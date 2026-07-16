import type { Produto } from '../types/produto';
import type { ItemCarrinho } from '../types/carrinho';

/**
 * Cálculo de preços — funções puras em centavos.
 * O acréscimo de cada adicional vem do campo precoCentavos no catálogo.
 */

export function precoUnitario(
  produto: Produto,
  adicionaisSelecionadosIds: string[],
): number {
  const acrescimo = produto.adicionais
    .filter((a) => adicionaisSelecionadosIds.includes(a.id))
    .reduce((soma, a) => soma + a.precoCentavos, 0);
  return produto.precoBaseCentavos + acrescimo;
}

/** Subtotal do item: preço unitário × quantidade. */
export function subtotal(precoUnitarioCentavos: number, quantidade: number): number {
  return precoUnitarioCentavos * quantidade;
}

/** Total do pedido: soma dos subtotais de todos os itens. */
export function totalPedido(itens: ItemCarrinho[]): number {
  return itens.reduce(
    (total, item) => total + subtotal(item.precoUnitarioCentavos, item.quantidade),
    0,
  );
}
