import type { Produto } from '../types/produto';
import type { PersonalizacaoItem } from '../types/carrinho';
import type { DadosCliente } from '../types/cliente';
import type { ConfiguracaoLoja } from '../data/config';

export interface ResultadoValidacao {
  valido: boolean;
  /** chave = campo, valor = mensagem em pt-BR */
  erros: Record<string, string>;
}

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

  if (personalizacao.quantidadeCores === 2) {
    if (!personalizacao.corSecundariaId) {
      erros.corSecundaria = 'Escolha a segunda cor.';
    } else if (!idsDeCores.includes(personalizacao.corSecundariaId)) {
      erros.corSecundaria = 'Escolha uma das cores disponíveis.';
    } else if (
      !produto.permiteCorRepetida &&
      personalizacao.corSecundariaId === personalizacao.corPrincipalId
    ) {
      erros.corSecundaria = 'Este modelo não permite repetir a mesma cor.';
    }
  }

  for (const adicional of produto.adicionais) {
    const selecionado = personalizacao.adicionaisSelecionados[adicional.id];
    if (!selecionado) continue;

    for (const opcao of adicional.opcoes) {
      if (opcao.obrigatoria && !selecionado[opcao.id]) {
        erros[`adicional_${adicional.id}_${opcao.id}`] =
          `Escolha ${opcao.legenda.toLowerCase()} para ${adicional.nome.toLowerCase()}.`;
      } else if (selecionado[opcao.id]) {
        const valorExiste = opcao.valores.some((v) => v.id === selecionado[opcao.id]);
        if (!valorExiste) {
          erros[`adicional_${adicional.id}_${opcao.id}`] =
            'Escolha uma das opções disponíveis.';
        }
      }
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
