import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, Loader2 } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

export default function PortalLogin() {
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { config } = useConfig();
  
  const nomeProvedor = config.provedor?.nomeFantasia || 'NAP Telecom';
  const inicialProvedor = nomeProvedor.charAt(0).toUpperCase() || 'N';

  // Se já estiver logado, redireciona
  if (localStorage.getItem('@nap_client_auth')) {
    return <Navigate to="/portal" replace />;
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (value.length > 11) value = value.slice(0, 11);
    
    // Aplica a máscara CPF (000.000.000-00)
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    setCpf(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 14) return; // 11 dígitos + 3 caracteres especiais

    setIsLoading(true);

    // Simula uma chamada à API do SGP/ERP
    setTimeout(() => {
      // Mock de dados do cliente logado
      const clientMock = {
        nome: 'João Silva',
        cpf: cpf,
        contrato: '1044-01',
        plano: '600 Mega Fibra',
      };
      
      localStorage.setItem('@nap_client_auth', JSON.stringify(clientMock));
      navigate('/portal');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 inset-x-0 h-64 bg-blue-600 rounded-b-[40px] shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      <div className="px-6 flex flex-col z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold text-4xl font-outfit">{inicialProvedor}</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-outfit">Central do Assinante</h1>
          <p className="text-blue-100 mt-2 text-sm">Acesse suas faturas e suporte de forma fácil.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Acesso com CPF
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Digite seu CPF
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full h-14 pl-4 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-mono font-medium text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
                  required
                />
                {cpf.length === 14 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={cpf.length < 14 || isLoading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Ao acessar, você concorda com os termos de uso de {nomeProvedor}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
