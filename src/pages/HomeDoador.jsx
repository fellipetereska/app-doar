import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCondition, setItemCondition] = useState("novo");
  const [itemImages, setItemImages] = useState([]);
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [donationItems, setDonationItems] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({
    category: false,
    subcategory: false,
    itemName: false,
    itemImages: false,
  });

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
  };

  const totalSteps = 4;

  const nextStep = () => {
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
    setItemName("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
    setItemImages(null);
    setRedirectIfRefused(true);
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

  const ProgressBar = () => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Adicionar itens para doação
            </h3>

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
                  className={`w-full p-2 border ${
                    formErrors.category ? "border-red-500" : "border-gray-300"
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
                  className={`w-full p-2 border ${
                    formErrors.subcategory
                      ? "border-red-500"
                      : "border-gray-300"
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
                Nome do Item*
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  setFormErrors({ ...formErrors, itemName: false });
                }}
                className={`w-full p-2 border ${
                  formErrors.itemName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Ex: Ventilador, Camiseta, Livro de Matemática"
              />
              {formErrors.itemName && (
                <p className="text-red-500 text-xs mt-1">
                  Este campo é obrigatório
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="2"
                placeholder="Forneça detalhes sobre o item"
              />
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
                  onChange={(e) =>
                    setItemQuantity(parseInt(e.target.value) || 1)
                  }
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

            <button
              onClick={handleAddItem}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
            >
              Adicionar Item
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Revise seus itens ({donationItems.length})
            </h3>

            {donationItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Você ainda não adicionou nenhum item
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Voltar para adicionar itens
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
          </div>
        );
      case 3:
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
                      defaultChecked
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
                    />
                    <label htmlFor="deliveryMethod2" className="text-gray-700">
                      Solicitar coleta pela instituição (sujeito a
                      disponibilidade)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
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
                  Eu mesmo levarei os itens até a instituição
                </p>
              </div>

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
              <h4 className="font-medium text-gray-700 mb-2">
                Horário para doação:
              </h4>
              <p className="text-gray-600">
                {selectedCompany?.donationInfo.hours}
              </p>

              <h4 className="font-medium text-gray-700 mt-4 mb-2">Endereço:</h4>
              <p className="text-gray-600">
                {selectedCompany?.donationInfo.address}
              </p>
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
      itemName: !itemName.trim(),
      itemImages: itemImages.length === 0,
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      if (errors.category) toast.error("Selecione uma categoria para o item");
      if (errors.subcategory)
        toast.error("Selecione uma subcategoria para o item");
      if (errors.itemName) toast.error("Informe o nome do item");
      if (errors.itemImages)
        toast.error("Adicione pelo menos uma foto do item");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      description: itemDescription.trim(),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      quantity: itemQuantity,
      condition: itemCondition,
      images: [...itemImages],
    };

    setDonationItems([...donationItems, newItem]);

    setSelectedCategory("");
    setSelectedSubcategory("");
    setItemName("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
    setItemImages([]);
    setFormErrors({
      category: false,
      subcategory: false,
      itemName: false,
      itemImages: false,
    });

    toast.success("Item adicionado com sucesso!");
  };

  const removeItem = (id) => {
    setDonationItems(donationItems.filter((item) => item.id !== id));
  };

  const handleSubmitDonation = () => {
    alert(`Doação para ${selectedCompany.name} realizada com sucesso!`);
    setDonationItems([]);
    closeDonationModal();
  };

  return (
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
        onRequestClose={() => {
          resetDonationFlow();
          closeDonationModal();
        }}
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
              onClick={() => {
                resetDonationFlow();
                closeDonationModal();
              }}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FiX size={24} />
            </button>
          </div>

          <ProgressBar />

          <div className="flex items-center justify-center mb-6">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } font-medium`}
                >
                  {step}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep > step ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {renderStep()}

          <div className="flex justify-between pt-4 border-t">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              >
                <FiArrowLeft className="mr-2" /> Voltar
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 2 && donationItems.length === 0}
                className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition ${
                  currentStep === 2 && donationItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Próximo <FiArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmitDonation}
                disabled={donationItems.length === 0}
                className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition ${
                  donationItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Confirmar Doação
              </button>
            )}
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
  );
};

export default Home;
