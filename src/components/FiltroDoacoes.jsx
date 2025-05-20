import React from 'react';

const FiltroDoacoes = ({ filtros, setFiltros, onFiltrar }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className='bg-white shadow p-4 rounded-md'>
        <div className="flex flex-col md:flex-row flex-wrap items-center">
          {/* Status */}
          <div className="flex flex-col w-full md:w-1/3 px-3">
            <label className="text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={filtros.status}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="">Todos</option>
              <option value="aceita">Aceitas</option>
              <option value="entregar">Para Entregar</option>
              <option value="retirar">Aguardando Retirada</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>

          {/* Assistido */}
          <div className="flex flex-col w-full md:w-1/3 px-3">
            <label className="text-sm font-medium mb-1">Assistido</label>
            <select
              name="assistidoId"
              value={filtros.assistidoId}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="">Todos</option>
              {filtros.listaAssistidos?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="flex flex-col w-full md:w-1/3 px-3">
            <label className="text-sm font-medium mb-1">Data (a partir de)</label>
            <input
              type="date"
              name="data"
              value={filtros.data}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          </div>

        </div>

        {/* Botão */}
        <div className="flex justify-end px-3 mt-2">
          <button
            onClick={onFiltrar}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </>
  );
};

export default FiltroDoacoes;
