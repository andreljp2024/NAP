import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Settings, Users, Trello } from 'lucide-react';
import CTIReverso from './CTIReverso';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-xl text-white border-b border-slate-800">
          NAP <span className="text-blue-500 ml-1">WACRM</span>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          <NavItem to="/" icon={<MessageSquare size={20} />} label="Inbox Unificado" />
          <NavItem to="/suporte" icon={<Trello size={20} />} label="Kanban - Suporte" />
          <NavItem to="/vendas" icon={<Trello size={20} />} label="Kanban - Vendas" />
          <NavItem to="/crm" icon={<Users size={20} />} label="CRM / Clientes" />
          
          <div className="mt-auto">
            <NavItem to="/configuracoes" icon={<Settings size={20} />} label="Super Admin" />
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div>
            <p className="text-white font-medium">João Dev</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
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
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
