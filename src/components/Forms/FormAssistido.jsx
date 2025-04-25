import React, { useState } from 'react';

const FormAssistido = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nome: '',
    documento: '',
    telefone: '',
    cep: '',
    logradouro: '',
    nome_logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    observacoes: ''
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
      cep: '',
      logradouro: '',
      nome_logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      observacoes: ''
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">CEP</label>
            <input
              name="cep"
              type="text"
              value={form.cep}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Logradouro</label>
            <select
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione</option>
              <option value="Rua">Rua</option>
              <option value="Avenida">Avenida</option>
              <option value="Travessa">Travessa</option>
              <option value="Estrada">Estrada</option>
              <option value="Alameda">Alameda</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block font-medium">Nome do Logradouro</label>
            <input
              name="nome_logradouro"
              type="text"
              value={form.nome_logradouro}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Número</label>
            <input
              name="numero"
              type="text"
              value={form.numero}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Complemento</label>
            <input
              name="complemento"
              type="text"
              value={form.complemento}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Bairro</label>
            <input
              name="bairro"
              type="text"
              value={form.bairro}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Cidade</label>
            <input
              name="cidade"
              type="text"
              value={form.cidade}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Estado</label>
            <input
              name="estado"
              type="text"
              value={form.estado}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
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
