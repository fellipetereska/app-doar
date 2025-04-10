import React from 'react';
import TableHome from '../components/Tables/TableHome';
import Indicador from '../components/Cards/Indicador';

const HomeInstituicao = () => {
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
    <div className="min-h-screen flex flex-col p-4 justify-center">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Home</h1>
      <div className='grid grid-cols-5 gap-4'>
        <Indicador title="Doações Recebidas 2025" value={146} borderColor="border-blue-500" textColor="text-blue-500"></Indicador>
        <Indicador title="Doações Recebidas Abr/25" value={34} borderColor="border-red-500" textColor="text-red-500"></Indicador>
        <Indicador title="Doações Enviadas 2025" value={112} borderColor="border-yellow-500" textColor="text-yellow-500"></Indicador>
        <Indicador title="Doações Enviadas Abr/25" value={26} borderColor="border-green-500" textColor="text-green-500"></Indicador>
        <Indicador title="Lista de Espera 2025" value={12} borderColor="border-purple-500" textColor="text-purple-500"></Indicador>
      </div>
      <div className='mt-8'>
        <h2 className='text-lg font-bold mb-2 text-sky-700'>Doações Recebidas</h2>
        <TableHome
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className='mt-4'>
        <h2 className='text-lg font-bold mb-2 text-sky-700'>Doações Globais</h2>
        <TableHome
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default HomeInstituicao;