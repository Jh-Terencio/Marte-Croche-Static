import { precoUnitario, subtotal, totalPedido } from './preco';
import { criarConfigTeste, criarProdutoTeste, criarItemTeste } from '../test/fixtures';

const config = criarConfigTeste();

describe('precoUnitario', () => {
  it('bolsa sem alça custa o preço base (RN-01)', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 12000 });
    expect(precoUnitario(bolsa, false, config)).toBe(12000);
  });

  it('bolsa com alça acresce R$ 15,00 (RN-01)', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 12000 });
    expect(precoUnitario(bolsa, true, config)).toBe(13500);
  });

  it('alça avulsa custa R$ 20,00 (RN-02)', () => {
    const alca = criarProdutoTeste({
      id: 'alca-teste',
      categoriaId: 'alcas',
      precoBaseCentavos: config.precoAlcaAvulsaCentavos,
      permiteAlca: false,
    });
    expect(precoUnitario(alca, false, config)).toBe(2000);
  });

  it('ignora o acréscimo quando o produto não permite alça', () => {
    const capinha = criarProdutoTeste({ permiteAlca: false, precoBaseCentavos: 4500 });
    expect(precoUnitario(capinha, true, config)).toBe(4500);
  });

  it('usa o valor da configuração central, não um número fixo (RN-03)', () => {
    const bolsa = criarProdutoTeste({ precoBaseCentavos: 10000 });
    const configCustom = criarConfigTeste({ precoAlcaComBolsaCentavos: 1800 });
    expect(precoUnitario(bolsa, true, configCustom)).toBe(11800);
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

  it('soma subtotais de carrinho misto (bolsa com alça ×2 + alça avulsa ×1)', () => {
    const itens = [
      criarItemTeste({ id: 'a', precoUnitarioCentavos: 13500, quantidade: 2, comAlca: true }),
      criarItemTeste({ id: 'b', produtoId: 'alca-teste', precoUnitarioCentavos: 2000, quantidade: 1 }),
    ];
    expect(totalPedido(itens)).toBe(29000);
  });
});
