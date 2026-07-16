import { precoUnitario, subtotal, totalPedido } from './preco';
import { criarProdutoTeste, criarItemTeste } from '../test/fixtures';

describe('precoUnitario', () => {
  it('sem adicionais custa o preço base', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 12000 });
    expect(precoUnitario(bolsa, [])).toBe(12000);
  });

  it('com um adicional selecionado acresce o preço do adicional', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 12000 });
    expect(precoUnitario(bolsa, ['alca-corrente'])).toBe(13500);
  });

  it('com múltiplos adicionais soma todos os acréscimos', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 12000 });
    expect(precoUnitario(bolsa, ['alca-corrente', 'alca-longa-croche'])).toBe(15000);
  });

  it('ignora IDs de adicionais que não existem no produto', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 10000 });
    expect(precoUnitario(bolsa, ['adicional-inexistente'])).toBe(10000);
  });

  it('produto sem adicionais disponíveis retorna apenas o preço base', () => {
    const capinha = criarProdutoTeste({ adicionais: [], precoBaseCentavos: 4500 });
    expect(precoUnitario(capinha, [])).toBe(4500);
  });
});

describe('subtotal', () => {
  it('multiplica preço unitário pela quantidade', () => {
    expect(subtotal(13500, 2)).toBe(27000);
    expect(subtotal(2000, 3)).toBe(6000);
  });

  it('quantidade 1 devolve o próprio preço unitário', () => {
    expect(subtotal(12000, 1)).toBe(12000);
  });
});

describe('totalPedido', () => {
  it('carrinho vazio soma zero', () => {
    expect(totalPedido([])).toBe(0);
  });

  it('soma subtotais de carrinho misto', () => {
    const itens = [
      criarItemTeste({ id: 'a', precoUnitarioCentavos: 13500, quantidade: 2 }),
      criarItemTeste({ id: 'b', precoUnitarioCentavos: 2000, quantidade: 1 }),
    ];
    expect(totalPedido(itens)).toBe(29000);
  });
});
