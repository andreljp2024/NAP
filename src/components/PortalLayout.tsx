import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Wifi, CreditCard, HeadphonesIcon, Settings } from 'lucide-react';
import WebchatWidget from './WebchatWidget';

export default function PortalLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0b0f19] text-slate-200 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#101726]/80 backdrop-blur-md border-b border-slate-800/60 p-4 flex justify-between items-center shadow-lg z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-lg text-white font-outfit">Provedor</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-300">
          JS
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-[#0d1321] border-r border-slate-800/60 flex-col shadow-xl shadow-black/10 z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white font-outfit leading-tight">Provedor</span>
              <span className="text-[10px] text-indigo-400 font-medium tracking-widest uppercase">Portal Cliente</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1.5 px-4">
          <NavItem to="/portal" icon={<Wifi size={20} />} label="Minha Conexão" exact />
          <NavItem to="/portal/faturas" icon={<CreditCard size={20} />} label="Faturas" />
          <NavItem to="/portal/suporte" icon={<HeadphonesIcon size={20} />} label="Suporte Técnico" />
          <NavItem to="/portal/conta" icon={<Settings size={20} />} label="Minha Conta" />
        </nav>
        
        <div className="p-5 border-t border-slate-800/60 bg-[#101726]/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700/50 shadow-inner">
            JS
          </div>
          <div>
            <p className="text-white font-bold text-sm">João Silva</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 bg-slate-800/50 px-1.5 py-0.5 rounded inline-block border border-slate-700/50">#1001</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#0b0f19]">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-[#101726]/90 backdrop-blur-xl border-t border-slate-800/60 flex justify-around p-2 pb-safe shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.3)] z-10 sticky bottom-0">
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
            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 shadow-inner' 
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
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
          isActive ? 'text-indigo-400' : 'text-slate-500'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-500/10 shadow-inner' : ''}`}> 
             {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{label}</span>
        </>
      )}
    </NavLink>
  );
}
