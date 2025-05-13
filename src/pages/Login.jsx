import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../hooks/useAuth";

import logo from "../media/logo.png";
import { connect } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated, setUser } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (!form.email || !form.senha) toast.warn("Preencha o usuário e senha!");

      const response = await fetch(`${connect}/usuario/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login");
      }

      const data = await response.json();

      if (data.usuario.role === "doador") {
        navigate("/");
      } else if (data.usuario.role === "instituicao") {
        navigate("/instituicao");
      }

      const dados = {
        ...data.usuario,
        ...data.dados,
        token: data.token
      };

      localStorage.setItem("user", JSON.stringify(dados));
      setUser(dados);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(`Erro ao fazer login: ${error}`);
      toast.error(`Erro ao fazer login!`);
    }
  };

  const handleRegister = async () => {
    try {
      if (!form.email || !form.senha || !form.nome || !form.documento || !form.endereco) toast.warn("Preencha todos os dados!");

      const response = await fetch(`${connect}/usuario/registrar/doador`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.message || 'Erro ao fazer cadastro');
      }

      toast.success("Cadastro realizado com sucesso!");
      setIsLogin(true);

    } catch (error) {
      console.error(`Erro ao se registrar: ${error}`);
      toast.error(`Erro ao se registrar. ${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Logo fora do card */}
      <div className="mb-6">
        <img src={logo} alt="Logo" className="w-32 h-auto" />
      </div>

      {/* Card do formulário */}
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-2 font-semibold border-b-2 ${isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 font-semibold border-b-2 ${!isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
              }`}
          >
            Registro
          </button>
        </div>

        {/* Formulário */}
        <form className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar" onSubmit={handleSubmit}>
          {!isLogin && (
            // Nome
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isLogin && (
            <>
              <div className="md:grid md:grid-cols-2 md:gap-4">
                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Documento</label>
                  <input
                    type="text"
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition"
          >
            {isLogin ? "Entrar" : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
