import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

import Modal from './Modal';
import { toast } from 'react-toastify';
import { MapPin, FileDown } from 'lucide-react';
import { connect } from '../../services/api';
import ToolTip from '../Auxiliares/ToolTip';

const ModalDoacao = ({ isOpen, onClose, doacao, onStatusChange }) => {
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    setNovoStatus(doacao.status || '');
  }, [doacao]);

  const handleSalvar = async () => {
    if (novoStatus === 'cancelada') {
      try {
        const res = await fetch(`${connect}/entregas/cancelar/${doacao.id}`, {
          method: 'POST'
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Erro ao cancelar a doação.');
        }

        toast.success('Doação cancelada com sucesso!');
        onStatusChange(doacao.id, 'cancelada');
        onClose();
      } catch (err) {
        toast.error('Erro ao cancelar a doação.');
        console.error(err);
      }
    } else if (novoStatus !== doacao.status) {
      onStatusChange(doacao.id, novoStatus);
      onClose();
    } else {
      onClose();
    }
  };

  const gerarLinkRota = () => {
    const destino = doacao.endereco_completo;

    if (!destino || destino.trim() === '') {
      console.error("Endereço não informado.");
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}&travelmode=driving`;
    window.open(url, '_blank');
  };


  const gerarTermo = async () => {
    try {
      const response = await fetch(`${connect}/entregas/gerar_termo/${doacao.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) throw new Error('Erro ao gerar termo');

      const blob = await response.blob();
      const nomeArquivo = `termo_${doacao.nome_assistido}_${doacao.id}.pdf`
        .replace(/\s+/g, '_')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      saveAs(blob, nomeArquivo);
    } catch (error) {
      console.error('Erro ao crear termo:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Doação #${doacao.id}`}>
      <div className="space-y-6 text-sm text-gray-800">

        {/* Informações da doação */}
        <div className='flex justify-between gap-2 items-center'>
          <h3 className="text-lg font-semibold text-sky-800">Informações da Doação</h3>
          <div className='flex items-center gap-2 pr-3'>
            {/* Gerar Rota */}
            {doacao.tipo_entrega === 'entregar' && doacao.cep_assistido && (
              <ToolTip text="Ver Rotas" position='left'>
                <button
                  onClick={gerarLinkRota}
                  className="text-emerald-500 hover:text-emerald-700"
                >
                  <MapPin size={22} />
                </button>
              </ToolTip>
            )}

            {/* Gerar Termo */}
            <ToolTip text="Baixar Termo" position='bottom'>
              <button
                onClick={gerarTermo}
                className="text-blue-500 hover:text-blue-700"
              >
                <FileDown size={22} />
              </button>
            </ToolTip>
          </div>
        </div>
        <div className="rounded-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between">
            <div className="">
              <p className="text-xs text-gray-500">Data</p>
              <p className="text-sm text-gray-800">{doacao.data}</p>
            </div>

            <div className="">
              <p className="text-xs text-gray-500">Tipo de Entrega</p>
              <p className="text-sm text-gray-800 capitalize">{doacao.tipo_entrega}</p>
            </div>

            <div className="">
              <p className="text-xs text-gray-500">Assistido</p>
              <p className="text-sm text-gray-800">{doacao.nome_assistido || doacao.assistido_id}</p>
            </div>

            <div className="">
              <p className="text-xs text-gray-500">Status</p>
              <select
                value={novoStatus}
                disabled={doacao.status === 'cancelada'}
                onChange={(e) => setNovoStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white text-sm text-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
              >
                <option value="pendente">Pendente</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="w-full">
              <div className='flex justify-between items-center'>
                <div className='w-1/2'>
                  <p className="text-xs text-gray-500">Endereço</p>
                  <p className="text-sm text-gray-800">{doacao.endereco_completo || '-'}</p>
                </div>
                <div className='w-1/2'>
                  <p className="text-xs text-gray-500">Observação</p>
                  <p className="text-sm text-gray-800">{doacao.observacao || '-'}</p>
                </div>
              </div>
            </div>

            <div className='w-full'>
              {/* Botão com o link do maps com a rota para o endereço, abrir direto no maps */}
            </div>
          </div>
        </div>

        <hr />

        {/* Lista de Itens */}
        {doacao.itens?.length > 0 && (
          <div className="rounded-md">
            <h3 className="font-semibold text-sky-800 mb-3">Itens da Doação</h3>

            <div className="space-y-3">
              {doacao.itens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-sky-600 px-3 py-1"
                >
                  <div className="flex flex-col text-xs text-gray-700">
                    <span className="text-gray-800">
                      {item.categoria} - {item.subcategoria}
                    </span>
                    <span className="text-gray-500">Quantidade: {item.quantidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Fechar
          </button>
          <button onClick={handleSalvar} disabled={doacao.status === 'cancelada'} className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 font-medium disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:cursor-not-allowed">
            Salvar Alterações
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDoacao;
