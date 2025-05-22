import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Modal from './Modal';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';


const ModalDoacao = ({ isOpen, onClose, doacao, onStatusChange, onRemoveItem }) => {
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    setNovoStatus(doacao.status || '');
  }, [doacao]);

  const handleSalvar = () => {
    if (novoStatus !== doacao.status) {
      onStatusChange(doacao.id, novoStatus);
    }
    setNovoStatus('');
    onClose();
  };

  const handleRemoverItem = (item) => {
    Swal.fire({
      title: 'Remover item?',
      html: `Tem certeza que deseja remover <strong>(x${item.quantidade}) ${item.categoria} - ${item.subcategoria}</strong> da doação?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setNovoStatus('');
        onRemoveItem(item.item_id);
        Swal.fire({
          icon: 'success',
          title: 'Item removido!',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Doação #${doacao.id}`}>
      <div className="space-y-6 text-sm text-gray-800">

        {/* Informações da doação */}
        <h3 className="text-lg font-semibold text-sky-800">Informações da Doação</h3>
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
                onChange={(e) => setNovoStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white text-sm text-gray-800"
              >
                <option value="pendente">Pendente</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="w-full">
              <p className="text-xs text-gray-500">Observação</p>
              <p className="text-sm text-gray-800">{doacao.observacao || '-'}</p>
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

                  <button
                    onClick={() => handleRemoverItem(item)}
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
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Fechar
          </button>
          <button onClick={handleSalvar} className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800 font-medium">
            Salvar Alterações
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDoacao;
