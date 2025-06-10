import React, { useEffect, useState } from 'react';
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormListaEspera from '../components/Forms/FormListaEspera';
import { connect } from '../services/api';
import { formatarDocumento, formatarEndereco, formatarTelefone, getInstituicaoId } from '../components/Auxiliares/helper';

const ListaEspera = () => {
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Nome', accessor: 'nome', sortable: true },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Telefone', accessor: 'telefone' },
  ];

  const [instituicaoId, setInstituicaoId] = useState(getInstituicaoId());
  const [assistidos, setAssistidos] = useState([]);
  const [assistidosFiltrados, setAssistidosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setOnEdit(null);
  };


  const fetchAssistidos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ instituicaoId: instituicaoId }).toString();
      const response = await fetch(`${connect}/assistido?${queryParams}`);
      const data = await response.json();

      // Formatando endereço
      const dadosFormatados = data.map((item) => ({
        ...item,
        documento: formatarDocumento(item),
        telefone: formatarTelefone(item),
        endereco: formatarEndereco(item),
      }));

      const listaEspera = dadosFormatados.filter((assistido) => assistido.status_lista_espera === 1);
      setAssistidos(listaEspera);
      setAssistidosFiltrados(listaEspera);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao buscar assistidos:', error);
    }
  };

  useEffect(() => {
    fetchAssistidos();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      setAssistidosFiltrados(assistidos);
      return;
    }

    const termo = term.toLowerCase();

    const filtrados = assistidos.filter((a) =>
      a.nome?.toLowerCase().includes(termo) ||
      a.documento?.replace(/\D/g, '').includes(termo)
    );

    setAssistidosFiltrados(filtrados);
  };


  const handleEdit = (item) => {
    if (!item) return;

    setIsModalOpen(true);
    setOnEdit(item);
  };

  const handleClear = () => {
    setOnEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col px-10 py-4">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Lista de Espera</h1>

      <div className="w-full flex justify-between items-center p-4">
        <div className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-full py-3 px-8 shadow">
            <SearchInput placeholder="Buscar Assistido..." onSearch={handleSearch} />
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
        data={assistidosFiltrados}
        onEdit={(item) => handleEdit(item)}
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Adicionar à Lista de Espera">
        <FormListaEspera
          onEdit={onEdit}
          onSuccess={() => {
            handleClear();
            setIsModalOpen(false);
            fetchAssistidos();
          }}
        />
      </Modal>
    </div>
  );
};

export default ListaEspera;
