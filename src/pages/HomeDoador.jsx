import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import placeholderImage from "../media/images.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import {
  FiX,
  FiCheck,
  FiMapPin,
  FiPhone,
  FiClock,
  FiGift,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const createCustomIcon = (iconUrl) => {
  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "company-marker",
  });
};

const companies = [
  {
    id: 1,
    name: "Empresa Solidária",
    lat: -23.2927,
    lng: -51.1732,
    image: placeholderImage,
    description:
      "Empresa comprometida com causas sociais e ambientais, aceitando doações de alimentos, roupas e materiais escolares.",
    donationInfo: {
      hours: "Segunda a Sexta, das 9h às 17h",
      address: "Rua Principal, 123 - Centro",
      items: [
        "Alimentos não perecíveis",
        "Roupas em bom estado",
        "Materiais escolares",
        "Produtos de higiene",
      ],
    },
    contact: {
      email: "contato@empresasolidaria.com",
      phone: "(43) 1234-5678",
    },
    categories: [
      "Alimentos",
      "Roupas e Calçados",
      "Produtos de Higiene e Limpeza",
    ],
  },
  {
    id: 2,
    name: "ONG Ajuda Brasil",
    lat: -23.3027,
    lng: -51.1832,
    image: placeholderImage,
    description:
      "Organização não governamental que atende comunidades carentes com programas de educação e alimentação.",
    donationInfo: {
      hours: "Terça a Sábado, das 8h às 18h",
      address: "Av. das Flores, 456 - Jardim das Nações",
      items: [
        "Alimentos",
        "Livros",
        "Brinquedos",
        "Produtos de higiene",
        "Material escolar",
      ],
    },
    contact: {
      email: "contato@ajudabrasil.org",
      phone: "(43) 9876-5432",
    },
    categories: [
      "Alimentos",
      "Livros e Materiais Educacionais",
      "Brinquedos",
      "Produtos de Higiene e Limpeza",
    ],
  },
];

const donationCategories = {
  Alimentos: {
    subcategories: ["Cestas básicas"],
  },
  "Roupas e Calçados": {
    subcategories: ["Roupas Infantis", "Roupas Adultas", "Calçados"],
  },
  "Móveis e Eletrodomésticos": {
    subcategories: ["Sofás", "Mesas", "Cadeiras", "Geladeiras", "Fogões"],
  },
  "Livros e Materiais Educacionais": {
    subcategories: ["Livros", "Material Escolar", "Jogos Educativos"],
  },
  Brinquedos: {
    subcategories: ["Bonecas", "Carrinhos", "Jogos de tabuleiro", "Pelúcias"],
  },
  "Produtos de Higiene e Limpeza": {
    subcategories: [
      "Sabonetes",
      "Shampoos",
      "Fraldas",
      "Absorventes",
      "Produtos de Limpeza",
    ],
  },
};

const Home = () => {

  const { isAuthenticated, user } = useAuth();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);
  const [addItemModalIsOpen, setAddItemModalIsOpen] = useState(false);
  const [addressModalIsOpen, setAddressModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCondition, setItemCondition] = useState("novo");
  const [itemImages, setItemImages] = useState([]);
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [donationItems, setDonationItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({
    category: false,
    subcategory: false,
    itemImages: false,
  });
  const [deliveryMethod, setDeliveryMethod] = useState("take");
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
  const [observations, setObservations] = useState("");
  const [phone, setPhone] = useState("");
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

  const openModal = (company) => {
    setSelectedCompany(company);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openDonationModal = () => {
    setDonationModalIsOpen(true);
    closeModal();
  };

  const closeDonationModal = () => {
    setDonationModalIsOpen(false);
    resetDonationFlow();
  };

  const openAddItemModal = () => {
    setAddItemModalIsOpen(true);
  };

  const closeAddItemModal = () => {
    setAddItemModalIsOpen(false);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
    setItemImages([]);
    setFormErrors({
      category: false,
      subcategory: false,
      itemImages: false,
    });
  };

  const openAddressModal = () => {
    setAddressModalIsOpen(true);
  };

  const closeAddressModal = () => {
    setAddressModalIsOpen(false);
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

  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep === 2 && deliveryMethod === "collect") {
      if (
        !address.cep ||
        !address.logradouro ||
        !address.numero ||
        !address.bairro ||
        !address.localidade ||
        !address.uf ||
        !observations ||
        !phone
      ) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetDonationFlow = () => {
    setCurrentStep(1);
    setDonationItems([]);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
    setItemImages([]);
    setRedirectIfRefused(true);
    setDeliveryMethod("take");
    setAddress({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
    });
    setObservations("");
    setPhone("");
  };

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const remainingSlots = 6 - itemImages.length;
    if (files.length > remainingSlots) {
      toast.warning(`Você só pode adicionar mais ${remainingSlots} imagem(ns)`);
      return;
    }

    const validImages = [];
    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Imagem ${file.name} excede o tamanho máximo de 2MB`);
        return;
      }

      validImages.push(file);
    });

    setItemImages([...itemImages, ...validImages]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setItemImages(itemImages.filter((_, i) => i !== index));
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

    closeAddressModal();
  };

  const editAddress = (address) => {
    setAddressName(address.name);
    setAddress({
      cep: address.cep,
      logradouro: address.logradouro,
      numero: address.numero,
      complemento: address.complemento || "",
      bairro: address.bairro,
      localidade: address.localidade,
      uf: address.uf,
    });
    setEditingAddressId(address.id);
    openAddressModal();
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Itens para doação
              </h3>
              <button
                onClick={openAddItemModal}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
              >
                <FiPlus className="mr-2" /> Adicionar Item
              </button>
            </div>

            {donationItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">
                  Você ainda não adicionou nenhum item
                </p>
                <button
                  onClick={openAddItemModal}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clique para adicionar seu primeiro item
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {donationItems.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-md p-3 flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.category}
                        {item.subcategory && ` • ${item.subcategory}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity} • Estado:{" "}
                        {
                          {
                            novo: "Novo",
                            "usado-bom": "Usado (Bom estado)",
                            "usado-regular": "Usado (Estado regular)",
                          }[item.condition]
                        }
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {donationItems.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  Próximo <FiArrowRight className="ml-2" />
                </button>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Opções de entrega
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="redirectIfRefused"
                  checked={redirectIfRefused}
                  onChange={(e) => setRedirectIfRefused(e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label htmlFor="redirectIfRefused" className="text-gray-700">
                  Caso a instituição recuse algum item, redirecionar
                  automaticamente para outra instituição
                </label>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Método de entrega
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="deliveryMethod1"
                      name="deliveryMethod"
                      className="mr-2"
                      checked={deliveryMethod === "take"}
                      onChange={() => setDeliveryMethod("take")}
                    />
                    <label htmlFor="deliveryMethod1" className="text-gray-700">
                      Eu mesmo levarei os itens até a instituição
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="deliveryMethod2"
                      name="deliveryMethod"
                      className="mr-2"
                      checked={deliveryMethod === "collect"}
                      onChange={() => setDeliveryMethod("collect")}
                    />
                    <label htmlFor="deliveryMethod2" className="text-gray-700">
                      Solicitar coleta pela instituição (sujeito a
                      disponibilidade)
                    </label>
                  </div>
                </div>
              </div>

              {deliveryMethod === "collect" && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Endereço para coleta
                  </h4>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone para contato*
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(XX) XXXX-XXXX"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={openAddressModal}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <FiPlus className="mr-1" /> Adicionar novo endereço
                    </button>

                    {savedAddresses.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">Ou selecione um endereço salvo:</p>
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`border rounded-md p-3 cursor-pointer ${address.cep === addr.cep ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                            onClick={() => selectAddress(addr)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{addr.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {addr.logradouro}, {addr.numero}{addr.complemento && `, ${addr.complemento}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {addr.bairro}, {addr.localidade} - {addr.uf}
                                </p>
                                <p className="text-sm text-gray-600">CEP: {addr.cep}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editAddress(addr);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAddress(addr.id);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>


                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações (Datas e horários disponíveis para coleta)*
                    </label>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="3"
                      placeholder="Ex: Disponível de segunda a sexta, entre 9h e 17h"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={prevStep}
                className="flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              >
                <FiArrowLeft className="mr-2" /> Voltar
              </button>
              <button
                onClick={nextStep}
                className="flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
              >
                Próximo <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirmação
            </h3>

            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h4 className="font-medium text-green-800 mb-2">
                Resumo da sua doação
              </h4>
              <p className="text-gray-700">
                Você está doando{" "}
                <span className="font-bold">{donationItems.length} itens</span>{" "}
                para <span className="font-bold">{selectedCompany?.name}</span>.
              </p>

              <div className="mt-4">
                <h5 className="font-medium text-gray-700 mb-1">
                  Método de entrega:
                </h5>
                <p className="text-gray-600">
                  {deliveryMethod === "take"
                    ? "Eu mesmo levarei os itens até a instituição"
                    : "Solicitar coleta pela instituição"}
                </p>
              </div>

              {deliveryMethod === "collect" && (
                <div className="mt-2">
                  <h5 className="font-medium text-gray-700 mb-1">
                    Telefone para contato:
                  </h5>
                  <p className="text-gray-600">{phone}</p>
                </div>
              )}

              {redirectIfRefused && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Observação:</span> Se algum
                    item for recusado, buscaremos automaticamente outra
                    instituição que possa recebê-lo.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              {deliveryMethod === "take" ? (
                <>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Horário para doação:
                  </h4>
                  <p className="text-gray-600">
                    {selectedCompany?.donationInfo.hours}
                  </p>
                  <h4 className="font-medium text-gray-700 mt-4 mb-2">
                    Endereço:
                  </h4>
                  <p className="text-gray-600">
                    {selectedCompany?.donationInfo.address}
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Endereço para coleta:
                  </h4>
                  <p className="text-gray-600">
                    {address.logradouro}, {address.numero}
                    {address.complemento && `, ${address.complemento}`}
                    <br />
                    {address.bairro}, {address.localidade} - {address.uf}
                    <br />
                    CEP: {address.cep}
                  </p>
                  <h4 className="font-medium text-gray-700 mt-4 mb-2">
                    Observações:
                  </h4>
                  <p className="text-gray-600">{observations}</p>
                </>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={prevStep}
                className="flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              >
                <FiArrowLeft className="mr-2" /> Voltar
              </button>
              <button
                onClick={handleSubmitDonation}
                disabled={donationItems.length === 0}
                className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition ${donationItems.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                Confirmar Doação
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleAddItem = () => {
    const errors = {
      category: !selectedCategory,
      subcategory: !selectedSubcategory,
      itemDescription: !itemDescription.trim(),
      itemImages: itemImages.length === 0,
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      if (errors.category) toast.error("Selecione uma categoria para o item");
      if (errors.subcategory)
        toast.error("Selecione uma subcategoria para o item");
      if (errors.itemDescription) toast.error("Informe a descrição do item");
      if (errors.itemImages)
        toast.error("Adicione pelo menos uma foto do item");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: `${selectedSubcategory} (${selectedCategory})`,
      description: itemDescription.trim(),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      quantity: itemQuantity,
      condition: itemCondition,
      images: [...itemImages],
    };

    setDonationItems([...donationItems, newItem]);
    closeAddItemModal();
    toast.success("Item adicionado com sucesso!");
  };

  const removeItem = (id) => {
    setDonationItems(donationItems.filter((item) => item.id !== id));
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
    alert(`Doação para ${selectedCompany.name} realizada com sucesso!`);
    closeDonationModal();
  };

  return (
    <>
      {isAuthenticated && user?.role === 'instituicao' ? (
        <Navigate to="/instituicao" replace />
      ) : (
        <div className="relative w-full h-screen">
          <MapContainer
            center={[-23.3101, -51.1628]}
            zoom={13}
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {companies.map((company) => (
              <Marker
                key={company.id}
                position={[company.lat, company.lng]}
                icon={createCustomIcon(company.image)}
                eventHandlers={{ click: () => openModal(company) }}
              />
            ))}
          </MapContainer>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Informações da Instituição"
            className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
            appElement={document.getElementById("root")}
            closeTimeoutMS={200}
          >
            {selectedCompany && (
              <div className="space-y-4">
                <button
                  onClick={closeModal}
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

          <Modal
            isOpen={donationModalIsOpen}
            onRequestClose={closeDonationModal}
            contentLabel="Realizar Doação"
            className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
            appElement={document.getElementById("root")}
            closeTimeoutMS={200}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Doação para {selectedCompany?.name}
                </h2>
                <button
                  onClick={closeDonationModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FiX size={24} />
                </button>
              </div>


              <div className="flex items-center justify-center mb-6">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                  <React.Fragment key={step}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                        } font-medium`}
                    >
                      {step}
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`w-16 h-1 ${currentStep > step ? "bg-green-600" : "bg-gray-200"
                          }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {renderStep()}
            </div>
          </Modal>

          <Modal
            isOpen={addItemModalIsOpen}
            onRequestClose={closeAddItemModal}
            contentLabel="Adicionar Item"
            className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
            appElement={document.getElementById("root")}
            closeTimeoutMS={200}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Adicionar Item</h2>
                <button
                  onClick={closeAddItemModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria*
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setFormErrors({ ...formErrors, category: false });
                    }}
                    className={`w-full p-2 border ${formErrors.category ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {Object.keys(donationCategories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoria*
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setFormErrors({ ...formErrors, subcategory: false });
                    }}
                    className={`w-full p-2 border ${formErrors.subcategory ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    disabled={!selectedCategory}
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {selectedCategory &&
                      donationCategories[selectedCategory].subcategories.map(
                        (subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        )
                      )}
                  </select>
                  {formErrors.subcategory && (
                    <p className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição*
                </label>
                <textarea
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className={`w-full p-2 border ${formErrors.itemDescription
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  rows="2"
                  placeholder="Forneça detalhes sobre o item"
                />
                {formErrors.itemDescription && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo é obrigatório
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado do Item*
                  </label>
                  <select
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="novo">Novo</option>
                    <option value="usado-bom">Usado (Bom estado)</option>
                    <option value="usado-regular">Usado (Estado regular)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotos do Item* (Máximo 6)
                </label>

                <div className="flex flex-wrap gap-3 mb-4">
                  {itemImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Prévia ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow hover:opacity-90 transition-opacity"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remover imagem"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {itemImages.length < 6 && (
                    <label
                      htmlFor="itemImages"
                      className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">
                        {itemImages.length}/6
                      </span>
                    </label>
                  )}
                </div>

                <input
                  id="itemImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={itemImages.length >= 6}
                />

                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB por imagem.
                  {itemImages.length > 0 &&
                    ` (${itemImages.length} imagem(ns) adicionada(s)`}
                </p>
                {formErrors.itemImages && (
                  <p className="text-red-500 text-xs mt-1">
                    Adicione pelo menos uma foto
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={closeAddItemModal}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
                >
                  Adicionar Item
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={addressModalIsOpen}
            onRequestClose={closeAddressModal}
            contentLabel="Gerenciar Endereços"
            className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
            appElement={document.getElementById("root")}
            closeTimeoutMS={200}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingAddressId ? "Editar Endereço" : "Adicionar Endereço"}
                </h2>
                <button
                  onClick={closeAddressModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Endereço*
                </label>
                <input
                  type="text"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  placeholder="Ex: Casa, Trabalho, etc."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP*
                  </label>
                  <input
                    type="text"
                    value={address.cep}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAddress({ ...address, cep: value });
                      if (value.replace(/\D/g, "").length === 8) {
                        fetchCEP(value);
                      }
                    }}
                    placeholder="00000-000"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {loadingCEP && (
                    <p className="text-xs text-gray-500">Buscando CEP...</p>
                  )}
                  {addressError && (
                    <p className="text-xs text-red-500">{addressError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro*
                  </label>
                  <input
                    type="text"
                    value={address.logradouro}
                    onChange={(e) =>
                      setAddress({ ...address, logradouro: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número*
                  </label>
                  <input
                    type="text"
                    value={address.numero}
                    onChange={(e) =>
                      setAddress({ ...address, numero: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={address.complemento}
                    onChange={(e) =>
                      setAddress({ ...address, complemento: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro*
                  </label>
                  <input
                    type="text"
                    value={address.bairro}
                    onChange={(e) =>
                      setAddress({ ...address, bairro: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade*
                  </label>
                  <input
                    type="text"
                    value={address.localidade}
                    onChange={(e) =>
                      setAddress({ ...address, localidade: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado*
                  </label>
                  <input
                    type="text"
                    value={address.uf}
                    onChange={(e) =>
                      setAddress({ ...address, uf: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={closeAddressModal}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveAddress}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition"
                >
                  {editingAddressId ? "Atualizar Endereço" : "Salvar Endereço"}
                </button>
              </div>
            </div>
          </Modal>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      )}
    </>
  );
}

export default Home;