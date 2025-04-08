import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import placeholderImage from "../../media/images.png";
import Modal from "react-modal";
import { FiX, FiCheck, FiChevronDown, FiChevronUp, FiMapPin, FiPhone, FiClock, FiGift } from "react-icons/fi";

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
    description: "Empresa comprometida com causas sociais e ambientais, aceitando doações de alimentos, roupas e materiais escolares.",
    donationInfo: {
      hours: "Segunda a Sexta, das 9h às 17h",
      address: "Rua Principal, 123 - Centro",
      items: [
        "Alimentos não perecíveis",
        "Roupas em bom estado",
        "Materiais escolares",
        "Produtos de higiene"
      ]
    },
    contact: {
      email: "contato@empresasolidaria.com",
      phone: "(43) 1234-5678"
    },
    categories: ["Alimentos", "Roupas e Calçados", "Produtos de Higiene e Limpeza"]
  },
  {
    id: 2,
    name: "ONG Ajuda Brasil",
    lat: -23.3027,
    lng: -51.1832,
    image: placeholderImage,
    description: "Organização não governamental que atende comunidades carentes com programas de educação e alimentação.",
    donationInfo: {
      hours: "Terça a Sábado, das 8h às 18h",
      address: "Av. das Flores, 456 - Jardim das Nações",
      items: [
        "Alimentos",
        "Livros",
        "Brinquedos",
        "Produtos de higiene",
        "Material escolar"
      ]
    },
    contact: {
      email: "contato@ajudabrasil.org",
      phone: "(43) 9876-5432"
    },
    categories: ["Alimentos", "Livros e Materiais Educacionais", "Brinquedos", "Produtos de Higiene e Limpeza"]
  },
];

const donationCategories = {
  "Alimentos": {
    subcategories: ["Cestas básicas"]
  },
  "Roupas e Calçados": {
    subcategories: ["Roupas Infantis", "Roupas Adultas", "Calçados"]
  },
  "Móveis e Eletrodomésticos": {
    subcategories: ["Sofás", "Mesas", "Cadeiras", "Geladeiras", "Fogões"]
  },
  "Livros e Materiais Educacionais": {
    subcategories: ["Livros", "Material Escolar", "Jogos Educativos"]
  },
  "Brinquedos": {
    subcategories: ["Bonecas", "Carrinhos", "Jogos de tabuleiro", "Pelúcias"]
  },
  "Produtos de Higiene e Limpeza": {
    subcategories: ["Sabonetes", "Shampoos", "Fraldas", "Absorventes", "Produtos de Limpeza"]
  }
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
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [donationItems, setDonationItems] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);

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

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
  };

  const handleAddItem = () => {
    if (!selectedCategory || !itemName || !itemQuantity) return;
    
    const newItem = {
      id: Date.now(),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      name: itemName,
      description: itemDescription,
      quantity: itemQuantity,
      condition: itemCondition
    };
    
    setDonationItems([...donationItems, newItem]);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setItemName("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
  };

  const removeItem = (id) => {
    setDonationItems(donationItems.filter(item => item.id !== id));
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
                <h2 className="text-2xl font-bold text-gray-800">{selectedCompany.name}</h2>
                <p className="text-gray-600 mt-1">{selectedCompany.description}</p>
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
                  <h4 className="font-medium text-gray-700">Horário para doação</h4>
                  <p className="text-gray-600">{selectedCompany.donationInfo.hours}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiMapPin className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-700">Local</h4>
                  <p className="text-gray-600">{selectedCompany.donationInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiPhone className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-700">Contato</h4>
                  <p className="text-gray-600">
                    {selectedCompany.contact.email}<br />
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
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(1)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                1. Adicionar itens para doação
              </h3>
              {activeAccordion === 1 ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {activeAccordion === 1 && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria*
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {Object.keys(donationCategories).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategoria
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={!selectedCategory}
                    >
                      <option value="">Selecione uma subcategoria</option>
                      {selectedCategory && 
                        donationCategories[selectedCategory].subcategories.map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Item*
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Arroz, Camiseta, Livro de Matemática"
                    required
                  />
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
                
                <button
                  onClick={handleAddItem}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
                  disabled={!selectedCategory || !itemName}
                >
                  Adicionar Item
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(2)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                2. Itens para doação ({donationItems.length})
              </h3>
              {activeAccordion === 2 ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {activeAccordion === 2 && (
              <div className="mt-4">
                {donationItems.length === 0 ? (
                  <p className="text-gray-500 italic">Nenhum item adicionado ainda</p>
                ) : (
                  <div className="space-y-3">
                    {donationItems.map((item) => (
                      <div key={item.id} className="border rounded-md p-3 flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.category}{item.subcategory && ` • ${item.subcategory}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantidade: {item.quantity} • Estado: {{
                              'novo': 'Novo',
                              'usado-bom': 'Usado (Bom estado)',
                              'usado-regular': 'Usado (Estado regular)'
                            }[item.condition]}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAccordion(3)}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                3. Opções de envio
              </h3>
              {activeAccordion === 3 ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {activeAccordion === 3 && (
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="redirectIfRefused"
                    checked={redirectIfRefused}
                    onChange={(e) => setRedirectIfRefused(e.target.checked)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="redirectIfRefused" className="text-gray-700">
                    Caso a instituição recuse algum item, redirecionar automaticamente para outra instituição
                  </label>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Método de entrega</h4>
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
                        Solicitar coleta pela instituição (sujeito a disponibilidade)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Resumo da Doação</h3>
              <div className="text-gray-700">
                Total de itens: <span className="font-bold">{donationItems.length}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmitDonation}
              className={`w-full py-3 px-4 rounded-md font-medium transition flex items-center justify-center ${
                donationItems.length > 0
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={donationItems.length === 0}
            >
              Confirmar Doação
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;