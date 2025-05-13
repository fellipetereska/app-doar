import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import useDonation from "../hooks/useDonation";

const DonationStep3 = ({ prevStep }) => {
  const {
    selectedCompany,
    donationItems,
    deliveryMethod,
    redirectIfRefused,
    address,
    observations,
    phone,
    handleSubmitDonation
  } = useDonation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Confirmação
      </h3>

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <h4 className="font-medium text-green-800 mb-2">
          Resumo da sua doação
        </h4>
        <p className="text-gray-700">
          Você está doando{" "}
          <span className="font-bold">{donationItems.length} itens</span>{" "}
          para <span className="font-bold">{selectedCompany?.name}</span>.
        </p>

        <div className="mt-4">
          <h5 className="font-medium text-gray-700 mb-1">
            Método de entrega:
          </h5>
          <p className="text-gray-600">
            {deliveryMethod === "take"
              ? "Eu mesmo levarei os itens até a instituição"
              : "Solicitar coleta pela instituição"}
          </p>
        </div>

        {deliveryMethod === "collect" && (
          <div className="mt-2">
            <h5 className="font-medium text-gray-700 mb-1">
              Telefone para contato:
            </h5>
            <p className="text-gray-600">{phone}</p>
          </div>
        )}

        {redirectIfRefused && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Observação:</span> Se algum
              item for recusado, buscaremos automaticamente outra
              instituição que possa recebê-lo.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        {deliveryMethod === "take" ? (
          <>
            <h4 className="font-medium text-gray-700 mb-2">
              Horário para doação:
            </h4>
            <p className="text-gray-600">
              {selectedCompany?.donationInfo.hours}
            </p>
            <h4 className="font-medium text-gray-700 mt-4 mb-2">
              Endereço:
            </h4>
            <p className="text-gray-600">
              {selectedCompany?.donationInfo.address}
            </p>
          </>
        ) : (
          <>
            <h4 className="font-medium text-gray-700 mb-2">
              Endereço para coleta:
            </h4>
            <p className="text-gray-600">
              {address.logradouro}, {address.numero}
              {address.complemento && `, ${address.complemento}`}
              <br />
              {address.bairro}, {address.localidade} - {address.uf}
              <br />
              CEP: {address.cep}
            </p>
            <h4 className="font-medium text-gray-700 mt-4 mb-2">
              Observações:
            </h4>
            <p className="text-gray-600">{observations}</p>
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
          onClick={handleSubmitDonation}
          disabled={donationItems.length === 0}
          className={`flex items-center justify-center py-2 px-4 rounded-md font-medium transition ${
            donationItems.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Confirmar Doação
        </button>
      </div>
    </div>
  );
};

export default DonationStep3;