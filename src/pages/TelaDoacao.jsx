import React, { useState } from 'react';

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
  // ...mais itens
];

const DonationScreen = () => {
  const [assistidoId, setAssistidoId] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const handleSelectItem = (item) => {
    setItemSelecionado(item);
    setSearchItem(item.name);
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
  };

  const resultadosBusca = searchItem.length > 0
    ? estoqueMock.filter(item =>
        item.name.toLowerCase().includes(searchItem.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-sky-700">Doar Itens</h1>

      <div>
        <label className="block font-medium mb-1">Escolha o assistido</label>
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
      </div>

      {/* Busca com autocomplete */}
      <div className="relative">
        <label className="block font-medium mb-1">Buscar item do estoque</label>
        <input
          type="text"
          value={searchItem}
          onChange={(e) => {
            setSearchItem(e.target.value);
            setItemSelecionado(null);
          }}
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

      {/* Campo de quantidade + botão adicionar */}
      <div className="flex items-end gap-4">
        <div className="w-32">
          <label className="block font-medium mb-1">Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min={1}
          />
        </div>
        <button
          onClick={handleAddItem}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded h-10"
          disabled={!itemSelecionado}
        >
          Adicionar
        </button>
      </div>

      {/* Lista de itens */}
      {itensSelecionados.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Itens para doação:</h2>
          <ul className="space-y-1">
            {itensSelecionados.map((item, idx) => (
              <li key={idx} className="flex justify-between bg-gray-100 px-4 py-2 rounded">
                <span>{item.name} (x{item.quantidade})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botão doar */}
      <button
        onClick={handleDoar}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
      >
        Confirmar Doação
      </button>
    </div>
  );
};

export default DonationScreen;