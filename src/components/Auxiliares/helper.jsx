// src/utils/authHelpers.js
export function getInstituicaoId() {
  const dados = localStorage.getItem('user');
  if (!dados) return null;

  try {
    const parsed = JSON.parse(dados);
    return parsed?.instituicao?.id || parsed?.usuario?.instituicao_id || null;
  } catch (e) {
    return null;
  }
}

export function formatarEndereco(item) {
  const {
    logradouro,
    nome_logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
  } = item;

  return `${logradouro ?? ''} ${nome_logradouro ?? ''}, ${numero ?? ''}${complemento ? ' - ' + complemento : ''}, ${bairro ?? ''} - ${cidade ?? ''}/${uf ?? ''}`;
}

export function formatarTelefone(item) {
  const { telefone } = item;
  return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
}

export function formatarDocumento(item) {
  const { tipo_documento, documento } = item;

  switch (tipo_documento) {
    case 'cpf':
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

    case 'rg':
    case 'rne':
    case 'crnm':
      return documento.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");

    case 'cnpj':
      return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

    case 'caepf':
      return documento.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3/$4-$5");
      
    default:
      return documento;
  }

}