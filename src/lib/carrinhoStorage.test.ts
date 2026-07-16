import {
  CHAVE_CARRINHO,
  carregarCarrinho,
  salvarCarrinho,
  limparCarrinho,
} from './carrinhoStorage';
import { criarItemTeste } from '../test/fixtures';

function criarStorageFalso(): Storage {
  const dados = new Map<string, string>();
  return {
    get length() {
      return dados.size;
    },
    key: (i: number) => [...dados.keys()][i] ?? null,
    getItem: (chave: string) => dados.get(chave) ?? null,
    setItem: (chave: string, valor: string) => void dados.set(chave, valor),
    removeItem: (chave: string) => void dados.delete(chave),
    clear: () => dados.clear(),
  };
}

function criarStorageQueLanca(): Storage {
  const lancar = () => {
    throw new Error('storage indisponível');
  };
  return {
    length: 0,
    key: lancar,
    getItem: lancar,
    setItem: lancar,
    removeItem: lancar,
    clear: lancar,
  };
}

describe('carrinhoStorage', () => {
  it('round-trip: salvar e carregar devolve itens equivalentes', () => {
    const storage = criarStorageFalso();
    const itens = [
      criarItemTeste({ id: 'a' }),
      criarItemTeste({
        id: 'b',
        quantidade: 3,
        adicionais: [
          {
            adicionalId: 'alca-corrente',
            nomeAdicional: 'Alça de corrente',
            precoCentavos: 1500,
            opcoes: [],
          },
        ],
      }),
    ];
    salvarCarrinho(storage, itens);
    expect(carregarCarrinho(storage)).toEqual(itens);
  });

  it('JSON corrompido → [] sem lançar e remove a chave', () => {
    const storage = criarStorageFalso();
    storage.setItem(CHAVE_CARRINHO, '{corrompido!!!');
    expect(carregarCarrinho(storage)).toEqual([]);
    expect(storage.getItem(CHAVE_CARRINHO)).toBeNull();
  });

  it('versão desconhecida → [] e remove a chave', () => {
    const storage = criarStorageFalso();
    storage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 99, itens: [criarItemTeste()] }));
    expect(carregarCarrinho(storage)).toEqual([]);
    expect(storage.getItem(CHAVE_CARRINHO)).toBeNull();
  });

  it('item inválido no meio de válidos → somente os válidos retornam', () => {
    const storage = criarStorageFalso();
    const valido = criarItemTeste({ id: 'ok' });
    const invalido = { id: 'quebrado', quantidade: 'muitas' };
    storage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 1, itens: [valido, invalido] }));
    expect(carregarCarrinho(storage)).toEqual([valido]);
  });

  it('storage que lança em getItem/setItem/removeItem não propaga exceção', () => {
    const storage = criarStorageQueLanca();
    expect(() => carregarCarrinho(storage)).not.toThrow();
    expect(carregarCarrinho(storage)).toEqual([]);
    expect(() => salvarCarrinho(storage, [criarItemTeste()])).not.toThrow();
    expect(() => limparCarrinho(storage)).not.toThrow();
  });

  it('limparCarrinho remove a chave', () => {
    const storage = criarStorageFalso();
    salvarCarrinho(storage, [criarItemTeste()]);
    expect(storage.getItem(CHAVE_CARRINHO)).not.toBeNull();
    limparCarrinho(storage);
    expect(storage.getItem(CHAVE_CARRINHO)).toBeNull();
  });

  it('payload não contém nenhum campo de dados pessoais', () => {
    const storage = criarStorageFalso();
    salvarCarrinho(storage, [criarItemTeste()]);
    const persistido = JSON.parse(storage.getItem(CHAVE_CARRINHO)!) as {
      versao: number;
      itens: Record<string, unknown>[];
    };
    const chavesPermitidas = [
      'id',
      'produtoId',
      'nomeProduto',
      'categoriaNome',
      'imagem',
      'precoUnitarioCentavos',
      'quantidade',
      'corPrincipal',
      'corSecundaria',
      'adicionais',
      'observacoes',
    ].sort();
    expect(Object.keys(persistido).sort()).toEqual(['itens', 'versao']);
    for (const item of persistido.itens) {
      expect(Object.keys(item).sort()).toEqual(chavesPermitidas);
    }
  });
});
