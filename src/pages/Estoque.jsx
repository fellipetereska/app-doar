import React from 'react';
import TableDefault from '../components/Tables/TableDefault';

const Estoque = () => {
  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Idade', accessor: 'age' },
  ];

  const data = [
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
    { name: 'João', email: 'joao@email.com', age: 28 },
    { name: 'Maria', email: 'maria@email.com', age: 32 },
  ];

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    console.log('Excluir:', item);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 justify-center">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4 text-sky-700">ESTOQUE</h1>
        <button className='bg-sky-600 hover:bg-sky-700 text-white px-8 py-2 rounded-md'>+ Novo</button>
      </div>
      <TableDefault
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Estoque;