import { formatarTelefone } from '../Auxiliares/helper';

const CardDoacao = ({ doacao, onEdit, onDelete }) => {
  return (
    <div className="bg-white border-gray-200 rounded-md shadow-md px-5 py-2 flex flex-col justify-between h-full transition hover:shadow-lg hover:border hover:border-sky-600">
      <div className="flex flex-col gap-1 mb-2">
        <div className='flex justify-between items-center gap-2'>
          <span className="text-xs text-gray-400">Doação #{doacao.doacao_id}</span>
          <span className={`text-xs mt-2 w-fit px-3 py-0.5 rounded-full font-medium capitalize
          ${doacao.status === 'pendente' && 'bg-yellow-100 border border-yellow-400 text-yellow-700'}
          ${doacao.status === 'aceita' && 'bg-green-100 border border-green-400 text-green-700'}
          ${doacao.status === 'recusada' && 'bg-red-100 border border-red-400 text-red-600'}`}>
            {doacao.status}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-800">{doacao.nome_usuario || 'Nome do Doador'}</h3>
        <p className="text-xs text-gray-600 capitalize">📞 {formatarTelefone(doacao)}</p>
        <p className="text-xs text-gray-600 capitalize">📦 Tipo: {doacao.tipo_entrega}</p>

        {doacao.tipo_entrega === 'retirada' && (
          <>
            <p className="text-xs text-gray-600 capitalize">📍 {doacao.endereco}</p>
            <p className='text-xs text-gray-600 capitalize'>⏱️ {doacao.horario_retirada}</p>
          </>
        )}

      </div>
      {onEdit && (
        <button
          onClick={() => onEdit(doacao)}
          className="w-full mt-1 px-4 py-1 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-900 transition"
          title="Visualizar"
        >
          Ver mais
        </button>
      )}
    </div>
  );
};

export default CardDoacao;
