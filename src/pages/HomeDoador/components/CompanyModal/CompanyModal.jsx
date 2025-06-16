import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { connect } from "../../../../services/api";
import { FiX, FiGift, FiMapPin, FiPhone, FiCheck } from "react-icons/fi";

const CompanyModal = ({
  isOpen,
  onClose,
  company,
  onDonate,
  isAuthenticated,
  onLoginRedirect,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (company) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${connect}/categoria?id=${company.id}`);
          if (!response.ok) {
            throw new Error("Erro ao buscar categorias");
          }
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Erro ao buscar categorias:", error);
        }
      };

      fetchCategories();
    }
  }, [company]);

  if (!company) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Informações da Instituição"
  className="outline-none mx-auto w-full max-w-md md:max-w-xl" 
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000] backdrop-blur-sm transition-opacity duration-200"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto mx-auto border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100 z-10"
          aria-label="Fechar modal"
        >
          <FiX size={24} />
        </button>

        <div className="space-y-6 p-6">
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -mr-16 -mt-16"></div>

            <div className="relative flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-shrink-0 relative group w-24 h-24">
                <div className="absolute inset-0 bg-blue-200 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                <img
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-xl shadow-md border-2 border-white ring-2 ring-blue-100 transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/96?text=Logo";
                    e.target.className =
                      "w-full h-full object-contain rounded-xl shadow-md border-2 border-white ring-2 ring-blue-100";
                  }}
                />
              </div>

              <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-gray-800 truncate">
                  {company.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                  {company.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 flex items-center text-lg">
              <FiGift className="mr-2 text-blue-700" /> Itens que esta
              instituição aceita:
            </h3>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.flatMap((category) => (
                <li
                  key={`${category.id}`}
                  className="flex items-start bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100"
                >
                  <FiCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 font-medium truncate">
                    {category.nome}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                <FiMapPin className="text-blue-700" size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-800">Local</h4>
                <p className="text-gray-600 mt-1 truncate">
                  {company.donationInfo.address}
                </p>
                {company.donationInfo.mapLink && (
                  <a
                    href={company.donationInfo.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-800 text-sm mt-1 transition"
                  >
                    Ver no mapa
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start bg-gray-50 p-3 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                <FiPhone className="text-blue-700" size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-800">Contato</h4>
                <p className="text-gray-600 mt-1">
                  {company.contact.phone && (
                    <a
                      href={`tel:${company.contact.phone.replace(/\D/g, "")}`}
                      className="hover:text-blue-600 transition break-all"
                    >
                      {company.contact.phone}
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {isAuthenticated ? (
              <button
                onClick={onDonate}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center shadow-md hover:shadow-lg"
              >
                Realizar Doação
              </button>
            ) : (
              <div className="flex flex-row gap-3 w-full">
                <button
                  onClick={onLoginRedirect}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                >
                  Fazer Login
                </button>

                <div className="flex-1 relative">
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium flex items-center justify-center cursor-not-allowed"
                  >
                    Realizar Doação
                  </button>
                  <div className="absolute -top-8 left-0 w-full text-center">
                    <span className="bg-white text-red-500 text-xs font-medium px-2 py-1 rounded border border-red-200 shadow-sm">
                      Você precisa estar logado para doar
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyModal;
