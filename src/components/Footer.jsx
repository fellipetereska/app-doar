import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md z-[999] border-t border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between">

          <div className="flex items-center mb-2 md:mb-0">
            <span className="text-primary font-bold text-lg mr-1">Doar</span>
            <span className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Todos os direitos reservados
            </span>
          </div>
          

          <div className="flex space-x-4">
            <a href="/termos" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Termos de uso
            </a>
            <a href="/privacidade" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Política de privacidade
            </a>
            <a href="/contato" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Contato
            </a>
          </div>
        </div>
        
        <div className="md:hidden text-center mt-2">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Doar - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;