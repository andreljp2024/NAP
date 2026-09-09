import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { Users, Bot, Clock, TrendingUp, TrendingDown, Phone, MessageSquare, Zap } from 'lucide-react';

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
    <div className="flex-1 overflow-y-auto p-8 bg-[#0b0f19]">
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
            <span className="text-sm font-medium text-emerald-400">Tempo Real (9router)</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Taxa de Retenção IA" 
            value="74.2%" 
            trend="+5.1%" 
            trendUp={true}
            icon={<Bot className="text-indigo-400" size={24} />} 
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
            icon={<MessageSquare className="text-emerald-400" size={24} />} 
          />
          <MetricCard 
            title="Economia Estimada" 
            value="R$ 14.5k" 
            trend="Mensal" 
            trendUp={true}
            icon={<TrendingUp className="text-amber-400" size={24} />} 
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-[#101726] border border-slate-800/60 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h3 className="text-lg font-bold text-white font-outfit mb-6 flex items-center gap-2">
              <Zap size={18} className="text-indigo-400" />
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
                  <Area type="monotone" dataKey="ia" name="IA (9router / AVA)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIa)" />
                  <Area type="monotone" dataKey="humano" name="Operador Humano" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHumano)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart */}
          <div className="bg-[#101726] border border-slate-800/60 rounded-2xl p-6 shadow-xl shadow-black/20">
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

        {/* Live Operators */}
        <div className="bg-[#101726] border border-slate-800/60 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
          <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-[#0d1321]">
            <h3 className="text-lg font-bold text-white font-outfit">Operadores Online</h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">4 Ativos</span>
          </div>
          <div className="divide-y divide-slate-800/60">
            {[
              { nome: 'Ana Costa', status: 'Em Atendimento', canal: 'WhatsApp', fila: 'Suporte N1' },
              { nome: 'Carlos Silva', status: 'Disponível', canal: 'Omni', fila: 'Vendas' },
              { nome: 'João Dev', status: 'Em Atendimento', canal: 'Webchat', fila: 'Suporte N2' },
              { nome: 'Mariana Lima', status: 'Pausa (Lanche)', canal: 'Telefonia', fila: 'Cobrança' },
            ].map((op, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                    {op.nome.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{op.nome}</p>
                    <p className="text-xs text-slate-400">{op.fila}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {op.canal === 'Telefonia' ? <Phone size={14} /> : <MessageSquare size={14} />}
                    {op.canal}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                    op.status === 'Disponível' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    op.status === 'Em Atendimento' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {op.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon }: any) {
  return (
    <div className="bg-[#101726] border border-slate-800/60 p-6 rounded-2xl shadow-xl shadow-black/20 flex flex-col relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 text-slate-800/30 group-hover:text-slate-700/30 transition-colors duration-500 rotate-12 scale-150">
        {icon}
      </div>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 bg-[#0b0f19] rounded-xl border border-slate-800 shadow-inner">
          {icon}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
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
