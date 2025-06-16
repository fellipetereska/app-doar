import React, { useEffect, useState } from 'react';

// Componentes
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormEstoque from '../components/Forms/FormEstoque';
import { getInstituicaoId } from '../components/Auxiliares/helper';
import { connect } from '../services/api';
import { toast } from 'react-toastify';

const Estoque = () => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [estoque, setEstoque] = useState([]);
  const [estoqueFiltrado, setEstoqueFiltrado] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Categoria', accessor: 'categoria', sortable: true },
    { header: 'Subcategoria', accessor: 'subcategoria', sortable: true },
    { header: 'Quantidade', accessor: 'quantidade', sortable: true },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(null);

  const fetchEstoque = async () => {
    try {
      const res = await fetch(`${connect}/estoque?instituicaoId=${instituicaoId}`);
      const data = await res.json();
      const filterEstoque = data.filter((item) => item.quantidade > 0);
      setEstoque(filterEstoque);
      setEstoqueFiltrado(filterEstoque);
    } catch (err) {
      console.error("Erro ao carregar o estoque.", err);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, [instituicaoId]);

  const handleEdit = (item) => {
    setIsModalOpen(true);
    setOnEdit(item);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      setEstoqueFiltrado(estoque);
      return;
    }

    const termoMin = term.toLowerCase();

    const filtrado = estoque.filter((item) =>
      `${item.categoria} ${item.subcategoria}`.toLowerCase().includes(termoMin)
    );

    setEstoqueFiltrado(filtrado);
  };

  const handleAddItem = async (formData) => {
    setIsModalOpen(false);
    try {
      const payload = {
        ...formData,
        instituicao_id: instituicaoId,
      };

      const url = onEdit
        ? `${connect}/estoque/${onEdit.id}`
        : `${connect}/estoque`;

      const method = onEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao salvar item.");
      }

      toast.success(onEdit ? "Item atualizado!" : "Item adicionado ao estoque!");
      setOnEdit(null);
      fetchEstoque();

    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar item no estoque.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4">
      <div className='mb-4'>
        <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Estoque</h1>
      </div>
      
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-2 sm:p-4">
        {/* Barra de pesquisa */}
        <div className="w-full sm:flex-grow">
          <div className="w-full bg-white rounded-full py-2 px-4 sm:py-3 sm:px-8 shadow">
            <SearchInput 
              placeholder="Buscar item no estoque..." 
              onSearch={handleSearch} 
            />
          </div>
        </div>

        {/* Botão */}
        <div className="w-full sm:w-auto flex justify-end">
          <button 
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 sm:px-8 sm:py-2 rounded-md text-sm sm:text-base"
            onClick={() => setIsModalOpen(true)}
          >
            + Novo
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <TableDefault
          columns={columns}
          data={estoqueFiltrado}
          onEdit={handleEdit}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Adicionar Item ao Estoque" 
        paragraph="Preencha o formulário e clique em 'Salvar' para adicionar um item ao estoque!"
      >
        <FormEstoque
          onEdit={onEdit}
          onSubmit={handleAddItem}
          instituicaoId={instituicaoId}
        />
      </Modal>
    </div>
  );
};

export default Estoque;