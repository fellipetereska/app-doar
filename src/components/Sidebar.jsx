import React, { useState } from "react";
import {
  Home,
  Boxes,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const isPrefixActive = (prefix) => location.pathname.startsWith(prefix);

  const [openAssistidos, setOpenAssistidos] = useState(true);

  return (
    <aside className="w-64 h-screen bg-white flex flex-col justify-between border-r border-gray-200">
      {/* Topo */}
      <div>
        <div className="border-b mb-5 py-6">
          <h1 className="text-center text-2xl font-bold text-gray-400">APP Doar</h1>
        </div>
        <nav className="flex flex-col gap-2 px-4 mt-5">
          <button
            onClick={() => navigate("/instituicao")}
            className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium ${
              isActive("/instituicao")
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home size={20} />
            HOME
          </button>

          <button
            onClick={() => navigate("/instituicao/estoque")}
            className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium ${
              isActive("/instituicao/estoque")
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Boxes size={20} />
            ESTOQUE
          </button>

          {/* ASSISTIDOS com submenu */}
          <div>
            <button
              onClick={() => setOpenAssistidos(!openAssistidos)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-md font-medium ${
                isPrefixActive("/instituicao/assistidos")
                  ? "bg-gray-100 text-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                ASSISTIDOS
              </div>
              {openAssistidos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openAssistidos && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                <button
                  onClick={() => navigate("/instituicao/assistidos/assistidos")}
                  className={`text-sm text-left px-2 py-1 rounded-md ${
                    isActive("/instituicao/assistidos/assistidos")
                      ? "text-gray-800 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Assistidos
                </button>
                <button
                  onClick={() => navigate("/instituicao/assistidos/lista-espera")}
                  className={`text-sm text-left px-2 py-1 rounded-md ${
                    isActive("/instituicao/assistidos/lista-espera")
                      ? "text-gray-800 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Lista de Espera
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/instituicao/relatorios")}
            className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium ${
              isActive("/instituicao/relatorios")
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FileText size={20} />
            RELATÓRIOS
          </button>
        </nav>
      </div>

      {/* Rodapé */}
      <div className="border-t mt-6 px-4 py-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 w-full">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">Fellipe Tereska</p>
            <p className="text-xs text-gray-500">fellipetereska@gmail.com</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
            <LogOut size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">v 1.0.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
