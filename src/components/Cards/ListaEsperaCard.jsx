import React, { useMemo } from 'react';
import { ClipboardCheck, ClipboardList } from 'lucide-react';

const ListaEsperaCard = ({ itensListaEspera = [], itensSelecionados = [] }) => {
  const listaAtualizada = useMemo(() => {
    return itensListaEspera.map((item) => {
      const selecionado = itensSelecionados.find(
        (i) =>
          i.categoria_id === item.categoria_id &&
          i.subcategoria_id === item.subcategoria_id
      );

      const quantidadeSelecionada = selecionado?.quantidade || 0;

      return {
        ...item,
        quantidade_atendida: item.quantidade_atendida + quantidadeSelecionada,
      };
    });
  }, [itensListaEspera, itensSelecionados]);

  if (!listaAtualizada || listaAtualizada.length === 0) return null;

  return (
    <div className="w-full space-y-3 text-left">
      {listaAtualizada.map((item) => {
        const faltamAtender = Math.max(0, item.quantidade_solicitada - item.quantidade_atendida);
        const completamenteAtendido = faltamAtender === 0;

        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm ${completamenteAtendido ? 'bg-gray-100 border-gray-300' : 'bg-white border-sky-200'
              }`}
          >
            {completamenteAtendido ? (
              <>
                <ClipboardCheck size={20} className="text-green-600 mt-1" />
              </>
            ) : (
              <>
                <ClipboardList size={20} className={`text-sky-600 mt-1`} />
              </>
            )}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-800">{item.descricao}</p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">{item.categoria_nome}</span>: {item.subcategoria_nome} <br />
                Solicitado: {item.quantidade_solicitada} | Atendido: {item.quantidade_atendida} |{' '}
                Faltam atender:{' '}
                <strong className={completamenteAtendido ? 'text-green-600' : 'text-red-600'}>
                  {faltamAtender}
                </strong>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListaEsperaCard;
