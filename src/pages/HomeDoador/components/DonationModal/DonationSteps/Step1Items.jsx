import React from "react";
import { FiPlus, FiArrowRight, FiX } from "react-icons/fi";

const Step1Items = ({
  donationItems = [],
  openAddItemModal,
  removeItem,
  nextStep,
}) => {
  const hasItems = donationItems.length > 0;

  return (
    <div className="space-y-6 z-[1002]">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Itens para doação
        </h3>
        <button
          onClick={openAddItemModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
        >
          <FiPlus className="mr-2" /> Adicionar Item
        </button>
      </div>

      {donationItems.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">
            Você ainda não adicionou nenhum item
          </p>
          <button
            onClick={openAddItemModal}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clique para adicionar seu primeiro item
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {donationItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-3 flex justify-between items-start"
            >
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.category}
                  {item.subcategory && ` • ${item.subcategory}`}
                </p>
                <p className="text-sm text-gray-600">
                  Quantidade: {item.quantity} • Estado:{" "}
                  {
                    {
                      novo: "Novo",
                      "usado-bom": "Usado (Bom estado)",
                      "usado-regular": "Usado (Estado regular)",
                    }[item.condition]
                  }
                </p>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {donationItems.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={nextStep}
            disabled={!hasItems}
            className="flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
          >
            Próximo <FiArrowRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1Items;
