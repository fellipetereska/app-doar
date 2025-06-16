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
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      render: (_, row) => row.assistido?.id ?? '-',
    },
    {
      header: 'Nome',
      accessor: 'nome',
      sortable: true,
      render: (_, row) => row.assistido?.nome ?? '-',
    },
    {
      header: 'Documento',
      accessor: 'documento',
      render: (_, row) => formatarDocumento(row.assistido),
    },
    {
      header: 'Telefone',
      accessor: 'telefone',
      render: (_, row) => formatarTelefone(row.assistido),
    },
    {
      header: 'Endereço',
      accessor: 'endereco',
      render: (_, row) => formatarEndereco(row.assistido),
    },
    {
      header: 'Projetos',
      accessor: 'projetos',
      render: (_, row) =>
        row.projetos?.length ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {row.projetos.map((p) => (
              <span
                key={p.id}
                className="inline-block bg-gray-200 text-gray-500 text-xs font-medium px-2 py-1 rounded-full"
              >
                {p.apelido}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 italic text-xs">Nenhum Projeto!</span>
        )
    },
  ];

  const [instituicaoId] = useState(getInstituicaoId());
  const [assistidos, setAssistidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assistidosFiltrados, setAssistidosFiltrados] = useState([]);
  const [selectedAssistido, setSelectedAssistido] = useState(null);
  const [isEdicao, setIsEdicao] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAssistidos = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ instituicaoId: instituicaoId }).toString();
      const response = await fetch(`${connect}/assistido/projetos?${queryParams}`);
      const data = await response.json();

      setAssistidos(data);
      setAssistidosFiltrados(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao buscar assistidos:', error);
    }
  }

  useEffect(() => {
    fetchAssistidos();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      setAssistidosFiltrados(assistidos);
      return;
    }

    const termoMin = term.toLowerCase();

    const filtrados = assistidos.filter((item) => {
      const nome = item.assistido?.nome?.toLowerCase() ?? '';
      const doc = item.assistido?.documento ?? '';
      return nome.includes(termoMin) || doc.includes(termoMin);
    });

    setAssistidosFiltrados(filtrados);
  };

  const handleEdit = (item) => {
    setSelectedAssistido(item);
    setIsModalOpen(true);
    setIsEdicao(true);
  };

  const handleAddItem = async (formData) => {
    try {
      const assistido = {
        ...formData,
        status_lista_espera: 0,
        cep: formData.cep.replace(/\D/g, ''),
        documento: formData.documento.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        instituicao_id: instituicaoId
      };

      const metodo = isEdicao ? 'PUT' : 'POST';
      const url = isEdicao
        ? `${connect}/assistido/${Number(selectedAssistido.assistido.id)}`
        : `${connect}/assistido`;

      const response = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistido),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao salvar assistido.');
      }

      toast.success(isEdicao ? 'Assistido atualizado com sucesso!' : 'Assistido cadastrado com sucesso!');
      await fetchAssistidos();
      setIsModalOpen(false);
      setSelectedAssistido(null);
      setIsEdicao(false);

    } catch (error) {
      console.error("Erro ao salvar assistido:", error);
      toast.error(error.message || "Erro ao salvar assistido");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4">
      <div className='mb-4'>
        <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Assistidos</h1>
      </div>
      
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-2 sm:p-4">
        {/* Barra de pesquisa */}
        <div className="w-full sm:flex-grow">
          <div className="w-full bg-white rounded-full py-2 px-4 sm:py-3 sm:px-8 shadow">
            <SearchInput 
              placeholder="Buscar Assistido..." 
              onSearch={handleSearch} 
            />
          </div>
        </div>

        {/* Botão Novo */}
        <div className="w-full lg:w-[150px] flex sm:justify-end justify-center">
          <button 
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 sm:px-8 sm:py-2 rounded-md text-sm sm:text-base"
            onClick={() => setIsModalOpen(true)}
          >
            + Novo
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <TableDefault
          columns={columns}
          data={assistidosFiltrados}
          onEdit={(item) => handleEdit(item)}
          isLoading={loading}
        />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedAssistido([]); setIsEdicao(false); }} 
        title="Cadastrar um Assistido"
      >
        <FormAssistido 
          onSubmit={handleAddItem} 
          selectedAssistido={selectedAssistido} 
          instituicao_id={instituicaoId} 
        />
      </Modal>
    </div>
  );
};

export default Assistidos;