import React, { useState } from 'react';

const FormEstoque = ({ onSubmit }) => {
  const [form, setForm] = useState({
    categoria: '',
    subcategoria: '',
    descricao: '',
    quantidade: '',
    doador: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      categoria: '',
      subcategoria: '',
      descricao: '',
      quantidade: '',
      doador: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <div>
          <label className="block font-medium">Categoria</label>
          <select
            name="categoria"
            type="text"
            value={form.categoria}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione uma categoria</option>
            <option value="eletrodomesticos">Eletrodomésticos</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">SubCategoria</label>
          <select
            name="subcategoria"
            type="text"
            value={form.subcategoria}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecione uma subcategoria</option>
            <option value="televisao">Televisão</option>
            <option value="geladeira">Geladeira</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Descrição</label>
          <input
            name="descricao"
            type="text"
            value={form.descricao}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Quantidade</label>
          <input
            name="quantidade"
            type="number"
            value={form.quantidade}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Doador</label>
          <input
            name="doador"
            type="text"
            value={form.doador}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-sm text-white font-bold px-6 py-2 rounded"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
};

export default FormEstoque;
