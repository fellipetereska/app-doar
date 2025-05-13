import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useAddress = () => {
  const [address, setAddress] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
  });
  const [addressError, setAddressError] = useState("");
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressName, setAddressName] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const fetchCEP = async (cep) => {
    try {
      setLoadingCEP(true);
      const cleanedCEP = cep.replace(/\D/g, "");
      if (cleanedCEP.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setAddressError("CEP não encontrado");
      } else {
        setAddress({
          ...address,
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
        });
        setAddressError("");
      }
    } catch (error) {
      setAddressError("Erro ao buscar CEP");
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoadingCEP(false);
    }
  };

  const saveAddress = () => {
    if (!addressName || !address.cep || !address.logradouro || !address.numero || !address.bairro || !address.localidade || !address.uf) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newAddress = {
      id: editingAddressId || Date.now(),
      name: addressName,
      ...address
    };

    if (editingAddressId) {
      setSavedAddresses(savedAddresses.map(addr => 
        addr.id === editingAddressId ? newAddress : addr
      ));
      toast.success("Endereço atualizado com sucesso!");
    } else {
      setSavedAddresses([...savedAddresses, newAddress]);
      toast.success("Endereço salvo com sucesso!");
    }
  };

  const editAddress = (addressToEdit) => {
    setAddressName(addressToEdit.name);
    setAddress({
      cep: addressToEdit.cep,
      logradouro: addressToEdit.logradouro,
      numero: addressToEdit.numero,
      complemento: addressToEdit.complemento || "",
      bairro: addressToEdit.bairro,
      localidade: addressToEdit.localidade,
      uf: addressToEdit.uf,
    });
    setEditingAddressId(addressToEdit.id);
  };

  const deleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== id));
    toast.success("Endereço removido com sucesso!");
  };

  const selectAddress = (selectedAddress) => {
    setAddress({
      cep: selectedAddress.cep,
      logradouro: selectedAddress.logradouro,
      numero: selectedAddress.numero,
      complemento: selectedAddress.complemento || "",
      bairro: selectedAddress.bairro,
      localidade: selectedAddress.localidade,
      uf: selectedAddress.uf,
    });
  };

  const resetAddressForm = () => {
    setAddressName("");
    setEditingAddressId(null);
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

  return {
    address,
    setAddress,
    addressError,
    loadingCEP,
    savedAddresses,
    addressName,
    setAddressName,
    editingAddressId,
    fetchCEP,
    saveAddress,
    editAddress,
    deleteAddress,
    selectAddress,
    resetAddressForm,
  };
};

export default useAddress;