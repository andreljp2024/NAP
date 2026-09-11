import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MessageSquare, Settings, BookOpen, Users, Trello, PieChart, 
  ShieldUser, Megaphone, Workflow, Server, LogOut, 
  ChevronLeft, ChevronRight, Menu, X, ExternalLink,
  PhoneCall, Activity, Sparkles, PanelLeftClose, PanelLeftOpen,
  CreditCard, Headphones, ShoppingCart, Router, Wrench, MapPin, Navigation, Compass
} from 'lucide-react';
import CTIReverso from './CTIReverso';
import Webphone from './Webphone';
import OperatorStatusControl from './OperatorStatusControl';
import OperatorPwaControls from './OperatorPwaControls';
import SyncStatusMonitor from './SyncStatusMonitor';
import { useGeolocationTracker } from '../hooks/useGeolocationTracker';

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { geoData } = useGeolocationTracker();

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
    if (path.startsWith('/admin/campo')) return { title: 'Técnico de Campo (PWA)', category: 'Ordens de Serviço & GPS', icon: <Wrench size={18} className="text-emerald-400" /> };
    if (path.startsWith('/admin/usuarios')) return { title: 'Usuários & Hierarquia', category: 'Gestão, Equipe & Campo', icon: <Users size={18} className="text-purple-400" /> };
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

  const role = user?.role || 'operador';
  const hasAccess = (allowedRoles: string[]) => {
    if (role === 'admin' || role === 'superadmin') return true;
    return allowedRoles.includes(role);
  };

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
          fixed inset-y-0 left-0 z-50 bg-[#070b14] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out
          md:static md:translate-x-0
          ${isMobileOpen ? 'translate-x-0  w-72' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}
        `}
      >
        {/* Header da Sidebar com Logo e Botão de Recolhimento */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-sm tracking-tight font-outfit">N</span>
            </div>
            
            {/* Texto do logo esconde ao recolher */}
            <div className={`transition-opacity duration-200 flex flex-col justify-center ${isCollapsed ? 'md:opacity-0 md:w-0 md:hidden' : 'opacity-100'}`}>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight font-outfit leading-none">NAP</span>
                <span className="text-blue-400 font-bold text-[10px] uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded leading-none">Omni</span>
              </div>
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
        <div className="flex-1 overflow-y-auto py-5 space-y-7" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Seção: Operação */}
          <div>
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-5 flex items-center justify-between">
                <span>Operação</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </p>
            )}
            
            <nav className="flex flex-col gap-0.5 px-3">
              {hasAccess(['tecnico_noc']) && <NavItem to="/admin/dashboard" icon={<PieChart size={18} />} label="Analytics" isCollapsed={isCollapsed} />}
              {hasAccess(['operador', 'tecnico_noc', 'tecnico_campo']) && <NavItem to="/admin" icon={<MessageSquare size={18} />} label="Inbox Unificado" badge="2" isCollapsed={isCollapsed} />}
              {hasAccess(['tecnico_campo']) && <NavItem to="/admin/campo" icon={<Wrench size={18} />} label="Técnico de Campo" badge="GPS" isCollapsed={isCollapsed} />}
              {hasAccess(['operador']) && <NavItem to="/admin/cobranca" icon={<CreditCard size={18} />} label="Cobrança & PIX" isCollapsed={isCollapsed} />}
              {hasAccess(['operador', 'tecnico_noc', 'tecnico_campo']) && <NavItem to="/admin/suporte" icon={<Headphones size={18} />} label="Suporte N1/N2" isCollapsed={isCollapsed} />}
              {hasAccess(['operador']) && <NavItem to="/admin/vendas" icon={<ShoppingCart size={18} />} label="Vendas & Leads" isCollapsed={isCollapsed} />}
              {hasAccess(['operador']) && <NavItem to="/admin/campanhas" icon={<Megaphone size={18} />} label="Ativo (Campanhas)" isCollapsed={isCollapsed} />}
              {hasAccess(['operador', 'tecnico_noc']) && <NavItem to="/admin/crm" icon={<Users size={18} />} label="CRM Clientes" isCollapsed={isCollapsed} />}
              {hasAccess(['operador', 'tecnico_noc', 'tecnico_campo']) && <NavItem to="/admin/sgp" icon={<Server size={18} />} label="Consulta SGP" isCollapsed={isCollapsed} />}
              {hasAccess(['tecnico_noc']) && <NavItem to="/admin/genieacs" icon={<Router size={18} />} label="GenieACS" isCollapsed={isCollapsed} />}
              <NavItem to="/admin/ajuda" icon={<BookOpen size={18} />} label="Base de Conhecimento" isCollapsed={isCollapsed} />
            </nav>
          </div>

          {/* Seção: Automação & IA */}
          {hasAccess([]) && (
            <div>
              {!isCollapsed && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-5 flex items-center justify-between">
                  <span>Automação & IA</span>
                  <Sparkles size={11} className="text-indigo-500" />
                </p>
              )}

              <nav className="flex flex-col gap-0.5 px-3">
                <NavItem to="/admin/automacoes" icon={<Sparkles size={18} />} label="Agente Gemini" badge="Free" isCollapsed={isCollapsed} />
              </nav>
            </div>
          )}

          {/* Seção: Administração */}
          {hasAccess([]) && (
            <div>
              {!isCollapsed && (
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-5">
                  Administração
                </p>
              )}

              <nav className="flex flex-col gap-0.5 px-3">
                <NavItem to="/admin/usuarios" icon={<Users size={18} />} label="Usuários & Hierarquia" badge="4" isCollapsed={isCollapsed} />
                <NavItem to="/admin/operadores" icon={<ShieldUser size={18} />} label="Operadores" isCollapsed={isCollapsed} />
                <NavItem to="/admin/configuracoes" icon={<Settings size={18} />} label="Super Admin" isCollapsed={isCollapsed} />
              </nav>
            </div>
          )}
        </div>

        {/* Atalho para o Portal do Cliente (PWA) no rodapé */}
        {!isCollapsed ? (
          <div className="px-3 pb-3">
            <a 
              href="/portal" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-500/20/80 hover:border-blue-300 text-blue-400 text-xs font-semibold transition-all group "
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
              <div className="w-9 h-9 rounded-xl bg-[#101726] flex items-center justify-center text-slate-300 font-bold border border-white/5  text-sm">
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
        <header className="h-16 border-b border-white/5 bg-[#0b0f19]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          
          {/* Esquerda: Botão Mobile + Título da Página / Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Botão Hamburger (Mobile) */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
              title="Abrir Menu"
            >
              <Menu size={18} />
            </button>

            {/* Alternar Recolher no Desktop */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 border border-transparent transition-colors"
              title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            {/* Título dinâmico da página atual */}
            <div className="flex items-center gap-3 ml-2">
              <div className="hidden sm:flex w-8 h-8 rounded-lg bg-white/5 border border-white/5 items-center justify-center">
                {pageInfo.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-sm font-bold text-white font-outfit tracking-tight leading-none mb-1">
                  {pageInfo.title}
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold leading-none hidden sm:block">
                  {pageInfo.category}
                </p>
              </div>
            </div>
          </div>

          {/* Direita: Status da Conexão, Controle de Pausas NR-17, Webphone, PWA e Ações */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Indicador de Geolocalização em Tempo Real (Técnicos & Operadores por Padrão) */}
            <div 
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-medium text-emerald-300"
              title={`GPS ${geoData.statusRastreamento.toUpperCase()} • Precisão: ${geoData.precisao}m • ${geoData.endereco}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                {user?.role === 'tecnico' ? 'GPS Campo' : 'GPS Ativo'}
              </span>
              {geoData.velocidade > 0 && (
                <span className="text-[10px] font-mono bg-emerald-500/20 px-1 rounded">
                  {geoData.velocidade}km/h
                </span>
              )}
            </div>

            {/* Controle de Pausas & Presença NR-17 */}
            <OperatorStatusControl />

            {/* Notificações Push & PWA do Operador */}
            <OperatorPwaControls />

            {/* Monitor de Sincronização SGP & GenieACS em Tempo Real */}
            <SyncStatusMonitor variant="topbar" className="hidden lg:flex" />

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
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center rounded-lg transition-all duration-200 group text-sm font-medium ${
          isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
        } ${
          isActive 
            ? 'bg-blue-600/10 text-white font-bold' 
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Indicador ativo na lateral esquerda */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-blue-500 rounded-r-full" />
          )}

          {/* Ícone */}
          <div className={`${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'} transition-colors shrink-0`}>
            {icon}
          </div>

          {/* Label de texto (esconde no modo recolhido) */}
          {!isCollapsed && (
            <span className="truncate flex-1">{label}</span>
          )}

          {/* Badge quando expandido */}
          {!isCollapsed && badge && (
            <span className="ml-auto bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
              {badge}
            </span>
          )}

          {/* Tooltip Flutuante elegante quando recolhido (Modo Desktop) */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#101726] border border-white/10 text-white text-[11px] font-bold uppercase tracking-wider rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap  z-50 pointer-events-none flex items-center gap-2">
              <span>{label}</span>
              {badge && (
                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[9px] px-1.5 py-0.5 rounded font-bold">
                  {badge}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
  
  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right" className="w-full">
        {content}
      </Tooltip>
    );
  }
  
  return content;
}
