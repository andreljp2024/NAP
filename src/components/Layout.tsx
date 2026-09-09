import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Settings, Users, Trello, PieChart } from 'lucide-react';
import CTIReverso from './CTIReverso';

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/60 flex flex-col relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-slate-100 tracking-tight font-outfit">NAP <span className="text-indigo-400 font-medium text-sm">Omni</span></span>
          </div>
        </div>
        
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Operação</p>
          <nav className="flex flex-col gap-1">
            <NavItem to="/dashboard" icon={<PieChart size={18} />} label="Analytics" />
            <NavItem to="/" icon={<MessageSquare size={18} />} label="Inbox Unificado" />
            <NavItem to="/suporte" icon={<Trello size={18} />} label="Kanban Suporte" />
            <NavItem to="/vendas" icon={<Trello size={18} />} label="Kanban Vendas" />
            <NavItem to="/crm" icon={<Users size={18} />} label="CRM Clientes" />
          </nav>
        </div>

        <div className="px-4 mt-auto py-3">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Administração</p>
          <nav className="flex flex-col gap-1">
            <NavItem to="/configuracoes" icon={<Settings size={18} />} label="Ajustes da IA" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800/60 flex items-center gap-3 bg-[#0d1321]">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-slate-700">
            JD
          </div>
          <div className="flex-1">
            <p className="text-slate-200 font-medium text-sm">João Dev</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0b0f19]">
        <CTIReverso />
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium ${
          isActive 
            ? 'bg-indigo-500/10 text-indigo-400' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`
      }
    >
      <div className={`${({ isActive }: any) => isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
        {icon}
      </div>
      <span>{label}</span>
    </NavLink>
  );
}
