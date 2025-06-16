import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useDonation from "./hooks/useDonation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { connect } from "../../services/api";
import { connectPhoto } from "../../services/api";

import LocationModal from "./components/LocationModal/LocationModal";
import CompanyModal from "./components/CompanyModal/CompanyModal";
import DonationModal from "./components/DonationModal/DonationModal";
import DonationConfirmation from "./components/DonationModal/DonationConfirmation/DonationConfirmation";
import { createCustomIcon, getIconSize } from "./utils/mapUtils";
import MapController from "./components/MapControls/MapController";
import MapEvents from "./components/MapControls/MapEvents";
import placeholderImage from "../../media/logo.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const HomeDoador = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.institutionModalOpen) {
      setSelectedCompany(location.state.selectedInstitution);
      setModalIsOpen(true);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const {
    userLocation,
    showCepModal,
    cep,
    loadingLocation,
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
  const [institutions, setInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [hasInitialZoomed, setHasInitialZoomed] = useState(false);

  useEffect(() => {
    if (userLocation) {
      setHasInitialZoomed(false); 
    }
  }, [userLocation]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`${connect}/instituicao`);
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Erro ao buscar instituições:", error);
        toast.error("Erro ao carregar instituições");
      } finally {
        setLoadingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, []);

  if (isAuthenticated && user?.role === "instituicao") {
    return <Navigate to="/instituicao" replace />;
  }

  const handleLoginRedirect = () => {
    localStorage.setItem(
      "loginRedirectState",
      JSON.stringify({
        institutionModalOpen: true,
        selectedInstitution: selectedCompany,
      })
    );

    navigate("/login", {
      state: {
        from: location,
        restoreState: {
          institutionModalOpen: true,
          selectedInstitution: selectedCompany,
        },
      },
    });
  };

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
        center={[-14.235, -51.9253]}
        zoom={4}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents onZoom={(zoom) => setZoomLevel(zoom)} />

        <MapController center={userLocation} zoom={zoomLevel} />

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
        {!loadingInstitutions &&
          institutions.map((institution) => {
            const imageUrl = institution.logo_path
              ? `${connectPhoto}/uploads/${institution.logo_path}`
              : placeholderImage;

            return (
              <Marker
                key={institution.id}
                position={[institution.latitude, institution.longitude]}
                icon={createCustomIcon(imageUrl, getIconSize(zoomLevel))}
                eventHandlers={{
                  click: () => {
                    setSelectedCompany({
                      id: institution.id,
                      name: institution.nome,
                      lat: institution.latitude,
                      lng: institution.longitude,
                      image: imageUrl,
                      description: institution.descricao,
                      donationInfo: {
                        address: `${institution.logradouro} ${institution.endereco}, ${institution.numero} - ${institution.bairro}, ${institution.cidade} - ${institution.uf}`,
                        items:
                          institution.categorias?.flatMap(
                            (cat) => cat.subcategorias
                          ) || [],
                      },
                      contact: {
                        phone: institution.telefone,
                      },
                    });
                    setModalIsOpen(true);
                  },
                }}
              />
            );
          })}
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
        isAuthenticated={isAuthenticated}
        onLoginRedirect={handleLoginRedirect}
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
        userId={user?.id}
        className="z-[1002]"
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
