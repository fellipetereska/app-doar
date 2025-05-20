import React from 'react';
import useAuth from '../hooks/useAuth';
import { useLocation } from "react-router-dom";

// Componentes
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { user } = useAuth();
  const isInstituicao = user?.role === 'instituicao';

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {isInstituicao && !isLoginPage && (
          <div className="relative flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoginPage && !isInstituicao && <Navbar />}
          <main className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </div>

      {!isLoginPage && !isInstituicao && <Footer />}
    </div>
  );
}
