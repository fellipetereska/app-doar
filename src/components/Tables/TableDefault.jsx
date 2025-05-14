import React, { useState } from 'react';

// Componentes
import { LoadingSpin } from '../Loading';

// Icons
import { IoIosOpen } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";

function TableDefault({ columns, data, onEdit, onDelete, itemsPerPage = 8, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular dados paginados
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Funções de navegação
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-[75vh] overflow-auto custom-scrollbar rounded-md shadow-md">
        <table className="min-w-full bg-white text-sm text-center">
          <thead className="border-b border-gray-200 text-gray-700 sticky top-0">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-bold">
                  {col.header}
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
                    <tr key={idx} className="hover:bg-gray-50">
                      {columns.map((col, i) => (
                        <td key={i} className="px-6 py-4">
                          {row[col.accessor] || '-'}
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
    </div>
  );
}

export default TableDefault;