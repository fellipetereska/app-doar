import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const isInstituicao = location.pathname.startsWith("/instituicao");
  const isLogin = location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {isInstituicao && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {!isInstituicao && !isLogin && <Navbar />}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {!isInstituicao && !isLogin && <Footer />}
    </div>
  );
}
