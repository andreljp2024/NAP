import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Router, Search, AlertCircle, CheckCircle2, XCircle, Signal, RefreshCw, Smartphone, Wrench, BarChart3, Radio, ShieldAlert, Plus, Send, Clock, MapPin, Users, Zap, Check } from 'lucide-react';

interface DeviceInfo {
  _id: string;
  manufacturer: string;
  productClass: string;
  serialNumber: string;
  mac: string;
  ip: string;
  lastInform: string;
  status: 'online' | 'offline';
  rssi?: number;
  snr?: number;
}

interface IncidenteRede {
  id: string;
  titulo: string;
  tipo: "rompimento_fibra" | "falha_energia_pop" | "degradacao_olt" | "manutencao_programada";
  regioesAfetadas: string[];
  concentradorOuOlt: string;
  clientesAfetadosAprox: number;
  status: "investigando" | "em_reparo" | "normalizado";
  previsaoRetorno: string;
  iniciadoEm: string;
  protocoloAnatel: string;
  descricao: string;
  autoInterceptarAtendimento: boolean;
  notificacoesEnviadas: number;
}

export default function GenieACSDashboard() {
  const [activeTab, setActiveTab] = useState<'tr069' | 'incidentes'>('incidentes');
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Incidentes NOC
  const [incidentes, setIncidentes] = useState<IncidenteRede[]>([]);
  const [loadingIncidentes, setLoadingIncidentes] = useState(false);
  const [modalNovoIncidente, setModalNovoIncidente] = useState(false);
  const [notificandoId, setNotificandoId] = useState<string | null>(null);
  const [feedbackNoc, setFeedbackNoc] = useState<string | null>(null);

  // Novo Incidente Form
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoBairros, setNovoBairros] = useState('');
  const [novoOlt, setNovoOlt] = useState('OLT Central / PON 02');
  const [novoClientes, setNovoClientes] = useState('320');
  const [novoPrevisao, setNovoPrevisao] = useState('16:00 (Hoje)');
  const [novoDescricao, setNovoDescricao] = useState('');

  const fetchIncidentes = () => {
    setLoadingIncidentes(true);
    fetch('/api/incidentes')
      .then(res => res.json())
      .then(data => {
        if (data.incidentes) setIncidentes(data.incidentes);
      })
      .catch(() => {})
      .finally(() => setLoadingIncidentes(false));
  };

  // Mocking real-time updates and initial fetch
  useEffect(() => {
    fetchIncidentes();
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // Simulating an API call to GenieACS NBI via our Node.js backend
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockDevices: DeviceInfo[] = [
          {
            _id: '123456-ZXHN-123456789',
            manufacturer: 'ZTE',
            productClass: 'F670L',
            serialNumber: 'ZTEGC1234567',
            mac: '00:11:22:33:44:55',
            ip: '10.10.1.55',
            lastInform: new Date(Date.now() - 60000).toISOString(),
            status: 'online',
            rssi: -19.5,
            snr: 40.2
          },
          {
            _id: '987654-HG8245-987654321',
            manufacturer: 'Huawei',
            productClass: 'HG8245H',
            serialNumber: '4857544321',
            mac: 'AA:BB:CC:DD:EE:FF',
            ip: '10.10.1.102',
            lastInform: new Date(Date.now() - 3600000).toISOString(),
            status: 'offline',
            rssi: -35.0, // Critical
            snr: 15.0
          },
          {
            _id: '456789-EG8145-456789123',
            manufacturer: 'Huawei',
            productClass: 'EG8145V5',
            serialNumber: '4857544388',
            mac: '11:22:33:AA:BB:CC',
            ip: '10.10.1.200',
            lastInform: new Date(Date.now() - 120000).toISOString(),
            status: 'online',
            rssi: -22.1,
            snr: 35.5
          }
        ];
        
        setDevices(mockDevices);
      } catch {
        setError('Falha ao conectar com o servidor NBI do GenieACS.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      fetchIncidentes();
    }, 1500);
  };

  const handleDispararMassa = async (id: string) => {
    setNotificandoId(id);
    setFeedbackNoc(null);
    try {
      const res = await fetch(`/api/incidentes/${id}/notificar-massa`, { method: 'POST' });
      const data = await res.json();
      if (data.sucesso) {
        setFeedbackNoc(data.mensagem);
        fetchIncidentes();
      }
    } catch {
      setFeedbackNoc("Erro ao transmitir alerta de manutenção em massa.");
    } finally {
      setNotificandoId(null);
    }
  };

  const handleNormalizar = async (id: string) => {
    try {
      const res = await fetch(`/api/incidentes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'normalizado', previsaoRetorno: 'Normalizado com Sucesso' })
      });
      const data = await res.json();
      if (data.sucesso) {
        setFeedbackNoc("Incidente marcado como normalizado no NOC!");
        fetchIncidentes();
      }
    } catch {
      setFeedbackNoc("Erro ao atualizar status.");
    }
  };

  const handleCriarIncidente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo) return;
    try {
      const bairrosArray = novoBairros.split(',').map(b => b.trim()).filter(Boolean);
      const res = await fetch('/api/incidentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novoTitulo,
          regioesAfetadas: bairrosArray.length ? bairrosArray : ['Região Geral'],
          concentradorOuOlt: novoOlt,
          clientesAfetadosAprox: Number(novoClientes) || 200,
          previsaoRetorno: novoPrevisao,
          descricao: novoDescricao
        })
      });
      const data = await res.json();
      if (data.sucesso) {
        setModalNovoIncidente(false);
        setNovoTitulo('');
        setNovoBairros('');
        setNovoDescricao('');
        setFeedbackNoc(`Novo incidente ${data.incidente.id} registrado e ativado para interceptação na IA!`);
        fetchIncidentes();
      }
    } catch {
      setFeedbackNoc("Falha ao registrar incidente.");
    }
  };

  const filteredDevices = devices.filter(d => 
    d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ip.includes(searchTerm)
  );

  const getRssiColor = (rssi?: number) => {
    if (rssi === undefined) return 'text-slate-500';
    if (rssi > -25) return 'text-emerald-400';
    if (rssi > -28) return 'text-amber-400';
    return 'text-red-400';
  };

  const getRssiBg = (rssi?: number) => {
    if (rssi === undefined) return 'bg-slate-800 border-white/5';
    if (rssi > -25) return 'bg-emerald-500/10 border-emerald-500/20';
    if (rssi > -28) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const incidentesAtivos = incidentes.filter(i => i.status !== 'normalizado');
  const totalAfetados = incidentesAtivos.reduce((acc, curr) => acc + curr.clientesAfetadosAprox, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f19] text-slate-300 overflow-hidden font-sans">
      {/* HEADER DA PÁGINA */}
      <div className="px-6 py-5 border-b border-white/5 bg-[#101726]/80 backdrop-blur-md flex flex-wrap justify-between items-center gap-4 z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Router size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-outfit tracking-tight">NOC & Telemetria FTTH</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-slate-400">GenieACS TR-069 e Gestão Proativa de Incidentes Massivos</p>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> NBI CONECTADO
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'tr069' ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar Serial, MAC ou IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm w-full sm:w-64 transition-all bg-[#0b0f19] text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          ) : (
            <button 
              onClick={() => setModalNovoIncidente(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-900/20"
            >
              <Plus size={16} /> Abrir Incidente no NOC
            </button>
          )}

          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0b0f19] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
            title="Sincronizar Dispositivos e Incidentes"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin text-blue-400" : ""} />
          </button>
        </div>
      </div>

      {/* ABAS DO MÓDULO */}
      <div className="px-6 pt-4 flex gap-4 border-b border-white/5 bg-[#101726]/40 shrink-0">
        <button
          onClick={() => setActiveTab('incidentes')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'incidentes' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
        >
          <ShieldAlert size={18} className="text-red-400" /> NOC Incident Shield (Quedas & Interceptação IA)
          {incidentesAtivos.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold">
              {incidentesAtivos.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tr069')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'tr069' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
        >
          <Router size={18} /> Telemetria de CPEs / ONUs (TR-069)
        </button>
      </div>

      {feedbackNoc && (
        <div className="m-6 mb-0 bg-emerald-500/10 text-emerald-300 p-4 rounded-xl flex items-center justify-between border border-emerald-500/20 text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            {feedbackNoc}
          </div>
          <button onClick={() => setFeedbackNoc(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {error && (
        <div className="m-6 mb-0 bg-red-500/10 text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-500/20">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {activeTab === 'incidentes' ? (
          /* NOC INCIDENT SHIELD TAB */
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* KPI Cards do NOC */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Incidentes Ativos</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">{incidentesAtivos.length}</h3>
                </div>
              </div>

              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Clientes Impactados</p>
                  <h3 className="text-2xl font-bold text-amber-400 font-outfit mt-0.5">{totalAfetados}</h3>
                </div>
              </div>

              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Auto-Interceptação IA</p>
                  <h3 className="text-lg font-bold text-emerald-400 font-outfit mt-0.5">100% OPERACIONAL</h3>
                </div>
              </div>

              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Send size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alertas Enviados</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">
                    {incidentes.reduce((acc, c) => acc + (c.notificacoesEnviadas || 0), 0)}
                  </h3>
                </div>
              </div>
            </div>

            {/* Banner de Como Funciona o Shield */}
            <div className="bg-gradient-to-r from-red-950/40 via-[#101726] to-[#101726] border border-red-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Escudo Inteligente de Atendimento em Quedas de Fibra</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quando há um rompimento registrado, a IA intercepta imediatamente os chamados no WhatsApp, URA e Webchat informando o bairro, a previsão (ETA) e o protocolo Anatel, evitando que 95% dos clientes entrem na fila humana.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono font-bold shrink-0">
                PROTEÇÃO NOC ATIVA
              </span>
            </div>

            {/* Lista de Incidentes */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Registro de Ocorrências do NOC
              </h3>

              {incidentes.length === 0 ? (
                <div className="p-8 bg-[#101726] rounded-2xl border border-white/5 text-center text-slate-500 text-sm">
                  Nenhum incidente ativo no momento. Toda a malha FTTH está operando normalmente.
                </div>
              ) : (
                incidentes.map(inc => (
                  <div 
                    key={inc.id}
                    className={`bg-[#101726] rounded-2xl border p-6 transition-all ${
                      inc.status === 'normalizado' ? 'border-white/5 opacity-70' : 'border-red-500/30 shadow-lg shadow-red-950/20'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            inc.status === 'normalizado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {inc.status === 'normalizado' ? 'NORMALIZADO' : 'EM REPARO / FUSÃO ÓPTICA'}
                          </span>
                          <span className="text-xs font-mono text-slate-500">ID: {inc.id}</span>
                          <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            Anatel: {inc.protocoloAnatel}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white font-outfit mt-2">{inc.titulo}</h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {inc.status !== 'normalizado' && (
                          <>
                            <button
                              onClick={() => handleDispararMassa(inc.id)}
                              disabled={notificandoId === inc.id}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                              {notificandoId === inc.id ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                              Disparar Comunicado em Massa
                            </button>
                            <button
                              onClick={() => handleNormalizar(inc.id)}
                              className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                            >
                              <Check size={14} /> Marcar como Normalizado
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider block mb-1">Regiões Afetadas</span>
                        <div className="flex flex-wrap gap-1.5">
                          {inc.regioesAfetadas.map((reg, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-200 flex items-center gap-1">
                              <MapPin size={10} className="text-red-400" /> {reg}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider block mb-1">Concentrador / OLT</span>
                        <p className="font-mono text-slate-200 font-bold">{inc.concentradorOuOlt}</p>
                      </div>

                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider block mb-1">Previsão Normalização (ETA)</span>
                        <p className="font-bold text-amber-400 flex items-center gap-1">
                          <Clock size={12} /> {inc.previsaoRetorno}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider block mb-1">Impacto Estimado</span>
                        <p className="font-bold text-white">{inc.clientesAfetadosAprox} clientes</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{inc.notificacoesEnviadas} comunicados disparados</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Diagnóstico de Campo:</strong> {inc.descricao}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* TR-069 DEVICES TAB */
          <div className="space-y-6">
            {/* MÉTRICAS TOP TR-069 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                  <Router size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total de CPEs</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">{devices.length}</h3>
                </div>
              </div>
              
              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Online</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">{devices.filter(d => d.status === 'online').length}</h3>
                </div>
              </div>

              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center shrink-0">
                  <XCircle size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Offline / LOS</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">{devices.filter(d => d.status === 'offline').length}</h3>
                </div>
              </div>

              <div className="bg-[#101726] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sinal Crítico (&lt; -27dBm)</p>
                  <h3 className="text-2xl font-bold text-white font-outfit mt-0.5">1</h3>
                </div>
              </div>
            </div>

            {/* TABELA DE DISPOSITIVOS */}
            <div className="bg-[#101726] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-[#0b0f19]/60 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <th className="p-4">Dispositivo / Modelo</th>
                      <th className="p-4">Serial / MAC</th>
                      <th className="p-4">IP WAN</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Sinal Óptico (Rx / Tx)</th>
                      <th className="p-4 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          <RefreshCw className="animate-spin inline-block mr-2" size={18} /> Carregando CPEs do GenieACS...
                        </td>
                      </tr>
                    ) : filteredDevices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          Nenhum dispositivo encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredDevices.map(device => (
                        <tr key={device._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#0b0f19] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                <Router size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-white font-outfit">{device.manufacturer} {device.productClass}</p>
                                <p className="text-xs text-slate-500">TR-069 ID: {device._id.slice(0, 16)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-mono text-xs font-bold text-slate-300">{device.serialNumber}</p>
                            <p className="font-mono text-[11px] text-slate-500">{device.mac}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-[#0b0f19] border border-white/5 px-2.5 py-1 rounded-lg text-xs text-blue-400 font-mono font-bold">
                              {device.ip}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              device.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                              {device.status}
                            </div>
                          </td>
                          <td className="p-4">
                            {device.status === 'online' && device.rssi ? (
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">RSSI (Rx)</span>
                                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${getRssiBg(device.rssi)}`}>
                                    <Signal size={12} className={getRssiColor(device.rssi)} />
                                    <span className={`text-xs font-mono font-bold ${getRssiColor(device.rssi)}`}>{device.rssi} dBm</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tx Power</span>
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border bg-[#0b0f19] border-white/5 text-slate-300">
                                    <Radio size={12} />
                                    <span className="text-xs font-mono font-bold">2.4 dBm</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                <Activity size={14} className="opacity-50" /> Telemetria Indisponível
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 bg-[#0b0f19] border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 rounded-lg transition-colors" title="Visualizar Diagnóstico Completo">
                                <BarChart3 size={16} />
                              </button>
                              <button className="p-2 bg-[#0b0f19] border border-white/5 hover:border-amber-500/30 text-slate-400 hover:text-amber-400 rounded-lg transition-colors" title="Reboot Remoto (TR-069)">
                                <RefreshCw size={16} />
                              </button>
                              <button className="p-2 bg-[#0b0f19] border border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors" title="Configurações Wi-Fi">
                                <Wrench size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE NOVO INCIDENTE */}
      {modalNovoIncidente && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101726] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="text-red-400" size={20} /> Abertura de Incidente de Rede (NOC)
              </h3>
              <button onClick={() => setModalNovoIncidente(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCriarIncidente} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Título da Ocorrência</label>
                <input 
                  type="text" 
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Rompimento de Fibra Troncal - Av. Principal"
                  required
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Bairros / Regiões Afetadas (separados por vírgula)</label>
                <input 
                  type="text" 
                  value={novoBairros}
                  onChange={(e) => setNovoBairros(e.target.value)}
                  placeholder="Ex: Centro Histórico, Bela Vista, Jardim Primavera"
                  required
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Concentrador / OLT / PON</label>
                  <input 
                    type="text" 
                    value={novoOlt}
                    onChange={(e) => setNovoOlt(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Clientes Afetados (Aprox.)</label>
                  <input 
                    type="number" 
                    value={novoClientes}
                    onChange={(e) => setNovoClientes(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Previsão de Normalização (ETA)</label>
                <input 
                  type="text" 
                  value={novoPrevisao}
                  onChange={(e) => setNovoPrevisao(e.target.value)}
                  placeholder="Ex: 16:30 (Hoje)"
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Detalhes do Reparo / Equipe em Campo</label>
                <textarea 
                  value={novoDescricao}
                  onChange={(e) => setNovoDescricao(e.target.value)}
                  placeholder="Ex: Caminhão colidiu com poste de distribuição. Equipe de fusão 02 no local."
                  rows={3}
                  className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500"
                />
              </div>

              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-[11px] flex items-center gap-2">
                <Zap size={14} className="shrink-0" />
                Ao salvar, a IA do NAP ativará a interceptação imediata para clientes dos bairros indicados.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setModalNovoIncidente(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <ShieldAlert size={14} /> Ativar Incidente no NOC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
