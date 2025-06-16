import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { connect } from "../../../../services/api"; 

const AddItemModal = ({
  isOpen,
  onClose,
  companyId, 
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  itemDescription,
  setItemDescription,
  itemQuantity,
  setItemQuantity,
  itemCondition,
  setItemCondition,
  itemImages,
  setItemImages,
  removeImage,
  formErrors,
  setFormErrors,
  handleAddItem,
  isFormComplete,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = React.useCallback(async () => {
    if (!companyId) {
      console.warn("Company ID not available, cannot fetch categories.");
      return;
    }
    setLoadingCategories(true);
    try {
      const response = await fetch(`${connect}/categoria?id=${companyId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();
      const formattedCategories = data.map((cat) => ({
        ...cat,
        id: cat.id?.toString() || "",
        subcategorias: Array.isArray(cat.subcategorias)
          ? cat.subcategorias.map((sub) => ({
              ...sub,
              id: sub.id?.toString() || "",
            }))
          : [],
      }));

      setCategorias(formattedCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      toast.error("Falha ao carregar categorias");
    } finally {
      setLoadingCategories(false);
    }
  }, [companyId]); 

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCategories();
    }
    if (!isOpen) {
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
    }
  }, [
    isOpen,
    companyId,
    fetchCategories,
    setSelectedCategory,
    setSelectedSubcategory,
    setItemDescription,
    setItemQuantity,
    setItemCondition,
    setItemImages,
    setFormErrors,
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      toast.error("Algumas imagens excedem o tamanho máximo de 2MB");
    }

    if (validFiles.length + itemImages.length > 6) {
      toast.error("Você pode adicionar no máximo 6 imagens");
      return;
    }

    setItemImages([...itemImages, ...validFiles]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {loadingCategories ? (
          <div className="text-center py-4">
            <p>Carregando categorias...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria*
                </label>
                <select
                  value={selectedCategory || ""}
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
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nome}
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
                  value={selectedSubcategory || ""}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setFormErrors({ ...formErrors, subcategory: false });
                  }}
                  className={`w-full p-2 border ${
                    formErrors.subcategory
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  disabled={!selectedCategory}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {selectedCategory &&
                    categorias
                      .find((c) => c.id.toString() === selectedCategory)
                      ?.subcategorias.map((subcategoria) => (
                        <option
                          key={subcategoria.id}
                          value={subcategoria.id.toString()}
                        >
                          {subcategoria.nome}
                        </option>
                      ))}
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
                  formErrors.itemDescription
                    ? "border-red-500"
                    : "border-gray-300"
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
                  onChange={(e) =>
                    setItemQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado do Item *
                </label>
                <select
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="novo">Novo</option>
                  <option value="usado">Usado</option>
                  <option value="danificado">Danificado</option>
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
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
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
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
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
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!isFormComplete}
                className={`py-2 px-4 rounded-md font-medium transition ${
                  isFormComplete
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Adicionar Item
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddItemModal;
