import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, db, getUserProfile, saveUserProfile, type UserProfile } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'operador' | 'suporte' | 'financeiro';
  provedorId: string;
  ramal?: string;
  status: 'ativo' | 'inativo';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  createOperatorAccount: (email: string, pass: string, name: string, role?: string, ramal?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado de autenticação do Firebase em tempo real
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          // Escuta o perfil no Firestore em tempo real
          const userRef = doc(db, 'users', fbUser.uid);
          unsubscribeUserDoc = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              const formatted: UserData = {
                id: fbUser.uid,
                email: data.email || fbUser.email || '',
                name: data.nome || fbUser.displayName || data.email?.split('@')[0] || 'Operador',
                role: data.role || 'operador',
                provedorId: data.provedorId || 'nap-default',
                status: data.status || 'ativo',
                ramal: (data as any).ramal || '2001'
              };
              setUser(formatted);
              setIsAuthenticated(true);
              localStorage.setItem('nap_auth', JSON.stringify(formatted));
            } else {
              // Primeiro acesso deste usuário: cria o perfil no Firestore
              const isDefaultAdmin = fbUser.email === 'admin@provedor.com.br' || fbUser.email === 'andreljp@gmail.com';
              const newProfile: UserProfile = {
                id: fbUser.uid,
                email: fbUser.email || '',
                nome: fbUser.displayName || (isDefaultAdmin ? 'Administrador Geral' : 'Operador NAP'),
                role: isDefaultAdmin ? 'superadmin' : 'operador',
                provedorId: 'nap-default',
                status: 'ativo',
                criadoEm: new Date().toISOString()
              };
              await saveUserProfile(newProfile);
              const formatted: UserData = {
                id: newProfile.id,
                email: newProfile.email,
                name: newProfile.nome,
                role: newProfile.role,
                provedorId: newProfile.provedorId,
                status: newProfile.status,
                ramal: '2001'
              };
              setUser(formatted);
              setIsAuthenticated(true);
              localStorage.setItem('nap_auth', JSON.stringify(formatted));
            }
            setLoading(false);
          }, (err) => {
            console.warn('Erro ao escutar perfil do usuário no Firestore:', err);
            // Fallback usando dados do auth
            const fallbackUser: UserData = {
              id: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.email?.split('@')[0] || 'Operador',
              role: (fbUser.email === 'admin@provedor.com.br' || fbUser.email === 'andreljp@gmail.com') ? 'superadmin' : 'operador',
              provedorId: 'nap-default',
              status: 'ativo',
              ramal: '2001'
            };
            setUser(fallbackUser);
            setIsAuthenticated(true);
            setLoading(false);
          });
        } catch (err) {
          console.error('Erro na sincronização de perfil:', err);
          setLoading(false);
        }
      } else {
        // Usuário deslogado no Firebase
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('nap_auth');
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      // 1. Tenta autenticar no Firebase Auth
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      // Se for a conta padrão do sistema e ainda não existir no Firebase Auth, provisiona automaticamente
      if (
        (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') &&
        (email === 'admin@provedor.com.br' || email === 'andreljp@gmail.com')
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
          const initialProfile: UserProfile = {
            id: cred.user.uid,
            email: cred.user.email || email,
            nome: 'Administrador Geral',
            role: 'superadmin',
            provedorId: 'nap-default',
            status: 'ativo',
            criadoEm: new Date().toISOString()
          };
          await saveUserProfile(initialProfile);
          return;
        } catch (createErr: any) {
          console.error('Erro ao provisionar usuário padrão no Firebase Auth:', createErr);
          throw new Error('Falha na autenticação. Verifique seu e-mail e senha.');
        }
      }

      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Senha incorreta ou usuário não encontrado.');
      } else if (err.code === 'auth/invalid-email') {
        throw new Error('Formato de e-mail inválido.');
      } else if (err.code === 'auth/user-disabled') {
        throw new Error('Esta conta foi desativada pelo administrador.');
      } else {
        throw new Error(err.message || 'Erro ao conectar ao Firebase Authentication.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Erro ao deslogar no Firebase:', e);
    } finally {
      localStorage.removeItem('nap_auth');
      setIsAuthenticated(false);
      setUser(null);
      setFirebaseUser(null);
    }
  };

  const createOperatorAccount = async (
    email: string, 
    pass: string, 
    name: string, 
    role: string = 'operador',
    ramal: string = '2001'
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const profile: UserProfile = {
        id: cred.user.uid,
        email: email.trim(),
        nome: name.trim(),
        role: role as any,
        provedorId: 'nap-default',
        status: 'ativo',
        criadoEm: new Date().toISOString()
      };
      await saveUserProfile(profile);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao cadastrar operador no Firebase.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400">Conectando ao Firebase Auth...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, firebaseUser, loading, login, logout, createOperatorAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
