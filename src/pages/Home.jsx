import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import placeholderImage from "../media/images.png";
import Modal from "react-modal";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const createCustomIcon = (iconUrl) => {
  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [40, 40],
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
    donationInfo:
      "Horário para doação: Segunda a Sexta, das 9h às 17h\nLocal: Rua Principal, 123 - Centro\nItens aceitos: Alimentos não perecíveis, roupas em bom estado, materiais escolares",
    contact: "contato@empresasolidaria.com | (43) 1234-5678",
  },
  {
    id: 2,
    name: "ONG Ajuda Brasil",
    lat: -23.3027,
    lng: -51.1832,
    image: placeholderImage,
    description:
      "Organização não governamental que atende comunidades carentes com programas de educação e alimentação.",
    donationInfo:
      "Horário para doação: Terça a Sábado, das 8h às 18h\nLocal: Av. das Flores, 456 - Jardim das Nações\nItens aceitos: Alimentos, livros, brinquedos, produtos de higiene",
    contact: "contato@ajudabrasil.org | (43) 9876-5432",
  },
];

const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const openModal = (company) => {
    setSelectedCompany(company);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <main className="w-screen h-screen">
      <MapContainer
        center={[-23.3101, -51.1628]}
        zoom={13}
        className="w-full h-full"
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
        contentLabel="Informações para Doação"
        className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1001]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      >
        {selectedCompany && (
          <div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl text-gray-600"
            >
              &times;
            </button>
            <img
              src={selectedCompany.image}
              alt={selectedCompany.name}
              className="w-full max-h-80 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
            <p className="text-gray-700 mt-2">{selectedCompany.description}</p>
            <h3 className="mt-4 text-lg font-semibold">
              Informações para Doação
            </h3>
            <p className="whitespace-pre-line text-gray-600">
              {selectedCompany.donationInfo}
            </p>
            <h3 className="mt-4 text-lg font-semibold">Contato</h3>
            <p className="text-gray-600">{selectedCompany.contact}</p>
            <button
              onClick={() =>
                alert(`Obrigado por querer doar para ${selectedCompany.name}!`)
              }
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
            >
              Realizar Doação
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default Home;
