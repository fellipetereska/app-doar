import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAddress from "./useAddress";
import { useDonation as useDonationContext } from './DonationContext';

const useDonation = () => {
  const [donationItems, setDonationItems] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("take");
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [observations, setObservations] = useState("");
  const [phone, setPhone] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const donationContext = useDonationContext();

  const {
    address,
    setAddress,
    addressName,
    setAddressName,
    savedAddresses,
    setSavedAddresses,
    editingAddressId,
    setEditingAddressId,
    loadingCEP,
    addressError,
    fetchCEP,
    saveAddress,
    editAddress,
    deleteAddress,
    selectAddress,
  } = useAddress();

  const addDonationItem = (item) => {
    setDonationItems((prevItems) => [...prevItems, item]);
    toast.success("Item adicionado com sucesso!");
  };

  const removeItem = (id) => {
    setDonationItems(donationItems.filter((item) => item.id !== id));
  };

  const resetDonationFlow = () => {
    setDonationItems([]);
    setCurrentStep(1);
    setDeliveryMethod("take");
    setRedirectIfRefused(true);
    setObservations("");
    setPhone("");
    setAddress({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
    });
  };

  const handleSubmitDonation = () => {
    const donationData = {
      company: selectedCompany,
      items: donationItems,
      deliveryMethod,
      redirectIfRefused,
      ...(deliveryMethod === "collect" && {
        address,
        observations,
        phone,
      }),
    };

    console.log("Dados da doação:", donationData);
    toast.success(`Doação para ${selectedCompany.name} realizada com sucesso!`);
    resetDonationFlow();
  };

  return {
    ...donationContext,
    ...address,
    donationItems,
    setDonationItems,
    selectedCompany,
    setSelectedCompany,
    deliveryMethod,
    setDeliveryMethod,
    redirectIfRefused,
    setRedirectIfRefused,
    observations,
    setObservations,
    phone,
    setPhone,
    currentStep,
    setCurrentStep,
    address,
    setAddress,
    addressName,
    setAddressName,
    savedAddresses,
    setSavedAddresses,
    editingAddressId,
    setEditingAddressId,
    loadingCEP,
    addressError,
    fetchCEP,
    saveAddress,
    editAddress,
    deleteAddress,
    selectAddress,
    addDonationItem,
    removeItem,
    resetDonationFlow,
    handleSubmitDonation,
  };
};

export default useDonation;
