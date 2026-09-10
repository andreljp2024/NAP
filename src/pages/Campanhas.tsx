import React, { useState, useEffect } from 'react';
import { Megaphone, PhoneOutgoing, MessageCircle, Play, Pause, Plus, Search, BarChart2, Users, CheckCircle2, Bell, Send, ShieldCheck, Smartphone } from 'lucide-react';

export default function Campanhas() {
  const [activeTab, setActiveTab] = useState<'voz' | 'whatsapp' | 'push'>('whatsapp');
  const [pushStatus, setPushStatus] = useState<any>(null);
  const [loadingPush, setLoadingPush] = useState(false);
  const [novoPushTitulo, setNovoPushTitulo] = useState('');
  const [novoPushMensagem, setNovoPushMensagem] = useState('');
  const [novoPushCategoria, setNovoPushCategoria] = useState<'cobranca' | 'suporte' | 'manutencao' | 'marketing' | 'geral'>('cobranca');
  const [feedbackPush, setFeedbackPush] = useState<string | null>(null);

  const fetchPushStatus = () => {
    fetch('/api/push/status')
      .then(res => res.json())
      .then(data => setPushStatus(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPushStatus();
  }, []);

  const handleEnviarPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPushTitulo || !novoPushMensagem) return;
    setLoadingPush(true);
    setFeedbackPush(null);
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novoPushTitulo,
          mensagem: novoPushMensagem,
          categoria: novoPushCategoria,
        }),
      });
      const data = await res.json();
      if (data.sucesso) {
        setFeedbackPush(`Transmissão realizada: ${data.mensagem}`);
        setNovoPushTitulo('');
        setNovoPushMensagem('');
        fetchPushStatus();
      }
    } catch {
      setFeedbackPush('Erro ao transmitir notificação push.');
    } finally {
      setLoadingPush(false);
    }
  };

  const campanhasWhatsapp = [
    { id: 1, nome: "Cobrança Preventiva (Vencimento -3 dias)", leads: 1250, processados: 450, conversao: "12%", status: "Rodando", tipo: "HSM Template" },
    { id: 2, nome: "Promoção Upgrade Fibra 1GB", leads: 3200, processados: 3200, conversao: "8.5%", status: "Concluída", tipo: "HSM Template" },
    { id: 3, nome: "Aviso Manutenção Programada (Bairro Centro)", leads: 850, processados: 0, conversao: "0%", status: "Agendada", tipo: "Texto Livre" },
  ];

  const campanhasVoz = [
    { id: 1, nome: "Retenção de Cancelamentos (Discador Preditivo)", leads: 150, processados: 85, conversao: "22%", status: "Rodando", dropRate: "3%" },
    { id: 2, nome: "Pesquisa NPS Automática (URA Reversa)", leads: 500, processados: 500, conversao: "64%", status: "Concluída", dropRate: "1%" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f19]">
      {/* Header */}
      <header className="p-6 border-b border-white/5 bg-[#101726]/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Megaphone className="text-blue-400" size={24} />
            Operação Ativa (Campanhas)
          </h1>
          <p className="text-sm text-slate-400 mt-1">Disparo em massa, discador automático (FreePBX) e réguas de relacionamento.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all  -700/20 hover:scale-105 active:scale-95">
          <Plus size={18} /> Nova Campanha
        </button>
      </header>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-6 flex gap-4 border-b border-white/5 shrink-0 overflow-x-auto whitespace-nowrap" style={{ scrollbarWidth: 'none' }}>
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'whatsapp' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
        >
          <MessageCircle size={18} /> Disparo de WhatsApp
        </button>
        <button 
          onClick={() => setActiveTab('voz')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'voz' ? 'border-blue-600 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
        >
          <PhoneOutgoing size={18} /> Discador Automático (Voz)
        </button>
        <button 
          onClick={() => setActiveTab('push')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'push' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
        >
          <Bell size={18} /> Notificações Push (PWA)
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#101726] border border-white/5 p-5 rounded-2xl   flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  {activeTab === 'push' ? 'Dispositivos Inscritos (Push)' : 'Leads Ativos'}
                </p>
                <p className="text-2xl font-bold text-white font-outfit">
                  {activeTab === 'push' ? (pushStatus?.total_inscritos || 1) : '5,300'}
                </p>
              </div>
            </div>
            <div className="bg-[#101726] border border-white/5 p-5 rounded-2xl   flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  {activeTab === 'push' ? 'Taxa de Entrega Push' : 'Taxa de Conversão'}
                </p>
                <p className="text-2xl font-bold text-white font-outfit">
                  {activeTab === 'push' ? '98.5%' : '18.4%'}
                </p>
              </div>
            </div>
            <div className="bg-[#101726] border border-white/5 p-5 rounded-2xl   flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-200 rounded-xl flex items-center justify-center text-amber-600">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  {activeTab === 'push' ? 'Disparos Push Efetuados' : 'Campanhas Rodando'}
                </p>
                <p className="text-2xl font-bold text-white font-outfit">
                  {activeTab === 'push' ? (pushStatus?.historico_recente?.length || 1) : '2'}
                </p>
              </div>
            </div>
          </div>

          {activeTab === 'push' ? (
            /* Push Notifications Management */
            <div className="space-y-6">
              {/* Form de Disparo Push */}
              <div className="bg-[#101726] rounded-3xl border border-white/5 p-6  ">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-outfit">Transmitir Alerta Web Push (PWA)</h3>
                      <p className="text-xs text-slate-500">Envia notificação instantânea para a tela dos clientes com PWA instalado.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Gateway Push Operacional
                  </span>
                </div>

                {feedbackPush && (
                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                    {feedbackPush}
                  </div>
                )}

                <form onSubmit={handleEnviarPush} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Título da Notificação</label>
                      <input 
                        type="text" 
                        value={novoPushTitulo} 
                        onChange={(e) => setNovoPushTitulo(e.target.value)}
                        placeholder="Ex: Fatura Pronta para Pagamento ou Aviso de Manutenção" 
                        className="w-full bg-[#0b0f19] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-600 "
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Pilar / Categoria</label>
                      <select 
                        value={novoPushCategoria} 
                        onChange={(e: any) => setNovoPushCategoria(e.target.value)}
                        className="w-full bg-[#0b0f19] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-600"
                      >
                        <option value="cobranca">Cobrança (SGP)</option>
                        <option value="suporte">Suporte Técnico</option>
                        <option value="manutencao">Manutenção de Fibra</option>
                        <option value="marketing">Promoção / Vendas</option>
                        <option value="geral">Aviso Geral</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mensagem / Texto do Push</label>
                    <textarea 
                      value={novoPushMensagem} 
                      onChange={(e) => setNovoPushMensagem(e.target.value)}
                      rows={2} 
                      placeholder="Ex: Olá! Sua fatura do plano Fibra 500MB vence amanhã. Clique para pagar via PIX sem juros." 
                      className="w-full bg-[#0b0f19] border border-white/5 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-600 "
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck size={14} className="text-slate-400" />
                      Assinado com chaves VAPID RFC-8292 seguras.
                    </p>
                    <button 
                      type="submit" 
                      disabled={loadingPush}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all  -600/20 active:scale-95 disabled:opacity-50"
                    >
                      <Send size={16} />
                      {loadingPush ? 'Transmitindo...' : 'Disparar Notificação Push'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Histórico e Dispositivos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#101726] rounded-3xl border border-white/5 p-6  ">
                  <h4 className="font-bold text-white font-outfit mb-4 flex items-center gap-2">
                    <Smartphone size={18} className="text-slate-500" /> Dispositivos Inscritos
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {(pushStatus?.inscricoes || []).map((sub: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#0b0f19] rounded-2xl border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{sub.cliente_nome}</p>
                          <p className="text-xs text-slate-500">{sub.dispositivo} • ID: {sub.cliente_id}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Ativo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#101726] rounded-3xl border border-white/5 p-6  ">
                  <h4 className="font-bold text-white font-outfit mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-slate-500" /> Histórico de Envios
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {(pushStatus?.historico_recente || []).map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-[#0b0f19] rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{item.titulo}</span>
                          <span className="text-[10px] text-slate-500">{item.enviado_em}</span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{item.mensagem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List */
            <div className="bg-[#101726] rounded-3xl border border-white/5 overflow-hidden  ">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#101726]">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar campanha..." 
                    className="w-full bg-[#0b0f19] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-blue-600/50 "
                  />
                </div>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#101726] border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Campanha</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Progresso</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Métricas</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-slate-500">Status</th>
                    <th className="px-6 py-4 text-center text-[10px] uppercase tracking-wider font-bold text-slate-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(activeTab === 'whatsapp' ? campanhasWhatsapp : campanhasVoz).map((camp, i) => {
                    const percent = (camp.processados / camp.leads) * 100;
                    return (
                      <tr key={i} className="hover:bg-[#0b0f19]/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{camp.nome}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">ID: CMP-{(1000 + camp.id).toString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{camp.processados} / {camp.leads}</span>
                            <span className="font-bold text-slate-400">{Math.round(percent)}%</span>
                          </div>
                          <div className="w-full bg-[#0b0f19] border border-white/5 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${camp.status === 'Concluída' ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded w-max border border-emerald-200">Conv: {camp.conversao}</span>
                            {'dropRate' in camp && (
                              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded w-max border border-amber-200">Drop: {camp.dropRate}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                            camp.status === 'Rodando' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' :
                            camp.status === 'Concluída' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-white/5 text-slate-400 border border-white/5'
                          }`}>
                            {camp.status === 'Rodando' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                            {camp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {camp.status === 'Rodando' ? (
                            <button className="w-8 h-8 bg-amber-500/10 border border-amber-200 text-amber-600 hover:bg-amber-500/20 hover:scale-105 rounded-lg flex items-center justify-center transition-all mx-auto">
                              <Pause size={14} />
                            </button>
                          ) : camp.status === 'Agendada' ? (
                            <button className="w-8 h-8 bg-emerald-500/10 border border-emerald-200 text-emerald-600 hover:bg-emerald-500/20 hover:scale-105 rounded-lg flex items-center justify-center transition-all mx-auto">
                              <Play size={14} className="ml-0.5" />
                            </button>
                          ) : (
                            <button className="w-8 h-8 bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-lg flex items-center justify-center transition-all mx-auto">
                              <BarChart2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
