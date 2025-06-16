import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useDonation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [showCepModal, setShowCepModal] = useState(true);
  const [cep, setCep] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState([-14.235, -51.9253]);
  const [zoomLevel, setZoomLevel] = useState(4); 

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [donationModalIsOpen, setDonationModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [hasLocation, setHasLocation] = useState(false);

   const fetchLocationByCEP = async () => {
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      toast.error("Digite um CEP válido (8 dígitos)");
      return;
    }

    setLoadingLocation(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      const fullAddress = `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''}, ${data.uf || ''}, Brasil`;

      const geoResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          fullAddress
        )}&key=1d529152a15843afa18decb6c408d34c`
      );
      const geoData = await geoResponse.json();

      if (geoData.results.length === 0) {
        toast.error("Coordenadas não encontradas para o endereço");
        return;
      }

      const { lat, lng } = geoData.results[0].geometry;
      const newCenter = [lat, lng];

      localStorage.setItem("userLocation", JSON.stringify(newCenter));

      setMapCenter(newCenter);
      setZoomLevel(13);
      setUserLocation(newCenter);
      setShowCepModal(false);
      setHasLocation(true); // Adicione esta linha
    } catch (error) {
      toast.error("Erro ao buscar localização");
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo navegador");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];

        localStorage.setItem("userLocation", JSON.stringify(location));

        setMapCenter(location);
        setUserLocation(location);
        setZoomLevel(15);
        setShowCepModal(false);
        setLoadingLocation(false);
        setHasLocation(true); 
      },
      (error) => {
        toast.error(
          "Não foi possível obter sua localização. Por favor, informe seu CEP."
        );
        console.error("Erro de geolocalização:", error);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const openModal = (company) => {
    setSelectedCompany(company);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openDonationModal = () => {
    setDonationModalIsOpen(true);
  };

  const closeDonationModal = () => {
    setDonationModalIsOpen(false);
  };

  const resetDonationFlow = () => {
    setDonationModalIsOpen(false);
    setShowConfirmation(false);
  };

    useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        if (Array.isArray(location) && location.length === 2) {
          setUserLocation(location);
          setMapCenter(location);
          setZoomLevel(15); 
          setHasLocation(true);
        }
      } catch (error) {
        console.error("Erro ao carregar localização salva:", error);
        localStorage.removeItem("userLocation");
      }
    }
  }, []);

  return {
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
    hasLocation, 
    setCep,
    setMapCenter,
    setZoomLevel,
    setUserLocation,
    setShowCepModal,
    setModalIsOpen,
    setSelectedCompany,
    setDonationModalIsOpen,
    setShowConfirmation,

    fetchLocationByCEP,
    getUserCurrentLocation,
    openModal: (company) => {
      setSelectedCompany(company);
      setModalIsOpen(true);
    },
    closeModal: () => setModalIsOpen(false),
    openDonationModal: () => setDonationModalIsOpen(true),
    closeDonationModal: () => setDonationModalIsOpen(false),
    resetDonationFlow: () => {
      setDonationModalIsOpen(false);
      setShowConfirmation(false);
    },
  };
};

export default useDonation;
