import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const location = useLocation();
  const isInstituicao = location.pathname.startsWith("/instituicao");

  return (
    <div className="flex h-screen">
      {isInstituicao && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!isInstituicao && <Navbar />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
