import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../hooks/useAuth";
import logo from "../media/logo.png";
import { connect } from "../services/api";
import { Input, SelectInput, Textarea } from "../components/Inputs/Inputs";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setIsAuthenticated, setUser } = useAuth();

  const [modo, setModo] = useState("login"); // "login" ou "registro"
  const [tipoCadastro, setTipoCadastro] = useState("doador");

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const tipoDocumentoOptions = [
    { value: "cpf", label: "CPF" },
    { value: "rg", label: "RG" },
    { value: "rne", label: "RNE" },
    { value: "crnm", label: "CRNM" },
  ];

  const [form, setForm] = useState({
    nome: "",
    nome_usuario: "",
    email: "",
    senha: "",
    telefone: "",
    tipo_documento: "",
    documento: "",
    cnpj: "",
    cep: "",
    logradouro: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    descricao: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () =>
    setForm({
      email: form.email,
      senha: form.senha,
      nome: "",
      nome_usuario: "",
      telefone: "",
      tipo_documento: "",
      documento: "",
      cnpj: "",
      cep: "",
      logradouro: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      descricao: "",
    });

  const handleLogin = async () => {
    if (!form.email || !form.senha)
      return toast.warn("Preencha o usuário e senha!");

    try {
      const response = await fetch(`${connect}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Restaura o estado salvo ou usa o estado da location
      const restoreState =
        location.state?.restoreState ||
        JSON.parse(localStorage.getItem("loginRedirectState")) ||
        {};

      // Limpa o estado salvo
      localStorage.removeItem("loginRedirectState");

      const destino =
        data.usuario.role === "instituicao" ? "/instituicao" : "/";

      // Aqui está a correção - remova a navegação duplicada
      navigate(destino, {
        state: restoreState, // Restaura o estado
      });

      const dados = {
        ...data.usuario,
        token: data.token,
        instituicao: data.instituicao ? { ...data.instituicao } : null,
      };

      // Recupera o que já está salvo
      const stored = localStorage.getItem("doar");
      const parsed = stored ? JSON.parse(stored) : {};

      // Atualiza apenas os dados de usuário
      const atualizado = {
        ...parsed,
        usuario: dados,
      };

      // Salva de volta no localStorage
      localStorage.setItem("doar", JSON.stringify(atualizado));

      setUser(dados);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message || "Erro ao fazer login.");
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    const endpoint =
      tipoCadastro === "instituicao"
        ? "instituicao/registrar"
        : "usuario/registrar";

    try {
      if (tipoCadastro === "instituicao") {
        const formData = new FormData();

        formData.append("usuario[nome]", form.nome_usuario);
        formData.append("usuario[email]", form.email);
        formData.append("usuario[senha]", form.senha);
        formData.append("usuario[tipo_documento]", form.tipo_documento);
        formData.append("usuario[documento]", form.documento);

        formData.append("instituicao[nome]", form.nome);
        formData.append("instituicao[cnpj]", form.cnpj);
        formData.append("instituicao[cep]", form.cep);
        formData.append("instituicao[logradouro]", form.logradouro);
        formData.append("instituicao[endereco]", form.endereco);
        formData.append("instituicao[numero]", form.numero);
        formData.append("instituicao[complemento]", form.complemento);
        formData.append("instituicao[bairro]", form.bairro);
        formData.append("instituicao[cidade]", form.cidade);
        formData.append("instituicao[uf]", form.uf);
        formData.append("instituicao[telefone]", form.telefone);
        formData.append("instituicao[descricao]", form.descricao);

        if (logoFile) {
          formData.append("logo", logoFile);
        }

        const response = await fetch(`${connect}/${endpoint}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const erro = await response.json();
          throw new Error(erro.message || "Erro ao registrar instituição");
        }
      } else {

        const doadorData = {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          telefone: form.telefone,
          tipo_documento: form.tipo_documento,
          documento: form.documento,
          cep: form.cep,
          logradouro: form.logradouro,
          endereco: form.endereco,
          numero: form.numero,
          complemento: form.complemento,
          bairro: form.bairro,
          cidade: form.cidade,
          uf: form.uf,
          role: "doador", 
        };

        const response = await fetch(`${connect}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doadorData),
        });

        if (!response.ok) {
          const erro = await response.json();
          throw new Error(erro.message || "Erro ao registrar doador");
        }
      }

      handleClear();
      setLogoFile(null);
      setLogoPreview(null);
      toast.success("Cadastro realizado com sucesso!");
      setModo("login");
    } catch (error) {
      toast.error(error.message || "Erro ao se registrar.");
      console.error("Erro ao se registrar:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modo === "login") {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <main className="min-h-screen py-6 flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-32 h-auto" />
      </div>

      <div className="rounded-lg w-full max-w-md space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tabs */}
          {modo === "registro" && (
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => setTipoCadastro("doador")}
                className={`pb-2 font-semibold border-b-2 ${
                  tipoCadastro === "doador"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                Sou Doador
              </button>
              <button
                type="button"
                onClick={() => setTipoCadastro("instituicao")}
                className={`pb-2 font-semibold border-b-2 ${
                  tipoCadastro === "instituicao"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600"
                }`}
              >
                Sou Instituição
              </button>
            </div>
          )}

          {/* Formulario */}
          {modo === "registro" && (
            <>
              {tipoCadastro === "doador" && (
                <>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Nome*"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                    />
                    <Input
                      label="Telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      required={false}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <SelectInput
                      label="Tipo do Documento"
                      name="tipo_documento"
                      value={form.tipo_documento}
                      onChange={handleChange}
                      options={tipoDocumentoOptions}
                      required
                    />
                    <Input
                      label="Documento*"
                      name="documento"
                      value={form.documento}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="CEP*"
                      name="cep"
                      value={form.cep}
                      onChange={handleChange}
                    />
                    <Input
                      label="Logradouro*"
                      name="logradouro"
                      value={form.logradouro}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Endereço*"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                    />
                    <Input
                      label="Numero*"
                      name="numero"
                      value={form.numero}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Complemento"
                      name="complemento"
                      value={form.complemento}
                      onChange={handleChange}
                      required={false}
                    />
                    <Input
                      label="Bairro*"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Cidade*"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleChange}
                    />
                    <Input
                      label="UF*"
                      name="uf"
                      value={form.uf}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {tipoCadastro === "instituicao" && (
                <>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo da Instituição
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview do logo"
                        className="h-16 w-16 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Sem logo</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Selecionar Logo
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF até 5MB
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Nome da Instituição"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                    />
                    <Input
                      label="CNPJ*"
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="CEP*"
                      name="cep"
                      value={form.cep}
                      onChange={handleChange}
                    />
                    <Input
                      label="Logradouro*"
                      name="logradouro"
                      value={form.logradouro}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Endereço*"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                    />
                    <Input
                      label="Numero*"
                      name="numero"
                      value={form.numero}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Complemento"
                      name="complemento"
                      value={form.complemento}
                      onChange={handleChange}
                      required={false}
                    />
                    <Input
                      label="Bairro*"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Cidade*"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleChange}
                    />
                    <Input
                      label="UF*"
                      name="uf"
                      value={form.uf}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                    />
                  </div>

                  <Textarea
                    label="Descrição"
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Digite aqui a descrição..."
                    rows={4}
                  />

                  <div className="border-b border-gray-300"></div>

                  <h1 className="text-sky-700 font-bold text-lg">Usuário</h1>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input
                      label="Nome*"
                      name="nome_usuario"
                      value={form.nome_usuario}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="tipo_documento"
                      >
                        Tipo do Documento*
                      </label>
                      <select
                        name="tipo_documento"
                        value={form.tipo_documento}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-md px-3 py-2"
                      >
                        <option value="">Selecione um tipo</option>
                        <option value="cpf">CPF</option>
                        <option value="rg">RG</option>
                        <option value="rne">RNE</option>
                        <option value="crnm">CRNM </option>
                      </select>
                    </div>
                    <Input
                      label="Documento*"
                      name="documento"
                      value={form.documento}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </>
          )}

          <Input
            label="E-mail"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Senha"
            name="senha"
            value={form.senha}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
          >
            {modo === "login" ? "Entrar" : "Registrar"}
          </button>
        </form>

        {/* Texto de login/registro */}
        <div className="text-end text-sm">
          {modo === "login" ? (
            <>
              <div className="flex items-center gap-2 justify-end">
                <p>Não tem uma conta?</p>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setModo("registro")}
                >
                  Criar conta
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 justify-end">
                <p>Já tem uma conta?</p>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setModo("login")}
                >
                  Fazer login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
