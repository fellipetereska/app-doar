import React, { useState } from 'react';

// Componentes
import { LoadingSpin } from '../Loading';

// Icons
import { IoIosOpen } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function TableDefault({ columns, data, onEdit, onDelete, itemsPerPage = 8, isLoading = false, legenda = [] }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortConfig]);

  const [currentPage, setCurrentPage] = useState(1);

  // Calcular dados paginados
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Funções de navegação
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex-1 overflow-auto custom-scrollbar rounded-md shadow-md">
        <table className="min-w-full bg-white text-sm text-center">
          <thead className="border-b border-gray-200 text-gray-700 sticky top-0">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-bold cursor-pointer select-none">
                  <div className="flex items-center justify-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <button
                        onClick={() =>
                          setSortConfig((prev) => ({
                            key: col.accessor,
                            direction: prev.key === col.accessor && prev.direction === 'asc' ? 'desc' : 'asc'
                          }))
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title={`Ordenar por ${col.header.toLowerCase()} (${sortConfig.direction === 'asc' ? 'crescente' : 'decrescente'})`}
                      >
                        {sortConfig.key === col.accessor ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-3 font-medium">Ações</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <>
                <tr>
                  <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="px-6 py-4 text-center text-gray-400">
                    <LoadingSpin />
                  </td>
                </tr>
              </>
            ) : (
              <>

                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="px-6 py-4 text-center text-gray-400">
                      Nenhum item encontrado.
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, idx) => (
                    <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {columns.map((col, i) => (
                        <td key={i} className="px-6 py-4 capitalize">
                          {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] ?? '-')}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-6 py-4 flex justify-center items-center gap-2 text-base">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-blue-500 hover:text-blue-800 cursor-pointer"
                            >
                              <IoIosOpen />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <IoMdTrash />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </>
            )}
          </tbody>

        </table>

        {/* Controles de paginação */}
        <div className="flex justify-between items-center px-5 py-3 bg-white border border-gray-200 rounded-b-md shadow-md text-sm text-gray-800">
          <p className=''>
            Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} itens
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500"
            >
              «
            </button>

            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500"
            >
              ‹
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 rounded cursor-pointer ${currentPage === pageNum ? 'bg-blue-500 text-white' : ''
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500"
            >
              ›
            </button>

            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded hover:bg-gray-100 cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-500"
            >
              »
            </button>
          </div>
        </div>
      </div>
      {legenda.length > 0 && (
        <div className="w-full px-2 text-xs text-gray-700 flex flex-wrap justify-end gap-2">
          <span className='font-medium'>Legenda:</span>
          {legenda.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${item.cor}`}></span>
              <span>{item.texto}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TableDefault;