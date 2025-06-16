import { useEffect, useState } from "react";
import { connect } from "../services/api";
import TableDefault from "../components/Tables/TableDefault";
import Modal from "../components/Modals/Modal";
import NewDonation from "../components/NewDonation";
import {
  formatarDocumento,
  formatarEndereco,
  formatarTelefone,
  getInstituicaoId,
  formatarDataIso,
} from "../components/Auxiliares/helper";
import { ListFilter, Plus } from "lucide-react";
import ToolTip from "../components/Auxiliares/ToolTip";
import ModalDoacao from "../components/Modals/ModalDoacao";
import { SelectSearch } from "../components/Inputs/Inputs";

const DoacoesInstituicao = () => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [assistidos, setAssistidos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDonation, setViewDonation] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    status: "pendente",
    assistidoId: "",
    data: "",
    listaAssistidos: [],
    tipo_entrega: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
      if (window.innerWidth <= 768 && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFilterOpen]);

  const legenda = [
    { cor: "bg-yellow-400", texto: "Pendente" },
    { cor: "bg-green-500", texto: "Finalizada" },
    { cor: "bg-gray-400", texto: "Cancelada" },
  ];

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Data", accessor: "data", sortable: true },
    { header: "Assitido", accessor: "nome_assistido", sortable: true },
    { header: "Observação", accessor: "observacao" },
    { header: "Tipo", accessor: "tipo_entrega", sortable: true },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-2 justify-center">
          <span
            className={`w-3 h-3 rounded-full ${
              value === "pendente"
                ? "bg-yellow-400"
                : value === "finalizada"
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          ></span>
        </span>
      ),
    },
  ];

  const fetchAssistidos = async () => {
    try {
      const queryParams = new URLSearchParams({
        instituicaoId: instituicaoId,
      }).toString();
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
      console.error("Erro ao buscar assistidos:", error);
    }
  };

  const fetchEstoque = async () => {
    try {
      const res = await fetch(
        `${connect}/estoque?instituicaoId=${instituicaoId}`
      );
      const data = await res.json();
      const filterEstoque = data.filter((item) => item.quantidade > 0);
      setEstoque(filterEstoque);
    } catch (err) {
      console.error("Erro ao buscar doações.");
    }
  };

  const buscarDoacoes = async () => {
    try {
      const params = {};

      if (filtros.status) params.status = filtros.status;
      if (filtros.tipo_entrega) params.tipo_entrega = filtros.tipo_entrega;
      if (filtros.assistidoId) params.assistidoId = filtros.assistidoId;
      if (filtros.data) params.data = filtros.data;

      const query = new URLSearchParams(params).toString();

      const res = await fetch(
        `${connect}/entregas/instituicao/${instituicaoId}?${query}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erro ao buscar doações.");
      }

      const dadosFormatados = data.map((item) => ({
        ...item,
        data: formatarDataIso(item.data),
      }));

      setDoacoes(dadosFormatados);
    } catch (err) {
      console.error("Erro ao buscar doações.", err.message);
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
  };

  const handleEdit = async (item) => {
    setViewDonation(true);
    setSelectedDonation(item);
  };

  const atualizarStatus = async (id, status) => {
    try {
      const res = await fetch(`${connect}/entregas/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Erro ao atualizar o status da entrega."
        );
      }

      buscarDoacoes();
    } catch (err) {
      console.error("Erro ao atualizar o status da entrega", err.message);
    }
  };

  useEffect(() => {
    loadScreen();
  }, []);

  const handleChangeFilter = (e) => {
    if (!e) {
      return;
    }

    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await fetch(`${connect}/entregas/remover_item?${itemId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao remover item.");
      }

      buscarDoacoes();
    } catch (error) {
      console.error("Erro ao remover item:", error.message);
    }
  };

 const renderFiltros = () => (
    <div className="bg-white p-4 rounded-md shadow-md space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Filtros</h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={filtros.status}
          onChange={handleChangeFilter}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Tipo de Entrega</label>
        <select
          name="tipo_entrega"
          value={filtros.tipo_entrega}
          onChange={handleChangeFilter}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos</option>
          <option value="retirar">Retirar</option>
          <option value="entregar">Entregar</option>
        </select>
      </div>

      <div className="flex flex-col">
        <SelectSearch
          data={assistidos}
          onSelect={handleChangeFilter}
          placeholder="Selecione um Assistido"
          label="Assistido"
          required
          name="selected_assistido"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Data</label>
        <input
          type="date"
          name="data"
          value={filtros.data}
          onChange={handleChangeFilter}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="pt-2 border-t">
        <button
          onClick={buscarDoacoes}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2 text-sky-700">
            Doações da Instituição
          </h1>
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-1 justify-end">
              <ToolTip text="Nova Doação" position={"left"}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white px-6 py-2 rounded shadow bg-sky-600 hover:bg-sky-700"
                >
                  <Plus />
                </button>
              </ToolTip>
            </div>
            
            {isDesktop && (
              <ToolTip text="Filtros" position={"bottom"}>
                <div
                  className={`bg-white shadow p-2 rounded cursor-pointer ${
                    isFilterOpen ? "shadow-none rounded-b-none" : ""
                  }`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <ListFilter />
                </div>
              </ToolTip>
            )}
          </div>
        </div>
      </div>

      {/* Filtros Mobile */}
      {!isDesktop && (
        <div className="px-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-white shadow p-2 rounded w-full justify-center mb-2"
          >
            <ListFilter size={16} />
            <span>Filtros</span>
          </button>
          {isFilterOpen && renderFiltros()}
        </div>
      )}

      <div className="flex-1 overflow-hidden custom-scrollbar p-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Tabela */}
          <div
            className={`${
              isDesktop && isFilterOpen ? "col-span-9" : "col-span-12"
            } transition-all overflow-auto`}
          >
            <TableDefault
              data={doacoes}
              columns={columns}
              isLoading={loading}
              legenda={legenda}
              onEdit={(item) => handleEdit(item)}
            />
          </div>

          {/* Filtros Desktop */}
          {isDesktop && isFilterOpen && (
            <div className="col-span-3 overflow-y-auto">
              {renderFiltros()}
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
          setViewDonation(false);
          setSelectedDonation([]);
        }}
        doacao={selectedDonation}
        onStatusChange={atualizarStatus}
      />
    </div>
  );
};

export default DoacoesInstituicao;