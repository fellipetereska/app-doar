import { useState } from "react";

const useDonationForm = () => {
  const [formData, setFormData] = useState({
    items: [],
    deliveryMethod: "take",
    address: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: ""
    },
    phone: "",
    observations: "",
    redirectIfRefused: true
  });

  const addItem = (item) => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const removeItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAddress = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return {
    formData,
    addItem,
    removeItem,
    updateField,
    updateAddress
  };
};

export default useDonationForm;