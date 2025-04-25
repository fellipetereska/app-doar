import React, { useState } from 'react';

// Componentes
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormEstoque from '../components/Forms/FormEstoque';


const Estoque = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Categoria', accessor: 'categoria' },
    { header: 'Subcategoria', accessor: 'subcategoria' },
    { header: 'Descrição', accessor: 'descricao' },
    { header: 'Quantidade', accessor: 'quantidade' },
  ];

  const [data, setData] = useState([
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    console.log('Excluir:', item);
  };

  const handleAddItem = (formData) => {
    const newItem = {
      id: data.length + 1,
      ...formData,
    };
    setData((prev) => [...prev, newItem]);
    setIsModalOpen(false);
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
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Item ao Estoque">
        <FormEstoque onSubmit={handleAddItem} />
      </Modal>
    </div >
  );
};

export default Estoque;