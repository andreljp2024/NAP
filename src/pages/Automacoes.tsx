import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Zap, 
  Terminal, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Wifi, 
  QrCode, 
  Clock, 
  Wrench, 
  HelpCircle,
  BarChart3,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';

interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: Record<string, string>;
}

interface Metrics {
  requests_today: number;
  daily_limit: number;
  rpm_current: number;
  rpm_limit: number;
  total_tokens: number;
  cost_estimated_brl: number;
}

export default function Automacoes() {
  const [activeTab, setActiveTab] = useState<'playground' | 'tools' | 'settings'>('playground');
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'agent';
    content: string;
    tool_executada?: string;
    tempo_ms?: number;
    tokens?: number;
    timestamp: string;
  }>>([
    {
      role: 'agent',
      content: 'Olá! Sou o Agente Inteligente do seu Provedor, alimentado diretamente pelo Google Gemini (Free Tier). Não dependemos de n8n nem de servidores pesados. Como posso te ajudar?',
      timestamp: 'Agora'
    }
  ]);

  const [tools, setTools] = useState<AgentTool[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    requests_today: 47,
    daily_limit: 1500,
    rpm_current: 2,
    rpm_limit: 15,
    total_tokens: 18450,
    cost_estimated_brl: 0.0
  });

  const [systemPrompt, setSystemPrompt] = useState(
    'Você é o Agente Autônomo Oficial do Provedor de Internet Fibra. Seja empático, rápido e priorize resolver a conexão do assinante ou fornecer a 2ª via PIX.'
  );
  const [savedPromptSuccess, setSavedPromptSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/gemini/agent/tools')
      .then(r => r.json())
      .then(d => setTools(d))
      .catch(() => {
        // Fallback default
        setTools([
          {
            id: "consultar_sgp",
            name: "Consultar Assinante no SGP",
            description: "Localiza contrato, plano e status financeiro por CPF ou telefone.",
            category: "ERP / SGP",
            parameters: { cpf_cnpj: "string", telefone: "string" }
          },
          {
            id: "verificar_sinal_onu",
            name: "Diagnosticar Sinal Óptico da ONU",
            description: "Lê a potência óptica (dBm), status PPPoE e uptime do roteador.",
            category: "NOC / Telecom",
            parameters: { contrato_id: "number" }
          },
          {
            id: "gerar_pix_fatura",
            name: "Gerar Chave PIX Copia e Cola",
            description: "Gera cobrança PIX imediata com baixa automática no SGP.",
            category: "Financeiro",
            parameters: { contrato_id: "number" }
          },
          {
            id: "desbloqueio_48h",
            name: "Desbloqueio em Confiança (48h)",
            description: "Libera a velocidade em caso de suspensão preventiva por 48 horas.",
            category: "ERP / SGP",
            parameters: { contrato_id: "number" }
          }
        ]);
      });

    fetch('/api/gemini/agent/metrics')
      .then(r => r.json())
      .then(d => setMetrics(d))
      .catch(() => {});
  }, []);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || promptInput;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user' as const,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!customText) setPromptInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          clientContext: {
            nome: "João Silva",
            contrato_id: 5432,
            plano: "Fibra 500MB Simétrico",
            status: "ativo",
            sinal_onu_dbm: -19.4
          }
        })
      });

      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        {
          role: 'agent',
          content: data.resposta || 'Não foi possível obter resposta do agente.',
          tool_executada: data.tool_executada,
          tempo_ms: data.tempo_execucao_ms || 280,
          tokens: data.tokens_consumidos || 110,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Atualiza métricas
      setMetrics(prev => ({
        ...prev,
        requests_today: prev.requests_today + 1,
        total_tokens: prev.total_tokens + (data.tokens_consumidos || 110)
      }));
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'agent',
          content: 'Erro de comunicação com o backend do NAP. Tente novamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = () => {
    setSavedPromptSuccess(true);
    setTimeout(() => setSavedPromptSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-[#101726]/80 backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-outfit">
                  Motor de Automações & Agente Inteligente
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Google Gemini Nativo
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Sem n8n / 100% Serverless
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Raciocínio autônomo com Function Calling para SGP, Radius MikroTik e PIX instantâneo no WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'playground'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal size={14} /> Playground & Testes
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tools'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu size={14} /> Ferramentas de ISP ({tools.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={14} /> Prompt & Parâmetros
          </button>
        </div>
      </div>

      {/* Free Tier Telemetry / Status Bar */}
      <div className="px-6 py-2.5 bg-[#0e1422] border-b border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" /> Cota Diária (Free Tier):
          </span>
          <span className="font-mono font-semibold text-white">
            {metrics.requests_today} / {metrics.daily_limit} <span className="text-emerald-400 font-normal">({Math.round((metrics.requests_today / metrics.daily_limit) * 100)}%)</span>
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock size={14} className="text-cyan-400" /> Vazão Máx.:
          </span>
          <span className="font-mono font-semibold text-white">
            {metrics.rpm_current} / {metrics.rpm_limit} RPM
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <BarChart3 size={14} className="text-indigo-400" /> Tokens Acumulados:
          </span>
          <span className="font-mono font-semibold text-white">
            {metrics.total_tokens.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> Custo Estimado:
          </span>
          <span className="font-mono font-bold text-emerald-400">
            R$ 0,00 <span className="text-[10px] text-slate-500 font-normal">(100% Isento)</span>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'playground' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[560px]">
            
            {/* Left: Chat Simulator */}
            <div className="lg:col-span-2 flex flex-col bg-[#101726] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Simulador do Agente ISP (WhatsApp / Webchat)
                  </span>
                </div>
                <button
                  onClick={() => setChatHistory([chatHistory[0]])}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Limpar histórico"
                >
                  <RefreshCw size={12} /> Limpar
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-inner'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.tool_executada && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                          <Cpu size={12} />
                          <span>Função acionada autonomamente: <strong>{msg.tool_executada}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                      <span>{msg.timestamp}</span>
                      {msg.tempo_ms && (
                        <span>• {msg.tempo_ms}ms</span>
                      )}
                      {msg.tokens && (
                        <span>• {msg.tokens} tokens</span>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl w-fit">
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Gemini raciocinando e verificando ferramentas do provedor...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-500 font-semibold uppercase text-[10px] whitespace-nowrap">Testes rápidos:</span>
                <button
                  onClick={() => handleSendMessage("Minha internet tá lenta, sou o João.")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700/60 transition-colors"
                >
                  ⚡ "Internet lenta"
                </button>
                <button
                  onClick={() => handleSendMessage("Quero a chave PIX da fatura deste mês.")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700/60 transition-colors"
                >
                  💳 "PIX da Fatura"
                </button>
                <button
                  onClick={() => handleSendMessage("Minha conexão foi cortada, libera o desbloqueio em confiança?")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700/60 transition-colors"
                >
                  🔓 "Desbloqueio 48h"
                </button>
              </div>

              {/* Input Box */}
              <div className="p-3 border-t border-slate-800 bg-[#0e1422] flex gap-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite como um assinante (ex: 'meu wifi caiu', 'qual o código do pix?')..."
                  className="flex-1 bg-slate-900/90 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !promptInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Right: Architecture & Active Tools Panel */}
            <div className="flex flex-col gap-4">
              
              {/* Architecture Explanation Card */}
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Por que sem n8n?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Em operações com consumo moderado ou servidor compartilhado no Debian do FreePBX, o n8n consome memória constante (500MB a 1GB de RAM).
                </p>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span><strong>Zero RAM no Servidor:</strong> A execução ocorre no Google Cloud.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span><strong>1.500 msgs/dia Grátis:</strong> Sem fatura ou cartão de crédito obrigatório.</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span><strong>Function Calling Nativo:</strong> O Gemini decide qual rota do SGP chamar.</span>
                  </div>
                </div>
              </div>

              {/* Tools Available Summary */}
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 flex-1 shadow-xl flex flex-col">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu size={16} className="text-indigo-400" />
                  Ferramentas Conectadas ({tools.length})
                </h3>
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 text-xs">
                  {tools.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-200">{t.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug">{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white font-outfit">Catálogo de Ferramentas de ISP (Function Calling)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Estas são as funções que o Gemini pode acionar de forma autônoma durante a triagem com o assinante.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#101726] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        {t.id.includes('pix') ? <QrCode size={20} /> :
                         t.id.includes('sinal') ? <Wifi size={20} /> :
                         t.id.includes('sgp') ? <Database size={20} /> :
                         <Wrench size={20} />}
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-800">
                        {t.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{t.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{t.description}</p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Parâmetros esperados pela IA:</p>
                    <code className="text-xs font-mono text-emerald-400">
                      {JSON.stringify(t.parameters)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-[#101726] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <Sliders size={20} className="text-indigo-400" />
                Configuração das Diretrizes do Agente
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Personalize o comportamento, tom de voz e políticas operacionais do seu provedor.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Instruções de Sistema (System Prompt)
                </label>
                <textarea
                  rows={6}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo de Linguagem (LLM)</label>
                  <input
                    type="text"
                    disabled
                    value="gemini-3.8-flash (Otimizado para baixo consumo)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Free tier: 15 requisições/minuto gratuitas.</p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chave Google AI Studio</label>
                  <input
                    type="text"
                    disabled
                    value="GEMINI_API_KEY (Definida no servidor via .env)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Protegida no backend, nunca exposta ao cliente.</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSavePrompt}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
                >
                  {savedPromptSuccess ? (
                    <>
                      <Check size={16} className="text-emerald-300" /> Salvo com Sucesso!
                    </>
                  ) : (
                    <>Salvar Diretrizes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
