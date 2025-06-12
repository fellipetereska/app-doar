import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Step1Items from "./DonationSteps/Step1Items";
import Step2Delivery from "./DonationSteps/Step2Delivery";
import Step3Confirmation from "./DonationSteps/Step3Confirmation";
import AddItemModal from "../AddItemModal/AddItemModal";
import AddressModal from "../AddressModal/AddressModal";
import DonationConfirmation from "../DonationConfirmation/DonationConfirmation";
import donationCategories from "../../constants/donationCategories";

const DonationModal = ({ isOpen, onClose, company, userLocation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [donationItems, setDonationItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCondition, setItemCondition] = useState("novo");
  const [itemImages, setItemImages] = useState([]);
  const [formErrors, setFormErrors] = useState({
    category: false,
    subcategory: false,
    itemDescription: false,
    itemImages: false,
  });
  const [addItemModalIsOpen, setAddItemModalIsOpen] = useState(false);
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
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressModalIsOpen, setAddressModalIsOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressError, setAddressError] = useState("");
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setDonationItems([]);
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
      setPhone("");
      setObservations("");
      setShowConfirmation(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const openAddressModal = () => {
    setAddressModalIsOpen(true);
    setEditingAddressId(null);
  };

  const selectAddress = (addr) => {
    setAddress(addr);
  };

  const editAddress = (addr) => {
    setAddress(addr);
    setEditingAddressId(addr.id);
    setAddressModalIsOpen(true);
  };

  const deleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter((addr) => addr.id !== id));
  };

  const fetchCEP = async (cep) => {
    setLoadingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setAddressError("CEP não encontrado");
        return;
      }

      setAddress({
        ...address,
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        localidade: data.localidade,
        uf: data.uf,
      });
      setAddressError("");
    } catch (error) {
      setAddressError("Erro ao buscar CEP");
      console.error(error);
    } finally {
      setLoadingCEP(false);
    }
  };

  const saveAddress = () => {
    if (
      !address.cep ||
      !address.logradouro ||
      !address.numero ||
      !address.bairro ||
      !address.localidade ||
      !address.uf
    ) {
      setAddressError("Preencha todos os campos obrigatórios");
      return;
    }

    const newAddress = { ...address, id: editingAddressId || Date.now() };

    if (editingAddressId) {
      setSavedAddresses(
        savedAddresses.map((addr) =>
          addr.id === editingAddressId ? newAddress : addr
        )
      );
    } else {
      setSavedAddresses([...savedAddresses, newAddress]);
    }

    setAddressModalIsOpen(false);
  };

  const isItemFormComplete = () => {
    return (
      selectedCategory &&
      selectedSubcategory &&
      itemDescription.trim() &&
      itemImages.length > 0
    );
  };

  const handleAddItem = () => {
    if (!isItemFormComplete()) {
      return; // Simplesmente não faz nada se o formulário não estiver completo
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
    setAddItemModalIsOpen(false);
    resetItemForm();
  };

  const resetItemForm = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setItemDescription("");
    setItemQuantity(1);
    setItemCondition("novo");
    setItemImages([]);
    setFormErrors({
      category: false,
      subcategory: false,
      itemDescription: false,
      itemImages: false,
    });
  };

  const removeItem = (id) => {
    setDonationItems(donationItems.filter((item) => item.id !== id));
  };

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

  const handleSubmitDonation = async () => {
    setIsSubmitting(true);

    const donationData = {
      company,
      items: donationItems,
      deliveryMethod,
      address: deliveryMethod === "collect" ? address : null,
      phone: deliveryMethod === "collect" ? phone : null,
      observations: deliveryMethod === "collect" ? observations : null,
      redirectIfRefused,
    };

    console.log("Dados da doação:", donationData);

    // Simula um tempo de processamento
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Fecha todos os modais antes de mostrar a confirmação
    setIsSubmitting(false);
    onClose(); // Fecha o modal principal de doação
    setShowConfirmation(true); // Mostra a confirmação
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetDonationFlow(); // Reseta todo o fluxo
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
    setPhone("");
    setObservations("");
    setShowConfirmation(false);
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Items
            donationItems={donationItems}
            openAddItemModal={() => setAddItemModalIsOpen(true)}
            removeItem={removeItem}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2Delivery
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            redirectIfRefused={redirectIfRefused}
            setRedirectIfRefused={setRedirectIfRefused}
            address={address}
            phone={phone}
            setPhone={setPhone}
            observations={observations}
            setObservations={setObservations}
            savedAddresses={savedAddresses}
            openAddressModal={openAddressModal}
            selectAddress={selectAddress}
            editAddress={editAddress}
            deleteAddress={deleteAddress}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <Step3Confirmation
            company={company}
            donationItems={donationItems}
            deliveryMethod={deliveryMethod}
            address={address}
            observations={observations}
            phone={phone}
            redirectIfRefused={redirectIfRefused}
            prevStep={prevStep}
            handleSubmitDonation={handleSubmitDonation}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Realizar Doação"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
        className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1000] outline-none"
        appElement={document.getElementById("root")}
        closeTimeoutMS={200}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Doação para {company?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FiX size={24} />
            </button>
          </div>

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
        </div>
      </Modal>

      <AddItemModal
        isOpen={addItemModalIsOpen}
        onClose={() => setAddItemModalIsOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        itemDescription={itemDescription}
        setItemDescription={setItemDescription}
        itemQuantity={itemQuantity}
        setItemQuantity={setItemQuantity}
        itemCondition={itemCondition}
        setItemCondition={setItemCondition}
        itemImages={itemImages}
        handleImageUpload={(e) => {
          const files = Array.from(e.target.files);
          if (files.length + itemImages.length > 6) {
            toast.error("Você pode adicionar no máximo 6 imagens");
            return;
          }
          setItemImages([...itemImages, ...files]);
        }}
        removeImage={(index) => {
          const newImages = [...itemImages];
          newImages.splice(index, 1);
          setItemImages(newImages);
        }}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        donationCategories={donationCategories}
        handleAddItem={handleAddItem}
        isFormComplete={isItemFormComplete()}
        overlayZIndex="z-[1001]"
        modalZIndex="z-[1001]"
      />

      <AddressModal
        isOpen={addressModalIsOpen}
        onClose={() => setAddressModalIsOpen(false)}
        addressName={address.name}
        setAddressName={(name) => setAddress((prev) => ({ ...prev, name }))}
        address={address}
        setAddress={setAddress}
        addressError={addressError}
        loadingCEP={loadingCEP}
        editingAddressId={editingAddressId}
        fetchCEP={fetchCEP}
        saveAddress={saveAddress}
        overlayZIndex="z-[1001]"
        modalZIndex="z-[1001]"
      />

      <DonationConfirmation
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        companyName={company?.name}
        overlayZIndex="z-[1002]"
        modalZIndex="z-[1002]"
      />
    </>
  );
};

export default DonationModal;
