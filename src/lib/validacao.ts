import type { Produto } from '../types/produto';
import type { PersonalizacaoItem } from '../types/carrinho';
import type { DadosCliente } from '../types/cliente';
import type { ConfiguracaoLoja } from '../data/config';

/**
 * Validações (contracts/funcoes-negocio.md) — funções puras com
 * mensagens em pt-BR prontas para exibição junto ao campo.
 */

export interface ResultadoValidacao {
  valido: boolean;
  /** chave = campo, valor = mensagem em pt-BR */
  erros: Record<string, string>;
}

/** Regras RN-04..06 e RN-11 da personalização do produto. */
export function validarPersonalizacao(
  personalizacao: PersonalizacaoItem,
  produto: Produto,
  config: ConfiguracaoLoja,
): ResultadoValidacao {
  const erros: Record<string, string> = {};
  const idsDeCores = produto.cores.map((cor) => cor.id);

  if (produto.cores.length > 0) {
    if (!personalizacao.corPrincipalId) {
      erros.corPrincipal = 'Escolha a cor principal.';
    } else if (!idsDeCores.includes(personalizacao.corPrincipalId)) {
      erros.corPrincipal = 'Escolha uma das cores disponíveis.';
    }
  }

  if (personalizacao.corSecundariaId) {
    if (!idsDeCores.includes(personalizacao.corSecundariaId)) {
      erros.corSecundaria = 'Escolha uma das cores disponíveis.';
    } else if (
      !produto.permiteCorRepetida &&
      personalizacao.corSecundariaId === personalizacao.corPrincipalId
    ) {
      erros.corSecundaria = 'Este modelo não permite repetir a mesma cor.';
    }
  }

  if (produto.permiteAlca && personalizacao.comAlca) {
    const idsDeCoresDaAlca = produto.coresAlca.map((cor) => cor.id);
    if (!personalizacao.corAlcaId) {
      erros.corAlca = 'Escolha a cor da alça.';
    } else if (!idsDeCoresDaAlca.includes(personalizacao.corAlcaId)) {
      erros.corAlca = 'Escolha uma das cores disponíveis.';
    }
  }

  if (
    !Number.isInteger(personalizacao.quantidade) ||
    personalizacao.quantidade < 1 ||
    personalizacao.quantidade > config.quantidadeMaximaPorItem
  ) {
    erros.quantidade = `Informe uma quantidade entre 1 e ${config.quantidadeMaximaPorItem}.`;
  }

  if (personalizacao.observacoes.length > config.limiteObservacoes) {
    erros.observacoes = `As observações podem ter até ${config.limiteObservacoes} caracteres.`;
  }

  return { valido: Object.keys(erros).length === 0, erros };
}

/** As 27 unidades federativas brasileiras. */
export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

const LIMITE_OBSERVACOES = 500;

/** Regras do formulário de finalização (Constituição §8). */
export function validarDadosCliente(dados: DadosCliente): ResultadoValidacao {
  const erros: Record<string, string> = {};

  if (dados.nomeCompleto.trim().length < 3) {
    erros.nomeCompleto = 'Informe seu nome completo.';
  }

  const digitosTelefone = dados.telefone.replace(/\D/g, '');
  if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
    erros.telefone = 'Informe um telefone válido com DDD.';
  }

  if (!/^\d{5}-?\d{3}$/.test(dados.cep.trim())) {
    erros.cep = 'Informe um CEP válido (ex.: 01234-567).';
  }

  for (const campo of ['endereco', 'numero', 'bairro', 'cidade'] as const) {
    if (dados[campo].trim().length === 0) {
      erros[campo] = 'Preencha este campo.';
    }
  }

  if (!(UFS as readonly string[]).includes(dados.estado)) {
    erros.estado = 'Selecione o estado.';
  }

  if (dados.observacoesGerais.length > LIMITE_OBSERVACOES) {
    erros.observacoesGerais = `As observações podem ter até ${LIMITE_OBSERVACOES} caracteres.`;
  }

  return { valido: Object.keys(erros).length === 0, erros };
}
