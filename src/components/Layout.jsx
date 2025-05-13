import useAuth from '../hooks/useAuth';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { user } = useAuth();
  const isInstituicao = user?.role === 'instituicao';
  const isDoador = user?.role === 'doador';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        {isInstituicao && (
          <div className="relative flex-shrink-0">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {isDoador && <Navbar />}
          <main className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </main>
        </div>
      </div>

      {isDoador && <Footer />}
    </div>
  );
}
