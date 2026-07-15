/**
 * Dados do cliente (Constituição §8).
 * Existem SOMENTE em memória durante a sessão — é PROIBIDO
 * persisti-los em qualquer armazenamento (Constituição §6, FR-039).
 */

export interface DadosCliente {
  nomeCompleto: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
  observacoesGerais: string;
}
