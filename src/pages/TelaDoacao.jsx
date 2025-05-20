import React, { useEffect, useState } from 'react';
import { connect } from '../services/api';
import { toast } from 'react-toastify';
import TableDefault from '../components/Tables/TableDefault';
import Modal from '../components/Modals/Modal';
import NewDonation from '../components/NewDonation';
import { getInstituicaoId } from '../components/Auxiliares/helper';
import FiltroDoacoes from '../components/FiltroDoacoes';
import { ListFilter } from 'lucide-react';

const DoacoesInstituicao = () => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [doacoes, setDoacoes] = useState([]);
  const [isDonationCreate, setIsDonationCreate] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filtros, setFiltros] = useState({
    status: '',
    assistidoId: '',
    data: '',
    listaAssistidos: []
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Descrição', accessor: 'descricao' },
    { header: 'Quantidade', accessor: 'quantidade' },
    { header: 'Status', accessor: 'status' },
    { header: 'Assistido', accessor: 'assistido_nome' },
  ];

  const buscarDoacoes = async () => {
    try {
      const params = {};

      if (filtros.status) params.status = filtros.status;
      if (filtros.assistidoId) params.assistidoId = filtros.assistidoId;
      if (filtros.data) params.data = filtros.data;

      const query = new URLSearchParams(params).toString();

      const res = await fetch(`${connect}/doacao/instituicao/${instituicaoId}?${query}`);
      const data = await res.json();
      setDoacoes(data);
    } catch (err) {
      console.error('Erro ao buscar doações.');
    }
  };

  const carregarAssistidos = async () => {
    try {
      const res = await fetch(`${connect}/assistido?instituicaoId=${instituicaoId}`);
      const data = await res.json();
      setFiltros((prev) => ({ ...prev, listaAssistidos: data }));
    } catch (err) {
      console.error('Erro ao carregar assistidos.');
    }
  };

  useEffect(() => {
    carregarAssistidos();
    buscarDoacoes();
  }, []);

  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 space-y-4">
      {!isDonationCreate ? (
        <>
          <div>
            <div className='flex justify-between items-center'>
              <h1 className="text-2xl font-bold mb-2 text-sky-700">Doações da Instituição</h1>

              <div className={`bg-white shadow p-2 rounded cursor-pointer ${isFilterOpen ? 'shadow-none rounded-b-none' : ''}`} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <ListFilter />
              </div>
            </div>
            {/* Filtros */}
            {isFilterOpen && (
              <div className={`bg-white p-4 rounded-md ${isFilterOpen ? 'rounded-tr-none' : ''}`}>
                <div className="flex flex-col md:flex-row flex-wrap items-center">
                  {/* Status */}
                  <div className="flex flex-col w-full md:w-1/3 px-3">
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
                  <div className="flex flex-col w-full md:w-1/3 px-3">
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
                  <div className="flex flex-col w-full md:w-1/3 px-3">
                    <label className="text-sm font-medium mb-1">Data (a partir de)</label>
                    <input
                      type="date"
                      name="data"
                      value={filtros.data}
                      onChange={handleChangeFilter}
                      className="border rounded px-3 py-2"
                    />
                  </div>

                </div>

                {/* Botão */}
                <div className="flex justify-end px-3 mt-2">
                  <button
                    onClick={buscarDoacoes}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Botão Nova Doação */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsDonationCreate(true)}
              className={` text-white px-6 py-2 rounded shadow bg-sky-600 hover:bg-sky-700`}
            >
              Criar Doação
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-bold mb-2 text-sky-700">Criar Doação</h1>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDonationCreate(false)}
                className={` text-white px-6 py-2 rounded shadow bg-red-600 hover:bg-red-700`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      {isDonationCreate ? (
        <>
          <NewDonation
            onSuccess={() => {
              setIsDonationCreate(false);
              buscarDoacoes();
            }}
            onClose={() => setIsDonationCreate(false)}
          />
        </>
      ) : (
        <>
          {/* Tabela de Doações */}
          <TableDefault data={doacoes} columns={columns} />
        </>
      )}


    </div>
  );
};

export default DoacoesInstituicao;
