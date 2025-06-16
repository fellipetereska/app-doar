import React from "react";
import { FiPlus, FiArrowRight, FiX, FiInfo } from "react-icons/fi";

const Step1Items = ({
  donationItems = [],
  openAddItemModal,
  removeItem,
  nextStep,
}) => {
  const hasItems = donationItems.length > 0;

  return (
    <div className="space-y-6 mx-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Itens para Doação</h3>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Adicione todos os itens que deseja doar nesta etapa. Você pode adicionar
              vários itens de diferentes categorias.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-700">
          Itens adicionados ({donationItems.length})
        </h4>
        <button
          onClick={openAddItemModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          <FiPlus className="mr-2" /> Adicionar Item
        </button>
      </div>

      {donationItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiPlus className="text-blue-600 text-xl" />
          </div>
          <p className="text-gray-500 mb-4">
            Você ainda não adicionou nenhum item
          </p>
          <button
            onClick={openAddItemModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar primeiro item
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {donationItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex justify-between items-start bg-white hover:bg-gray-50 transition"
            >
              <div className="flex items-start space-x-4">
                {item.images.length > 0 && (
                  <div className="flex-shrink-0">
                    <img
                      src={URL.createObjectURL(item.images[0])}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Categoria:</span> {item.category} • {item.subcategory}
                  </p>
                  <div className="flex space-x-4 mt-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Qtd:</span> {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Estado:</span>{" "}
                      {{
                        novo: "Novo",
                        usado: "Usado",
                        danificado: "Danificado",
                      }[item.condition]}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={nextStep}
          disabled={donationItems.length === 0}
          className={`flex items-center justify-center py-2 px-6 rounded-md font-medium transition ${
            donationItems.length === 0
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

export default Step1Items;