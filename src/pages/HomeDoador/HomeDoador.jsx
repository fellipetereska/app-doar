import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useDonation from "./hooks/useDonation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import LocationModal from "./components/LocationModal/LocationModal";
import CompanyModal from "./components/CompanyModal/CompanyModal";
import DonationModal from "./components/DonationModal/DonationModal";
import DonationConfirmation from "./components/DonationConfirmation/DonationConfirmation";
import { createCustomIcon, getIconSize } from "./utils/mapUtils";
import companies from "./constants/companies";
import CenterMap from "./components/MapControls/CenterMap";
import MapEvents from "./components/MapControls/MapEvents";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const HomeDoador = () => {
  const { isAuthenticated, user } = useAuth();

  const {
    userLocation,
    showCepModal,
    cep,
    loadingLocation,
    mapCenter,
    zoomLevel,
    modalIsOpen,
    donationModalIsOpen,
    selectedCompany,
    showConfirmation,
    setCep,
    setZoomLevel,
    fetchLocationByCEP,
    getUserCurrentLocation,
    closeModal,
    openDonationModal,
    closeDonationModal,
    resetDonationFlow,
    setShowConfirmation,
    setModalIsOpen,
    setSelectedCompany,
  } = useDonation();


  if (isAuthenticated && user?.role === "instituicao") {
    return <Navigate to="/instituicao" replace />;
  }

  return (
    <div className="relative w-full h-screen">
      <LocationModal
        isOpen={showCepModal && !userLocation}
        cep={cep}
        setCep={setCep}
        loadingLocation={loadingLocation}
        fetchLocationByCEP={fetchLocationByCEP}
        getUserCurrentLocation={getUserCurrentLocation}
      />

      {loadingLocation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-700">
              {cep
                ? "Buscando instituições na região..."
                : "Obtendo sua localização..."}
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapEvents onZoom={(zoom) => setZoomLevel(zoom)} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CenterMap center={mapCenter} zoom={zoomLevel} animate={true} />
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
            eventHandlers={{
              add: (e) => {
                e.target.openPopup();
              },
            }}
          >
            <Popup>Sua localização</Popup>
          </Marker>
        )}
        {companies.map((company) => (
          <Marker
            key={company.id}
            position={[company.lat, company.lng]}
            icon={createCustomIcon(company.image, getIconSize(zoomLevel))}
            eventHandlers={{
              click: () => {
                setSelectedCompany(company);
                setModalIsOpen(true);
              },
            }}
          />
        ))}
      </MapContainer>

      <CompanyModal
        isOpen={modalIsOpen}
        onClose={() => {
          closeModal();
          resetDonationFlow();
        }}
        company={selectedCompany}
        onDonate={() => {
          closeModal();
          setTimeout(() => openDonationModal(), 100);
        }}
        className="z-[1002]"
      />

      <DonationModal
        isOpen={donationModalIsOpen}
        onClose={() => {
          closeDonationModal();
          resetDonationFlow();
        }}
        company={selectedCompany}
        userLocation={userLocation}
        className="z-[1002]"
      />

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

      {showConfirmation && (
        <DonationConfirmation
          companyName={selectedCompany?.name}
          onClose={() => {
            setShowConfirmation(false);
            resetDonationFlow();
          }}
        />
      )}
    </div>
  );
};

export default HomeDoador;
