import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from './contexts/auth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { Loading } from './components/Loading';

const Home = lazy(() => import('./pages/home/home'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (

    <AuthProvider>
      <Router>

        {/* Carregamento Asincrono das paginas */}
        <div className='flex flex-col min-h-screen'>

          <Suspense fallback={<Loading />}>

            {/* Menu */}
            <Navbar />

            {/* Rotas */}
            <div className='flex-grow'>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Home />} />
              </Routes>
            </div>

            {/* Rodapé */}
            <Footer />
          </Suspense>
        </div>
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
