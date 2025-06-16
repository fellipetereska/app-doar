import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiEdit2,
  FiInfo,
} from "react-icons/fi";
import { connect } from "../../../../../services/api";

const Step2Delivery = ({
  userId,
  deliveryMethod,
  setDeliveryMethod,
  redirectIfRefused,
  setRedirectIfRefused,
  address,
  setAddress,
  observations,
  setObservations,
  openAddressModal,
  prevStep,
  nextStep,
}) => {
  const [loadingAddress, setLoadingAddress] = useState(false);

  const fetchUserAddress = async () => {
    if (!userId) {
      console.warn("User ID not available, cannot fetch address.");
      return;
    }
    setLoadingAddress(true);
    try {
      const response = await fetch(`${connect}/endereco/usuario/${userId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar endereço");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Erro ao carregar endereço");
      }

      if (result.data) {
        setAddress(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, [userId]);

  const isFormComplete = () => {
    if (deliveryMethod === "take") return true;

    return (
      observations.trim() !== "" &&
      address?.cep &&
      address?.logradouro &&
      address?.numero &&
      address?.bairro &&
      address?.cidade &&
      address?.uf
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Opções de Entrega
        </h3>
        <p className="text-gray-600">
          Escolha como deseja entregar seus itens doados
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              A instituição avaliará sua doação e entrará em contato para
              confirmar a disponibilidade de coleta, caso selecione esta opção.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="redirectIfRefused"
            checked={redirectIfRefused}
            onChange={(e) => setRedirectIfRefused(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="redirectIfRefused" className="text-gray-700">
            <span className="font-medium">Redirecionamento automático</span>
            <p className="text-sm text-gray-500 mt-1">
              Caso a instituição recuse algum item, redirecionaremos
              automaticamente para outra instituição que possa recebê-lo.
            </p>
          </label>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 text-lg">
            Método de entrega
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryMethod === "take"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setDeliveryMethod("take")}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  id="deliveryMethod1"
                  name="deliveryMethod"
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                  checked={deliveryMethod === "take"}
                  onChange={() => setDeliveryMethod("take")}
                />
                <label htmlFor="deliveryMethod1" className="ml-3 block">
                  <span className="font-medium text-gray-900">
                    Entrega pessoal
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Eu mesmo levarei os itens até a instituição
                  </p>
                </label>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                deliveryMethod === "collect"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setDeliveryMethod("collect")}
            >
              <div className="flex items-start">
                <input
                  type="radio"
                  id="deliveryMethod2"
                  name="deliveryMethod"
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500"
                  checked={deliveryMethod === "collect"}
                  onChange={() => setDeliveryMethod("collect")}
                />
                <label htmlFor="deliveryMethod2" className="ml-3 block">
                  <span className="font-medium text-gray-900">
                    Coleta pela instituição
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Solicitar coleta (sujeito a disponibilidade)
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {deliveryMethod === "collect" && (
          <div className="border-t pt-6 mt-4">
            <h4 className="font-medium text-gray-700 text-lg mb-6">
              Informações para coleta
            </h4>

            <div className="mb-6">
              {loadingAddress ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : address?.cep ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-900">
                          Endereço cadastrado
                        </h5>
                        <p className="text-gray-600">
                          {address.logradouro} {address.endereco},{" "}
                          {address.numero}
                          {address.complemento && `, ${address.complemento}`}
                        </p>
                        <p className="text-gray-600">
                          {address.bairro}, {address.cidade} - {address.uf}
                        </p>
                        <p className="text-gray-600">CEP: {address.cep}</p>
                      </div>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                        aria-label="Editar endereço"
                      >
                        <FiEdit2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Este é o endereço onde a instituição irá coletar os itens.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={openAddressModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="mr-2" /> Adicionar endereço
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Você precisa cadastrar um endereço para a coleta
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informações adicionais *
              </label>
              <div className="mt-1">
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                  rows="4"
                  placeholder="Ex: Disponível de segunda a sexta, entre 9h e 17h"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Informe os horários e dias disponíveis para coleta
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={prevStep}
          className="flex items-center justify-center py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
        >
          <FiArrowLeft className="mr-2" /> Voltar
        </button>
        <button
          onClick={nextStep}
          disabled={!isFormComplete()}
          className={`flex items-center justify-center py-2 px-6 rounded-md font-medium transition ${
            !isFormComplete()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Próxima Etapa
          <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step2Delivery;
