import React, { useEffect, useState } from 'react';
import { connect } from '../services/api';
import { toast } from 'react-toastify';
import TableDefault from '../components/Tables/TableDefault';
import Modal from '../components/Modals/Modal';
import NewDonation from '../components/NewDonation';
import { formatarDocumento, formatarEndereco, formatarTelefone, getInstituicaoId, formatarDataIso } from '../components/Auxiliares/helper';
import FiltroDoacoes from '../components/FiltroDoacoes';
import { ListFilter, Plus } from 'lucide-react';
import ToolTip from '../components/Auxiliares/ToolTip';
import ModalDoacao from '../components/Modals/ModalDoacao';

const DoacoesInstituicao = () => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [assistidos, setAssistidos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDonation, setViewDonation] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState([]);

  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    status: '',
    assistidoId: '',
    data: '',
    listaAssistidos: [],
    tipo_entrega: '',
  });

  const legenda = [
    { cor: 'bg-yellow-400', texto: 'Pendente' },
    { cor: 'bg-green-500', texto: 'Finalizada' },
    { cor: 'bg-gray-400', texto: 'Cancelada' },
  ];

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Data', accessor: 'data' },
    { header: 'Assitido', accessor: 'nome_assistido' },
    { header: 'Observação', accessor: 'observacao' },
    { header: 'Tipo', accessor: 'tipo_entrega' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`flex items-center gap-2 justify-center`}>
          <span className={`w-3 h-3 rounded-full ${value === 'pendente' ? 'bg-yellow-400' : value === 'finalizada' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </span>
      )
    }
  ];

  const fetchAssistidos = async () => {
    try {
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
      setFiltros((prev) => ({ ...prev, listaAssistidos: dadosFormatados }));
      setAssistidos(dadosFormatados);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao buscar assistidos:', error);
    }
  }

  const fetchEstoque = async () => {
    try {
      const res = await fetch(`${connect}/estoque?instituicaoId=${instituicaoId}`);
      const data = await res.json();
      setEstoque(data);
    } catch (err) {
      console.error('Erro ao buscar doações.');
    }
  };

  const buscarDoacoes = async () => {
    try {
      const params = {};

      if (filtros.status) params.status = filtros.status;
      if (filtros.assistidoId) params.assistidoId = filtros.assistidoId;
      if (filtros.data) params.data = filtros.data;

      const query = new URLSearchParams(params).toString();

      const res = await fetch(`${connect}/entregas/instituicao/${instituicaoId}?${query}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao buscar doações.');
      }

      const dadosFormatados = data.map((item) => ({
        ...item,
        data: formatarDataIso(item.data),
      }))

      setDoacoes(dadosFormatados);
    } catch (err) {
      console.error('Erro ao buscar doações.', err.message);
    }
  };

  const loadScreen = async () => {
    try {
      setLoading(true);
      await fetchAssistidos();
      await fetchEstoque();
      await buscarDoacoes();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro ao carregar tela de doações.", error);
    }
  }

  const handleEdit = async (item) => {
    setViewDonation(true);
    setSelectedDonation(item);
  }

  const atualizarStatus = async (id, status) => {
    try {
      const res = await fetch(`${connect}/entregas/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao atualizar o status da entrega.');
      }

      buscarDoacoes();
    } catch (err) {
      console.log("Erro ao atualizar o status da entrega", err.message);
    }
  };

  useEffect(() => {
    loadScreen();
  }, []);

  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(`${connect}/entregas/remover_item?${itemId}`, { method: 'DELETE' });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao remover item.');
      }

      buscarDoacoes();
    } catch (error) {
      console.error('Erro ao remover item:', error.message);
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className='px-4 pt-4'>
        <div className='flex justify-between items-center'>
          <h1 className="text-2xl font-bold mb-2 text-sky-700">Doações da Instituição</h1>
          <div className='flex justify-center items-center gap-4'>
            {/* Botão Nova Doação */}
            <div className="flex flex-1 justify-end">
              <ToolTip text="Nova Doação" position={'left'}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={` text-white px-6 py-2 rounded shadow bg-sky-600 hover:bg-sky-700`}
                >
                  <Plus />
                </button>
              </ToolTip>
            </div>
            {/* Filtros */}
            <ToolTip text="Filtros" position={'bottom'}>
              <div className={`bg-white shadow p-2 rounded cursor-pointer ${isFilterOpen ? 'shadow-none rounded-b-none' : ''}`} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <ListFilter />
              </div>
            </ToolTip>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden custom-scrollbar p-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Tabela de Doações */}
          <div className={`${isFilterOpen ? 'col-span-9' : 'col-span-12'} transition-all overflow-auto`}>
            <TableDefault data={doacoes} columns={columns} isLoading={loading} legenda={legenda} onEdit={(item) => handleEdit(item)} />
          </div>

          {/* Filtros laterais - Lista Vertical */}
          {isFilterOpen && (
            <div className="col-span-3 bg-white p-4 rounded-md shadow-md space-y-4 overflow-y-auto">
              <h2 className="text-lg font-semibold border-b pb-2">Filtros</h2>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={filtros.status}
                  onChange={handleChangeFilter}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Todos</option>
                  <option value="aceita">Aceitas</option>
                  <option value="entregar">Para Entregar</option>
                  <option value="retirar">Aguardando Retirada</option>
                  <option value="finalizada">Finalizadas</option>
                </select>
              </div>

              {/* Assistido */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Assistido</label>
                <select
                  name="assistidoId"
                  value={filtros.assistidoId}
                  onChange={handleChangeFilter}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Todos</option>
                  {filtros.listaAssistidos?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Data (a partir de)</label>
                <input
                  type="date"
                  name="data"
                  value={filtros.data}
                  onChange={handleChangeFilter}
                  className="border rounded px-3 py-2"
                />
              </div>
              {/* Botão */}
              <div className='pt-2 border-t'>
                <button
                  onClick={buscarDoacoes}
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewDonation
          estoque={estoque}
          assistidos={assistidos}
          instituicaoId={instituicaoId}
          onSuccess={() => {
            setIsModalOpen(false);
            buscarDoacoes();
          }}
        />
      </Modal>

      <ModalDoacao
        isOpen={viewDonation}
        onClose={() => {
          setViewDonation(false)
          setSelectedDonation([])
        }}
        doacao={selectedDonation}
        onStatusChange={atualizarStatus}
        onDeleteItem={handleRemoveItem}
      />
    </div>
  );
};

export default DoacoesInstituicao;
