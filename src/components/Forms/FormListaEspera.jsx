import React, { useEffect, useState } from 'react';
import { connect } from '../../services/api';
import { toast } from 'react-toastify';

const FormListaEspera = ({ onSuccess }) => {
  const [assistidos, setAssistidos] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [itens, setItens] = useState([{ descricao: '' }]);

  const fetchAssistidos = async () => {
    try {
      const res = await fetch(`${connect}/assistido`);
      const data = await res.json();
      const disponiveis = data.filter(a => a.status_lista_espera === 0);
      setAssistidos(disponiveis);
    } catch (err) {
      toast.error('Erro ao carregar assistidos');
    }
  };

  useEffect(() => {
    fetchAssistidos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId || itens.some(i => !i.descricao.trim())) {
      toast.warn('Preencha todos os campos');
      return;
    }

    try {
      // Atualizar status do assistido
      await fetch(`${connect}/assistido/${selectedId}/status`, { method: 'PATCH' });

      // Salvar os itens (supondo que vá implementar no backend)
      await fetch(`${connect}/assistido/${selectedId}/necessidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itens }),
      });

      toast.success("Assistido adicionado à lista de espera com sucesso!");
      onSuccess();

    } catch (err) {
      toast.error("Erro ao adicionar à lista de espera");
    }
  };

  const handleItemChange = (i, value) => {
    const novos = [...itens];
    novos[i].descricao = value;
    setItens(novos);
  };

  const addItemField = () => setItens([...itens, { descricao: '' }]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Selecionar Assistido:</label>
        <select
          className="w-full border px-3 py-2 rounded-md"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          {assistidos.map(a => (
            <option key={a.id} value={a.id}>
              {a.nome} - {a.documento}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Itens Necessários:</label>
        {itens.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item.descricao}
            placeholder={`Item ${index + 1}`}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="w-full mb-2 border px-3 py-2 rounded-md"
          />
        ))}
        <button
          type="button"
          onClick={addItemField}
          className="text-sky-600 text-sm hover:underline"
        >
          + Adicionar outro item
        </button>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default FormListaEspera;
