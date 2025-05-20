import React from "react";
import { FiCheck } from "react-icons/fi";
import animationData from "./goodwill-donation.gif"; 

const DonationConfirmation = ({ companyName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1005]">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-48 h-48 relative">
            <img 
              src={animationData} 
              alt="Animação de doação confirmada" 
              className="w-full h-full object-contain"
            />
        
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Doação Confirmada!</h3>
        <p className="text-gray-600 mb-6">
          Sua doação para <span className="font-semibold">{companyName}</span> foi registrada com sucesso. Muito obrigado por sua generosidade!
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition flex items-center"
          >
            <FiCheck className="mr-2" /> Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationConfirmation;