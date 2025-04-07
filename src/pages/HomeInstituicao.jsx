import React from 'react';
import TableDefault from '../components/Tables/TableDefault';
import Indicador from '../components/Cards/Indicador';

const HomeInstituicao = () => {
  const columns = [
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Idade', accessor: 'age' },
  ];

  const data = [
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <div className='grid grid-cols-5 gap-4'>
        <Indicador title="Doações Recebidas 2025" value={146} color="border-blue-500"></Indicador>
        <Indicador title="Doações Recebidas 2025" value={146} color="border-blue-500"></Indicador>
        <Indicador title="Doações Recebidas 2025" value={146} color="border-blue-500"></Indicador>
        <Indicador title="Doações Recebidas 2025" value={146} color="border-blue-500"></Indicador>
        <Indicador title="Doações Recebidas 2025" value={146} color="border-blue-500"></Indicador>
      </div>
      <div className='mt-4'>
        <h2>Doações Recebidas</h2>
        <TableDefault
          columns={columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      <div className='mt-4'>
        <h2>Doações Gerais</h2>
        <TableDefault
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