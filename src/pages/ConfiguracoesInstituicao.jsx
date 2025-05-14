import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

// Componentes
import { getInstituicaoId } from '../components/Auxiliares/helper';
import { toast } from "react-toastify";
import { connect } from "../services/api";

const tabs = [
  { id: "dados", label: "Dados da Instituição" },
  { id: "usuarios", label: "Usuários" },
  { id: "categorias", label: "Categorias" },
  { id: "configuracoes", label: "Outras Configurações" },
];

export default function ConfiguracoesInstituicao() {
  const [instituicaoId, setInstituicaoId] = useState(getInstituicaoId());

  const [tabAtiva, setTabAtiva] = useState("dados");

  const [categoria, setCategoria] = useState("");
  const [subcategorias, setSubcategorias] = useState([""]);

  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [modoCadastro, setModoCadastro] = useState(false);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${connect}/categoria?instituicaoId=${instituicaoId}`);
      const data = await response.json();
      console.log("Categorias existentes:", data);
      setCategoriasExistentes(data);
    } catch (error) {
      console.error("Erro ao buscar categorias!", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const adicionarSubcategoria = () => {
    setSubcategorias([...subcategorias, ""]);
  };

  const removerSubcategoria = (index) => {
    const atualizadas = subcategorias.filter((_, i) => i !== index);
    setSubcategorias(atualizadas);
  };

  const atualizarSubcategoria = (index, valor) => {
    const atualizadas = [...subcategorias];
    atualizadas[index] = valor;
    setSubcategorias(atualizadas);
  };

  const handleSalvar = async () => {
    const payload = {
      nome: categoria.trim(),
      instituicaoId,
      subcategorias: subcategorias.map((s) => s.trim()).filter((s) => s !== "")
    };

    if (!payload.nome || payload.subcategorias.length === 0) {
      alert("Preencha a categoria e pelo menos uma subcategoria!");
      return;
    }

    try {
      const response = await fetch(`${connect}/categoria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao cadastrar");
      }

      toast.success("Categoria cadastrada com sucesso!");
      setModoCadastro(false);
      setCategoria("");
      setSubcategorias([""]);
      fetchCategorias();
    } catch (error) {
      toast.error("Erro ao cadastrar categoria.");
      console.error("Erro ao cadastrar categoria!", error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Configurações</h1>

      {/* Abas */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabAtiva(tab.id)}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${tabAtiva === tab.id
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da Aba */}
      <div className="mt-4">
        {tabAtiva === "dados" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Dados da Instituição</h2>
            <p>Formulário com nome, CNPJ, contato, etc.</p>
          </div>
        )}

        {tabAtiva === "usuarios" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Gerenciar Usuários</h2>
            <p>Lista de usuários vinculados à instituição.</p>
          </div>
        )}

        {tabAtiva === "categorias" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Categorias e Subcategorias</h2>

            {/* Alternar entre listagem e formulário */}
            {!modoCadastro ? (
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setModoCadastro(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    + Nova Categoria
                  </button>
                </div>

                {/* Lista de categorias existentes */}
                {categoriasExistentes.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoriasExistentes.map((cat, idx) => (
                      <li key={idx} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                        <p className="text-md font-semibold text-gray-800">{cat.nome}</p>
                        {cat.subcategorias.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                            {cat.subcategorias.map((sub, i) => (
                              <li key={i}>{sub}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 mt-1">Sem subcategorias</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold">Nova Categoria</h3>
                  <button
                    onClick={() => {
                      setModoCadastro(false);
                      setCategoria("");
                      setSubcategorias([""]);
                    }}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    ← Voltar para lista
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Categoria*</label>
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ex: Alimentos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategorias</label>
                  {subcategorias.map((sub, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => atualizarSubcategoria(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        placeholder={`Subcategoria ${index + 1}`}
                      />
                      {subcategorias.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerSubcategoria(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarSubcategoria}
                    className="flex items-center text-sm text-blue-600 hover:underline mt-1"
                  >
                    <Plus size={16} className="mr-1" /> Adicionar subcategoria
                  </button>
                </div>

                <button
                  onClick={handleSalvar}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            )}
          </div>
        )}

        {tabAtiva === "configuracoes" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Outras Configurações</h2>
            <p>Configurações adicionais da instituição.</p>
          </div>
        )}
      </div>
    </div>
  );
}
