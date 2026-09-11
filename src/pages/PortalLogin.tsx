import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight, Loader2, Sparkles, Copy, Check, Info, Wifi, CreditCard, ChevronRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { 
  CLIENTE_HOMOLOGACAO_PRINCIPAL, 
  CLIENTE_TESTE_INADIMPLENTE, 
  CLIENTES_TESTE_PORTAL, 
  getClientByCpf, 
  PortalClient 
} from '../data/portalMockClients';

export default function PortalLogin() {
  const [cpf, setCpf] = useState(CLIENTE_HOMOLOGACAO_PRINCIPAL.cpf);
  const [selectedClient, setSelectedClient] = useState<PortalClient>(CLIENTE_HOMOLOGACAO_PRINCIPAL);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCpf, setCopiedCpf] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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
    
    // Sincroniza com cliente conhecido se bater o CPF
    const matched = CLIENTES_TESTE_PORTAL.find(c => c.cpf === value || c.cpf_limpo === value.replace(/\D/g, ''));
    if (matched) {
      setSelectedClient(matched);
    }
  };

  const handleSelectClient = (client: PortalClient) => {
    setSelectedClient(client);
    setCpf(client.cpf);
  };

  const handleDirectLogin = (clientToUse: PortalClient) => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('@nap_client_auth', JSON.stringify(clientToUse));
      navigate('/portal');
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 14) return;

    setIsLoading(true);

    setTimeout(() => {
      const clientData = getClientByCpf(cpf);
      localStorage.setItem('@nap_client_auth', JSON.stringify(clientData));
      navigate('/portal');
    }, 1000);
  };

  const handleCopyCpf = (cpfText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cpfText);
    setCopiedCpf(true);
    setTimeout(() => setCopiedCpf(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-blue-700 to-blue-600 rounded-b-[48px] shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      <div className="px-2 flex flex-col z-10 w-full max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl mx-auto flex items-center justify-center mb-3 border-2 border-white/20">
            <span className="text-blue-600 font-bold text-3xl font-outfit">{inicialProvedor}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit">Central do Assinante</h1>
          <p className="text-blue-100 text-xs md:text-sm mt-1">Portal PWA Mobile-First • Autoatendimento {nomeProvedor}</p>
        </div>

        {/* Card Principal de Login */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="text-blue-600" size={22} />
              Acesso com CPF
            </h2>
            <span className="text-[11px] font-mono font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
              Ambiente de Testes
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  CPF do Titular
                </label>
                <button
                  type="button"
                  onClick={(e) => handleCopyCpf(cpf, e)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  title="Copiar CPF formatado"
                >
                  {copiedCpf ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-600">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar CPF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  value={cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  className="w-full h-13 pl-4 pr-11 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-mono font-medium text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
                  required
                />
                {cpf.length === 14 && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                    <ShieldCheck size={22} />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={cpf.length < 14 || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Autenticando Assinante...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divisor Visual */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider">
                Clientes Fictícios para Homologação
              </span>
            </div>
          </div>

          {/* Seletor Rápido de Clientes de Teste */}
          <div className="space-y-2.5">
            {CLIENTES_TESTE_PORTAL.map((cliente) => {
              const isSelected = selectedClient.cpf === cliente.cpf;
              return (
                <div
                  key={cliente.id}
                  onClick={() => handleSelectClient(cliente)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                    isSelected 
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm' 
                      : 'bg-slate-50/80 border-slate-200 hover:border-blue-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 truncate font-outfit">
                          {cliente.nome}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          cliente.badgeColor === 'emerald'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cliente.tag}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                        <span>CPF: <strong className="text-slate-700">{cliente.cpf}</strong></span>
                        <span>•</span>
                        <span>{cliente.plano}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectLogin(cliente);
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1"
                      title="Entrar diretamente com este perfil"
                    >
                      <span>Entrar</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ficha Completa do Cliente Fictício Selecionado */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 mx-auto transition-colors"
            >
              <Info size={14} />
              <span>{showDetails ? 'Ocultar Detalhes Técnicos do Cliente' : 'Ver Ficha Completa do Cliente Fictício'}</span>
            </button>

            {showDetails && (
              <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2.5 animate-in fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-800 text-sm">{selectedClient.nome}</span>
                  <span className="font-mono text-slate-500">Contrato: {selectedClient.contrato}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Endereço</span>
                    <span className="font-medium text-slate-700">{selectedClient.endereco}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bairro / Cidade</span>
                    <span className="font-medium text-slate-700">{selectedClient.bairro} - {selectedClient.cidade}/{selectedClient.uf}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ONU / Roteador (TR-069)</span>
                    <span className="font-medium text-slate-700">{selectedClient.cpe.modelo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Sinal Óptico RX</span>
                    <span className="font-medium text-emerald-600 font-mono">{selectedClient.cpe.rxPower} (Normal)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Rede Wi-Fi 5GHz</span>
                    <span className="font-medium text-slate-700 font-mono">{selectedClient.cpe.ssid5}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Senha do Wi-Fi</span>
                    <span className="font-medium text-slate-700 font-mono">{selectedClient.cpe.senhaWifi}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 italic">
                  {selectedClient.descricao_cenario}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-400">
              Ao acessar, você concorda com os termos de uso de {nomeProvedor}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
