import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { DivIcon, Icon } from 'leaflet';
import { 
  Search, Filter, MapPin, Router, Activity, 
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Signal, X
} from 'lucide-react';

// Correção para ícones padrão do Leaflet no React
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Tipagem da ONT no Mapa
interface OntGeoNode {
  id: string;
  cliente: string;
  mac: string;
  lat: number;
  lng: number;
  status: 'online' | 'offline' | 'alerta';
  rxPower: string;
  uptime: string;
  plano: string;
}

// Gerador de Mocks Geográficos (Ao redor de uma coordenada central)
const generateMockOnts = (centerLat: number, centerLng: number, count: number): OntGeoNode[] => {
  const nodes: OntGeoNode[] = [];
  const radius = 0.05; // ~5km
  
  const statuses: ('online' | 'offline' | 'alerta')[] = ['online', 'online', 'online', 'online', 'alerta', 'offline'];
  const nomes = ['João Silva', 'Maria Souza', 'Empresa XYZ', 'Carlos Oliveira', 'Ana Costa', 'Padaria Pão Quente', 'Lucas Mendes', 'Farmácia Vida'];
  const planos = ['Fibra 500 Mega', 'Fibra 700 Mega', 'Gamer 1 Giga', 'Empresarial Link Dedicado'];

  for (let i = 0; i < count; i++) {
    const r = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let rx = '-19.5 dBm';
    if (status === 'alerta') rx = '-28.4 dBm (Crítico)';
    if (status === 'offline') rx = 'Sem Sinal (LOS)';
    
    nodes.push({
      id: `ONT-${1000 + i}`,
      cliente: nomes[Math.floor(Math.random() * nomes.length)] + ` ${i+1}`,
      mac: `48:57:DD:${Math.floor(Math.random()*90+10)}:${Math.floor(Math.random()*90+10)}:${Math.floor(Math.random()*90+10)}`,
      lat: centerLat + r * Math.cos(theta),
      lng: centerLng + r * Math.sin(theta),
      status: status,
      rxPower: rx,
      uptime: status === 'offline' ? '00:00:00' : `${Math.floor(Math.random() * 30 + 1)} dias`,
      plano: planos[Math.floor(Math.random() * planos.length)]
    });
  }
  return nodes;
};

// Ícones Customizados
const createCustomIcon = (status: 'online' | 'offline' | 'alerta') => {
  let colorClass = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
  if (status === 'alerta') colorClass = 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse';
  if (status === 'offline') colorClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-bounce';

  return new DivIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="absolute w-full h-full rounded-full border-2 border-white ${colorClass}"></div>
        <div class="w-1.5 h-1.5 bg-white rounded-full z-10"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function MapaRede() {
  const centralPos = { lat: -23.5505, lng: -46.6333 }; // São Paulo
  const [onts, setOnts] = useState<OntGeoNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'online' | 'alerta' | 'offline'>('todos');
  const [selectedOnt, setSelectedOnt] = useState<OntGeoNode | null>(null);

  useEffect(() => {
    // Simula carregamento do banco de dados (GenieACS + CRM Geocoding)
    setTimeout(() => {
      setOnts(generateMockOnts(centralPos.lat, centralPos.lng, 2500));
      setLoading(false);
    }, 800);
  }, []);

  const filteredOnts = useMemo(() => {
    return (onts || []).filter(ont => {
      if (!ont) return false;
      const matchSearch = (ont.cliente?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (ont.mac?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (ont.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'todos' || ont.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [onts, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: onts?.length || 0,
      online: onts?.filter(o => o?.status === 'online')?.length || 0,
      alertas: onts?.filter(o => o?.status === 'alerta')?.length || 0,
      offline: onts?.filter(o => o?.status === 'offline')?.length || 0
    };
  }, [onts]);

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* HEADER DE CONTROLE */}
      <div className="p-6 border-b border-white/5 bg-slate-900/90 backdrop-blur-md z-20 shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
              <MapPin className="text-blue-500" /> GIS & Mapa de ONTs
            </h1>
            <p className="text-sm text-slate-400 mt-1">Monitoramento geográfico em tempo real das ONTs (TR-069) e Alarmes.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[100px]">
              <span className="text-xl font-bold text-white">{stats.total}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Ativos</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[100px] cursor-pointer hover:bg-emerald-500/20 transition-colors" onClick={() => setStatusFilter(statusFilter === 'online' ? 'todos' : 'online')}>
              <span className="text-xl font-bold text-emerald-400">{stats.online}</span>
              <span className="text-[10px] text-emerald-500 uppercase tracking-wider">Online</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[100px] cursor-pointer hover:bg-amber-500/20 transition-colors" onClick={() => setStatusFilter(statusFilter === 'alerta' ? 'todos' : 'alerta')}>
              <span className="text-xl font-bold text-amber-400">{stats.alertas}</span>
              <span className="text-[10px] text-amber-500 uppercase tracking-wider">Atenção</span>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 flex flex-col items-center justify-center min-w-[100px] cursor-pointer hover:bg-red-500/20 transition-colors" onClick={() => setStatusFilter(statusFilter === 'offline' ? 'todos' : 'offline')}>
              <span className="text-xl font-bold text-red-400">{stats.offline}</span>
              <span className="text-[10px] text-red-500 uppercase tracking-wider">LOS/Offline</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Nome do Cliente, MAC ou ID da ONT..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 flex-1 sm:w-48 appearance-none"
            >
              <option value="todos">Todos os Status</option>
              <option value="online">Somente Online</option>
              <option value="alerta">Somente Alertas</option>
              <option value="offline">Somente Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* ÁREA DO MAPA */}
      <div className="flex-1 relative z-10 bg-slate-900">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50">
            <RefreshCw size={32} className="text-blue-500 animate-spin mb-4" />
            <p className="text-slate-300 font-medium">Carregando dados geolocalizados do GenieACS...</p>
          </div>
        ) : null}

        {/* Legenda Interativa Flutuante */}
        <div className="absolute bottom-6 right-6 z-[400] bg-slate-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex flex-col gap-3 min-w-[200px]">
          <h3 className="text-sm font-bold text-white mb-1">Legenda (Status TR-069)</h3>
          
          <div 
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${statusFilter === 'online' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setStatusFilter(statusFilter === 'online' ? 'todos' : 'online')}
          >
            <div className="relative flex items-center justify-center w-5 h-5">
              <div className="absolute w-full h-full rounded-full border border-white bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full z-10"></div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white leading-none">Online</p>
              <p className="text-[10px] text-emerald-400">Sinal e conexão OK</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">{stats.online}</span>
          </div>

          <div 
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${statusFilter === 'alerta' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setStatusFilter(statusFilter === 'alerta' ? 'todos' : 'alerta')}
          >
            <div className="relative flex items-center justify-center w-5 h-5">
              <div className="absolute w-full h-full rounded-full border border-white bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full z-10"></div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white leading-none">Atenção</p>
              <p className="text-[10px] text-amber-400">Sinal Crítico (Atenuado)</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">{stats.alertas}</span>
          </div>

          <div 
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${statusFilter === 'offline' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setStatusFilter(statusFilter === 'offline' ? 'todos' : 'offline')}
          >
            <div className="relative flex items-center justify-center w-5 h-5">
              <div className="absolute w-full h-full rounded-full border border-white bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-bounce" style={{animationDuration: '2s'}}></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full z-10"></div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white leading-none">Offline (LOS)</p>
              <p className="text-[10px] text-red-400">Rompimento / Sem Energia</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">{stats.offline}</span>
          </div>
        </div>

        <MapContainer 
          center={[centralPos.lat, centralPos.lng]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          className="z-10"
        >
          {/* Usando o CartoDB Dark Matter para combinar com o tema dark do sistema */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
            {(filteredOnts || []).map(ont => {
              if (!ont) return null;
              return (
              <Marker 
                key={ont.id} 
                position={[ont.lat, ont.lng]} 
                icon={createCustomIcon(ont.status)}
                eventHandlers={{
                  click: () => setSelectedOnt(ont)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[220px]">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                      <Router size={16} className="text-blue-600" />
                      <span className="font-bold text-slate-800 text-sm">{ont.id}</span>
                      {ont.status === 'online' && <span className="ml-auto bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">ONLINE</span>}
                      {ont.status === 'alerta' && <span className="ml-auto bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">ALERTA</span>}
                      {ont.status === 'offline' && <span className="ml-auto bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">OFFLINE</span>}
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p><strong className="text-slate-800">Cliente:</strong> {ont.cliente}</p>
                      <p><strong className="text-slate-800">MAC:</strong> <span className="font-mono">{ont.mac}</span></p>
                      <p><strong className="text-slate-800">Plano:</strong> {ont.plano}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Signal size={14} className={ont.status === 'offline' ? 'text-red-500' : 'text-blue-500'} />
                        <span className="font-semibold">{ont.rxPower}</span>
                      </div>
                      {ont.status === 'online' && (
                        <div className="flex items-center gap-1">
                           <Activity size={14} className="text-emerald-500" />
                           <span>Uptime: {ont.uptime}</span>
                        </div>
                      )}
                    </div>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors">
                      Abrir no GenieACS
                    </button>
                  </div>
                </Popup>
              </Marker>
            )})}
          </MarkerClusterGroup>
        </MapContainer>
        
        {/* Adicionar CSS Customizado para o Popup do Leaflet para integrar ao tema Dark */}
        <style dangerouslySetInnerHTML={{__html: `
          .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          }
          .custom-leaflet-icon {
            background: transparent;
            border: none;
          }
          .leaflet-control-attribution {
            background: rgba(11, 15, 25, 0.7) !important;
            color: #94a3b8 !important;
          }
          .leaflet-control-attribution a {
            color: #60a5fa !important;
          }
        `}} />
      </div>
    </div>
  );
}
