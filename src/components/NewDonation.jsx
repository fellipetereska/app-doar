import { useEffect, useState } from 'react';

// Componentes
import { formatarDocumento} from './Auxiliares/helper';
import { Input, SelectInput, Textarea } from './Inputs/Inputs';

// Icons
import { CirclePlus, ClipboardCheck, Trash2 } from 'lucide-react';
import { connect } from '../services/api';
import { toast } from 'react-toastify';
import ListaEsperaCard from './Cards/ListaEsperaCard';
import AddItensDoacao from './Inputs/AddItensDoacao';

const NewDonation = ({ instituicaoId, onSuccess, assistidos, estoque }) => {
  // Steps
  const [steps] = useState([
    { id: 1, label: 'Assistido' },
    { id: 2, label: 'Itens' },
    { id: 3, label: 'Confirmar' }
  ]);

  // Assistidos
  const [assistidoId, setAssistidoId] = useState('');
  const [assistido, setAssistido] = useState([]);

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [itensListaEspera, setItensListaEspera] = useState([]);
  const [mostrarListaEspera, setMostrarListaEspera] = useState(false);

  const [tipoEntrega, setTipoEntrega] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubCategoria, setSelectedSubCategoria] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (assistidoId) {
      const selectedAssistido = assistidos.find(a => a.id === parseInt(assistidoId));
      setAssistido(selectedAssistido);
    }
  }, [assistidoId]);

  const handleSelectedAssistido = async () => {
    try {
      if (!assistidoId) throw new Error('Selecione um assistido.');

      const res = await fetch(`${connect}/assistido/itens_lista_espera/${assistidoId}`);
      const data = await res.json();
      const itensFiltrados = data.filter(item => item.status !== "atendida");

      setItensListaEspera(itensFiltrados);

      setStep(2);
    } catch (error) {
      toast.error(error.message || "Erro ao carregar assistido.");
      console.error("Erro ao carregar step:", error);
    }
  };

  const handleAddItem = () => {
    const categoriaId = parseInt(selectedCategoria);
    const subcategoriaId = parseInt(selectedSubCategoria);
    const qtd = parseInt(quantidade);

    if (!categoriaId || !subcategoriaId || isNaN(qtd) || qtd < 1) {
      console.info('Campos inválidos');
      return
    };

    // Busca o item no estoque com categoria e subcategoria
    const item = estoque.find(
      (i) =>
        i.categoria_id === categoriaId &&
        i.subcategoria_id === subcategoriaId
    );

    if (!item) {
      console.info('Item não encontrado');
      return
    };

    const quantidadeDisponivel = item.quantidade;

    if (qtd > quantidadeDisponivel) {
      console.info('Quantidade indisponível');
      return
    };

    const novoItem = {
      ...item,
      estoque_id: item.id,
      quantidade: qtd,
    };

    console.log('Item adicionado:', novoItem);

    setItensSelecionados(prev => [...prev, novoItem]);

    // Resetar campos
    setSelectedCategoria('');
    setSelectedSubCategoria('');
    setQuantidade(1);
  };

  const handleDeleteItem = (item) => {
    const novoItensSelecionados = itensSelecionados.filter(i => i.id !== item.id);
    setItensSelecionados(novoItensSelecionados);
  };

  const handleDoar = async () => {
    if (!assistidoId || itensSelecionados.length === 0) {
      return toast.warn('Selecione um assistido e adicione itens.');
    }

    try {
      const itensPayload = itensSelecionados.map((item) => ({
        quantidade: item.quantidade,
        estoque_id: item.id,
        categoria_id: item.categoria_id,
        subcategoria_id: item.subcategoria_id
      }));

      const payload = {
        data: new Date().toISOString(),
        observacao: observacoes,
        instituicao_id: parseInt(instituicaoId),
        assistido_id: parseInt(assistidoId),
        tipo_entrega: tipoEntrega,
        status: 'pendente',
        itens: itensPayload,
      };

      const res = await fetch(`${connect}/entregas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || 'Erro ao realizar doação.');
      }

      toast.success('Doação realizada com sucesso!');

      setAssistido(null);
      setItensListaEspera([]);
      onSuccess();
      setAssistidoId('');
      setItensSelecionados([]);
      setStep(1);
    } catch (error) {
      console.error('Erro ao realizar doação:', error);
    }
  };

  const handleQuantidadeChange = (e) => {
    const value = parseInt(e.target.value || 0);
    const max = getQuantidadeDisponivel(estoque, selectedCategoria, selectedSubCategoria);
    if (value > max) {
      setQuantidade(max);
    } else {
      setQuantidade(value);
    }
  };

  const getQuantidadeDisponivel = (estoque, categoriaId, subcategoriaId) => {
    const item = estoque && estoque.find(
      (i) =>
        i.categoria_id === parseInt(categoriaId) &&
        i.subcategoria_id === parseInt(subcategoriaId)
    );
    return item?.quantidade || 0;
  };

  return (
    <div className="w-full p-4">

      {/* Etapas do processo */}
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto mb-4">
        {steps.map((etapa, i, arr) => {
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

      <div className='mx-auto flex flex-col space-y-6 rounded-md bg-white'>
        {/* Passo 1 - Assistido */}
        {step === 1 && (
          <>
            <SelectInput
              label="Escolha um asssitido"
              name="assistido_id"
              value={assistidoId}
              onChange={(e) => setAssistidoId(e.target.value)}
              required
              options={assistidos && assistidos.map((ass) => ({
                value: ass.id,
                label: ass.nome + ' - ' + ass.documento
              }))}
              placeholder="Selecione um assistido"
            />
            <div className='flex justify-end mt-4'>
              <button
                disabled={!assistidoId}
                onClick={handleSelectedAssistido}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </>
        )}

        {/* Passo 2 - Itens */}
        {step === 2 && (
          <div className='w-full flex flex-col space-y-4 rounded-md px-6 py-4'>
            <h2 className="text-2xl font-bold text-sky-700 text-center">Adicionar Itens</h2>

            {/* Itens da lista de espera */}
            {itensListaEspera.length > 0 && (
              <>
                <div className="w-full space-y-3 text-center bg-sky-100 rounded-md p-4 max-h-[30vh] overflow-y-auto custom-scrollbar">
                  <div>
                    <p className="text-sky-700 font-medium">
                      Este assistido possui <strong>{itensListaEspera.length}</strong> item(ns) na lista de espera.
                    </p>
                    <p className="text-sm text-sky-700">
                      Selecione os itens que deseja atender e informe a quantidade a doar.
                    </p>
                  </div>

                  <button
                    onClick={() => setMostrarListaEspera(!mostrarListaEspera)}
                    className="text-sky-800 underline text-center text-sm font-medium"
                  >
                    {mostrarListaEspera ? 'Fechar' : 'Ver lista'}
                  </button>
                  {mostrarListaEspera && (
                    <ListaEsperaCard
                      onClose={() => setMostrarListaEspera(false)}
                      mostrarListaEspera={mostrarListaEspera}
                      itensSelecionados={itensSelecionados}
                      setItensSelecionados={setItensSelecionados}
                      itensListaEspera={itensListaEspera}
                    />
                  )}
                </div>
              </>
            )}

            {/* Buscar do Estoque */}
            <div className='flex justify-between items-start gap-4'>
              <AddItensDoacao
                estoque={estoque}
                selectedCategoria={selectedCategoria}
                setSelectedCategoria={setSelectedCategoria}
                selectedSubCategoria={selectedSubCategoria}
                setSelectedSubCategoria={setSelectedSubCategoria}
              />

              <div>
                <div className='flex items-center gap-2'>
                  <Input
                    label="Quantidade"
                    name="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={handleQuantidadeChange}
                    min={1}
                    max={getQuantidadeDisponivel(estoque, selectedCategoria, selectedSubCategoria)}
                    required
                  />
                  <button
                    onClick={handleAddItem}
                    className={`px-4 py-2 rounded text-white font-medium flex items-center gap-2 mt-6 ${!selectedCategoria || !selectedSubCategoria || quantidade < 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-700'
                      }`}
                    disabled={
                      !selectedCategoria ||
                      !selectedSubCategoria ||
                      quantidade < 1 ||
                      quantidade > getQuantidadeDisponivel(estoque, selectedCategoria, selectedSubCategoria)
                    }
                  >
                    <CirclePlus size={22} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Disponível: {Math.max(0, getQuantidadeDisponivel(estoque, selectedCategoria, selectedSubCategoria) - (parseInt(quantidade) || 0))}
                </p>
              </div>
            </div>

            {itensSelecionados.length > 0 && (
              <div className="mt-4 space-y-2">
                <h2 className="font-semibold text-gray-700 mb-2">Itens para doação:</h2>

                {itensSelecionados.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border rounded-lg px-4 py-3 shadow-sm bg-white hover:shadow transition"
                  >
                    <div className="flex items-start gap-3">
                      <ClipboardCheck size={20} className="text-sky-600 mt-1" />
                      <div className="flex flex-col text-sm text-gray-700">
                        <span className="font-medium text-gray-800">
                          {item.categoria} - {item.subcategoria}
                        </span>
                        <span className="text-xs text-gray-500">Quantidade: {item.quantidade}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remover item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
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
          <div className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-sky-700 text-center">Confirmar Doação</h2>

            {/* Bloco de dados do assistido */}
            <div className="border border-sky-200 bg-sky-50 rounded-md px-6 py-4 shadow-sm">
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Dados do Assistido</h3>
              <p className="text-sm text-gray-700"><strong>Nome:</strong> {assistido?.nome}</p>
              <p className="text-sm text-gray-700"><strong>Documento:</strong> {formatarDocumento(assistido?.documento)}</p>
              {assistido?.telefone && (
                <p className="text-sm text-gray-700"><strong>Telefone:</strong> {assistido.telefone}</p>
              )}
              {assistido?.endereco && (
                <p className="text-sm text-gray-700"><strong>Endereço:</strong> {assistido.endereco}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Tipo Entrega</h3>
              <SelectInput
                value={tipoEntrega}
                onChange={(e) => setTipoEntrega(e.target.value)}
                required
                options={[
                  { value: 'retirar', label: 'Retirada' },
                  { value: 'entregar', label: 'Entrega' },
                ]}
                placeholder="Selecione um tipo de entrega"
              />
              <Textarea
                label="Observações"
                name="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="mt-2"
                placeholder='Endereço de entrega, data e horário de entrega/retirada, etc.'
              />
            </div>

            {/* Bloco de itens para doação */}
            {itensSelecionados.length > 0 && (
              <div className="rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-sky-800 mb-4">Itens Selecionados</h3>

                <div className="space-y-3">
                  {itensSelecionados.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50 hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-3">
                        <ClipboardCheck size={20} className="text-green-600 mt-1" />
                        <div className="flex flex-col text-sm text-gray-700">
                          <span className="font-medium text-gray-800">
                            {item.categoria} - {item.subcategoria}
                          </span>
                          <span className="text-xs text-gray-500">Quantidade: {item.quantidade}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              >
                Voltar
              </button>
              <button
                disabled={!tipoEntrega}
                onClick={handleDoar}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar Doação
              </button>
            </div>
          </div>
        )}
      </div >
    </div >
  );
};

export default NewDonation;