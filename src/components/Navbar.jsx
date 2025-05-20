import {React, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import logo from '../media/logo.png';
import { SearchInput } from './Inputs/searchInput';
import { FaUserCircle, FaQuestionCircle } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const { isAuthenticated, user, signout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  const logout = () => {
  localStorage.clear(); 
    signout();
    navigate("/"); 
  }
  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 py-3 z-[1001]">
        {/* Logo (oculta no mobile) */}
        <div className="hidden md:flex h-[42px] items-center bg-white shadow-md rounded-md px-4">
          <img src={logo} alt="Logo" className="w-16" />
        </div>

        {/* Search */}
        <div className="flex-grow h-[42px] flex items-center mx-2 bg-white shadow-md rounded-md px-4">
          <SearchInput placeholder="Buscar Instituição..." />
        </div>

        {/* User */}
        <div className="relative flex items-center h-[42px] bg-white shadow-md rounded-md px-4 ml-2 gap-2">
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="cursor-pointer hover:text-primary">
                <FaQuestionCircle className="text-xl" />
              </div>
              <div className="cursor-pointer hover:text-primary" onClick={() => navigate("/login")}>
                <FaUserCircle className="text-xl" />
              </div>
            </div>
          )}
          {isAuthenticated && user && (
            <div
              className="flex items-center gap-2 cursor-pointer text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              <FaUserCircle className="text-lg" />
              <span className="hidden md:inline text-sm font-semibold select-none">
                {user.nome || ''}
              </span>
            </div>
          )}

          {/* Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-md z-50">
              {/* Flechinha */}
              <div className="absolute -top-1 right-6 w-2 h-2 bg-white rotate-45 select-none"></div>

              <ul className="flex flex-col p-2 text-sm text-gray-700 select-none">
                <li className="p-2 hover:bg-gray-100 rounded-sm cursor-pointer">Perfil</li>
                <li className="p-2 hover:bg-gray-100 rounded-sm cursor-pointer">Configurações</li>
                <li className="p-2 hover:bg-gray-100 rounded-sm cursor-pointer" onClick={logout}>Sair</li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
