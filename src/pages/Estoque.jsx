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

  const handleDelete = (item) => {
    console.log('Excluir:', item);
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
    <div className="min-h-screen flex flex-col px-10 py-4">
      <div className=''>
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Estoque</h1>
      </div>
      <div className="w-full flex justify-between items-center p-4">
        {/* Barra de pesquisa (centralizada) */}
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-full py-3 px-8 shadow">
            <SearchInput placeholder="Buscar item no estoque..." />
          </div>
        </div>

        {/* Botão (alinhado à direita) */}
        <div className="ml-4">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2 rounded-md" onClick={() => setIsModalOpen(true)}>
            + Novo
          </button>
        </div>
      </div>
      <TableDefault
        columns={columns}
        data={estoque}
        onEdit={handleEdit}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Item ao Estoque" paragraph="Preencha o formulário e clique em 'Salvar' para adicionar um item ao estoque!">
        <FormEstoque
          onEdit={onEdit}
          onSubmit={handleAddItem}
          instituicaoId={instituicaoId}
        />
      </Modal>
    </div >
  );
};

export default Estoque;