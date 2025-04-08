import React from 'react';
import { useLocation } from 'react-router-dom';

// Utils
import logo from '../media/logo.png';
import { SearchInput } from './Inputs/searchInput';

// Icons
import { FaQuestionCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

// Utilizar no sistema do doador
const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full grid grid-cols-12 gap-4 items-center py-4 px-16 z-[1001]  backdrop-blur-sm">
      <div className="col-span-2 flex items-center justify-center shadow-md rounded-md p-4 mx-4 cursor-pointer bg-white">
        <img src={logo} className="w-16" alt="logo" />
      </div>
      <div className="col-span-8 flex items-center shadow-md rounded-md py-3 px-6 mx-16 bg-white ">
        <SearchInput placeholder={"Buscar Instituição..."} />
      </div>
      <div className="col-span-2 shadow-md rounded-md p-3 mx-4 flex justify-center items-center gap-2 bg-white">
        <div className="text-gray-800 hover:text-primary cursor-pointer">
          <FaQuestionCircle />
        </div>
        <div className="text-gray-800 hover:text-primary cursor-pointer">
          <FaUserCircle />
        </div>
        <p className="text-sm text-gray-800 font-semibold select-none">
          Fellipe Tereska
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
