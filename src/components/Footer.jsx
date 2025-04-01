import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <footer className=" text-gray-600 border-t border-gray-200 text-center p-3 sticky left-0 w-full mt-6">
      <p>&copy; {new Date().getFullYear()} Doar. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
