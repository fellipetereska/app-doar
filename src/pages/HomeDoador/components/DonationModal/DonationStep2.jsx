import React from "react";
import { FiArrowLeft, FiArrowRight, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import  useDonation  from "../hooks/useDonation";
import  {useModal}  from "../hooks/useModal";
import { toast } from "react-toastify";

const DonationStep2 = ({ nextStep, prevStep }) => {
  const {
    redirectIfRefused,
    setRedirectIfRefused,
    deliveryMethod,
    setDeliveryMethod,
    address,
    setAddress,
    observations,
    setObservations,
    phone,
    setPhone,
    savedAddresses,
    setSavedAddresses,
    selectAddress,
    editAddress,
    deleteAddress
  } = useDonation();
  
  const { openAddressModal } = useModal();

  const handleNextStep = () => {
    if (deliveryMethod === "collect") {
      if (!phone || !address.cep || !address.logradouro || !address.numero || 
          !address.bairro || !address.localidade || !address.uf || !observations) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
    }
    nextStep();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Opções de entrega
      </h3>

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="redirectIfRefused"
            checked={redirectIfRefused}
            onChange={(e) => setRedirectIfRefused(e.target.checked)}
            className="mt-1 mr-2"
          />
          <label htmlFor="redirectIfRefused" className="text-gray-700">
            Caso a instituição recuse algum item, redirecionar automaticamente para outra instituição
          </label>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            Método de entrega
          </h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="deliveryMethod1"
                name="deliveryMethod"
                className="mr-2"
                checked={deliveryMethod === "take"}
                onChange={() => setDeliveryMethod("take")}
              />
              <label htmlFor="deliveryMethod1" className="text-gray-700">
                Eu mesmo levarei os itens até a instituição
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="deliveryMethod2"
                name="deliveryMethod"
                className="mr-2"
                checked={deliveryMethod === "collect"}
                onChange={() => setDeliveryMethod("collect")}
              />
              <label htmlFor="deliveryMethod2" className="text-gray-700">
                Solicitar coleta pela instituição (sujeito a disponibilidade)
              </label>
            </div>
          </div>
        </div>

        {deliveryMethod === "collect" && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-700 mb-3">
              Endereço para coleta
            </h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone para contato*
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(XX) XXXX-XXXX"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <button
                onClick={openAddressModal}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <FiPlus className="mr-1" /> Adicionar novo endereço
              </button>

              {savedAddresses.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600">Ou selecione um endereço salvo:</p>
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`border rounded-md p-3 cursor-pointer ${address.cep === addr.cep ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                      onClick={() => selectAddress(addr)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{addr.name}</h5>
                          <p className="text-sm text-gray-600">
                            {addr.logradouro}, {addr.numero}{addr.complemento && `, ${addr.complemento}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.bairro}, {addr.localidade} - {addr.uf}
                          </p>
                          <p className="text-sm text-gray-600">CEP: {addr.cep}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              editAddress(addr);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAddress(addr.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (Datas e horários disponíveis para coleta)*
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Ex: Disponível de segunda a sexta, entre 9h e 17h"
                required
              />
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
          onClick={handleNextStep}
          className="flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
        >
          Próximo <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default DonationStep2;