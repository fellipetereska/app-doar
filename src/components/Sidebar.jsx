// Sidebar.jsx
import { createContext, useState, useContext } from "react";
import {
  Home,
  Boxes,
  HeartHandshake,
  Users,
  Clock,
  BarChart2,
  ChevronFirst,
  ChevronLast,
  Settings,
  LogOut,
} from "lucide-react";

import ToolTip from "./Auxiliares/ToolTip";
import logo from '../media/logo.png';
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar() {

  const { signout } = useAuth();

  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { label: "Home", icon: <Home />, path: "/instituicao" },
    { label: "Estoque", icon: <Boxes />, path: "/instituicao/estoque" },
    { label: "Doar", icon: <HeartHandshake />, path: "/instituicao/doar" },
    { label: "Assistidos", icon: <Users />, path: "/instituicao/assistidos" },
    { label: "Lista de Espera", icon: <Clock />, path: "/instituicao/lista-espera" },
    { label: "Relatórios", icon: <BarChart2 />, path: "/instituicao/relatorios" },
  ];

  const logout = () => {
    navigate("/login");
    signout();
  }

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center border-b mb-4">
          <div></div>
          <img
            src={logo}
            className={`overflow-hidden ${expanded ? "w-16" : "w-0"}`}
            alt="Logo"
          />
          <ToolTip
            text={expanded ? "Minimizar" : "Expandir"}
            position="right"
            key={expanded ? "open" : "closed"}
          >
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst size={18} color="#6b7280" /> : <ChevronLast size={18} color="#6b7280" />}
            </button>
          </ToolTip>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.label} icon={item.icon} text={item.label} path={item.path} />
            ))}
          </ul>
        </SidebarContext.Provider>

        {/* Rodapé */}
        <div className="border-t px-2 py-4">
          <div className={`flex items-center ${expanded ? "gap-3" : "flex-col justify-center"}`}>
            {expanded ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Fellipe Tereska</p>
                  <p className="text-xs text-gray-500">fellipetereska@gmail.com</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <ToolTip text="Configurações" position="top">
                    <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
                  </ToolTip>
                  <ToolTip text="Sair" position="right">
                    <button type="button" onClick={logout}>
                      <LogOut size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
                    </button>
                  </ToolTip>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`flex ${expanded ? "justify-between px-1" : "justify-center"} items-center gap-4`}
                >
                  <ToolTip text="Configurações" position="right">
                    <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
                  </ToolTip>
                  <ToolTip text="Sair" position="right">
                    <button type="button" onClick={logout}>
                      <LogOut size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" />
                    </button>
                  </ToolTip>
                </div>
              </>
            )}
          </div>


          <p className="text-xs text-gray-400 text-center mt-3 select-none">v 1.0.0</p>
        </div>

      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text, path }) {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();

  const isActive = location.pathname === path;

  const itemContent = (
    <Link to={path}>
      <div
        className={`flex items-center p-2 cursor-pointer rounded transition-colors
          ${isActive ? "border-l-4 border-primary text-primary" : "text-gray-600 hover:text-gray-800"}`}
      >
        <span className="text-xl">{icon}</span>
        {expanded && (
          <span className="ml-3 text-sm font-medium transition-all">
            {text}
          </span>
        )}
      </div>
    </Link>
  );

  return (
    <li className="relative">
      {expanded ? (
        itemContent
      ) : (
        <ToolTip text={text} position="right">
          {itemContent}
        </ToolTip>
      )}
    </li>
  );
}
