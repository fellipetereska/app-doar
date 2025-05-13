// ModalContext.js
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null); // Estado para armazenar a empresa selecionada

  const openCompanyModal = (company) => {
    setSelectedCompany(company); // Atualiza a empresa selecionada
    setIsCompanyModalOpen(true); // Abre o modal
  };

  const closeCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setSelectedCompany(null); // Reseta a empresa selecionada ao fechar o modal
  };
  const openDonationModal = () => {
    setIsDonationModalOpen(true);
    closeCompanyModal();
  };

  const closeDonationModal = () => setIsDonationModalOpen(false);

  const openAddItemModal = () => setIsAddItemModalOpen(true);
  const closeAddItemModal = () => setIsAddItemModalOpen(false);

  const openAddressModal = () => setIsAddressModalOpen(true);
  const closeAddressModal = () => setIsAddressModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isCompanyModalOpen,
        openCompanyModal,
        closeCompanyModal,
        isDonationModalOpen,
        openDonationModal,
        closeDonationModal,
        isAddItemModalOpen,
        openAddItemModal,
        closeAddItemModal,
        isAddressModalOpen,
        openAddressModal,
        closeAddressModal,
        selectedCompany, // Disponibiliza a empresa selecionada no contexto
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
