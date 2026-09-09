import React, { useState } from 'react';
import { Megaphone, PhoneOutgoing, MessageCircle, Play, Pause, Plus, Search, BarChart2, Users, CheckCircle2 } from 'lucide-react';

export default function Campanhas() {
  const [activeTab, setActiveTab] = useState<'voz' | 'whatsapp'>('whatsapp');

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
      <header className="p-6 border-b border-slate-800/60 bg-[#101726]/80 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
            <Megaphone className="text-indigo-400" size={24} />
            Operação Ativa (Campanhas)
          </h1>
          <p className="text-sm text-slate-400 mt-1">Disparo em massa, discador automático (FreePBX) e réguas de relacionamento.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95">
          <Plus size={18} /> Nova Campanha
        </button>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6 flex gap-4 border-b border-slate-800/60 shrink-0">
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'whatsapp' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <MessageCircle size={18} /> Disparo de WhatsApp
        </button>
        <button 
          onClick={() => setActiveTab('voz')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'voz' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <PhoneOutgoing size={18} /> Discador Automático (Voz)
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#101726] border border-slate-800/60 p-5 rounded-2xl shadow-xl shadow-black/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Leads Ativos</p>
                <p className="text-2xl font-bold text-white font-outfit">5,300</p>
              </div>
            </div>
            <div className="bg-[#101726] border border-slate-800/60 p-5 rounded-2xl shadow-xl shadow-black/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-white font-outfit">18.4%</p>
              </div>
            </div>
            <div className="bg-[#101726] border border-slate-800/60 p-5 rounded-2xl shadow-xl shadow-black/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Campanhas Rodando</p>
                <p className="text-2xl font-bold text-white font-outfit">2</p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="bg-[#101726] rounded-3xl border border-slate-800/60 overflow-hidden shadow-xl shadow-black/20">
            <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-[#0d1321]">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar campanha..." 
                  className="w-full bg-[#1a2333] border border-slate-700/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500/50 shadow-inner"
                />
              </div>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0d1321] border-b border-slate-800/60">
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
                    <tr key={i} className="hover:bg-[#1a2333]/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{camp.nome}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">ID: CMP-{(1000 + camp.id).toString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{camp.processados} / {camp.leads}</span>
                          <span className="font-bold text-slate-300">{Math.round(percent)}%</span>
                        </div>
                        <div className="w-full bg-[#1a2333] border border-slate-700/50 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${camp.status === 'Concluída' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-max border border-emerald-500/20">Conv: {camp.conversao}</span>
                          {'dropRate' in camp && (
                            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded w-max border border-amber-500/20">Drop: {camp.dropRate}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                          camp.status === 'Rodando' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          camp.status === 'Concluída' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {camp.status === 'Rodando' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>}
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {camp.status === 'Rodando' ? (
                          <button className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:scale-105 rounded-lg flex items-center justify-center transition-all mx-auto">
                            <Pause size={14} />
                          </button>
                        ) : camp.status === 'Agendada' ? (
                          <button className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 rounded-lg flex items-center justify-center transition-all mx-auto">
                            <Play size={14} className="ml-0.5" />
                          </button>
                        ) : (
                          <button className="w-8 h-8 bg-slate-800 border border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg flex items-center justify-center transition-all mx-auto">
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

        </div>
      </div>
    </div>
  );
}
