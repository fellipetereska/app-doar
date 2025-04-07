import React from 'react';

function TableHome({ columns, data, onEdit, onDelete }) {
  return (
    <div className="max-h-[25vh] overflow-auto custom-scrollbar rounded-md shadow-md">
      <table className="min-w-full bg-white text-sm text-center">
        <thead className="bg-gray-50 text-gray-700 sticky top-0">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-2 font-medium">Ações</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 hover:cursor-pointer">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-2">
                  {row[col.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2 flex justify-center items-center gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableHome;