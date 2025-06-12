// FormItem.jsx
import React, { useEffect, useState } from 'react';
import { connect } from '../../services/api';
import { getInstituicaoId } from '../Auxiliares/helper';

const FormItem = ({ onAddItem, onCancel }) => {
  const [instituicaoId] = useState(getInstituicaoId());
  const [categorias, setCategorias] = useState([]);
  const [item, setItem] = useState({ categoriaId: '', subcategoriaId: '', quantidade: 1, observacao: '' });

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(`${connect}/categoria?id=${instituicaoId}`);
      const data = await res.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, [instituicaoId]);

  const handleAdd = () => {
    // Validação básica
    if (!item.categoriaId || !item.subcategoriaId || !item.quantidade || item.quantidade < 1) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const categoria = categorias.find(c => c.id === parseInt(item.categoriaId));
    const subcategoria = categoria?.subcategorias.find(s => s.id === parseInt(item.subcategoriaId));

    const itemCompleto = {
      ...item,
      categoria_id: parseInt(item.categoriaId),
      subcategoria_id: parseInt(item.subcategoriaId),
      categoriaNome: categoria?.nome || '',
      subcategoriaNome: subcategoria?.nome || '',
      status: 'pendente'
    };

    onAddItem(itemCompleto);
  };


  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex gap-2 mb-2">
        <div className='w-5/12'>
          <label htmlFor="categoria" className="block mb-1 text-sm font-medium">Categoria</label>
          <select
            className="w-full border px-2 py-2 rounded-md"
            value={item.categoriaId}
            onChange={(e) =>
              setItem({ ...item, categoriaId: e.target.value, subcategoriaId: '' })
            }
          >
            <option value="">Selecione a categoria</option>
            {categorias.length > 0 && categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className='w-5/12'>
          <label htmlFor="subcategoria" className="block mb-1 text-sm font-medium">Subcategoria</label>
          <select
            className="w-full border px-2 py-2 rounded-md"
            value={item.subcategoriaId}
            onChange={(e) =>
              setItem({ ...item, subcategoriaId: e.target.value })
            }
            disabled={!item.categoriaId}
          >
            <option value="">Selecione a subcategoria</option>
            {(categorias.length > 0 && categorias.find(c => c.id === parseInt(item.categoriaId))?.subcategorias || []).map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div className="w-2/12">
          <label htmlFor="quantidade" className="block mb-1 text-sm font-medium">Quantidade</label>
          <input
            type="number"
            min="1"
            placeholder="Qtd."
            className="w-full border px-2 py-2 rounded-md"
            value={item.quantidade || ''}
            onChange={(e) =>
              setItem({ ...item, quantidade: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      <div className='w-full'>
        <label htmlFor="observacao" className="block mb-1 text-sm font-medium">Observação</label>
        <textarea
          rows="2"
          className="w-full border rounded-md px-3 py-2"
          placeholder="Digite aqui a observação..."
          value={item.observacao}
          onChange={(e) =>
            setItem({ ...item, observacao: e.target.value })
          }
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
};

export default FormItem;