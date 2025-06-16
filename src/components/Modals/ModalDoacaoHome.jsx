import React, { useState } from 'react';

// Componentes
import { formatarTelefone } from '../Auxiliares/helper';
import { SelectInput } from '../Inputs/Inputs';

// Icons
import { X } from 'lucide-react';
import { connect } from '../../services/api';
import { toast } from 'react-toastify';

const ModalDoacao = ({ doacao, setDoacao, isOpen, onClose, fetchDonations, aceitarDoacaoGeral }) => {

  const [imageModal, setImageModal] = useState(false);
  const [galeria, setGaleria] = useState([]);
  const [indexImagem, setIndexImagem] = useState(0);

  const opcoesStatusDoacao = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Aceita', value: 'aceita' },
    { label: 'Recusada', value: 'recusada' }
  ];

  const opcoesStatusEntrega = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Confirmada', value: 'confirmada' },
    { label: 'Cancelada', value: 'cancelada' }
  ];

  const onChangeStatus = (novoStatus) => {
    atualizarStatusDoacao(doacao.doacao_id, novoStatus);
  };

  const atualizarStatusDoacao = async (id, novoStatus) => {
    try {
      const res = await fetch(`${connect}/doacao/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatus })
      });

      if (res.ok) {
        setDoacao({ ...doacao, status: novoStatus });
        toast.success('Status atualizado com sucesso!');
        fetchDonations();
        if (novoStatus === 'recusada') {
          onClose();
        }
      } else if (res.status === 404) {
        toast.warn('Doação nao encontrada.');
        console.warn('Doação não encontrada.');
      } else {
        const erro = await res.text();
        toast.error('Erro ao atualizar status da doação.');
        console.error('Erro:', erro);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const onChangeEntrega = (novoStatusEntrega) => {
    atualizarStatusEntrega(doacao.doacao_id, novoStatusEntrega, doacao.itens);
  };

  const atualizarStatusEntrega = async (doacaoId, novoStatusEntrega, itens) => {
    try {
      const response = await fetch(`${connect}/doacao/${doacaoId}/status_entrega`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: novoStatusEntrega, itens: itens }),
      });

      if (response.ok) {
        setDoacao({ ...doacao, status_entrega: novoStatusEntrega });
        toast.success('Status atualizado com sucesso!');
        fetchDonations();
      } else {
        const erro = await response.text();
        toast.error('Erro ao atualizar status de entrega.');
        console.error("Erro ao atualizar status de entrega:", erro);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  

  const openImageModal = (imagens) => {
    setGaleria(imagens);
    setIndexImagem(0);
    setImageModal(true);
  };

  const closeImageModal = () => {
    setImageModal(false);
    setGaleria([]);
    setIndexImagem(0);
  };

  if (!isOpen || !doacao) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-xs  flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl relative">
        {/* Cabeçalho */}
        <div className='flex items-center justify-between gap-2 mb-4 border-b border-gray-200 pb-1'>
          <h2 className="text-lg font-bold text-sky-700">Detalhes da Doação #{doacao.doacao_id}</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        {/* Dados do Doador */}
        <h3 className="font-semibold text-gray-800 mb-2">Informações do Doador</h3>
        <div className="flex flex-col gap-1 mb-2 border border-sky-300 bg-sky-50 rounded-md px-4 py-2 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800">{doacao.nome_usuario || 'Nome do Doador'} - <span className='uppercase text-xs text-gray-600 font-light'>{doacao.tipo_documento || ''}: {doacao.documento || ''}</span></h3>
          <p className="text-xs text-gray-600 capitalize">📞 {formatarTelefone(doacao)}</p>
          <p className="text-xs text-gray-600 capitalize">📦 Tipo: {doacao.tipo_entrega}</p>

          {doacao.tipo_entrega === 'retirada' && (
            <>
              <p className="text-xs text-gray-600 capitalize">📍 {doacao.endereco}</p>
              <p className='text-xs text-gray-600 capitalize'>⏱️ {doacao.horario_retirada}</p>
            </>
          )}
        </div>

        {/* Lista de Itens com Imagens */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800">Itens da Doação</h3>
          <ul className="max-h-[300px] overflow-y-auto divide-y divide-gray-200 custom-scrollbar px-2">
            {doacao.itens?.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900">{item.item_nome} <span className="text-xs text-gray-500">({item.item_quantidade} un.)</span></p>
                  {item.item_descricao && (
                    <p className="text-xs text-gray-600 italic">{item.item_descricao}</p>
                  )}
                </div>
                {item.imagens?.[0] && (
                  <img
                    src={item.imagens[0].url_imagem}
                    alt="Imagem do item"
                    className="w-10 h-10 object-cover rounded border cursor-pointer"
                    onClick={() => openImageModal(item.imagens)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          {!doacao.instituicao_id ? (
            <button
              onClick={() => aceitarDoacaoGeral(doacao.doacao_id)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full font-bold"
            >
              Assumir Doação
            </button>
          ) : (
            <>
              <div className='flex items-center justify-end gap-2'>
                <span className={`text-xs mt-2 w-fit px-3 py-0.5 rounded-full font-medium capitalize
                    ${doacao.status === 'pendente' && 'bg-yellow-100 border border-yellow-400 text-yellow-700'}
                    ${doacao.status === 'aceita' && 'bg-green-100 border border-green-400 text-green-700'}
                    ${doacao.status === 'recusada' && 'bg-red-100 border border-red-400 text-red-600'}`}>
                  {doacao.status}
                </span>
              </div>

              {/* Container flex para os selects */}
              <div className={`flex gap-4 ${doacao.status === 'aceita' ? '' : 'w-full'}`}>
                <div className={doacao.status === 'aceita' ? 'w-1/2' : 'w-full'}>
                  <SelectInput
                    label="Status da Doação"
                    name="status"
                    value={doacao.status}
                    disable={doacao.status_entrega === 'confirmada'}
                    onChange={(e) => onChangeStatus(e.target.value)}
                    options={opcoesStatusDoacao}
                  />
                </div>

                {doacao.status === 'aceita' && (
                  <div className="w-1/2">
                    <SelectInput
                      label="Status da Entrega"
                      name="status_entrega"
                      value={doacao.status_entrega}
                      onChange={(e) => onChangeEntrega(e.target.value)}
                      options={opcoesStatusEntrega}
                    />
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {imageModal && galeria.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
            >
              <X size={24} />
            </button>

            {/* Imagem atual */}
            <img
              src={galeria[indexImagem]?.url_imagem}
              alt="Imagem ampliada"
              className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
            />

            {/* Navegação se houver mais de uma */}
            {galeria.length > 1 && (
              <>
                <button
                  onClick={() => setIndexImagem((indexImagem - 1 + galeria.length) % galeria.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black px-2 py-1 rounded-full shadow"
                >
                  ⬅️
                </button>
                <button
                  onClick={() => setIndexImagem((indexImagem + 1) % galeria.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black px-2 py-1 rounded-full shadow"
                >
                  ➡️
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDoacao;
