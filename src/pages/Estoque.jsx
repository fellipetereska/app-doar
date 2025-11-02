import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import TableDefault from "../components/Tables/TableDefault";
import { SearchInput } from "../components/Inputs/searchInput";
import Modal from "../components/Modals/Modal";
import FormEstoque from "../components/Forms/FormEstoque";
import { getInstituicaoId } from "../components/Auxiliares/helper";
import { connect } from "../services/api";

const Estoque = () => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [estoque, setEstoque] = useState([]);
  const [estoqueFiltrado, setEstoqueFiltrado] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Categoria", accessor: "categoria", sortable: true },
    { header: "Subcategoria", accessor: "subcategoria", sortable: true },
    { header: "Quantidade", accessor: "quantidade", sortable: true },
    {
      header: "Última Entrada",
      accessor: "data_ultima_entrada",
      sortable: true,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onEdit, setOnEdit] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchEstoque = async () => {
    try {
      const res = await fetch(
        `${connect}/estoque?instituicaoId=${instituicaoId}`
      );
      const rawData = await res.json();
      const formattedData = rawData.map(item => {
          if (item.data_ultima_entrada) {
              return {
                  ...item,
                  data_ultima_entrada: new Date(item.data_ultima_entrada).toLocaleDateString('pt-BR')
              };
          }
          return item;
      });

      const filterEstoque = formattedData.filter((item) => item.quantidade > 0);
      setEstoque(filterEstoque);
      setEstoqueFiltrado(filterEstoque);
    } catch (err) {
      console.error("Erro ao carregar o estoque.", err);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, [instituicaoId]);

  const handleEdit = (item) => {
    const originalItem = estoque.find(e => e.id === item.id);
    setIsModalOpen(true);
    setOnEdit(originalItem); 
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      setEstoqueFiltrado(estoque);
      return;
    }

    const termoMin = term.toLowerCase();

    const filtrado = estoque.filter((item) =>
      `${item.categoria} ${item.subcategoria} ${item.data_ultima_entrada}`.toLowerCase().includes(termoMin)
    );

    setEstoqueFiltrado(filtrado);
  };

  const handleAddItem = async (formData) => {
    setIsModalOpen(false);
    try {
      const dateObj = formData.data_movimentacao;
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const payload = {
        ...formData,
        data_movimentacao: formattedDate, 
        instituicao_id: instituicaoId,
      };

      const url = onEdit
        ? `${connect}/estoque/${onEdit.id}`
        : `${connect}/estoque`;

      const method = onEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao salvar item.");
      }

      toast.success(
        onEdit ? "Item atualizado!" : "Item adicionado ao estoque!"
      );
      setOnEdit(null);
      fetchEstoque(); 
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar item no estoque.");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const isoStartDate = startDate.toISOString().split("T")[0];
      const isoEndDate = endDate.toISOString().split("T")[0];

      const res = await fetch(
        `${connect}/estoque/relatorio-entradas?instituicaoId=${instituicaoId}&dataInicio=${isoStartDate}&dataFim=${isoEndDate}`
      );

      const data = await res.json();

      if (!res.ok || data.length === 0) {
        toast.warn("Nenhuma entrada encontrada para este período.");
        return;
      }

      const doc = new jsPDF();
      doc.text("Relatório de Entradas no Estoque", 14, 20);
      doc.text(
        `Período: ${startDate.toLocaleDateString(
          "pt-BR"
        )} - ${endDate.toLocaleDateString("pt-BR")}`,
        14,
        28
      );

      const tableColumn = [
        "Data",
        "Categoria",
        "Subcategoria",
        "Qtd",
        "Descrição",
      ];
      const tableRows = [];

      data.forEach((item) => {
        const itemData = [
          new Date(item.data_movimentacao).toLocaleDateString("pt-BR"),
          item.categoria,
          item.subcategoria,
          item.quantidade,
          item.descricao || "-",
        ];
        tableRows.push(itemData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
      });

      doc.save(`relatorio_entradas_${isoStartDate}_${isoEndDate}.pdf`);
      setIsReportModalOpen(false);
    } catch (err) {
      console.error("Erro ao gerar relatório.", err);
      toast.error("Erro ao gerar relatório.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-8 lg:px-10 py-4">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Estoque</h1>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 p-2 sm:p-4">
        <div className="w-full sm:flex-grow">
          <div className="w-full bg-white rounded-full py-2 px-4 sm:py-3 sm:px-8 shadow">
            <SearchInput
              placeholder="Buscar item no estoque..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 sm:justify-end justify-center">
          <button
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-8 sm:py-2 rounded-md text-sm sm:text-base"
            onClick={() => setIsReportModalOpen(true)}
          >
            Gerar Relatório
          </button>

          <button
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 sm:px-8 sm:py-2 rounded-md text-sm sm:text-base"
            onClick={() => {
              setOnEdit(null);
              setIsModalOpen(true);
            }}
          >
            + Novo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <TableDefault
          columns={columns}
          data={estoqueFiltrado}
          onEdit={handleEdit}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOnEdit(null);
        }}
        title={onEdit ? "Atualizar Item" : "Adicionar Item ao Estoque"}
        paragraph={
          onEdit
            ? "Faça as alterações e clique em 'Salvar'."
            : "Preencha o formulário para adicionar um item."
        }
      >
        <FormEstoque
          onEdit={onEdit}
          onSubmit={handleAddItem}
          instituicaoId={instituicaoId}
        />
      </Modal>

      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Gerar Relatório de Entradas"
        paragraph="Selecione o período desejado para gerar o relatório."
      >
        <div className="space-y-4 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md"
            >
              Gerar PDF
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Estoque;