import type { ItemCarrinho, CorEscolhida } from '../types/carrinho';

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
    Array.isArray(item.adicionais) &&
    typeof item.observacoes === 'string' &&
    ehCorEscolhidaOuNull(item.corPrincipal) &&
    ehCorEscolhidaOuNull(item.corSecundaria)
  );
}

function removerComSeguranca(storage: Storage): void {
  try {
    storage.removeItem(CHAVE_CARRINHO);
  } catch {
    // storage indisponível
  }
}

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

export function salvarCarrinho(storage: Storage, itens: ItemCarrinho[]): void {
  try {
    storage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: VERSAO_ATUAL, itens }));
  } catch {
    // cota excedida ou storage indisponível
  }
}

export function limparCarrinho(storage: Storage): void {
  removerComSeguranca(storage);
}
