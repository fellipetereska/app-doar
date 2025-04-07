import React from "react";

function Indicador({ title, value, color }) {
  return (
    <>
      <div className={`border-t-4 rounded-xl p-4 shadow-sm bg-white ${color}`}>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </>
  );
}

export default Indicador;