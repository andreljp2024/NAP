import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Wifi, CreditCard, HeadphonesIcon, Settings } from 'lucide-react';
import WebchatWidget from './WebchatWidget';
import { PWAInstallButton } from './PWAInstallButton';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useConfig } from '../contexts/ConfigContext';
import { Bell, BellOff, BellRing } from 'lucide-react';

export default function PortalLayout() {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const { config } = useConfig();
  const nomeProvedor = config.provedor?.nomeFantasia || 'NAP Telecom';
  const inicialProvedor = nomeProvedor.charAt(0).toUpperCase() || 'N';

  const authData = localStorage.getItem('@nap_client_auth');
  
  if (!authData) {
    return <Navigate to="/portal/login" replace />;
  }

  const clientData = JSON.parse(authData);
  const clientInitials = clientData.nome ? clientData.nome.charAt(0).toUpperCase() : 'C';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-700 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">{inicialProvedor}</span>
          </div>
          <span className="font-bold text-lg text-slate-900 font-outfit truncate max-w-[170px]">{nomeProvedor}</span>
        </div>
        <div className="flex items-center gap-3">
          {isSupported && permission !== 'granted' && (
            <button onClick={requestPermission} className="p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Ativar Notificações">
              <Bell size={20} />
            </button>
          )}
          {permission === 'granted' && (
            <div className="p-2 text-blue-600" title="Notificações Ativas">
              <BellRing size={20} />
            </div>
          )}
          <PWAInstallButton />
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">
            {clientInitials}
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">{inicialProvedor}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 font-outfit leading-tight truncate max-w-[160px]">{nomeProvedor}</span>
              <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Portal do Assinante</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1.5 px-4">
          <div className="mb-4 px-2 flex flex-col gap-2">
            <PWAInstallButton />
            {isSupported && permission !== 'granted' && (
              <button 
                onClick={requestPermission} 
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Bell size={18} />
                Ativar Notificações
              </button>
            )}
          </div>
          <NavItem to="/portal" icon={<Wifi size={20} />} label="Minha Conexão" exact />
          <NavItem to="/portal/faturas" icon={<CreditCard size={20} />} label="Faturas" />
          <NavItem to="/portal/suporte" icon={<HeadphonesIcon size={20} />} label="Suporte Técnico" />
          <NavItem to="/portal/conta" icon={<Settings size={20} />} label="Minha Conta" />
        </nav>
        
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
            JS
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm">João Silva</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5 bg-white px-1.5 py-0.5 rounded inline-block border border-slate-200">#1001</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 flex justify-around p-2 pb-safe [0_-5px_15px_-5px_rgba(0,0,0,0.1)] z-10 sticky bottom-0">
        <MobileNavItem to="/portal" icon={<Wifi size={22} />} label="Início" exact />
        <MobileNavItem to="/portal/faturas" icon={<CreditCard size={22} />} label="Faturas" />
        <MobileNavItem to="/portal/suporte" icon={<HeadphonesIcon size={22} />} label="Suporte" />
        <MobileNavItem to="/portal/conta" icon={<Settings size={22} />} label="Conta" />
      </nav>

      {/* Inject Webchat Widget */}
      <WebchatWidget />
    </div>
  );
}

function NavItem({ to, icon, label, exact = false }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group ${
          isActive 
            ? 'bg-blue-50 text-blue-700  border border-blue-100' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-600'} transition-colors`}>
            {icon}
          </div>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label, exact = false }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors ${
          isActive ? 'text-blue-600' : 'text-slate-500'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50' : ''}`}>
              {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{label}</span>
        </>
      )}
    </NavLink>
  );
}
