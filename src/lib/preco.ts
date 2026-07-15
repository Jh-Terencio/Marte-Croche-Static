import type { Produto } from '../types/produto';
import type { ItemCarrinho } from '../types/carrinho';
import type { ConfiguracaoLoja } from '../data/config';

/**
 * Cálculo de preços (RN-01..03) — funções puras em centavos.
 * O acréscimo da alça vem SEMPRE da configuração central.
 */

/** Preço unitário: base + alça quando o produto permite e o cliente escolheu. */
export function precoUnitario(
  produto: Produto,
  comAlca: boolean,
  config: ConfiguracaoLoja,
): number {
  const acrescimoAlca =
    produto.permiteAlca && comAlca ? config.precoAlcaComBolsaCentavos : 0;
  return produto.precoBaseCentavos + acrescimoAlca;
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
