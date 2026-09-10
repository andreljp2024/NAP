import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, Settings, Users, Trello, PieChart, 
  ShieldUser, Megaphone, Workflow, Server, LogOut, 
  ChevronLeft, ChevronRight, Menu, X, ExternalLink,
  PhoneCall, Activity, Sparkles, PanelLeftClose, PanelLeftOpen,
  CreditCard, Headphones, ShoppingCart, Router
} from 'lucide-react';
import CTIReverso from './CTIReverso';
import Webphone from './Webphone';
import OperatorStatusControl from './OperatorStatusControl';

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Estado de recolhimento no Desktop com persistência local
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nap_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Estado da barra móvel (Drawer em telas menores)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persiste a preferência do usuário
  useEffect(() => {
    try {
      localStorage.setItem('nap_sidebar_collapsed', String(isCollapsed));
    } catch (e) {
      console.warn(e);
    }
  }, [isCollapsed]);

  // Fecha o drawer mobile ao trocar de rota
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Atalho de teclado Ctrl+B / Cmd+B para alternar menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mapeamento dinâmico de títulos para o Topbar
  const getPageInfo = (path: string) => {
    if (path === '/admin' || path === '/admin/') return { title: 'Inbox Unificado', category: 'Atendimento Omnichannel', icon: <MessageSquare size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/dashboard')) return { title: 'Analytics Operacional', category: 'Monitoramento & KPIs', icon: <PieChart size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/cobranca')) return { title: 'Régua de Cobrança', category: 'Inadimplência, PIX & Desbloqueio 48h', icon: <CreditCard size={18} className="text-amber-600" /> };
    if (path.startsWith('/admin/suporte')) return { title: 'Kanban de Suporte', category: 'N1 & N2 Técnico', icon: <Headphones size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/vendas')) return { title: 'Kanban de Vendas', category: 'Novos Assinantes & Upgrades', icon: <ShoppingCart size={18} className="text-emerald-600" /> };
    if (path.startsWith('/admin/campanhas')) return { title: 'Operação Ativa', category: 'Campanhas HSM & URA Reversa', icon: <Megaphone size={18} className="text-indigo-600" /> };
    if (path.startsWith('/admin/crm')) return { title: 'Base CRM 360', category: 'Histórico & Sincronização SGP', icon: <Users size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/sgp')) return { title: 'Workspace SGP (ERP)', category: 'Diagnóstico & Ações de Rede', icon: <Server size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/genieacs')) return { title: 'GenieACS Dashboard', category: 'Monitoramento TR-069', icon: <Router size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/automacoes')) return { title: 'Agente IA & Automações', category: 'Google Gemini Serverless (Sem n8n)', icon: <Sparkles size={18} className="text-indigo-600" /> };
    if (path.startsWith('/admin/operadores')) return { title: 'Gestão de Operadores', category: 'Escalas & Filas Asterisk', icon: <ShieldUser size={18} className="text-blue-400" /> };
    if (path.startsWith('/admin/configuracoes')) return { title: 'Super Admin', category: 'Multi-Tenant & Telecom', icon: <Settings size={18} className="text-slate-400" /> };
    return { title: 'NAP Omni', category: 'Telecom Suite', icon: <Activity size={18} className="text-blue-400" /> };
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-300 font-sans overflow-hidden">
      {/* Backdrop para Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#0b0f19]/80 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Modernizada (Desktop Collapsible + Mobile Drawer) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-[#101726] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
          md:static md:translate-x-0
          ${isMobileOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        `}
      >
        {/* Header da Sidebar com Logo e Botão de Recolhimento */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <span className="text-white font-extrabold text-base tracking-tight font-outfit">N</span>
            </div>
            
            {/* Texto do logo esconde ao recolher */}
            <div className={`transition-opacity duration-200 ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100'}`}>
              <span className="font-extrabold text-lg text-white tracking-tight font-outfit block leading-none">
                NAP <span className="text-blue-400 font-medium text-xs bg-blue-600/10 border border-blue-500/20 px-1.5 py-0.5 rounded ml-1">Omni</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Plataforma ISP</span>
            </div>
          </div>

          {/* Botão de Fechar no Mobile */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#101726]/5 rounded-lg transition-colors"
            title="Fechar menu"
          >
            <X size={20} />
          </button>

          {/* Botão de Recolher no Desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-[#101726]/5 border border-white/5 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
            title={isCollapsed ? "Expandir menu (Ctrl+B)" : "Recolher menu (Ctrl+B)"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Navegação Principal com Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Seção: Operação */}
          <div>
            {!isCollapsed ? (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 flex items-center justify-between">
                <span>Operação</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Serviços Ativos"></span>
              </p>
            ) : (
              <div className="h-px bg-white/10 my-2 mx-2" title="Operação" />
            )}
            
            <nav className="flex flex-col gap-1">
              <NavItem to="/admin/dashboard" icon={<PieChart size={19} />} label="Analytics" isCollapsed={isCollapsed} />
              <NavItem to="/admin" icon={<MessageSquare size={19} />} label="Inbox Unificado" badge="2" isCollapsed={isCollapsed} />
              <NavItem to="/admin/cobranca" icon={<CreditCard size={19} />} label="Cobrança & PIX" isCollapsed={isCollapsed} />
              <NavItem to="/admin/suporte" icon={<Headphones size={19} />} label="Suporte N1/N2" isCollapsed={isCollapsed} />
              <NavItem to="/admin/vendas" icon={<ShoppingCart size={19} />} label="Vendas & Leads" isCollapsed={isCollapsed} />
              <NavItem to="/admin/campanhas" icon={<Megaphone size={19} />} label="Ativo (Campanhas)" isCollapsed={isCollapsed} />
              <NavItem to="/admin/crm" icon={<Users size={19} />} label="CRM Clientes" isCollapsed={isCollapsed} />
              <NavItem to="/admin/sgp" icon={<Server size={19} />} label="Consulta SGP" isCollapsed={isCollapsed} />
              <NavItem to="/admin/genieacs" icon={<Router size={19} />} label="GenieACS" isCollapsed={isCollapsed} />
            </nav>
          </div>

          {/* Seção: Automação & IA */}
          <div>
            {!isCollapsed ? (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 flex items-center justify-between">
                <span>Automação & IA</span>
                <Sparkles size={11} className="text-purple-600" />
              </p>
            ) : (
              <div className="h-px bg-white/10 my-2 mx-2" title="Automação & IA" />
            )}

            <nav className="flex flex-col gap-1">
              <NavItem to="/admin/automacoes" icon={<Sparkles size={19} />} label="Agente Gemini" badge="Free" isCollapsed={isCollapsed} />
            </nav>
          </div>

          {/* Seção: Administração */}
          <div>
            {!isCollapsed ? (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                Administração
              </p>
            ) : (
              <div className="h-px bg-white/10 my-2 mx-2" title="Administração" />
            )}

            <nav className="flex flex-col gap-1">
              <NavItem to="/admin/operadores" icon={<ShieldUser size={19} />} label="Operadores" isCollapsed={isCollapsed} />
              <NavItem to="/admin/configuracoes" icon={<Settings size={19} />} label="Super Admin" isCollapsed={isCollapsed} />
            </nav>
          </div>
        </div>

        {/* Atalho para o Portal do Cliente (PWA) no rodapé */}
        {!isCollapsed ? (
          <div className="px-3 pb-3">
            <a 
              href="/portal" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-500/20/80 hover:border-blue-300 text-blue-400 text-xs font-semibold transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  APP
                </div>
                <span>Portal do Assinante</span>
              </div>
              <ExternalLink size={14} className="text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        ) : (
          <div className="px-3 pb-3 flex justify-center">
            <a 
              href="/portal" 
              target="_blank" 
              rel="noreferrer"
              title="Abrir Portal do Assinante (PWA)"
              className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        )}
        
        {/* Perfil do Usuário e Ramal Conectado */}
        <div className={`p-3 border-t border-white/5 bg-[#0b0f19]/80 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#101726] flex items-center justify-center text-slate-300 font-bold border border-white/5 shadow-2xs text-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'JD'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" title="Disponível no Asterisk"></div>
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-white font-semibold text-xs truncate">{user?.name || 'João Silva'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">Ramal 2001</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Topbar Moderno e Responsivo */}
        <header className="h-16 border-b border-white/5 bg-[#101726]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-2xs">
          
          {/* Esquerda: Botão Mobile + Título da Página / Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Botão Hamburger (Mobile) */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#101726]/5 border border-white/5 transition-colors"
              title="Abrir Menu"
            >
              <Menu size={20} />
            </button>

            {/* Alternar Recolher no Desktop */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-white hover:bg-[#101726]/5 border border-transparent hover:border-white/5 transition-colors"
              title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {/* Título dinâmico da página atual */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[#101726]/5 border border-white/5 items-center justify-center">
                {pageInfo.icon}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-outfit tracking-tight leading-tight">
                  {pageInfo.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  {pageInfo.category}
                </p>
              </div>
            </div>
          </div>

          {/* Direita: Status da Conexão, Controle de Pausas NR-17, Webphone e Ações */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Controle de Pausas & Presença NR-17 */}
            <OperatorStatusControl />

            {/* Status Telecom & SGP */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#101726]/5 border border-white/5 text-[11px] font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FreePBX & SGP Online</span>
            </div>

            {/* Webphone / Ramal SIP */}
            <div className="relative">
              <Webphone />
            </div>
          </div>
        </header>

        {/* Notificação CTI Reversa (FreePBX) */}
        <CTIReverso />

        {/* Conteúdo Dinâmico das Rotas */}
        <main className="flex-1 overflow-hidden relative flex flex-col bg-[#0b0f19]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Componente de Item de Navegação com Suporte a Tooltip Flutuante no modo Recolhido
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isCollapsed: boolean;
}

function NavItem({ to, icon, label, badge, isCollapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center rounded-xl transition-all duration-200 group text-sm font-medium ${
          isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
        } ${
          isActive 
            ? 'bg-blue-600/10 text-blue-400 shadow-2xs font-semibold' 
            : 'text-slate-400 hover:bg-[#101726]/5 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Indicador ativo na lateral esquerda quando expandido */}
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
          )}

          {/* Ícone */}
          <div className={`${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} transition-colors shrink-0`}>
            {icon}
          </div>

          {/* Label de texto (esconde no modo recolhido) */}
          {!isCollapsed && (
            <span className="truncate flex-1">{label}</span>
          )}

          {/* Badge quando expandido */}
          {!isCollapsed && badge && (
            <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
              {badge}
            </span>
          )}

          {/* Tooltip Flutuante elegante quando recolhido (Modo Desktop) */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#101726] text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap shadow-xl z-50 pointer-events-none flex items-center gap-2">
              <span>{label}</span>
              {badge && (
                <span className="bg-blue-600/100 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}
