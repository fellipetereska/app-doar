export const aplicarMascaraCPF = (valor) =>
  valor.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const aplicarMascaraTelefone = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{2})(\d)/, '($1) $2')
       .replace(/(\d{4,5})(\d{4})$/, '$1-$2');

export const aplicarMascaraCEP = (valor) =>
  valor.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');

export const aplicarMascaraCNPJ = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{2})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1/$2')
       .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

export const aplicarMascaraRG = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{2})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const aplicarMascaraRNE = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{2})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const aplicarMascaraCRNM = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{2})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const aplicarMascaraCAEPF = (valor) =>
  valor.replace(/\D/g, '')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1.$2')
       .replace(/(\d{3})(\d)/, '$1/$2')
       .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    