import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import logo from "../media/logo.png";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      setIsAuthenticated(true);
      setUser(form);
      navigate("/");
    } else {
      setIsAuthenticated(true);
      setUser(form);
      navigate("/");
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
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
