import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { companies } from "../../constants";
import { useModal } from "../hooks/useModal";

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

const MapComponent = () => {
  const { openCompanyModal } = useModal(); // Acesso à função do contexto

  const handleMarkerClick = (company) => {
    openCompanyModal(company); // Passa a empresa para o contexto
  };

  return (
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
          eventHandlers={{
            click: () => handleMarkerClick(company), 
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
