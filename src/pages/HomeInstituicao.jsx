import React, { useEffect, useState, useRef } from "react";
import { getInstituicaoId } from "../components/Auxiliares/helper";
import { connect } from "../services/api";

import ModalDoacaoHome from "../components/Modals/ModalDoacaoHome";
import Indicador from "../components/Cards/Indicador";
import CardDoacao from "../components/Cards/CardDoacao";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const HomeInstituicao = () => {
  const [instituicaoId] = useState(getInstituicaoId());

  const scrollRefRecebidas = useRef(null);
  const scrollRefGerais = useRef(null);

  const [mostrarSetasRecebidas, setMostrarSetasRecebidas] = useState(false);
  const [mostrarSetasGerais, setMostrarSetasGerais] = useState(false);

  const scroll = (ref, direction) => {
    const container = ref.current;
    const scrollAmount = 550;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isOpenModalDonation, setIsOpenModalDonation] = useState(false);
  const [statusDonation, setStatusDonation] = useState("recebidas");
  const [doacoesRecebidas, setDoacoesRecebidas] = useState([]);
  const [doacoesAguardando, setDoacoesAguardando] = useState([]);
  const [doacoesGerais, setDoacoesGerais] = useState([]);
  const hoje = new Date();
  let mes = hoje.toLocaleString("pt-BR", { month: "short" }).toLowerCase();
  mes = mes.replace(".", "");
  mes = mes.charAt(0).toUpperCase() + mes.slice(1);
  const ano = hoje.getFullYear();

  const [indicadores, setIndicadores] = useState({
    recebidasAno: 0,
    recebidasMes: 0,
    entregasAno: 0,
    entregasMes: 0,
    listaEspera: 0,
  });

  useEffect(() => {
    const verificarOverflow = () => {
      if (scrollRefRecebidas.current) {
        const overflow =
          scrollRefRecebidas.current.scrollWidth >
          scrollRefRecebidas.current.clientWidth;
        setMostrarSetasRecebidas(overflow);
      }

      if (scrollRefGerais.current) {
        const overflow =
          scrollRefGerais.current.scrollWidth >
          scrollRefGerais.current.clientWidth;
        setMostrarSetasGerais(overflow);
      }
    };

    verificarOverflow();
    window.addEventListener("resize", verificarOverflow);
    return () => window.removeEventListener("resize", verificarOverflow);
  }, [doacoesRecebidas, doacoesGerais]);

  const loadScreen = async () => {
    try {
      const res = await fetch(`${connect}/doacao/todas/${instituicaoId}`);
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setDoacoesRecebidas(data.recebidas || []);
      setDoacoesAguardando(data.aguardando || []);
      console.log(data.aguardando);

      setDoacoesGerais(data.gerais || []);
      setIndicadores(data.indicadores);
    } catch (err) {
      console.error("Erro ao buscar todas as doações:", err);
    }
  };

  const aceitarDoacaoGeral = async (doacaoId) => {
    setIsOpenModalDonation(false);
    try {
      const res = await fetch(`${connect}/doacao/${doacaoId}/aceitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instituicaoId),
      });

      if (res.ok) {
        toast.success("Doação aceita com sucesso!");
        loadScreen();
      } else {
        toast.error("Erro ao aceitar doação.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (instituicaoId) {
      loadScreen();
    }
  }, [instituicaoId]);

  const handleEdit = (item) => {
    setSelectedDonation(item);
    setIsOpenModalDonation(true);
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-2">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Home</h1>
      <div className="grid grid-cols-5 gap-4">
        <Indicador
          title={`Doações Recebidas ${ano}`}
          value={indicadores.recebidasAno}
          borderColor="border-blue-500"
          textColor="text-blue-500"
        ></Indicador>
        <Indicador
          title={`Doações Recebidas ${mes}/${String(ano).slice(-2)}`}
          value={indicadores.recebidasMes}
          borderColor="border-red-500"
          textColor="text-red-500"
        ></Indicador>
        <Indicador
          title={`Doações Enviadas ${ano}`}
          value={indicadores.entregasAno}
          borderColor="border-yellow-500"
          textColor="text-yellow-500"
        ></Indicador>
        <Indicador
          title={`Doações Enviadas ${mes}/${String(ano).slice(-2)}`}
          value={indicadores.entregasMes}
          borderColor="border-green-500"
          textColor="text-green-500"
        ></Indicador>
        <Indicador
          title={`Lista de Espera ${ano}`}
          value={indicadores.listaEspera}
          borderColor="border-purple-500"
          textColor="text-purple-500"
        ></Indicador>
      </div>
      {/* Doações Recebidas */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-bold text-sky-700">Doações Recebidas</h2>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setStatusDonation("recebidas")}
                className={`px-3 py-1 rounded-full text-sm border 
                  ${
                    statusDonation === "recebidas"
                      ? "bg-sky-600 text-white border-sky-600"
                      : "border-gray-300 text-gray-600"
                  }`}
              >
                Recebidas
              </button>
              <button
                onClick={() => setStatusDonation("aguardando")}
                className={`px-3 py-1 rounded-full text-sm border 
                  ${
                    statusDonation === "aguardando"
                      ? "bg-sky-600 text-white border-sky-600"
                      : "border-gray-300 text-gray-600"
                  }`}
              >
                Aguardando Retirada/Entrega
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          {mostrarSetasRecebidas && (
            <div
              onClick={() => scroll(scrollRefRecebidas, "left")}
              className="absolute left-0 top-0 h-full w-12 z-10 cursor-pointer
              bg-gradient-to-r to-transparent hover:from-sky-200/50 hover:to-transparent
              transition duration-300 ease-in-out"
            >
              <div className="h-full flex items-center justify-start pl-2">
                <ChevronLeft
                  className="text-gray-600 hover:text-gray-800"
                  size={24}
                />
              </div>
            </div>
          )}
          
          {/* <div
            ref={scrollRefRecebidas}
            className="flex gap-4 overflow-x-auto px-6 pb-2 custom-scrollbar scroll-smooth"
          >
            {doacoesRecebidas.length > 0 ? (
              (statusDonation === "recebidas"
                ? doacoesRecebidas
                : doacoesAguardando
              ).map((doacao) => (
                <div
                  key={doacao.doacao_id}
                  className="min-w-[300px] max-w-[350px] h-[200px]"
                >
                  <CardDoacao doacao={doacao} onEdit={handleEdit} />
                </div>
              ))
            ) : (
              <>
                <div className="w-full text-center h-24 flex justify-center items-center">
                  <p className="text-gray-600">Nenhuma doação encontrada!.</p>
                </div>
              </>
            )}
          </div> */}

          <div
            ref={scrollRefRecebidas}
            className="flex gap-4 overflow-x-auto px-6 pb-2 custom-scrollbar scroll-smooth"
          >
            {(statusDonation === "recebidas"
              ? doacoesRecebidas
              : doacoesAguardando
            ).length > 0 ? (
              (statusDonation === "recebidas"
                ? doacoesRecebidas
                : doacoesAguardando
              ).map((doacao) => (
                <div
                  key={doacao.doacao_id}
                  className="min-w-[300px] max-w-[350px] h-[200px]"
                >
                  <CardDoacao doacao={doacao} onEdit={handleEdit} />
                </div>
              ))
            ) : (
              <div className="w-full text-center h-24 flex justify-center items-center">
                <p className="text-gray-600">Nenhuma doação encontrada!</p>
              </div>
            )}
          </div>

          {mostrarSetasRecebidas && (
            <div
              onClick={() => scroll(scrollRefRecebidas, "right")}
              className="absolute right-0 top-0 h-full w-12 z-10 cursor-pointer
             bg-gradient-to-l to-transparent 
             hover:from-sky-200/50 hover:to-transparent
             transition duration-300 ease-in-out"
            >
              <div className="h-full flex items-center justify-end pr-2">
                <ChevronRight
                  className="text-gray-600 hover:text-gray-800"
                  size={24}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doações Globais */}
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2 text-sky-700">Doações Gerais</h2>

        <div className="relative">
          {mostrarSetasGerais && (
            <div
              onClick={() => scroll(scrollRefGerais, "left")}
              className="absolute left-0 top-0 h-full w-12 z-10 cursor-pointer
              bg-gradient-to-r to-transparent hover:from-sky-200/50 hover:to-transparent
              transition duration-300 ease-in-out"
            >
              <div className="h-full flex items-center justify-start pl-2">
                <ChevronLeft
                  className="text-gray-600 hover:text-gray-800"
                  size={24}
                />
              </div>
            </div>
          )}

          <div
            ref={scrollRefGerais}
            className="flex gap-4 overflow-x-auto px-6 pb-2 custom-scrollbar scroll-smooth"
          >
            {doacoesGerais.length > 0 ? (
              doacoesGerais.map((doacao) => (
                <div
                  key={doacao.doacao_id}
                  className="min-w-[300px] max-w-[350px] h-[200px]"
                >
                  <CardDoacao doacao={doacao} onEdit={handleEdit} />
                </div>
              ))
            ) : (
              <>
                <div className="w-full text-center h-24 flex justify-center items-center">
                  <p className="text-gray-600">Nenhuma doação encontrada!.</p>
                </div>
              </>
            )}
          </div>

          {mostrarSetasGerais && (
            <div
              onClick={() => scroll(scrollRefGerais, "right")}
              className="absolute right-0 top-0 h-full w-12 z-10 cursor-pointer
             bg-gradient-to-l to-transparent 
             hover:from-sky-200/50 hover:to-transparent
             transition duration-300 ease-in-out"
            >
              <div className="h-full flex items-center justify-end pr-2">
                <ChevronRight
                  className="text-gray-600 hover:text-gray-800"
                  size={24}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {selectedDonation && (
        <ModalDoacaoHome
          doacao={selectedDonation}
          setDoacao={setSelectedDonation}
          isOpen={isOpenModalDonation}
          onClose={() => setIsOpenModalDonation(false)}
          fetchDonations={loadScreen}
          aceitarDoacaoGeral={aceitarDoacaoGeral}
        />
      )}
    </div>
  );
};

export default HomeInstituicao;
