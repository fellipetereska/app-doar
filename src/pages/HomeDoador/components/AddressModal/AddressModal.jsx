import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const AddressModal = ({
  isOpen,
  onClose,
  address: currentAddressData,
  setAddress,
  saveAddress,
}) => {
  const [formData, setFormData] = useState({
    cep: "",
    logradouroCompleto: "", 
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [loadingCEP, setLoadingCEP] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Combina logradouro e endereco ao carregar os dados
      const logradouroCompleto = currentAddressData?.logradouro
        ? `${currentAddressData.logradouro} ${
            currentAddressData.endereco || ""
          }`.trim()
        : "";

      setFormData({
        cep: currentAddressData?.cep || "",
        logradouroCompleto: logradouroCompleto,
        numero: currentAddressData?.numero || "",
        complemento: currentAddressData?.complemento || "",
        bairro: currentAddressData?.bairro || "",
        cidade: currentAddressData?.cidade || "",
        uf: currentAddressData?.uf || "",
      });
      setAddressError("");
    }
  }, [isOpen, currentAddressData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCEP = async (cep) => {
    const cleanedCEP = cep.replace(/\D/g, "");
    if (cleanedCEP.length !== 8) return;

    setLoadingCEP(true);
    setAddressError("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCEP}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      setFormData((prev) => ({
        ...prev,
        logradouroCompleto: data.logradouro || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setAddressError(error.message || "Erro ao buscar endereço para este CEP");
    } finally {
      setLoadingCEP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddressError("");

    try {
      if (
        !formData.cep ||
        !formData.logradouroCompleto ||
        !formData.numero ||
        !formData.bairro ||
        !formData.cidade ||
        !formData.uf
      ) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const [logradouro, ...enderecoParts] =
        formData.logradouroCompleto.split(" ");
      const endereco = enderecoParts.join(" ");

      const addressToSave = {
        ...formData,
        logradouro,
        endereco,
        logradouroCompleto: undefined,
      };

      const savedAddress = await saveAddress(addressToSave);
      setAddress(savedAddress);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      setAddressError(error.message);
      toast.error(error.message || "Erro ao salvar endereço");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCEPChange = async (e) => {
    const { value } = e.target;
    const formattedCEP = value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);

    setFormData((prev) => ({ ...prev, cep: formattedCEP }));

    if (formattedCEP.length === 9) {
      await fetchCEP(formattedCEP);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Endereço"
      className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentAddressData?.id
                ? "Editar Endereço"
                : "Adicionar Endereço"}
            </h2>
            <buttona
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FiX size={24} />
            </buttona>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP*
            </label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleCEPChange}
              placeholder="00000-000"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            {loadingCEP && (
              <p className="text-xs text-gray-500">Buscando CEP...</p>
            )}
            {addressError && (
              <p className="text-xs text-red-500">{addressError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço*
              </label>
              <input
                type="text"
                name="logradouroCompleto"
                value={formData.logradouroCompleto}
                onChange={handleInputChange}
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
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
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
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro*
              </label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade*
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
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
                name="uf"
                value={formData.uf}
                onChange={handleInputChange}
                maxLength={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;
