import React, { useState } from 'react';

const FormAssistido = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nome: '',
    documento: '',
    telefone: '',
    endereco: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      nome: '',
      documento: '',
      telefone: '',
      endereco: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <div>
          <label className="block font-medium">Nome *</label>
          <input
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Documento *</label>
          <input
            name="documento"
            type="text"
            value={form.documento}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Telefone</label>
          <input
            name="telefone"
            type="text"
            value={form.telefone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Endereço */}
        <div>
          <label className="block font-medium">Endereco</label>
          <input
            name="endereco"
            type="text"
            value={form.endereco}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-sm text-white font-bold px-6 py-2 rounded"
        >
          Cadastrar Assistido
        </button>
      </div>
    </form>
  );
};

export default FormAssistido;
