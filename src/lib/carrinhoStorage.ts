import type { ItemCarrinho, CorEscolhida } from '../types/carrinho';

/**
 * Persistência do carrinho em localStorage (contracts/armazenamento-carrinho.md).
 * Única chave de storage da aplicação — dados pessoais NUNCA entram aqui
 * (Constituição §6). Leitura defensiva: conteúdo inválido é descartado em
 * silêncio; falhas de storage nunca quebram a aplicação.
 */

export const CHAVE_CARRINHO = 'marte-croche:carrinho';
const VERSAO_ATUAL = 1;

function ehCorEscolhidaOuNull(valor: unknown): valor is CorEscolhida | null {
  if (valor === null) return true;
  if (typeof valor !== 'object') return false;
  const cor = valor as Record<string, unknown>;
  return typeof cor.id === 'string' && typeof cor.nome === 'string';
}

function ehItemValido(valor: unknown): valor is ItemCarrinho {
  if (typeof valor !== 'object' || valor === null) return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.produtoId === 'string' &&
    typeof item.nomeProduto === 'string' &&
    typeof item.categoriaNome === 'string' &&
    typeof item.imagem === 'string' &&
    typeof item.precoUnitarioCentavos === 'number' &&
    Number.isInteger(item.precoUnitarioCentavos) &&
    item.precoUnitarioCentavos > 0 &&
    typeof item.quantidade === 'number' &&
    Number.isInteger(item.quantidade) &&
    item.quantidade >= 1 &&
    typeof item.comAlca === 'boolean' &&
    typeof item.observacoes === 'string' &&
    ehCorEscolhidaOuNull(item.corPrincipal) &&
    ehCorEscolhidaOuNull(item.corSecundaria) &&
    ehCorEscolhidaOuNull(item.corAlca)
  );
}

function removerComSeguranca(storage: Storage): void {
  try {
    storage.removeItem(CHAVE_CARRINHO);
  } catch {
    // storage indisponível — nada a fazer
  }
}

/** Carrega o carrinho; qualquer conteúdo inválido é descartado e retorna []. */
export function carregarCarrinho(storage: Storage): ItemCarrinho[] {
  try {
    const bruto = storage.getItem(CHAVE_CARRINHO);
    if (bruto === null) return [];

    const dados: unknown = JSON.parse(bruto);
    if (typeof dados !== 'object' || dados === null) {
      removerComSeguranca(storage);
      return [];
    }

    const { versao, itens } = dados as { versao?: unknown; itens?: unknown };
    if (versao !== VERSAO_ATUAL || !Array.isArray(itens)) {
      removerComSeguranca(storage);
      return [];
    }

    return itens.filter(ehItemValido);
  } catch {
    removerComSeguranca(storage);
    return [];
  }
}

/** Salva o carrinho; falha de escrita é silenciosa (aplicação segue em memória). */
export function salvarCarrinho(storage: Storage, itens: ItemCarrinho[]): void {
  try {
    storage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: VERSAO_ATUAL, itens }));
  } catch {
    // cota excedida ou storage indisponível — segue em memória
  }
}

/** Esvazia o carrinho removendo a chave por completo. */
export function limparCarrinho(storage: Storage): void {
  removerComSeguranca(storage);
}
