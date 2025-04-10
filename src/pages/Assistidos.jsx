import React from 'react';

// Componentes
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';

const Assistidos = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Idade', accessor: 'age' },
  ];

  const data = [
    { id: 1, name: 'João', email: 'joao@email.com', age: 28 },
    { id: 2, name: 'Maria', email: 'maria@email.com', age: 32 },
    { id: 3, name: 'João', email: 'joao@email.com', age: 28 },
    { id: 4, name: 'Maria', email: 'maria@email.com', age: 32 },
    { id: 5, name: 'João', email: 'joao@email.com', age: 28 },
    { id: 6, name: 'Maria', email: 'maria@email.com', age: 32 },
  ];

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    console.log('Excluir:', item);
  };

  return (
    <div className="min-h-screen flex flex-col px-10 py-4 justify-center">
      <div className=''>
        <h1 className="text-3xl font-bold text-sky-700">ASSISTIDOS</h1>
      </div>
      <div className="w-full flex justify-between items-center p-4">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-full py-3 px-8 shadow">
            <SearchInput placeholder="Buscar Assistido..." />
          </div>
        </div>

        <div className="ml-4">
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2 rounded-md">
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
    </div >
  );
};

export default Assistidos;