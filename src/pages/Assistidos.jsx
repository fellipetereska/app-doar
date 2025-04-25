import React, { useState } from 'react';

// Componentes
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormAssistido from '../components/Forms/FormAssistido';

const Assistidos = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Telefone', accessor: 'telefone' },
    { header: 'Endereço', accessor: 'endereco' },
  ];

  const [data, setData] = useState([
    { id: 1, nome: 'João', documento: '123.456.789-00', telefone: '(11) 1234-5678', endereco: 'Rua A, 123' },
    { id: 2, nome: 'Maria', documento: '987.654.321-00', telefone: '(21) 9876-5432', endereco: 'Rua B, 456' },
    { id: 3, nome: 'João', documento: '123.456.789-00', telefone: '(11) 1234-5678', endereco: 'Rua A, 123' },
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
        <h1 className="text-2xl font-bold mb-4 text-sky-700">Assistido</h1>
      </div>
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-full py-3 px-8 shadow">
            <SearchInput placeholder="Buscar Assistido..." />
          </div>
        </div>

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar um Assistido">
        <FormAssistido onSubmit={handleAddItem} />
      </Modal>
    </div >
  );
};

export default Assistidos;