import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wifi, CreditCard, HeadphonesIcon, Settings } from 'lucide-react';
import WebchatWidget from './WebchatWidget';

export default function PortalLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="font-bold text-lg">Meu Provedor</div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
          JS
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-blue-700 border-b border-slate-100">
          Meu Provedor
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <NavItem to="/portal" icon={<Wifi size={20} />} label="Minha Conexão" exact />
          <NavItem to="/portal/faturas" icon={<CreditCard size={20} />} label="Faturas" />
          <NavItem to="/portal/suporte" icon={<HeadphonesIcon size={20} />} label="Suporte Técnico" />
          <NavItem to="/portal/conta" icon={<Settings size={20} />} label="Minha Conta" />
        </nav>
        
        <div className="p-4 border-t border-slate-100 text-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 font-bold">
            JS
          </div>
          <div>
            <p className="text-slate-900 font-bold">João Silva</p>
            <p className="text-xs text-slate-500">Contrato #1001</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
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
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label, exact = false }: { to: string; icon: React.ReactNode; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-lg transition-colors ${
          isActive ? 'text-blue-700' : 'text-slate-500'
        }`
      }
    >
      <div className={({ isActive }: any) => `p-1 rounded-full ${isActive ? 'bg-blue-50' : ''}`}>
         {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
