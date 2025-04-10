import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative">
        {/* Header */}
        <div className='flex justify-between items-center mb-2 px-6 py-3'>
          <div className="flex flex-col">
            <h1 className='text-xl font-bold text-sky-700'>{title}</h1>
            <p className="text-sm text-gray-500">Preencha o formulário e clique em <i>"Salvar"</i> para adicionar um item ao estoque!</p>
          </div>
          {/* Close button */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded text-sm w-8 h-8"
              onClick={onClose}>
              <svg className="flex m-auto w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className='px-6 py-3'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
