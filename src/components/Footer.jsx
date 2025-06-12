import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-sm z-[999]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-primary font-semibold text-base">Doar</span>
            <span className="text-gray-400">|</span>
            <span>&copy; {new Date().getFullYear()} Todos os direitos reservados</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
