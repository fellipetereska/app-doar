import React from "react";

function Indicador({ title, value, borderColor, textColor }) {
  return (
    <>
      <div className={`border-b-4 rounded-lg p-4 shadow-sm bg-white ${borderColor}`}>
        <p className="text-xs text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </>
  );
}

export default Indicador;