import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Settings, Users, Trello, PieChart, ShieldUser, Megaphone, Workflow } from 'lucide-react';
import CTIReverso from './CTIReverso';
import Webphone from './Webphone';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-700 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col relative z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight font-outfit">NAP <span className="text-blue-600 font-medium text-sm">Omni</span></span>
          </div>
        </div>
        
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">Operação</p>
          <nav className="flex flex-col gap-1">
            <NavItem to="/dashboard" icon={<PieChart size={18} />} label="Analytics" />
            <NavItem to="/" icon={<MessageSquare size={18} />} label="Inbox Unificado" />
            <NavItem to="/suporte" icon={<Trello size={18} />} label="Kanban Suporte" />
            <NavItem to="/vendas" icon={<Trello size={18} />} label="Kanban Vendas" />
            <NavItem to="/campanhas" icon={<Megaphone size={18} />} label="Ativo (Campanhas)" />
            <NavItem to="/crm" icon={<Users size={18} />} label="CRM Clientes" />
          </nav>
        </div>

        <div className="px-4 mt-auto py-3">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-2">Administração</p>
          <nav className="flex flex-col gap-1">
            <NavItem to="/automacoes" icon={<Workflow size={18} />} label="Fluxos (n8n)" />
            <NavItem to="/operadores" icon={<ShieldUser size={18} />} label="Operadores" />
            <NavItem to="/configuracoes" icon={<Settings size={18} />} label="Painel Super Admin" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
            JD
          </div>
          <div className="flex-1">
            <p className="text-slate-900 font-medium text-sm">João Dev</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        
        {/* Top Header / Webphone Injection */}
        <header className="absolute top-0 right-0 w-full h-16 flex justify-end items-center px-6 pointer-events-none z-40">
          <div className="pointer-events-auto">
            <Webphone />
          </div>
        </header>

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
            ? 'bg-blue-50 text-blue-700 shadow-sm' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
