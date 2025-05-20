import React, { useState } from 'react';

// Componentes
import ToolTip from '../components/Auxiliares/ToolTip';

// Icons
import { IoIosAddCircle } from "react-icons/io";
import { IoMdTrash } from "react-icons/io";

const assistidosMock = [
  { id: 1, name: 'José da Silva' },
  { id: 2, name: 'Maria Oliveira' },
];

const estoqueMock = [
  { id: 1, name: 'Cesta Básica' },
  { id: 2, name: 'Cobertor' },
  { id: 3, name: 'Kit de Higiene' },
  { id: 4, name: 'Fralda Geriátrica' },
  { id: 5, name: 'Roupas Adulto M' },
  { id: 6, name: 'Roupas Infantil P' },
  { id: 7, name: 'Sabonete' },
];

const NewDonation = () => {
  const [assistidoId, setAssistidoId] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [step, setStep] = useState(1);
  const [estoqueDisponivel, setEstoqueDisponivel] = useState(estoqueMock);
  const [resultadosBusca, setResultadosBusca] = useState([]);

  const assistido = assistidosMock.find(a => a.id.toString() === assistidoId);

  // Função de busca
  const handleSearchItem = (value) => {
    setSearchItem(value);
    setItemSelecionado(null);

    if (value.trim() === "") {
      setResultadosBusca([]);
      return;
    }

    // Aqui você pode aplicar um filtro local ou uma chamada de API
    const resultados = estoqueDisponivel.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setResultadosBusca(resultados);
  };

  // Função ao clicar no item
  const handleSelectItem = (item) => {
    setItemSelecionado(item);
    setSearchItem(item.name); // opcional: preencher o input com o nome
    setResultadosBusca([]); // limpa os resultados para fechar o dropdown
  };


  const handleAddItem = () => {
    if (!itemSelecionado || quantidade < 1) return;

    const novoItem = {
      ...itemSelecionado,
      quantidade: parseInt(quantidade),
    };

    setItensSelecionados(prev => [...prev, novoItem]);
    setItemSelecionado(null);
    setSearchItem('');
    setQuantidade(1);
  };

  const handleDeleteItem = (item) => {
    const novoItensSelecionados = itensSelecionados.filter(i => i.id !== item.id);
    setItensSelecionados(novoItensSelecionados);
  };

  const handleDoar = () => {
    if (!assistidoId || itensSelecionados.length === 0) {
      alert('Selecione um assistido e adicione itens.');
      return;
    }

    const payload = {
      assistidoId,
      itens: itensSelecionados,
    };

    console.log('Doação enviada:', payload);

    setAssistidoId('');
    setItensSelecionados([]);
    setStep(1);
  };

  return (
    <div className="w-full px-16 mx-auto">

      {/* Etapas do processo */}
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4 mb-4">
        {[
          { id: 1, label: 'Assistido' },
          { id: 2, label: 'Itens' },
          { id: 3, label: 'Confirmar' }
        ].map((etapa, i, arr) => {
          const isCompleted = step > etapa.id;
          const isActive = step === etapa.id;
          const isLast = i === arr.length - 1;

          return (
            <div key={etapa.id} className="relative flex-1 flex flex-col items-center text-sm text-center">

              {/* Linha entre círculos */}
              {!isLast && (
                <div className="absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0">
                  <div className={`h-1 w-full ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`} />
                </div>
              )}

              {/* Círculo numerado ou check */}
              <div
                className={`z-10 relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
            ${isCompleted
                    ? 'bg-blue-100 text-blue-600 border-blue-400'
                    : isActive
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 5.917 5.724 10.5 15 1.5" />
                  </svg>
                ) : (
                  etapa.id
                )}
              </div>

              {/* Texto da etapa */}
              <span className={`mt-2 ${isActive ? 'text-sky-600 font-semibold' :
                isCompleted ? 'text-blue-400' :
                  'text-gray-400'
                }`}>
                {etapa.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className='mx-auto flex flex-col space-y-6 rounded-md bg-white shadow px-10 py-6'>
        {/* Passo 1 - Assistido */}
        {step === 1 && (
          <div className='w-full'>
            <label className="block font-medium mb-1">Escolha um assistido</label>
            <select
              value={assistidoId}
              onChange={(e) => setAssistidoId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione...</option>
              {assistidosMock.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <div className='flex justify-end mt-4'>
              <button
                disabled={!assistidoId}
                onClick={() => setStep(2)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Passo 2 - Itens */}
        {step === 2 && (
          <div className='w-full flex flex-col space-y-4 rounded-md px-6 py-4'>
            <h2 className="text-2xl font-bold text-sky-700 text-center">Adicionar Itens</h2>
            <div className='flex justify-between items-center gap-4'>
              <div className="relative w-full">
                <label className="block font-medium mb-1">Buscar item do estoque</label>
                <input
                  type="text"
                  value={searchItem}
                  onChange={(e) => handleSearchItem(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Digite o nome do item..."
                />
                {resultadosBusca.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-60 overflow-y-auto">
                    {resultadosBusca.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="">
                <label className="block font-medium mb-1">Quantidade</label>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                />
              </div>

              <div className="flex items-end gap-4 mt-6">
                <button
                  onClick={handleAddItem}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded cursor-pointer"
                  disabled={!itemSelecionado}
                >
                  <IoIosAddCircle />
                </button>
              </div>
            </div>

            {itensSelecionados.length > 0 && (
              <div>
                <h2 className="font-semibold mb-2">Itens para doação:</h2>
                <ul className="space-y-1">
                  {itensSelecionados.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-gray-300 px-1 py-2">
                      <span>{item.name} (x{item.quantidade})</span>
                      <ToolTip text={"Deletar"} position={"top"}>
                        <div className='cursor-pointer text-red-500 hover:text-red-700 text-lg'>
                          <IoMdTrash onClick={() => handleDeleteItem(item)} />
                        </div>
                      </ToolTip>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className='flex justify-between mt-4'>
              <button
                onClick={() => setStep(1)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Voltar
              </button>
              <button
                disabled={itensSelecionados.length === 0}
                onClick={() => setStep(3)}
                className={`text-white px-6 py-2 rounded disabled:opacity-50 ${itensSelecionados.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-sky-700 bg-sky-600'}`}
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* Passo 3 - Confirmar */}
        {step === 3 && (
          <div className='w-full space-y-6'>
            <h2 className='text-2xl font-bold text-sky-700 text-center'>Confirmar Doação</h2>
            <p><strong>Assistido:</strong> {assistido?.name}</p>
            <div>
              <h3 className="font-semibold mb-2">Itens:</h3>
              <ul className="space-y-1">
                {itensSelecionados.map((item, idx) => (
                  <li key={idx}>{item.name} (x{item.quantidade})</li>
                ))}
              </ul>
            </div>
            <div className='flex justify-between'>
              <button
                onClick={() => setStep(2)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Voltar
              </button>
              <button
                onClick={handleDoar}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md font-medium"
              >
                Confirmar Doação
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDonation;