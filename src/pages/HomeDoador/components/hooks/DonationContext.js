import React, { createContext, useContext, useState } from 'react';

const DonationContext = createContext();

export const DonationProvider = ({ children }) => {
  const [donationItems, setDonationItems] = useState([]);
  
  // Função para adicionar item com verificação
  const addDonationItem = (newItem) => {
    setDonationItems(prevItems => {
      console.log('Adicionando item:', newItem);
      console.log('Estado anterior:', prevItems);
      return [...prevItems, newItem];
    });
  };

  const removeItem = (id) => {
    setDonationItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <DonationContext.Provider value={{
      donationItems,
      addDonationItem,
      removeItem
    }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within DonationProvider');
  }
  return context;
};