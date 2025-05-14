import React, { useState, useEffect } from 'react';
import { connect } from "../services/api";
import { toast } from 'react-toastify';

// Componentes
import TableDefault from '../components/Tables/TableDefault';
import { SearchInput } from '../components/Inputs/searchInput';
import Modal from '../components/Modals/Modal';
import FormAssistido from '../components/Forms/FormAssistido';
import { getInstituicaoId, formatarEndereco, formatarTelefone, formatarDocumento } from '../components/Auxiliares/helper';

const Assistidos = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'nome' },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Telefone', accessor: 'telefone' },
    { header: 'Endereço', accessor: 'endereco' },
  ];

  const [instituicaoId, setInstituicaoId] = useState(getInstituicaoId());

  const [assistidos, setAssistidos] = useState([]);
  const [selectedAssistido, setSelectedAssistido] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAssistidos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ instituicaId: instituicaoId }).toString();
      const response = await fetch(`${connect}/assistido?${queryParams}`);
      const data = await response.json();

      // Formatando endereço
      const dadosFormatados = data.map((item) => ({
        ...item,
        documento: formatarDocumento(item),
        telefone: formatarTelefone(item),
        endereco: formatarEndereco(item),
      }));

      setAssistidos(dadosFormatados);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao buscar assistidos:', error);
    }
  }

  useEffect(() => {
    fetchAssistidos();
  }, []);

  const handleEdit = (item) => {
    console.log('Editar:', item);
  };

  const handleDelete = (item) => {
    console.log('Excluir:', item);
  };

  const handleAddItem = async (formData) => {
    try {
      const assistido = {
        ...formData,
        status_lista_espera: 0,
        instituicao_id: instituicaoId
      };

      const response = await fetch(`${connect}/assistido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistido),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao cadastrar assistido.');
      }

      toast.success('Assistido cadastrado com sucesso!');
      await fetchAssistidos();
      setIsModalOpen(false);

    } catch (error) {
      console.error("Erro ao cadastrar assistido:", error);
      toast.error(error.message || "Erro ao cadastrar assistido");
    }
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
        data={assistidos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar um Assistido">
        <FormAssistido onSubmit={handleAddItem} />
      </Modal>
    </div >
  );
};

export default Assistidos;