import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import  useDonation  from "../hooks/useDonation";
import  {useModal}  from "../hooks/useModal";
import { toast } from "react-toastify";

const AddressModal = () => {
  const {
    isAddressModalOpen,
    closeAddressModal,
    editingAddressId,
    setEditingAddressId
  } = useModal();
  
  const {
    address,
    setAddress,
    addressName,
    setAddressName,
    savedAddresses,
    setSavedAddresses,
    fetchCEP,
    loadingCEP,
    addressError,
    saveAddress,
    editAddress,
    deleteAddress
  } = useDonation();

  const resetForm = () => {
    setAddressName("");
    setEditingAddressId(null);
    setAddress({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
    });
  };

  return (
    <Modal
      isOpen={isAddressModalOpen}
      onRequestClose={() => {
        closeAddressModal();
        resetForm();
      }}
      contentLabel="Gerenciar Endereços"
      className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editingAddressId ? "Editar Endereço" : "Adicionar Endereço"}
          </h2>
          <button
            onClick={() => {
              closeAddressModal();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Endereço*
          </label>
          <input
            type="text"
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
            placeholder="Ex: Casa, Trabalho, etc."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP*
            </label>
            <input
              type="text"
              value={address.cep}
              onChange={(e) => {
                const value = e.target.value;
                setAddress({ ...address, cep: value });
                if (value.replace(/\D/g, "").length === 8) {
                  fetchCEP(value);
                }
              }}
              placeholder="00000-000"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {loadingCEP && (
              <p className="text-xs text-gray-500">Buscando CEP...</p>
            )}
            {addressError && (
              <p className="text-xs text-red-500">{addressError}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logradouro*
            </label>
            <input
              type="text"
              value={address.logradouro}
              onChange={(e) =>
                setAddress({ ...address, logradouro: e.target.value })
              }
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
              value={address.numero}
              onChange={(e) =>
                setAddress({ ...address, numero: e.target.value })
              }
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
              value={address.complemento}
              onChange={(e) =>
                setAddress({ ...address, complemento: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro*
            </label>
            <input
              type="text"
              value={address.bairro}
              onChange={(e) =>
                setAddress({ ...address, bairro: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade*
            </label>
            <input
              type="text"
              value={address.localidade}
              onChange={(e) =>
                setAddress({ ...address, localidade: e.target.value })
              }
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
              value={address.uf}
              onChange={(e) =>
                setAddress({ ...address, uf: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={() => {
              closeAddressModal();
              resetForm();
            }}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              saveAddress();
              resetForm();
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition"
          >
            {editingAddressId ? "Atualizar Endereço" : "Salvar Endereço"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressModal;