import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "react-toastify";
import Step1Items from "./DonationSteps/Step1Items";
import Step2Delivery from "./DonationSteps/Step2Delivery";
import Step3Confirmation from "./DonationSteps/Step3Confirmation";
import AddItemModal from "../AddItemModal/AddItemModal";
import AddressModal from "../AddressModal/AddressModal";
import DonationConfirmation from "./DonationConfirmation/DonationConfirmation";
import { connect } from "../../../../services/api";

const DonationModal = ({ isOpen, onClose, company, userLocation, userId }) => {
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
    cidade: "",
    uf: "",
  });
  const [phone, setPhone] = useState("");
  const [observations, setObservations] = useState("");
  const [redirectIfRefused, setRedirectIfRefused] = useState(true);
  const [addressModalIsOpen, setAddressModalIsOpen] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 3;
  const [categorias, setCategorias] = useState([]);

  const fetchCategories = async () => {
    if (!company?.id) return;

    try {
      const response = await fetch(`${connect}/categoria?id=${company.id}`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      toast.error("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    if (isOpen && company?.id) {
      fetchCategories();
    }
  }, [isOpen, company?.id]);

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
        cidade: "",
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
  };

  const modalContentRef = React.useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const saveAddress = async (addressData) => {
    try {
      const url = `${connect}/endereco/usuario/${userId}`;
      const method = "PUT";

      const bodyData = {
        cep: addressData.cep?.replace(/\D/g, "") || "",
        logradouro: addressData.logradouro || "",
        endereco: addressData.endereco || "",
        numero: addressData.numero || "",
        complemento: addressData.complemento || "",
        bairro: addressData.bairro || "",
        cidade: addressData.cidade || "",
        uf: addressData.uf || "",
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao atualizar endereço");
      }

      toast.success("Endereço atualizado com sucesso!");

      setAddress((prev) => ({
        ...prev,
        ...bodyData,
      }));
      return bodyData;
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      toast.error(error.message || "Erro ao atualizar endereço");
      throw error;
    }
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
      toast.error(
        "Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma imagem."
      );
      setFormErrors({
        category: !selectedCategory,
        subcategory: !selectedSubcategory,
        itemDescription: !itemDescription.trim(),
        itemImages: itemImages.length === 0,
      });
      return;
    }

    const selectedCat = categorias.find(
      (cat) => cat.id.toString() === selectedCategory
    );
    const selectedSubcat = selectedCat?.subcategorias.find(
      (sub) => sub.id.toString() === selectedSubcategory
    );

    const newItem = {
      id: Date.now(),
      name: itemDescription.trim(),
      description: itemDescription.trim(),
      categoryId: selectedCategory,
      category: selectedCat?.nome || "",
      subcategoryId: selectedSubcategory,
      subcategory: selectedSubcat?.nome || "",
      quantity: itemQuantity,
      condition: itemCondition,
      images: [...itemImages],
    };

    setDonationItems([...donationItems, newItem]);
    setAddItemModalIsOpen(false);
    resetItemForm();
    toast.success("Item adicionado com sucesso!");
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
    toast.info("Item removido.");
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
    try {
      const userResponse = await fetch(`${connect}/usuario/${userId}`);
      if (!userResponse.ok) throw new Error("Erro ao buscar dados do usuário");

      const enderecoCompleto =
        deliveryMethod === "collect"
          ? [
              address.logradouro || "",
              address.endereco || "",
              address.numero ? `, ${address.numero}` : "",
              address.complemento ? `, ${address.complemento}` : "",
              ` - ${address.bairro}, ${address.cidade}-${address.uf}`,
            ]
              .filter(Boolean)
              .join(" ")
          : null;

      const formData = new FormData();
      formData.append("DoadorId", userId);
      formData.append("InstituicaoId", company.id);
      formData.append(
        "TipoEntrega",
        deliveryMethod === "take" ? "entrega" : "retirada"
      );

      if (deliveryMethod === "collect") {
        formData.append("Endereco", enderecoCompleto);
        formData.append("HorarioRetirada", observations);
      }
      donationItems.forEach((item, index) => {
        formData.append(`Itens[${index}].Nome`, item.name);
        formData.append(`Itens[${index}].Descricao`, item.description);
        formData.append(`Itens[${index}].Estado`, item.condition);
        formData.append(`Itens[${index}].Quantidade`, item.quantity);
        formData.append(`Itens[${index}].SubcategoriaId`, item.subcategoryId);

        item.images.forEach((image, imgIndex) => {
          formData.append(
            `Itens[${index}].ImagensItem`,
            image,
            `item_${index}_image_${imgIndex}.jpg`
          );
        });
      });

      const response = await fetch(`${connect}/doacao`, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          console.error("Erro ao parsear JSON:", e);
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Erro ao enviar doação");
      }

      console.log("Doação enviada com sucesso:", result);
      setIsSubmitting(false);
      setShowConfirmation(true);
      onClose();
    } catch (error) {
      console.error("Erro ao processar doação:", error);
      setIsSubmitting(false);
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
    setDeliveryMethod("take");
    setAddress({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
    });
    setPhone("");
    setObservations("");
    setShowConfirmation(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetDonationFlow();
    onClose();
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
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
            userId={userId}
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            redirectIfRefused={redirectIfRefused}
            setRedirectIfRefused={setRedirectIfRefused}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            observations={observations}
            setObservations={setObservations}
            openAddressModal={openAddressModal}
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
        onRequestClose={handleClose}
        contentLabel={`Doação para ${company?.name}`}
        className="outline-none  px-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] transition-opacity duration-300"
        style={{
          content: {
            position: "relative",
            inset: "auto",
            width: "90%",
            maxWidth: "600px",
            margin: "0 auto",
            transform: "none",
            left: "0",
            right: "0",
          },
        }}
        closeTimeoutMS={300}
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-xl w-full mx-4 my-8 max-w-2xl max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Doação para {company?.name}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Complete os passos para finalizar sua doação
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition text-white"
                aria-label="Fechar"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-center relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 transform -translate-y-1/2 z-0"></div>

                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i + 1} className="flex items-center z-10">
                    <div
                      className={`flex flex-col items-center transition-all`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          currentStep > i + 1
                            ? "bg-white text-blue-600 shadow-md"
                            : currentStep === i + 1
                            ? "bg-white text-blue-600 border-2 border-blue-300 shadow-lg"
                            : "bg-white/10 text-white border border-white/20"
                        } font-medium text-sm`}
                      >
                        {i + 1}
                      </div>
                      {currentStep === i + 1 && (
                        <span className="text-xs text-white mt-1 font-medium">
                          Passo {i + 1}
                        </span>
                      )}
                    </div>

                    {i < totalSteps - 1 && (
                      <div
                        className={`h-1 w-12 mx-1 transition-all ${
                          currentStep > i + 1 ? "bg-white" : "bg-white/10"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6" ref={modalContentRef}>
            <AnimatePresence custom={currentStep} mode="wait">
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                className="h-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Modal>

      <AddItemModal
        companyId={company?.id}
        isOpen={addItemModalIsOpen}
        onClose={() => {
          setAddItemModalIsOpen(false);
          resetItemForm();
        }}
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
        setItemImages={setItemImages}
        removeImage={(index) => {
          const newImages = [...itemImages];
          newImages.splice(index, 1);
          setItemImages(newImages);
        }}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        handleAddItem={handleAddItem}
        isFormComplete={isItemFormComplete()}
        overlayZIndex="z-[1001]"
        modalZIndex="z-[1001]"
      />

      <AddressModal
        isOpen={addressModalIsOpen}
        onClose={() => {
          setAddressModalIsOpen(false);
        }}
        address={address}
        setAddress={setAddress}
        addressError={addressError}
        loadingCEP={loadingCEP}
        fetchCEP={async (cep) => {
          setLoadingCEP(true);
          try {
            const response = await fetch(
              `https://viacep.com.br/ws/${cep}/json/`
            );
            const data = await response.json();

            if (data.erro) {
              setAddressError("CEP não encontrado");
              setAddress((prev) => ({
                ...prev,
                logradouro: "",
                bairro: "",
                cidade: "",
                uf: "",
              }));
              return;
            }

            setAddress((prev) => ({
              ...prev,
              cep: data.cep.replace("-", ""),
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            }));
            setAddressError("");
          } catch (error) {
            setAddressError("Erro ao buscar CEP");
            console.error(error);
          } finally {
            setLoadingCEP(false);
          }
        }}
        saveAddress={saveAddress}
        userId={userId}
        overlayZIndex="z-[1001]"
        modalZIndex="z-[1001]"
      />

      <DonationConfirmation
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          resetDonationFlow();
        }}
        companyName={company?.name}
      />
    </>
  );
};

export default DonationModal;
