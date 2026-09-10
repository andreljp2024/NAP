import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Inbox from './pages/Inbox';
import Kanban from './pages/Kanban';
import SuperAdmin from './pages/SuperAdmin';
import Helpers from './pages/Helpers';
import CRM from './pages/CRM';
import Analytics from './pages/Analytics';
import Operadores from './pages/Operadores';
import Campanhas from './pages/Campanhas';
import Automacoes from './pages/Automacoes';
import GenieACSDashboard from './pages/GenieACSDashboard';
import PortalLayout from './components/PortalLayout';
import PortalDashboard from './pages/PortalDashboard';
import PortalFaturas from './pages/PortalFaturas';
import PortalSuporte from './pages/PortalSuporte';
import PortalConta from './pages/PortalConta';
import ConsultaSGP from './pages/ConsultaSGP';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Operador / Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<Inbox />} />
              <Route path="dashboard" element={<Analytics />} />
              <Route path="suporte" element={<Kanban type="Suporte" />} />
              <Route path="cobranca" element={<Kanban type="Cobranca" />} />
              <Route path="vendas" element={<Kanban type="Vendas" />} />
              <Route path="crm" element={<CRM />} />
              <Route path="sgp" element={<ConsultaSGP />} />
              <Route path="genieacs" element={<GenieACSDashboard />} />
              <Route path="campanhas" element={<Campanhas />} />
              <Route path="operadores" element={<Operadores />} />
              <Route path="automacoes" element={<Automacoes />} />
              <Route path="configuracoes" element={<SuperAdmin />} />
              <Route path="ajuda" element={<Helpers />} />
            </Route>
          </Route>

          {/* Cliente PWA Routes */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalDashboard />} />
            <Route path="faturas" element={<PortalFaturas />} />
            <Route path="suporte" element={<PortalSuporte />} />
            <Route path="conta" element={<PortalConta />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}