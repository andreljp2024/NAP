import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { Users, Bot, Clock, TrendingUp, TrendingDown, Phone, MessageSquare, Zap, Radio, Signal, Headphones } from 'lucide-react';
import Webphone from '../components/Webphone';

const dataResolucao = [
  { name: 'Seg', humano: 120, ia: 250 },
  { name: 'Ter', humano: 132, ia: 280 },
  { name: 'Qua', humano: 101, ia: 310 },
  { name: 'Qui', humano: 140, ia: 350 },
  { name: 'Sex', humano: 90, ia: 380 },
  { name: 'Sáb', humano: 50, ia: 150 },
  { name: 'Dom', humano: 40, ia: 140 },
];

const dataTMR = [
  { time: '08:00', tmr: 25 },
  { time: '10:00', tmr: 15 },
  { time: '12:00', tmr: 45 },
  { time: '14:00', tmr: 30 },
  { time: '16:00', tmr: 18 },
  { time: '18:00', tmr: 12 },
];

export default function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white font-outfit mb-2">Visão Geral da Operação</h1>
            <p className="text-slate-400">Monitoramento em tempo real do ecossistema NAP.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-600">Tempo Real (9router)</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Taxa de Retenção IA" 
            value="74.2%" 
            trend="+5.1%" 
            trendUp={true}
            icon={<Bot className="text-blue-400" size={24} />} 
          />
          <MetricCard 
            title="TMR (Humano)" 
            value="1m 42s" 
            trend="-24s" 
            trendUp={true}
            icon={<Clock className="text-blue-400" size={24} />} 
          />
          <MetricCard 
            title="Atendimentos Hoje" 
            value="1,842" 
            trend="+12%" 
            trendUp={true}
            icon={<MessageSquare className="text-emerald-600" size={24} />} 
          />
          <MetricCard 
            title="Economia Estimada" 
            value="R$ 14.5k" 
            trend="Mensal" 
            trendUp={true}
            icon={<TrendingUp className="text-amber-600" size={24} />} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#101726] border border-white/5 rounded-2xl p-6  ">
            <h3 className="text-lg font-bold text-white font-outfit mb-6 flex items-center gap-2">
              <Zap size={18} className="text-blue-400" />
              Volume de Resolução: Humano vs IA
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataResolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHumano" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="ia" name="NAP IA Integrada" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIa)" />
                  <Area type="monotone" dataKey="humano" name="Operador Humano" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHumano)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="bg-[#101726] border border-white/5 rounded-2xl p-6  ">
            <h3 className="text-lg font-bold text-white font-outfit mb-6">Tempo Médio de Resposta (s)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTMR} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
                  />
                  <Bar dataKey="tmr" name="TMR" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Operators & Embedded Asterisk Webphone */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operadores Online (2 Cols) */}
          <div className="lg:col-span-2 bg-[#101726] border border-white/5 rounded-2xl   overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#101726]">
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">Operadores Online & Filas FreePBX</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ramais SIP ativos no Asterisk 21 e distribuição de canais</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                4 Ativos
              </span>
            </div>
            <div className="divide-y divide-white/5 flex-1">
              {[
                { nome: 'Ana Costa', status: 'Em Atendimento', canal: 'WhatsApp', fila: 'Suporte N1', ramal: '2004' },
                { nome: 'Carlos Silva', status: 'Disponível', canal: 'Omni', fila: 'Vendas', ramal: '2002' },
                { nome: 'João Dev (Você)', status: 'Disponível', canal: 'WebRTC Telephony', fila: 'Suporte N2', ramal: '2001' },
                { nome: 'Mariana Lima', status: 'Pausa (Lanche)', canal: 'Telefonia', fila: 'Cobrança', ramal: '2003' },
              ].map((op, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-[#0b0f19] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 font-bold border border-white/5">
                      {op.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">{op.nome}</p>
                        <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                          Ramal {op.ramal}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{op.fila}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      {op.canal.includes('Telefonia') || op.canal.includes('Telephony') ? <Phone size={14} /> : <MessageSquare size={14} />}
                      <span>{op.canal}</span>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                      op.status === 'Disponível' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      op.status === 'Em Atendimento' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {op.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé de Status do Servidor de Telefonia */}
            <div className="p-4 bg-[#0b0f19] border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Asterisk PBX: v21.4.1 (Debian 12)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>Codecs: Opus, G.711u</span>
                <span>Porta AMI: 5038</span>
                <span>SRTP: Ativo</span>
              </div>
            </div>
          </div>

          {/* WebPhone Embutido no Dashboard (1 Col) */}
          <div className="flex flex-col items-center">
            <div className="w-full mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Headphones size={14} className="text-blue-400" />
                Console Webphone Operador
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                SIP Pronto
              </span>
            </div>
            <Webphone embedded={true} className="w-full" defaultExtension="2001" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon }: any) {
  return (
    <div className="bg-[#101726] border border-white/5 p-6 rounded-2xl   flex flex-col relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 text-slate-200/30 group-hover:text-slate-300/30 transition-colors duration-500 rotate-12 scale-150">
        {icon}
      </div>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 bg-[#0b0f19] rounded-xl border border-white/5 ">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
        <span className="text-3xl font-bold text-white font-outfit">{value}</span>
      </div>
    </div>
  );
}
