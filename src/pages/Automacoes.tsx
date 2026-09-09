import React, { useState } from 'react';
import { Workflow, Play, Settings, Save, Plus, ExternalLink, Activity, Server, Code, Loader2, RefreshCw, X } from 'lucide-react';

export default function Automacoes() {
  const [activeFlow, setActiveFlow] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const flows = [
    { 
      id: 1, 
      name: 'Triagem Inteligente (WhatsApp)', 
      status: 'Ativo', 
      webhook_id: 'triagem-waba',
      description: 'Recebe a mensagem do cliente, verifica o número no SGP e direciona para IA ou fila de suporte.',
      iframe_url: 'https://demo.n8n.io/workflow/triagem' 
    },
    { 
      id: 2, 
      name: 'Cobrança PIX Automática', 
      status: 'Ativo', 
      webhook_id: 'cobranca-pix',
      description: 'Dispara fatura via WhatsApp 3 dias antes do vencimento.',
      iframe_url: 'https://demo.n8n.io/workflow/cobranca' 
    },
    { 
      id: 3, 
      name: 'Pesquisa NPS (Pós-Atendimento)', 
      status: 'Pausado', 
      webhook_id: 'nps-pesquisa',
      description: 'Envia formulário de avaliação após encerramento do ticket no Kanban.',
      iframe_url: 'https://demo.n8n.io/workflow/nps' 
    },
  ];

  const handleTestWebhook = async (flow: any) => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const payload = {
        teste: true,
        cliente_id: 12345,
        mensagem: "Teste manual via painel NAP",
        timestamp: new Date().toISOString()
      };

      const res = await fetch(`/api/n8n/webhook/${flow.webhook_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: 'Falha ao conectar com servidor Proxy.' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center z-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Workflow className="text-blue-600" size={24} />
            Motor de Automações (n8n)
          </h1>
          <p className="text-sm text-slate-600 mt-1">Integração Híbrida: Disparo via API Proxy e edição visual embarcada.</p>
        </div>
        {viewMode === 'editor' && (
          <button 
            onClick={() => { setViewMode('list'); setActiveFlow(null); setTestResult(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm border border-slate-200"
          >
            <X size={16} /> Fechar Editor Visual
          </button>
        )}
      </div>

      {viewMode === 'list' ? (
        /* Lista de Fluxos */
        <div className="p-8 flex-1 overflow-y-auto max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-900 font-outfit">Fluxos Integrados</h2>
            <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95">
              <Plus size={18} /> Novo Fluxo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div key={flow.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Workflow size={20} className="text-blue-600" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      flow.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {flow.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{flow.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{flow.description}</p>
                  
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                    <Server size={14} className="text-slate-400" />
                    <code className="text-xs font-mono text-slate-600 truncate">/api/n8n/webhook/{flow.webhook_id}</code>
                  </div>
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex gap-2">
                  <button 
                    onClick={() => { setActiveFlow(flow); setViewMode('editor'); }}
                    className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors shadow-sm text-xs flex items-center justify-center gap-2"
                  >
                    <Settings size={14} /> Editar no n8n
                  </button>
                  <button 
                    onClick={() => { setActiveFlow(flow); handleTestWebhook(flow); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-xs flex items-center gap-2"
                  >
                    <Play size={14} /> Testar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Área de Log de Testes */}
          {testResult && (
            <div className="mt-8 bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold font-outfit flex items-center gap-2">
                  <Activity size={18} className="text-emerald-400" /> Resultado do Disparo (Webhook Proxy)
                </h3>
                <button onClick={() => setTestResult(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 border border-slate-800 shadow-inner">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        /* Editor Visual (Iframe Embarcado) */
        <div className="flex-1 flex flex-col bg-slate-100 relative">
          
          {/* Barra de Ferramentas Superior do Iframe */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-slate-300 font-medium text-xs">Conectado à instância externa do n8n</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold">
                <ExternalLink size={14} /> Abrir em Nova Aba
              </a>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                Ativar Fluxo
              </button>
            </div>
          </div>

          {/* Iframe Mock */}
          <div className="flex-1 bg-white relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-[url('https://cdn.pixabay.com/photo/2021/11/04/19/39/grid-6769225_1280.png')] bg-cover opacity-80">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/30 mb-6 border-2 border-white">
                   <Workflow size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-outfit mb-2">n8n Embed Mode</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Neste ambiente de produção, o iFrame original do n8n carrega aqui via Single Sign-On (SSO). O operador constrói os nós visualmente sem sair do painel NAP.
                </p>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left font-mono text-xs text-slate-700 shadow-inner">
                  <p className="mb-2 text-slate-400 font-bold uppercase">URL do iFrame renderizado:</p>
                  <p className="text-blue-600 break-all">{activeFlow?.iframe_url}?embed=true&token=JWT_SSO_TOKEN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
