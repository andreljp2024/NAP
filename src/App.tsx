/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Inbox from './pages/Inbox';
import Kanban from './pages/Kanban';
import SuperAdmin from './pages/SuperAdmin';
import CRM from './pages/CRM';
import Analytics from './pages/Analytics';
import Operadores from './pages/Operadores';
import Campanhas from './pages/Campanhas';
import Automacoes from './pages/Automacoes';

import PortalLayout from './components/PortalLayout';
import PortalDashboard from './pages/PortalDashboard';
import PortalFaturas from './pages/PortalFaturas';
import PortalSuporte from './pages/PortalSuporte';
import PortalConta from './pages/PortalConta';
import ConsultaSGP from './pages/ConsultaSGP';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Operador / Admin Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inbox />} />
          <Route path="dashboard" element={<Analytics />} />
          <Route path="suporte" element={<Kanban type="Suporte" />} />
          <Route path="vendas" element={<Kanban type="Vendas" />} />
          <Route path="crm" element={<CRM />} />
          <Route path="sgp" element={<ConsultaSGP />} />
          <Route path="campanhas" element={<Campanhas />} />
          <Route path="operadores" element={<Operadores />} />
          <Route path="automacoes" element={<Automacoes />} />
          <Route path="configuracoes" element={<SuperAdmin />} />
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
  );
}
