import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Inbox from "./pages/Inbox";
import Kanban from "./pages/Kanban";
import SuperAdmin from "./pages/SuperAdmin";
import Helpers from "./pages/Helpers";
import CRM from "./pages/CRM";
import Analytics from "./pages/Analytics";
import Operadores from "./pages/Operadores";
import Campanhas from "./pages/Campanhas";
import Automacoes from "./pages/Automacoes";
import GenieACSDashboard from "./pages/GenieACSDashboard";
import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/PortalDashboard";
import PortalFaturas from "./pages/PortalFaturas";
import PortalSuporte from "./pages/PortalSuporte";
import PortalConta from "./pages/PortalConta";
import PortalLogin from "./pages/PortalLogin";
import ConsultaSGP from "./pages/ConsultaSGP";
import MapaRede from "./pages/MapaRede";
import UsuariosHierarquia from "./pages/UsuariosHierarquia";
import TecnicoCampo from "./pages/TecnicoCampo";
import Auditoria from "./pages/Auditoria";
import SetupWizard from "./pages/SetupWizard";

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupWizard />} />
            <Route path="/login" element={<Login />} />

            {/* Operador / Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Layout />}>
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "operador",
                        "tecnico_noc",
                        "tecnico_campo",
                      ]}
                    />
                  }
                >
                  <Route index element={<Inbox />} />
                </Route>

                <Route
                  path="dashboard"
                  element={<ProtectedRoute allowedRoles={["tecnico_noc"]} />}
                >
                  <Route index element={<Analytics />} />
                </Route>

                <Route
                  path="suporte"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "operador",
                        "tecnico_noc",
                        "tecnico_campo",
                      ]}
                    />
                  }
                >
                  <Route index element={<Kanban type="Suporte" />} />
                </Route>

                <Route
                  path="cobranca"
                  element={<ProtectedRoute allowedRoles={["operador"]} />}
                >
                  <Route index element={<Kanban type="Cobranca" />} />
                </Route>

                <Route
                  path="vendas"
                  element={<ProtectedRoute allowedRoles={["operador"]} />}
                >
                  <Route index element={<Kanban type="Vendas" />} />
                </Route>

                <Route
                  path="crm"
                  element={
                    <ProtectedRoute
                      allowedRoles={["operador", "tecnico_noc"]}
                    />
                  }
                >
                  <Route index element={<CRM />} />
                </Route>

                <Route
                  path="sgp"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "operador",
                        "tecnico_noc",
                        "tecnico_campo",
                      ]}
                    />
                  }
                >
                  <Route index element={<ConsultaSGP />} />
                </Route>

                <Route
                  path="genieacs"
                  element={<ProtectedRoute allowedRoles={["tecnico_noc"]} />}
                >
                  <Route index element={<GenieACSDashboard />} />
                </Route>
                <Route
                  path="mapa-rede"
                  element={<ProtectedRoute allowedRoles={["tecnico_noc", "tecnico_campo"]} />}
                >
                  <Route index element={<MapaRede />} />
                </Route>

                <Route
                  path="campanhas"
                  element={<ProtectedRoute allowedRoles={["operador"]} />}
                >
                  <Route index element={<Campanhas />} />
                </Route>

                <Route
                  path="operadores"
                  element={<ProtectedRoute allowedRoles={[]} />}
                >
                  <Route index element={<Operadores />} />
                </Route>

                <Route
                  path="usuarios"
                  element={<ProtectedRoute allowedRoles={[]} />}
                >
                  <Route index element={<UsuariosHierarquia />} />
                </Route>

                <Route
                  path="campo"
                  element={<ProtectedRoute allowedRoles={["tecnico_campo"]} />}
                >
                  <Route index element={<TecnicoCampo />} />
                </Route>

                <Route
                  path="automacoes"
                  element={<ProtectedRoute allowedRoles={[]} />}
                >
                  <Route index element={<Automacoes />} />
                </Route>

                <Route
                  path="auditoria"
                  element={<ProtectedRoute allowedRoles={[]} />}
                >
                  <Route index element={<Auditoria />} />
                </Route>

                <Route
                  path="configuracoes"
                  element={<ProtectedRoute allowedRoles={[]} />}
                >
                  <Route index element={<SuperAdmin />} />
                </Route>

                <Route path="ajuda" element={<Helpers />} />
              </Route>
            </Route>

            {/* Cliente PWA Routes */}
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="faturas" element={<PortalFaturas />} />
              <Route path="suporte" element={<PortalSuporte />} />
              <Route path="conta" element={<PortalConta />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  );
}
