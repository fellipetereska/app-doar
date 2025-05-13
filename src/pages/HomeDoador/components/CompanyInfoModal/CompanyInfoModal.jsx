import React from 'react';
import Modal from 'react-modal';
import { FiX, FiCheck, FiMapPin, FiPhone, FiClock, FiGift } from 'react-icons/fi';
import  {useModal}  from '../hooks/useModal';

const CompanyInfoModal = () => {
  const { selectedCompany, isCompanyModalOpen, closeCompanyModal, openDonationModal } = useModal(); // Agora estamos pegando a empresa do useModal
  return (
    <Modal
      isOpen={isCompanyModalOpen}
      onRequestClose={closeCompanyModal}
      contentLabel="Informações da Instituição"
      className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      {selectedCompany && (
        <div className="space-y-4">
          <button
            onClick={closeCompanyModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>

          <div className="flex items-start space-x-4">
            <img
              src={selectedCompany.image}
              alt={selectedCompany.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCompany.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedCompany.description}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold text-blue-800 flex items-center">
              <FiGift className="mr-2" /> Itens que esta instituição aceita:
            </h3>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedCompany.donationInfo.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <FiClock className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">
                  Horário para doação
                </h4>
                <p className="text-gray-600">
                  {selectedCompany.donationInfo.hours}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiMapPin className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Local</h4>
                <p className="text-gray-600">
                  {selectedCompany.donationInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiPhone className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Contato</h4>
                <p className="text-gray-600">
                  {selectedCompany.contact.email}
                  <br />
                  {selectedCompany.contact.phone}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openDonationModal}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition flex items-center justify-center"
          >
            Realizar Doação
          </button>
        </div>
      )}
    </Modal>
  );
};

export default CompanyInfoModal;