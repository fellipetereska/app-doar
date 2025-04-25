import React, { useState } from 'react';
import TableHome from '../components/Tables/TableHome';
import Indicador from '../components/Cards/Indicador';
import Modal from '../components/Modals/Modal';

const HomeInstituicao = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isOpenModalDonation, setIsOpenModalDonation] = useState(false);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Doador', accessor: 'doador' },
    { header: 'Telefone', accessor: 'telefone' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Ação', accessor: 'action' }
  ];

  const data = [
    {
      id: 1,
      doador: [{ id: 1, name: 'Fellipe', telefone: '(43) 99959-5962', documento: '104.179.199-10' }],
      data: "2025-04-15",
      tipo: 'Entrega',
      itens: [{ itemId: 1, nome: "Cesta Básica", quantidade: 2 }, { itemId: 3, nome: "Kit de Higiene", quantidade: 1 }]
    },
    {
      id: 2,
      doador: [{ id: 2, name: 'Ana Lima', telefone: '(11) 91234-5678', documento: '321.654.987-00' }],
      data: "2025-04-14",
      tipo: 'Retirada',
      itens: [{ itemId: 2, nome: "Cobertor", quantidade: 3 }]
    },
    {
      id: 3,
      doador: [{ id: 3, name: 'Carlos Mendes', telefone: '(21) 98765-4321', documento: '852.963.741-20' }],
      data: "2025-04-13",
      tipo: 'Entrega',
      itens: [{ itemId: 1, nome: "Cesta Básica", quantidade: 1 }, { itemId: 2, nome: "Cobertor", quantidade: 2 }, { itemId: 4, nome: "Máscaras", quantidade: 5 }]
    },
    {
      id: 4,
      doador: [{ id: 4, name: 'Juliana Costa', telefone: '(31) 98888-0000', documento: '999.888.777-66' }],
      data: "2025-04-12",
      tipo: 'Retirada',
      itens: [{ itemId: 5, nome: "Fraldas", quantidade: 4 }]
    }
  ];

  // Função para mapear os dados para a estrutura da tabela
  const transformedData = data.map(item => ({
    id: item.id,
    doador: item.doador[0]?.name || '-',
    telefone: item.doador[0]?.telefone || '-',
    tipo: item.tipo || '-',
    action: (
      <button
        className="text-blue-500"
        onClick={() => setSelectedDonation(item)}>
        Abrir
      </button>
    )
  }));

  const handleEdit = (item) => {
    setIsOpenModalDonation(!isOpenModalDonation);
    console.log('Editar:', item);
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
      {/* Doações Recebidas */}
      <div className='mt-8'>
        <h2 className='text-lg font-bold mb-2 text-sky-700'>Doações Recebidas</h2>
        <TableHome
          columns={columns}
          data={transformedData}
          onEdit={handleEdit}
        />
      </div>
      {/* Doações Globais */}
      <div className='mt-8'>
        <h2 className='text-lg font-bold mb-2 text-sky-700'>Doações Gerais</h2>
        <TableHome
          columns={columns}
          data={transformedData}
          onEdit={handleEdit}
        />
      </div>
      {/* Modal */}
      {selectedDonation && (
        <Modal
          donation={selectedDonation}
          isOpen={isOpenModalDonation}
          onClose={() => setIsOpenModalDonation(!isOpenModalDonation)}
        />
      )}
    </div>
  );
};

export default HomeInstituicao;