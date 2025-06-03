// FormListaEspera.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { connect } from '../../services/api';
import { getInstituicaoId } from '../Auxiliares/helper';
import FormItem from './FormItem';
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const ListaEspera = ({ onSuccess, onEdit }) => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [assistidos, setAssistidos] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [itens, setItens] = useState([]);
  const [mostrarFormItem, setMostrarFormItem] = useState(false);
  const [ordemStatusAsc, setOrdemStatusAsc] = useState(true);

  const fetchItens = async (id) => {
    try {
      const res = await fetch(`${connect}/assistido/itens_lista_espera/${id}`);
      const data = await res.json();
      setSelectedId(id);
      setItens(data || []);
    } catch (err) {
      toast.error('Erro ao carregar itens');
    }
  };

  const fetchAssistidos = async () => {
    try {
      const queryParams = new URLSearchParams({ instituicaoId: instituicaoId }).toString();
      const response = await fetch(`${connect}/assistido?${queryParams}`);
      const data = await response.json();
      const assistidosDisponiveis = data.filter((assistido) => assistido.status_lista_espera === 0);
      setAssistidos(assistidosDisponiveis);
    } catch (err) {
      toast.error('Erro ao carregar assistidos');
    }
  };

  useEffect(() => {
    if (onEdit) {
      fetchItens(onEdit.id);
    } else {
      fetchAssistidos();
      setItens([]);
      setSelectedId('');
    }
  }, [instituicaoId, onEdit]);

  const salvarLista = async () => {
    if (!selectedId || itens.length === 0) {
      toast.warn('Selecione um assistido e adicione pelo menos um item');
      return;
    }

    try {
      await fetch(`${connect}/assistido/${selectedId}/status`, { method: 'PATCH' });
      await fetch(`${connect}/assistido/${selectedId}/itens_espera`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itens: itens.map(item => ({
            id_item: item.id_item || 0,
            status: item.status || "pendente",
            quantidade_solicitada: item.quantidade_solicitada || item.quantidade,
            quantidade_atendida: item.quantidade_atendida || 0,
            observacao: item.observacao,
            categoria_id: item.categoria_id || item.categoriaId,
            subcategoria_id: item.subcategoria_id || item.subcategoriaId
          }))
        })
      });
      toast.success('Lista de espera salva com sucesso!');
      setItens([]);
      setSelectedId('');
      onSuccess();
    } catch (err) {
      toast.error('Erro ao salvar lista de espera');
    }
  };

  const removerItem = async (idx) => {
    const item = itens[idx];

    const result = await Swal.fire({
      title: 'Remover item?',
      text: `Você tem certeza que deseja remover "${item.categoria_nome || item.categoriaNome} - ${item.subcategoria_nome || item.subcategoriaNome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    // Se tem id_item (já salvo no banco), faz DELETE
    if (item.id_item) {
      try {
        await fetch(`${connect}/assistido/item_lista_espera/${item.id_item}`, {
          method: 'DELETE',
        });
        toast.success('Item removido com sucesso!');
      } catch (err) {
        toast.error('Erro ao remover item');
        return;
      }
    }

    // Remove visualmente
    const novaLista = [...itens];
    novaLista.splice(idx, 1);
    setItens(novaLista);
  };


  const adicionarOuSomarItem = (novoItem) => {
    const existenteIndex = itens.findIndex(
      item => item.subcategoria_id === novoItem.subcategoria_id
        || item.subcategoriaId === novoItem.subcategoriaId
    );

    if (existenteIndex !== -1) {
      const novaLista = [...itens];
      const atual = novaLista[existenteIndex];
      const quantidadeAtual = atual.quantidade_solicitada || atual.quantidade || 0;

      novaLista[existenteIndex] = {
        ...atual,
        quantidade_solicitada: quantidadeAtual + novoItem.quantidade
      };

      toast.info('Item já existente. Quantidade somada.');
      setItens(novaLista);
    } else {
      setItens([...itens, novoItem]);
    }

    setMostrarFormItem(false);
  };

  const ordenarPorStatus = (ascendente) => {
    const ordenado = [...itens].sort((a, b) => {
      return ascendente
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    });
    setItens(ordenado);
    setOrdemStatusAsc(ascendente);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 text-sm font-medium">Selecionar Assistido:</label>
        <select
          className="w-full border px-3 py-2 rounded-md"
          value={onEdit ? onEdit.id : selectedId}
          disabled={onEdit}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          {onEdit ? (
            <>
              <option value={onEdit.id}>{onEdit.nome} - {onEdit.documento}</option>
            </>
          ) : (
            <>
              {assistidos.map(a => (
                <option key={a.id} value={a.id}>{a.nome} - {a.documento}</option>
              ))}
            </>
          )}
        </select>
      </div>

      {mostrarFormItem && (
        <FormItem
          onAddItem={adicionarOuSomarItem}
          onCancel={() => setMostrarFormItem(false)}
        />
      )}

      <div>
        <div className='flex items-center justify-between mb-2'>
          <h3 className="text-sm font-medium">Itens adicionados:</h3>
          <button
            onClick={() => setMostrarFormItem(true)}
            className="bg-green-500 hover:bg-green-600 text-xs text-white py-2 px-4 rounded font-bold transition"
          >
            + Novo item
          </button>
        </div>
        <div className="overflow-x-auto max-h-[40vh]">
          <table className="min-w-full border text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Categoria</th>
                <th className="px-2 py-1 border">Subcategoria</th>
                <th className="px-2 py-1 border">Quantidade Solicitada</th>
                <th className="px-2 py-1 border">Quantidade Atendida</th>
                <th className="px-2 py-1 border">Observação</th>
                <th className="px-2 py-1 border text-center">
                  <div className="flex gap-1 items-center justify-center">
                    <span>Status</span>
                    <button
                      type="button"
                      onClick={() => ordenarPorStatus(!ordemStatusAsc)}
                      className={`
                        text-xs
                        ${ordemStatusAsc ? 'text-gray-700' : 'text-gray-400'}
                        hover:text-gray-500 transition-colors
                      `}
                      title={`Ordenar por status ${ordemStatusAsc ? 'descendente' : 'ascendente'}`}
                    >
                      {ordemStatusAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </th>
                <th className="px-2 py-1 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(itens) && itens.length > 0 ? (
                itens.map((item, idx) => (
                  <tr key={idx} className={`text-center ${item.status === 'atendida' ? 'text-green-400' : 'text-gray-700'}`}>
                    <td className="px-2 py-1 border">{item.categoria_nome || item.categoriaNome}</td>
                    <td className="px-2 py-1 border">{item.subcategoria_nome || item.subcategoriaNome}</td>
                    <td className="px-2 py-1 border">{item.quantidade_solicitada || item.quantidade}</td>
                    <td className="px-2 py-1 border">{item.quantidade_atendida || '-'}</td>
                    <td className="px-2 py-1 border">{item.observacao || 'sem observação'}</td>
                    <td className="px-2 py-1 border"><span className={`inline-block w-3 h-3 rounded-full ${item.status === 'pendente' ? 'bg-red-400' : item.status === 'atendida' ? 'bg-green-400' : 'bg-yellow-400'}`}></span></td>
                    <td className="px-2 py-1 border">
                      <button
                        type="button"
                        disabled={item.status === 'atendida'}
                        onClick={() => removerItem(idx)}
                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:hover:text-gray-300 transition-colors disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-2 text-gray-400">Nenhum item encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Legenda */}
          <div className="w-full px-2 text-xs text-gray-700 flex flex-wrap justify-end gap-2">
            <span className='font-medium'>Legenda:</span>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-green-400`}></span>
              <span>Atendida</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-yellow-400`}></span>
              <span>Parcial</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-red-400`}></span>
              <span>Pendente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right sticky bottom-0 py-2 border-t-2 bg-white">
        <button
          onClick={salvarLista}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md font-bold transition"
        >
          Salvar Lista
        </button>
      </div>
    </div>
  );
};

export default ListaEspera;