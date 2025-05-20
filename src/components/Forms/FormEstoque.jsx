import React, { useEffect, useState } from 'react';
import { connect } from '../../services/api';

import { Input, SelectInput, Textarea } from '../Inputs/Inputs';
import { toast } from 'react-toastify';

const FormEstoque = ({ onSubmit, instituicaoId, onEdit }) => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    categoria_id: '',
    subcategoria_id: '',
    descricao: '',
    quantidade: '',
    instituicao_id: ''
  });

  const fetchCategorias = async () => {
    const res = await fetch(`${connect}/categoria?id=${instituicaoId}`);
    const data = await res.json();
    setCategorias(data);
  };

  useEffect(() => {
    fetchCategorias();
  }, [instituicaoId]);

  useEffect(() => {
    if (onEdit) {
      setForm(onEdit);
    }
  }, [onEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      categoria_id: '',
      subcategoria_id: '',
      descricao: '',
      quantidade: '',
      instituicao_id: ''
    });
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4 h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <SelectInput
          label="Categoria"
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          required
          disable={onEdit?.categoria_id}
          options={categorias && categorias.map((categoria) => ({
            value: categoria.id,
            label: categoria.nome
          }))}
          placeholder="Selecione uma categoria"
        />

        <SelectInput
          label="Subcategoria"
          name="subcategoria_id"
          value={form.subcategoria_id}
          onChange={handleChange}
          disable={!form.categoria_id || onEdit?.subcategoria_id}
          required
          options={
            (categorias && categorias.find(c => c.id === parseInt(form.categoria_id))?.subcategorias || []).map((s) => ({
              value: s.id,
              label: s.nome
            }))
          }
          placeholder="Selecione uma subcategoria"
        />

        <Input
          label="Quantidade*"
          name="quantidade"
          type="number"
          value={form.quantidade}
          min={onEdit?.quantidade}
          onChange={handleChange}
        />

        <Textarea
          label="Descrição"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Digite aqui a descrição..."
          rows={4}
        />
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
