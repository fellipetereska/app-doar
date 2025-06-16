import { React, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import logo from "../media/logo.png";
import {
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import SettingsModal from "../pages/HomeDoador/components/SettingsModal/SettingsModal";

function Navbar() {
  const navigate = useNavigate();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { isAuthenticated, user, signout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("userCoordinates");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("loginRedirectState"); 
    localStorage.clear();
    signout();
    navigate("/login", { replace: true });
  };
  const openSettingsModal = () => {
    setIsMenuOpen(false);
    setSettingsModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-6 py-2 z-[1000] transition-all duration-300 backdrop-blur-sm">
        <div
          className="flex items-center p-2 cursor-pointer group bg-white rounded-lg shadow-sm"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-20 object-contain" />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm"
                onClick={() => navigate("/login")}
              >
                Entrar
              </button>
            </div>
          )}

          {isAuthenticated && user && (
            <div className="relative flex items-center">
              <div
                className={`flex items-center gap-2 cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-gray-100/50 ${
                  isMenuOpen ? "bg-gray-100/80" : "bg-white"
                } transition-colors duration-200`}
                onClick={toggleMenu}
              >
                <div className="flex items-center justify-center text-primary">
                  {isMenuOpen
                    ? ""
                    : <FaUserCircle className="text-2xl" /> || "Usuário"}
                </div>
                <div className="hidden md:flex flex-col items-start min-w-[120px]">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary truncate max-w-[160px]">
                    {isMenuOpen ? "Detalhes" : user.nome || "Usuário"}
                  </span>
                </div>
                {isMenuOpen ? (
                  <FaChevronUp className="text-gray-500 text-sm" />
                ) : (
                  <FaChevronDown className="text-gray-500 text-sm" />
                )}
              </div>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden animate-fadeIn">
                  <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                    <FaUserCircle className="text-3xl text-primary" />
                    <div className="truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.nome || "Usuário"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>
                  <ul className="py-1 text-sm text-gray-700">
                    <li
                      className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 cursor-pointer"
                      onClick={openSettingsModal}
                    >
                      <FaCog className="text-gray-400 text-base" />
                      Configurações
                    </li>

                    <li
                      className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 cursor-pointer text-red-500"
                      onClick={logout}
                    >
                      <FaSignOutAlt className="text-base" />
                      Sair
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {(isMenuOpen || settingsModalOpen) && (
        <div
          className="fixed inset-0 z-[999] bg-black/10 backdrop-blur-sm"
          onClick={() => {
            if (isMenuOpen) setIsMenuOpen(false);
          }}
        />
      )}

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userId={user?.id}
      />
    </>
  );
}

export default Navbar;
