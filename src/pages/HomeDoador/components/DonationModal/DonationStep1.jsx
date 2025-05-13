import React, { useEffect } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import  useDonation  from '../hooks/useDonation';
import { useModal } from '../hooks/useModal';

const DonationStep1 = ({ nextStep }) => {
  const { donationItems, removeItem } = useDonation();
  const { openAddItemModal } = useModal();

  useEffect(() => {
    console.log('Itens atualizados:', donationItems);
  }, [donationItems]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Itens para doação ({donationItems.length})
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
        <>
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
                    {{
                      novo: "Novo",
                      "usado-bom": "Usado (Bom estado)",
                      "usado-regular": "Usado (Estado regular)",
                    }[item.condition]}
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
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={nextStep}
              className="flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
            >
              Próximo <FiArrowRight className="ml-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DonationStep1;