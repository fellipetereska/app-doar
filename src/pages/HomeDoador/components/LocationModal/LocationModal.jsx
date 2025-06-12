import React from "react";
import Modal from "react-modal";
import { FiMapPin, FiSearch } from "react-icons/fi";

const LocationModal = ({
  isOpen,
  cep,
  setCep,
  loadingLocation,
  fetchLocationByCEP,
  getUserCurrentLocation,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {}}
      contentLabel="Definir localização"
      className="bg-white p-6 rounded-lg max-w-md w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Antes de começar
        </h2>
        <p className="text-gray-600">
          Para encontrar instituições próximas a você, informe seu CEP ou
          permita que usemos sua localização atual.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Digite seu CEP
            </label>
            <div className="flex">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={fetchLocationByCEP}
                disabled={loadingLocation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center justify-center disabled:opacity-50"
              >
                {loadingLocation ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <FiSearch size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={getUserCurrentLocation}
            disabled={loadingLocation}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition flex items-center justify-center disabled:opacity-50"
          >
            {loadingLocation ? (
              "Obtendo localização..."
            ) : (
              <>
                <FiMapPin className="mr-2" />
                Usar minha localização atual
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;