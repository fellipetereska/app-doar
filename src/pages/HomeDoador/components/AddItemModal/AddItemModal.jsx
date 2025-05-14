import React, { useState } from "react";
import Modal from "react-modal";
import { FiX, FiPlus } from "react-icons/fi";
import useDonation from "../hooks/useDonation";
import { useModal } from "../hooks/useModal";
import { toast } from "react-toastify";

import { donationCategories } from "../../constants";

const AddItemModal = () => {
  const { addDonationItem } = useDonation();
  const { isAddItemModalOpen, closeAddItemModal } = useModal();


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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = 6 - itemImages.length;
    if (files.length > remainingSlots) {
      toast.warning(`Você só pode adicionar mais ${remainingSlots} imagem(ns)`);
      return;
    }

    const validImages = files.filter((file) => file.size <= 2 * 1024 * 1024);
    if (validImages.length < files.length) {
      toast.error("Algumas imagens excedem o tamanho máximo de 2MB");
    }

    setItemImages([...itemImages, ...validImages]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setItemImages(itemImages.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    const errors = {
      category: !selectedCategory,
      subcategory: !selectedSubcategory,
      itemDescription: !itemDescription.trim(),
      itemImages: itemImages.length === 0,
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      if (errors.category) toast.error("Selecione uma categoria para o item");
      if (errors.subcategory)
        toast.error("Selecione uma subcategoria para o item");
      if (errors.itemDescription) toast.error("Informe a descrição do item");
      if (errors.itemImages)
        toast.error("Adicione pelo menos uma foto do item");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: `${selectedSubcategory} (${selectedCategory})`,
      description: itemDescription.trim(),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      quantity: itemQuantity,
      condition: itemCondition,
      images: [...itemImages],
    };

    addDonationItem(newItem);
    closeAddItemModal();
    resetForm();
  };

  const resetForm = () => {
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

  return (
    <Modal
      isOpen={isAddItemModalOpen}
      onRequestClose={() => {
        closeAddItemModal();
        resetForm();
      }}
      contentLabel="Adicionar Item"
      className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 sm:mx-auto relative shadow-lg z-[1003] outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
      appElement={document.getElementById("root")}
      closeTimeoutMS={200}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Adicionar Item</h2>
          <button
            onClick={() => {
              closeAddItemModal();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria*
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
                setFormErrors({ ...formErrors, category: false });
              }}
              className={`w-full p-2 border ${
                formErrors.category ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="">Selecione uma categoria</option>
              {Object.keys(donationCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="text-red-500 text-xs mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoria*
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setFormErrors({ ...formErrors, subcategory: false });
              }}
              className={`w-full p-2 border ${
                formErrors.subcategory ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              disabled={!selectedCategory}
            >
              <option value="">Selecione uma subcategoria</option>
              {selectedCategory &&
                donationCategories[selectedCategory].subcategories.map(
                  (subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  )
                )}
            </select>
            {formErrors.subcategory && (
              <p className="text-red-500 text-xs mt-1">
                Este campo é obrigatório
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição*
          </label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className={`w-full p-2 border ${
              formErrors.itemDescription ? "border-red-500" : "border-gray-300"
            } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            rows="2"
            placeholder="Forneça detalhes sobre o item"
          />
          {formErrors.itemDescription && (
            <p className="text-red-500 text-xs mt-1">
              Este campo é obrigatório
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade*
            </label>
            <input
              type="number"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado do Item*
            </label>
            <select
              value={itemCondition}
              onChange={(e) => setItemCondition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="novo">Novo</option>
              <option value="usado-bom">Usado (Bom estado)</option>
              <option value="usado-regular">Usado (Estado regular)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fotos do Item* (Máximo 6)
          </label>

          <div className="flex flex-wrap gap-3 mb-4">
            {itemImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Prévia ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow hover:opacity-90 transition-opacity"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover imagem"
                >
                  ×
                </button>
              </div>
            ))}

            {itemImages.length < 6 && (
              <label
                htmlFor="itemImages"
                className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
              >
                <FiPlus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">
                  {itemImages.length}/6
                </span>
              </label>
            )}
          </div>

          <input
            id="itemImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={itemImages.length >= 6}
          />

          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB por imagem.
            {itemImages.length > 0 &&
              ` (${itemImages.length} imagem(ns) adicionada(s)`}
          </p>
          {formErrors.itemImages && (
            <p className="text-red-500 text-xs mt-1">
              Adicione pelo menos uma foto
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            onClick={() => {
              closeAddItemModal();
              resetForm();
            }}
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
          >
            Adicionar Item
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddItemModal;
