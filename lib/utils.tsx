export const formatCNPJ = (text: string) => {
  return text
    .replace(/\D/g, '') // Remove tudo o que não for número
    .replace(/^(\d{2})(\d)/, '$1.$2') // Adiciona ponto após os dois primeiros dígitos
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona ponto após os três primeiros dígitos
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra
    .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o traço
    .slice(0, 18); // Limita o comprimento a 18 caracteres
};



export const cnpjValidator = (cnpj: string): string => {
  cnpj = cnpj.replace(/[^\d]+/g, ''); 

  if (cnpj.length !== 14) return 'CNPJ deve ter 14 dígitos';

  if (/^(\d)\1+$/.test(cnpj)) return 'CNPJ não pode ter todos os dígitos iguais';

  const calcularDigito = (cnpj: string, pesoInicial: number) => {
      let soma = 0;
      let peso = pesoInicial;

      for (let i = 0; i < cnpj.length; i++) {
          soma += parseInt(cnpj[i]) * peso;
          peso = peso === 2 ? 9 : peso - 1;
      }

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cnpj.slice(0, 12), 5);
  if (primeiroDigito !== parseInt(cnpj[12])) return 'CNPJ inválido (primeiro dígito verificador incorreto)';

  const segundoDigito = calcularDigito(cnpj.slice(0, 13), 6);
  if (segundoDigito !== parseInt(cnpj[13])) return 'CNPJ inválido (segundo dígito verificador incorreto)';

  return 'CNPJ válido';
};
