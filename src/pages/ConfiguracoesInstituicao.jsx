import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";

// Componentes
import { getInstituicaoId } from '../components/Auxiliares/helper';
import { toast } from "react-toastify";
import { connect } from "../services/api";
import Tooltip from "../components/Auxiliares/ToolTip";
import useAuth from "../hooks/useAuth";
import { FiEdit } from "react-icons/fi";
import { Input, SelectInput, Textarea } from "../components/Inputs/Inputs";

const tabs = [
  { id: "instituicao", label: "Dados da Instituição" },
  { id: "usuarios", label: "Usuários" },
  { id: "categorias", label: "Categorias" },
  { id: "configuracoes", label: "Outras Configurações" },
];

export default function ConfiguracoesInstituicao() {
  const { user } = useAuth();
  const [instituicaoId, setInstituicaoId] = useState(getInstituicaoId());

  const [tabAtiva, setTabAtiva] = useState("instituicao");

  // Instituição
  const [instituicao, setInstituicao] = useState([]);
  const [formInstituicao, setFormInstituicao] = useState({});
  const [isEditingInstituicao, setIsEditingInstituicao] = useState(false);

  // Usuários
  const [usuarios, setUsuarios] = useState([]);
  const [isEditingUsuario, setIsEditingUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modoCadastroUsuario, setModoCadastroUsuario] = useState(false);
  const [formUsuario, setFormUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    role: 'instituicao',
    cep: '',
    logradouro: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    tipo_documento: '',
    documento: '',
    tipo: '',
    status: 1,
    instituicao_id: getInstituicaoId()
  });

  const tipoDocumentoOptions = [
    { value: 'cpf', label: 'CPF' },
    { value: 'rg', label: 'RG' },
    { value: 'rne', label: 'RNE' },
    { value: 'crnm', label: 'CRNM' },
  ];
  const tipoUsuarioOptions = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'colaborador', label: 'Colaborador' },
  ];

  // Categorias
  const [categoriasExpandidas, setCategoriasExpandidas] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [subcategorias, setSubcategorias] = useState([""]);
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(null);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [modoCadastro, setModoCadastro] = useState(false);

  const fetchInstituicao = async () => {
    try {
      const res = await fetch(`${connect}/instituicao/${instituicaoId}`);
      const data = await res.json();
      console.log(data);
      setInstituicao(data);
      setFormInstituicao({
        id: data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cep: data.cep,
        logradouro: data.logradouro,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        tipo_documento: data.tipo_documento,
        cnpj: data.cnpj,
        descricao: data.descricao
      });
    } catch (err) {
      toast.error("Erro ao carregar instituição");
      console.error("Erro ao carregar instituição. Status: ", err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${connect}/usuario/instituicao?instituicaoId=${instituicaoId}`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      toast.error("Erro ao carregar usuários");
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${connect}/categoria?id=${instituicaoId}`);
      const data = await response.json();
      setCategoriasExistentes(data);
    } catch (error) {
      console.error("Erro ao buscar categorias!", error);
    }
  };

  useEffect(() => {
    switch (tabAtiva) {
      case 'instituicao':
        fetchInstituicao();
        break;
      case 'usuarios':
        fetchUsuarios();
        break;
      case "categorias":
        fetchCategorias();
        break;
      default:
        break;
    }
  }, [tabAtiva, user]);

  // Instituição
  const handleChangeInstituicao = (e) => {
    setIsEditingInstituicao(true);
    setFormInstituicao({ ...formInstituicao, [e.target.name]: e.target.value });;
  };

  const handleUpdateInstituicao = async () => {
    try {
      const response = await fetch(`${connect}/instituicao/${instituicaoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInstituicao)
      });
      const data = await response.json();
      toast.success("Instituição atualizada com sucesso!");
      setInstituicao(data);
      setIsEditingInstituicao(false);
      fetchInstituicao();
    } catch (error) {
      console.error("Erro ao atualizar instituição!", error);
    }
  };

  const handleCancelEditingInstituicao = () => {
    fetchInstituicao();
    setIsEditingInstituicao(false);
  };

  // Usuarios
  const editarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setFormUsuario(prev => ({
      ...prev,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      senha: '',
      telefone: usuario.telefone,
      tipo: usuario.tipo,
      tipo_documento: usuario.tipo_documento,
      documento: usuario.documento
    }));
  };

  const handleChangeUsuario = (e) => {
    setFormUsuario({ ...formUsuario, [e.target.name]: e.target.value });;
  };

  const salvarEdicaoUsuario = async () => {
    try {
      console.log("Enviando:", JSON.stringify(formUsuario, null, 2));
      const res = await fetch(`${connect}/usuario/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formUsuario, senha: usuarioEditando.senha })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Usuário atualizado com sucesso!");
      setUsuarioEditando(null);
      fetchUsuarios();
    } catch (err) {
      toast.error("Erro ao atualizar usuário");
      console.error(err);
    }
  };

  const salvarNovoUsuario = async () => {
    try {
      const res = await fetch(`${connect}/usuario/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formUsuario)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Usuário cadastrado com sucesso!");
      setFormUsuario({ nome: '', email: '', senha: '', telefone: '', role: 'instituicao', cep: '', logradouro: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', tipo_documento: '', documento: '', tipo: '', status: 1, instituicao_id: getInstituicaoId() });
      setModoCadastroUsuario(false);
      fetchUsuarios();
    } catch {
      toast.error("Erro ao cadastrar usuário");
    }
  };

  // Categorias
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

    const metodo = categoriaSelecionadaId ? "PUT" : "POST";
    const url = categoriaSelecionadaId
      ? `${connect}/categoria/${categoriaSelecionadaId}`
      : `${connect}/categoria`;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar categoria");
      }

      toast.success(`Categoria ${categoriaSelecionadaId ? "atualizada" : "cadastrada"} com sucesso!`);
      setModoCadastro(false);
      setCategoria("");
      setSubcategorias([""]);
      setCategoriaSelecionadaId(null);
      fetchCategorias();
    } catch (error) {
      toast.error("Erro ao salvar categoria.");
      console.error("Erro ao salvar categoria!", error);
    }
  };

  const editarCategoria = (cat) => {
    setCategoria(cat.nome);
    setSubcategorias(cat.subcategorias.map(s => s.nome));
    setCategoriaSelecionadaId(cat.id);
    setModoCadastro(true);
  };

  const toggleCategoria = (id) => {
    setCategoriasExpandidas((prev) =>
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
    );
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
        {tabAtiva === "instituicao" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Dados da Instituição</h2>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="col-span-2">
                <Input label="Nome da Instituição" name="nome" value={formInstituicao.nome} onChange={handleChangeInstituicao} />
              </div>
              <Input label="CNPJ*" name="cnpj" value={formInstituicao.cnpj} onChange={handleChangeInstituicao} />
              <Input label="Telefone" name="telefone" value={formInstituicao.telefone} onChange={handleChangeInstituicao} />
              <Input label="CEP*" name="cep" value={formInstituicao.cep} onChange={handleChangeInstituicao} />
              <Input label="Logradouro*" name="logradouro" value={formInstituicao.logradouro} onChange={handleChangeInstituicao} />
              <Input label="Endereço*" name="endereco" value={formInstituicao.endereco} onChange={handleChangeInstituicao} />
              <Input label="Numero*" name="numero" value={formInstituicao.numero} onChange={handleChangeInstituicao} />
              <Input label="Complemento" name="complemento" value={formInstituicao.complemento} onChange={handleChangeInstituicao} required={false} />
              <Input label="Bairro*" name="bairro" value={formInstituicao.bairro} onChange={handleChangeInstituicao} />
              <Input label="Cidade*" name="cidade" value={formInstituicao.cidade} onChange={handleChangeInstituicao} />
              <Input label="UF*" name="uf" value={formInstituicao.uf} onChange={handleChangeInstituicao} />
            </div>
            <Textarea
              label="Descrição"
              name="descricao"
              value={formInstituicao.descricao}
              onChange={handleChangeInstituicao}
              placeholder="Digite aqui a descrição..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-2">
              {isEditingInstituicao && (
                <>
                  <button className="text-sm text-gray-500 hover:underline" onClick={handleCancelEditingInstituicao}>Cancelar</button>
                </>
              )}
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" onClick={handleUpdateInstituicao}>Salvar</button>
            </div>
          </div>
        )}


        {tabAtiva === "usuarios" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Usuários da Instituição</h2>
              <button onClick={() => setModoCadastroUsuario(true)} className="text-sm bg-sky-600 text-white px-4 py-2 rounded">+ Novo</button>
            </div>

            {modoCadastroUsuario ? (
              <div className="border p-4 bg-gray-50 rounded mb-6">
                <h3 className="font-semibold mb-2">Cadastrar Novo Usuário</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Nome*" name="nome" value={formUsuario.nome} onChange={handleChangeUsuario} />
                  <SelectInput label="Permissão" name="tipo" value={formUsuario.tipo} onChange={handleChangeUsuario} options={tipoUsuarioOptions} />
                  <Input label="Senha*" name="senha" value={formUsuario.senha} onChange={handleChangeUsuario} />
                  <Input label="Telefone" name="telefone" value={formUsuario.telefone} onChange={handleChangeUsuario} />
                  <SelectInput label="Tipo de Documento" name="tipo_documento" value={formUsuario.tipo_documento} onChange={handleChangeUsuario} options={tipoDocumentoOptions} />
                  <Input label="Documento" name="documento" value={formUsuario.documento} onChange={handleChangeUsuario} />
                  <Input label="Email*" name="email" value={formUsuario.email} onChange={handleChangeUsuario} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setModoCadastroUsuario(false)} className="text-sm text-gray-600 hover:underline">Cancelar</button>
                  <button onClick={salvarNovoUsuario} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">Salvar</button>
                </div>
              </div>
            ) : (
              <>
                {usuarioEditando && (
                  <div className="border p-4 mt-4 bg-gray-50 rounded shadow mb-4">
                    <h3 className="font-semibold mb-2">Editar Usuário</h3>
                    <div className="w-full flex itens-center justify-between gap-4 mb-2">
                      <Input label="Nome*" name="nome" value={formUsuario.nome} onChange={handleChangeUsuario} />
                      <SelectInput
                        label="Permissão"
                        name="tipo"
                        value={formUsuario.tipo}
                        onChange={handleChangeUsuario}
                        options={tipoUsuarioOptions}
                        required
                      />
                    </div>
                    <div className="w-full flex itens-center justify-between gap-4">
                      <SelectInput
                        label="Tipo do Documento"
                        name="tipo_documento"
                        value={formUsuario.tipo_documento}
                        onChange={handleChangeUsuario}
                        options={tipoDocumentoOptions}
                        required
                      />
                      <Input label="Documento*" name="documento" value={formUsuario.documento} onChange={handleChangeUsuario} />
                      <Input label="E-mail" name="email" value={formUsuario.email} onChange={handleChangeUsuario} />
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                      <button onClick={() => setUsuarioEditando(null)} className="text-sm text-gray-500 hover:underline">Cancelar</button>
                      <button onClick={salvarEdicaoUsuario} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm">Salvar</button>
                    </div>
                  </div>
                )}
                {usuarios.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum usuário cadastrado.</p>
                ) : (
                  <ul className="space-y-4">
                    {usuarios.length > 0 && usuarios.map((u) => (
                      <li key={u.id} className="p-3 text-sm bg-white divide-y border rounded-md shadow-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{u.nome}</p>
                            <p className="text-gray-500 text-xs">{u.email} — {u.tipo}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => editarUsuario(u)}
                            >
                              <FiEdit size={20} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}

                  </ul>
                )}
              </>
            )}


          </div>
        )}

        {tabAtiva === "categorias" && (
          <div>

            {/* Alternar entre listagem e formulário */}
            {!modoCadastro ? (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold mb-4">Categorias e Subcategorias</h2>
                  <div className="flex justify-end mb-4">
                    <Tooltip text={"Adicionar"} position="top">
                      <button
                        onClick={() => setModoCadastro(true)}
                        className="bg-blue-600 text-white px-4 py-2 font-bold text-sm rounded hover:bg-blue-700"
                      >
                        + Nova Categoria
                      </button>
                    </Tooltip>
                  </div>
                </div>

                {/* Lista de categorias existentes */}
                {categoriasExistentes.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-4">
                    {categoriasExistentes.map((cat, idx) => (
                      <li key={idx} className="border rounded-md p-4 shadow-sm bg-white">
                        <div className="flex items-center justify-between gap-1">
                          <button
                            onClick={() => toggleCategoria(cat.id)}
                            className="text-left w-full text-md font-semibold text-gray-800"
                          >
                            {cat.nome}
                          </button>
                          <Tooltip text={"Editar"} position="top">
                            <button className="text-blue-600 hover:text-blue-800" onClick={() => editarCategoria(cat)}>
                              <Edit2 size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip text={categoriasExpandidas.includes(cat.id) ? "Recolher" : "Expandir"} position="top">
                            <button className="text-gray-600 hover:text-gray-800" onClick={() => toggleCategoria(cat.id)}>
                              {categoriasExpandidas.includes(cat.id) ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </button>
                          </Tooltip>
                        </div>
                        {categoriasExpandidas.includes(cat.id) && (
                          cat.subcategorias.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                              {cat.subcategorias.map((sub, i) => (
                                <li key={i}>{sub.nome}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1">Sem subcategorias</p>
                          )
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
