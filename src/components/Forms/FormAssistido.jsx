import React, { useState } from 'react';
import { Input, SelectInput } from '../Inputs/Inputs';

const FormAssistido = ({ onSubmit }) => {
  const [form, setForm] = useState({
    nome: '',
    tipo_documento: '',
    documento: '',
    cep: '',
    endereco: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    latitude: 0,
    longitude: 0,
  });
  const tipoDocumentoOptions = [
    { value: 'cpf', label: 'CPF' },
    { value: 'rg', label: 'RG' },
    { value: 'rne', label: 'RNE' },
    { value: 'crnm', label: 'CRNM' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      nome: '',
      tipo_documento: '',
      documento: '',
      telefone: '',
      cep: '',
      endereco: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      latitude: 0,
      longitude: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar py-2">
        <div className="w-full flex itens-center justify-between gap-4">
          <Input label="Nome*" name="nome" value={form.nome} onChange={handleChange} />
          <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required={false} />
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
