import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Loading } from "./components/Loading";
import PrivateRoute from "./components/PrivateRoute";

// Páginas
const Login = lazy(() => import("./pages/Login"));

// Páginas Doador
const HomeDoador = lazy(() => import("./pages/HomeDoador/HomeDoador"));

// Páginas Instituição
const HomeInstituicao = lazy(() => import("./pages/HomeInstituicao.jsx"));
const Estoque = lazy(() => import("./pages/Estoque"));
const Assistidos = lazy(() => import("./pages/Assistidos"));
const ListaEspera = lazy(() => import("./pages/ListaEspera"));
const TelaDoacao = lazy(() => import("./pages/TelaDoacao"));
const ConfiguracoesInstituicao = lazy(() =>
  import("./pages/ConfiguracoesInstituicao")
);

function AppRoutes() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<Loading />}>
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <HomeDoador
                    modalIsOpen={modalIsOpen}
                    setModalIsOpen={setModalIsOpen}
                    selectedCompany={selectedCompany}
                    setSelectedCompany={setSelectedCompany}
                  />
                }
              />
              {/* Rotas Instituição */}
              <Route
                path="/instituicao"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <HomeInstituicao />
                  </PrivateRoute>
                }
              />
              <Route
                path="/instituicao/estoque"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <Estoque />
                  </PrivateRoute>
                }
              />
              <Route
                path="/instituicao/doacoes"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <TelaDoacao />
                  </PrivateRoute>
                }
              />
              <Route
                path="/instituicao/assistidos"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <Assistidos />
                  </PrivateRoute>
                }
              />
              <Route
                path="/instituicao/lista-espera"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <ListaEspera />
                  </PrivateRoute>
                }
              />
              <Route
                path="/instituicao/configuracoes"
                element={
                  <PrivateRoute requiredPermission={"instituicao"}>
                    <ConfiguracoesInstituicao />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Suspense>
      </div>
    </Layout>
  );
}

export default AppRoutes;
