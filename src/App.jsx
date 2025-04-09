import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Layout from './components/Layout';

import { AuthProvider } from './contexts/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { Loading } from './components/Loading';
const Home = lazy(() => import('./pages/home/home'));
import { Loading } from './components/Loading';

// Paginas

const Login = lazy(() => import('./pages/Login'));
const HomeDoador = lazy(() => import('./pages/HomeDoador'));
const HomeInstituicao = lazy(() => import('./pages/HomeInstituicao'));
const Estoque = lazy(() => import('./pages/Estoque'));
const Assistidos = lazy(() => import('./pages/Assistidos'));
const ListaEspera = lazy(() => import('./pages/ListaEspera'));

function App() {
  return (

    <AuthProvider>
      <Router>

        <Layout>
          {/* Carregamento Asincrono das paginas */}
          <div className='flex flex-col min-h-screen'>

            <Suspense fallback={<Loading />}>

              {/* Rotas */}
              <div className='flex-grow'>
                <Routes>
                  <Route path="/login" element={<Login />} />

                  {/* Doador */}
                  <Route path="/" element={<HomeDoador />} />
                  {/* Instituição */}
                  <Route path="/instituicao/" element={<HomeInstituicao />} />
                  <Route path="/instituicao/estoque" element={<Estoque />} />
                  <Route path="/instituicao/assistidos/assistidos" element={<Assistidos />} />
                  <Route path="/instituicao/assistidos/lista_espera" element={<ListaEspera />} />
                </Routes>
              </div>

            </Suspense>
          </div>
        </Layout>

      </Router>

      {/* Mensagem */}
      <ToastContainer
        autoClose={3000}
        position="top-right"
      />
    </AuthProvider>
  );
}

export default App;
