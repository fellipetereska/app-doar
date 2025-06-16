import React, { useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

const Step3Confirmation = ({
  company,
  donationItems,
  deliveryMethod,
  address,
  observations,
  phone,
  redirectIfRefused,
  prevStep,
  handleSubmitDonation,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleSubmitDonation();
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Confirmação Final
        </h3>
        <p className="text-gray-600">
          Revise os detalhes da sua doação antes de confirmar
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
              <FiCheck className="text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-blue-800 mb-2">
              Resumo da sua doação
            </h4>
            <p className="text-gray-700">
              Você está doando{" "}
              <span className="font-bold">
                {donationItems.length}{" "}
                {donationItems.length === 1 ? "item" : "itens"}
              </span>{" "}
              para <span className="font-bold">{company?.name}</span>.
            </p>
          </div>
        </div>

        <div className="mt-4 pl-9">
          <div className="mb-3">
            <h5 className="font-medium text-gray-700 mb-1">
              Método de entrega:
            </h5>
            <p className="text-gray-600">
              {deliveryMethod === "take"
                ? "Entrega pessoal - Eu mesmo levarei os itens até a instituição"
                : "Coleta pela instituição - Eles irão buscar os itens"}
            </p>
          </div>

          {deliveryMethod === "collect" && (
            <div className="mb-3">
              <h5 className="font-medium text-gray-700 mb-1">
                Telefone para contato:
              </h5>
              <p className="text-gray-600">{phone}</p>
            </div>
          )}

          {redirectIfRefused && (
            <div className="mb-3">
              <h5 className="font-medium text-gray-700 mb-1">
                Redirecionamento:
              </h5>
              <p className="text-gray-600">
                Itens recusados serão automaticamente redirecionados para outras
                instituições
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-700 text-lg mb-4">
          {deliveryMethod === "take"
            ? "Informações para entrega"
            : "Informações para coleta"}
        </h4>

        {deliveryMethod === "take" ? (
          <>
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-1">
                Horário para doação:
              </h5>
              <p className="text-gray-600">{company?.donationInfo.hours}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Endereço:</h5>
              <p className="text-gray-600">{company?.donationInfo.address}</p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-1">
                Endereço para coleta:
              </h5>
              <p className="text-gray-600">
                {address.logradouro || ""}
                {address.endereco ? ` ${address.endereco}` : ""}
                {address.numero ? `, ${address.numero}` : ""}
                {address.complemento ? `, ${address.complemento}` : ""}
                <br />
                {address.bairro}, {address.cidade} - {address.uf}
                <br />
                CEP: {address.cep}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Observações:</h5>
              <p className="text-gray-600">{observations}</p>
            </div>
          </>
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
          onClick={handleSubmit}
          disabled={donationItems.length === 0 || isSubmitting}
          className={`flex items-center justify-center py-2 px-6 rounded-md font-medium transition ${
            donationItems.length === 0 || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Enviando doação...
            </div>
          ) : (
            "Confirmar Doação"
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Confirmation;
