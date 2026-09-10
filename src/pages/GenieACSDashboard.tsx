import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Router, Search, AlertCircle, CheckCircle2, XCircle, Signal } from 'lucide-react';

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

export default function GenieACSDashboard() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Mocking real-time updates and initial fetch
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // Simulating an API call to GenieACS NBI via our Node.js backend
        // In a real app this would be: await fetch('/api/genieacs/devices')
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDevices: DeviceInfo[] = [
          {
            _id: '123456-ZXHN-123456789',
            manufacturer: 'ZTE',
            productClass: 'F670L',
            serialNumber: 'ZTEGC1234567',
            mac: '00:11:22:33:44:55',
            ip: '10.10.1.55',
            lastInform: new Date().toISOString(),
            status: 'online',
            rssi: -22,
            snr: 35
          },
          {
            _id: '987654-HUAWEI-987654321',
            manufacturer: 'Huawei',
            productClass: 'HG8245Q2',
            serialNumber: '485754432198',
            mac: '66:77:88:99:AA:BB',
            ip: '10.10.2.14',
            lastInform: new Date(Date.now() - 3600000).toISOString(),
            status: 'offline'
          },
          {
            _id: '555555-NOKIA-555555555',
            manufacturer: 'Nokia',
            productClass: 'G-240W-C',
            serialNumber: 'ALCLB1234567',
            mac: 'CC:DD:EE:FF:00:11',
            ip: '10.10.3.100',
            lastInform: new Date().toISOString(),
            status: 'online',
            rssi: -28,
            snr: 29
          }
        ];
        
        setDevices(mockDevices);
        setError('');
      } catch (err) {
        setError('Erro ao conectar com o servidor GenieACS.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();

    // Simulating real-time signal fluctuations for online devices
    const interval = setInterval(() => {
      setDevices(prev => prev.map(dev => {
        if (dev.status === 'online' && dev.rssi && dev.snr) {
          // Fluctuates RSSI by -1 to +1 and SNR by -1 to +1
          const rChange = Math.floor(Math.random() * 3) - 1;
          const sChange = Math.floor(Math.random() * 3) - 1;
          return {
            ...dev,
            rssi: Math.min(-15, Math.max(-35, dev.rssi + rChange)),
            snr: Math.max(15, dev.snr + sChange),
            lastInform: new Date().toISOString()
          };
        }
        return dev;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (rssi?: number) => {
    if (!rssi) return 'text-slate-300';
    if (rssi >= -25) return 'text-emerald-500'; // Excellent
    if (rssi >= -28) return 'text-amber-500'; // Good
    return 'text-red-500'; // Poor
  };

  const filteredDevices = devices.filter(d => 
    d.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ip.includes(searchTerm)
  );

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Router className="text-blue-600" />
            GenieACS Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoramento TR-069 em tempo real de ONUs e Roteadores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar MAC, IP ou Serial..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64 transition-shadow bg-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-200">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Router size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total de Dispositivos</p>
              <p className="text-2xl font-bold text-slate-900">{devices.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">ONUs Online</p>
              <p className="text-2xl font-bold text-slate-900">{devices.filter(d => d.status === 'online').length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">ONUs Offline</p>
              <p className="text-2xl font-bold text-slate-900">{devices.filter(d => d.status === 'offline').length}</p>
            </div>
          </div>
        </div>

        {/* Devices List */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Telemetria de CPEs
            </h3>
            {loading && <span className="text-xs font-medium text-slate-500 animate-pulse">Atualizando...</span>}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Dispositivo</th>
                  <th className="px-6 py-3 font-semibold">MAC / IP</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Sinal Óptico (RSSI)</th>
                  <th className="px-6 py-3 font-semibold">SNR</th>
                  <th className="px-6 py-3 font-semibold text-right">Último Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map(device => (
                  <tr key={device._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{device.manufacturer} {device.productClass}</span>
                        <span className="text-xs text-slate-500 font-mono">SN: {device.serialNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-mono">{device.mac}</span>
                        <span className="text-xs text-slate-500 font-mono">{device.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {device.status === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Offline
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {device.status === 'online' && device.rssi ? (
                        <div className="flex items-center gap-2">
                          <Signal size={16} className={getSignalColor(device.rssi)} />
                          <span className={`font-mono font-bold ${getSignalColor(device.rssi)}`}>
                            {device.rssi} dBm
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {device.status === 'online' && device.snr ? (
                        <span className="font-mono font-bold text-slate-700">{device.snr} dB</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-slate-500">
                        {new Date(device.lastInform).toLocaleTimeString()}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredDevices.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <Wifi className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">Nenhum dispositivo encontrado</p>
                      <p className="text-xs mt-1">Verifique o termo de busca ou tente novamente.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
