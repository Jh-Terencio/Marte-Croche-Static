/**
 * Formatação e máscaras (funções puras — contracts/funcoes-negocio.md).
 * Preços circulam em CENTAVOS (inteiros) por toda a aplicação.
 */

const formatadorReais = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Centavos → "R$ 1.234,56". Usa espaço comum (não NBSP) para a mensagem do WhatsApp. */
export function formatarReais(centavos: number): string {
  return formatadorReais.format(centavos / 100).replace(/[  ]/g, ' ');
}

/** Dígitos → "(11) 91234-5678" (celular) ou "(11) 1234-5678" (fixo). Ignora não-dígitos. */
export function mascaraTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/** Dígitos → "123.456.789-01". Ignora não-dígitos; máximo 11 dígitos. */
export function mascaraCpf(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
  if (digitos.length <= 9)
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

/** Dígitos → "01234-567". Ignora não-dígitos; máximo 8 dígitos. */
export function mascaraCep(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}
