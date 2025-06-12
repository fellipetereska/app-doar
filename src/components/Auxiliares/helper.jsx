export function getInstituicaoId() {
  const storage = localStorage.getItem('doar');
  if (!storage) return null;

  try {
    const parsed = JSON.parse(storage);
    return parsed?.usuario?.instituicao?.id || parsed?.usuario?.instituicao_id || null;
  } catch (e) {
    return null;
  }
}

export function formatarEndereco(item) {
  const {
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
  } = item;

  return `${endereco ?? ''}, ${numero ?? ''}${complemento ? ' - ' + complemento : ''}, ${bairro ?? ''} - ${cidade ?? ''}/${uf ?? ''}`;
}

export function formatarCep(item) {
  const { cep } = item;

  if (!cep) {
    return;
  }

  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatarTelefone(item) {
  const { telefone } = item;

  if (!telefone) {
    return;
  }

  return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
}

export function formatarDocumento(item) {
  const { tipo_documento, documento, cnpj } = item;

  if (!tipo_documento && cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }

  if (!tipo_documento || !documento) {
    return;
  }

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

export function formatarDataIso(dataIso, time = false) {
  if (!dataIso) return '-';

  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${ano}${time ? ` às ${hora}:${minutos}` : ''}`;
}

export async function buscarEnderecoPorCep(cep) {
  const OPENCAGE_KEY = '13abcb3bb47b473bb6edf363c4ef52b3';
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido. Deve conter 8 dígitos.');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao buscar o CEP.');
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado.');
    }

    const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}, Brasil`;

    // Consulta à API OpenCage
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(enderecoCompleto)}&key=${OPENCAGE_KEY}&language=pt&countrycode=br`);
    const geoData = await geoRes.json();

    let latitude = '';
    let longitude = '';

    if (geoData.results.length > 0) {
      latitude = geoData.results[0].geometry.lat;
      longitude = geoData.results[0].geometry.lng;
    }

    return {
      endereco: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
      latitude,
      longitude
    };
  } catch (error) {
    throw new Error(error.message || 'Erro ao buscar o CEP.');
  }
}

export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}