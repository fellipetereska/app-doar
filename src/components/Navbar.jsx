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
    <>
      <nav className='w-full grid grid-cols-12 gap-4 items-center py-4 px-16 z-50'>
        <div className='col-span-2 bg-white h-full flex items-center justify-center shadow-md rounded-md p-4 mx-4 cursor-pointer'>
          <img src={logo} className='w-16' alt="logo" />
        </div>
        <div className='col-span-8 bg-white h-full flex items-center shadow-md rounded-md py-3 px-6 mx-16'>
          <SearchInput
            placeholder={'Buscar Instituição...'}
          />
        </div>
        <div className='col-span-2 bg-white h-full shadow-md rounded-md p-3 mx-4 flex justify-center items-center gap-2'>
          <div className='text-gray-400 hover:text-primary cursor-pointer'>
            <FaQuestionCircle />
          </div>
          <div className='text-gray-400 hover:text-primary cursor-pointer'>
            <FaUserCircle />
          </div>
          <p className='text-sm text-primary font-semibold select-none'>
            Fellipe Tereska
          </p>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
