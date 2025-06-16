import React from "react";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Chatbot from "../pages/HomeDoador/components/Chatbot/Chatbot";

export default function Layout({
  children,
  modalIsOpen,
  setModalIsOpen,
  selectedCompany,
  setSelectedCompany,
}) {
  const { user } = useAuth();
  const isInstituicao = user?.role === "instituicao";
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {isInstituicao && !isLoginPage && <Sidebar />}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {!isLoginPage && !isInstituicao && (
            <Navbar
              setModalIsOpen={setModalIsOpen}
              setSelectedCompany={setSelectedCompany}
            />
          )}
          <main className="flex-1 overflow-auto custom-scrollbar relative z-0">
            {React.cloneElement(children, {
              modalIsOpen,
              setModalIsOpen,
              selectedCompany,
              setSelectedCompany,
            })}
          </main>
        </div>
      </div>

      {!isLoginPage && !isInstituicao && <Chatbot />}
      {!isLoginPage && !isInstituicao && <Footer />}
    </div>
  );
}
