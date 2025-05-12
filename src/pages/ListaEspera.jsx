import React, { useEffect, useState } from 'react';
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormListaEspera from '../components/Forms/FormListaEspera';
import { connect } from '../services/api';

const ListaEspera = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Telefone', accessor: 'telefone' },
  ];

  const [assistidos, setAssistidos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssistidos = async () => {
    try {
      const response = await fetch(`${connect}/assistido`);
      const data = await response.json();
      const listaEspera = data.filter(a => a.status_lista_espera === 1);
      setAssistidos(listaEspera);
    } catch (error) {
      console.error('Erro ao buscar assistidos:', error);
    }
  };

  useEffect(() => {
    fetchAssistidos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-10 py-4">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Lista de Espera</h1>

      <div className="w-full flex justify-between items-center p-4">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-full py-3 px-8 shadow">
            <SearchInput placeholder="Buscar Assistido..." />
          </div>
        </div>

        <div className="ml-4">
          <button
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            + Novo
          </button>
        </div>
      </div>

      <TableDefault
        columns={columns}
        data={assistidos}
        onEdit={(item) => console.log('Editar:', item)}
        onDelete={(item) => console.log('Excluir:', item)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar à Lista de Espera">
        <FormListaEspera onSuccess={() => {
          setIsModalOpen(false);
          fetchAssistidos();
        }} />
      </Modal>
    </div>
  );
};

export default ListaEspera;
