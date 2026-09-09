import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Server, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@provedor.com.br');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Lado Esquerdo - Decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Pattern de fundo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Glow Effects */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[100px]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight font-outfit">NAP <span className="text-blue-500 font-medium text-lg">Omni</span></span>
          </div>

          <h1 className="text-5xl font-bold text-white font-outfit leading-tight mb-6">
            A central de comando <br/>do seu provedor.
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            Gestão unificada de chamados, CRM, integrações nativas com SGP e IA projetada para Telecom.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-6 mt-12 max-w-lg">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-5 rounded-2xl">
            <Server className="text-blue-500 mb-3" size={24} />
            <h3 className="text-white font-bold mb-1">SGP Sync</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Sincronização bidirecional em tempo real.</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-5 rounded-2xl">
            <ShieldCheck className="text-emerald-500 mb-3" size={24} />
            <h3 className="text-white font-bold mb-1">Multi-tenant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Isolamento seguro de dados por operador.</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Form de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight font-outfit">NAP <span className="text-blue-600 font-medium text-sm">Omni</span></span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 font-outfit mb-3">Bem-vindo de volta</h2>
            <p className="text-slate-500 font-medium">Insira suas credenciais para acessar o painel administrativo.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Senha</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all font-medium shadow-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-700/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Acessar Painel'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500 font-medium">
            Problemas para acessar? <a href="#" className="text-blue-600 font-bold hover:underline">Fale com o suporte técnico</a>
          </p>
        </div>
      </div>
    </div>
  );
}
