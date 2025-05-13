import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../hooks/useAuth";
import logo from "../media/logo.png";
import { connect } from "../services/api";

const Input = ({ label, name, value, onChange, required = true }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={name === "senha" ? "password" : "text"}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
    />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuth();

  const [modo, setModo] = useState("login"); // "login" ou "registro"
  const [tipoCadastro, setTipoCadastro] = useState("doador");

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
    descricao: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () => setForm({
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
    descricao: ""
  });

  const handleLogin = async () => {
    console.log(form);
    if (!form.email || !form.senha) return toast.warn("Preencha o usuário e senha!");

    try {
      const response = await fetch(`${connect}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, senha: form.senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      const destino = data.usuario.role === "instituicao" ? "/instituicao" : "/";
      navigate(destino);


      const dados = {
        ...data.usuario,
        token: data.token,
        instituicao: data.instituicao ? { ...data.instituicao } : null
      };


      localStorage.setItem("user", JSON.stringify(dados));
      setUser(dados);
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message || "Erro ao fazer login.");
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const handleRegister = async () => {
    // const requiredFields = ["nome", "email", "senha", "telefone", "documento", "endereco"];
    // const missing = requiredFields.some((f) => !form[f]);
    // if (missing) return toast.warn("Preencha todos os dados!");

    const endpoint = tipoCadastro === "instituicao" ? "registrar/instituicao" : "registrar/doador";

    const newData = tipoCadastro === "instituicao" ? {
      usuario: {
        email: form.email,
        senha: form.senha,
        tipo_documento: form.tipo_documento,
        documento: form.documento
      },
      instituicao: {
        nome: form.nome,
        cnpj: form.documento,
        telefone: form.telefone,
        cep: form.cep,
        logradouro: form.logradouro,
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        descricao: form.descricao
      }
    } : {
      ...form,
      role: tipoCadastro
    };

    try {
      const response = await fetch(`${connect}/usuario/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      });

      if (!response.ok) {
        const erro = await response.json();
        console.log(erro);
        throw new Error(erro.message || "Erro ao registrar");
      }

      handleClear();

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
                className={`pb-2 font-semibold border-b-2 ${tipoCadastro === "doador" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"}`}
              >
                Sou Doador
              </button>
              <button
                type="button"
                onClick={() => setTipoCadastro("instituicao")}
                className={`pb-2 font-semibold border-b-2 ${tipoCadastro === "instituicao" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"}`}
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
                    <Input label="Nome*" name="nome" value={form.nome} onChange={handleChange} />
                    <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required={false} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="tipo_documento">Tipo do Documento*</label>
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
                    <Input label="Documento*" name="documento" value={form.documento} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="CEP*" name="cep" value={form.cep} onChange={handleChange} />
                    <Input label="Logradouro*" name="logradouro" value={form.logradouro} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Endereço*" name="endereco" value={form.endereco} onChange={handleChange} />
                    <Input label="Numero*" name="numero" value={form.numero} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Complemento" name="complemento" value={form.complemento} onChange={handleChange} required={false} />
                    <Input label="Bairro*" name="bairro" value={form.bairro} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Cidade*" name="cidade" value={form.cidade} onChange={handleChange} />
                    <Input label="UF*" name="uf" value={form.uf} onChange={handleChange} />
                  </div>
                </>
              )}

              {tipoCadastro === "instituicao" && (
                <>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Nome da Instituição" name="nome" value={form.nome} onChange={handleChange} />
                    <Input label="CNPJ*" name="cnpj" value={form.cnpj} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="CEP*" name="cep" value={form.cep} onChange={handleChange} />
                    <Input label="Logradouro*" name="logradouro" value={form.logradouro} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Endereço*" name="endereco" value={form.endereco} onChange={handleChange} />
                    <Input label="Numero*" name="numero" value={form.numero} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Complemento" name="complemento" value={form.complemento} onChange={handleChange} required={false} />
                    <Input label="Bairro*" name="bairro" value={form.bairro} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Cidade*" name="cidade" value={form.cidade} onChange={handleChange} />
                    <Input label="UF*" name="uf" value={form.uf} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
                  </div>
                  <div className="w-full">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      name="descricao"
                      id="descricao"
                      rows="4"
                      className="mt-1 w-full rounded-md px-3 py-2 focus:outline-none focus:ring-1 min-h-20 focus:ring-sky-500 resize-y"
                      placeholder="Digite aqui a descrição..."
                    />
                  </div>

                  <div className="border-b border-gray-300"></div>

                  <h1 className="text-sky-700 font-bold text-lg">Usuário</h1>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <Input label="Nome*" name="nome_usuario" value={form.nome_usuario} onChange={handleChange} />
                  </div>
                  <div className="w-full flex itens-center justify-between gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="tipo_documento">Tipo do Documento*</label>
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
                    <Input label="Documento*" name="documento" value={form.documento} onChange={handleChange} />
                  </div>
                </>
              )}
            </>
          )}

          <Input label="E-mail" name="email" value={form.email} onChange={handleChange} />
          <Input label="Senha" name="senha" value={form.senha} onChange={handleChange} />

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
    </main >
  );
};

export default Login;