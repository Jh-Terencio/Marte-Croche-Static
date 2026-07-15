import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CarrinhoProvider, useCarrinho, carrinhoReducer } from './CarrinhoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import { criarItemTeste } from '../test/fixtures';

const wrapper = ({ children }: { children: ReactNode }) => (
  <CarrinhoProvider>{children}</CarrinhoProvider>
);

beforeEach(() => {
  window.localStorage.clear();
});

describe('carrinhoReducer', () => {
  it('adiciona, atualiza, altera quantidade, remove e esvazia', () => {
    const a = criarItemTeste({ id: 'a' });
    const b = criarItemTeste({ id: 'b', quantidade: 2 });

    let itens = carrinhoReducer([], { tipo: 'adicionar', item: a });
    itens = carrinhoReducer(itens, { tipo: 'adicionar', item: b });
    expect(itens).toHaveLength(2);

    itens = carrinhoReducer(itens, {
      tipo: 'atualizar',
      item: { ...a, observacoes: 'com laço' },
    });
    expect(itens[0].observacoes).toBe('com laço');

    itens = carrinhoReducer(itens, { tipo: 'alterarQuantidade', itemId: 'b', quantidade: 5 });
    expect(itens[1].quantidade).toBe(5);

    itens = carrinhoReducer(itens, { tipo: 'remover', itemId: 'a' });
    expect(itens.map((i) => i.id)).toEqual(['b']);

    itens = carrinhoReducer(itens, { tipo: 'esvaziar' });
    expect(itens).toEqual([]);
  });

  it('nunca deixa a quantidade cair abaixo de 1', () => {
    const itens = carrinhoReducer([criarItemTeste({ id: 'a', quantidade: 2 })], {
      tipo: 'alterarQuantidade',
      itemId: 'a',
      quantidade: 0,
    });
    expect(itens[0].quantidade).toBe(1);
  });
});

describe('CarrinhoProvider', () => {
  it('persiste itens no localStorage a cada ação', () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper });

    act(() => result.current.adicionarItem(criarItemTeste({ id: 'a' })));
    const persistido = JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!);
    expect(persistido.versao).toBe(1);
    expect(persistido.itens).toHaveLength(1);
  });

  it('restaura o carrinho persistido na montagem', () => {
    window.localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify({ versao: 1, itens: [criarItemTeste({ id: 'salvo', quantidade: 3 })] }),
    );
    const { result } = renderHook(() => useCarrinho(), { wrapper });
    expect(result.current.itens).toHaveLength(1);
    expect(result.current.itens[0].id).toBe('salvo');
    expect(result.current.quantidadeTotal).toBe(3);
  });

  it('esvaziar remove a chave do localStorage', () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper });
    act(() => result.current.adicionarItem(criarItemTeste()));
    expect(window.localStorage.getItem(CHAVE_CARRINHO)).not.toBeNull();

    act(() => result.current.esvaziar());
    expect(result.current.itens).toEqual([]);
    expect(window.localStorage.getItem(CHAVE_CARRINHO)).toBeNull();
  });

  it('quantidadeTotal soma as quantidades de todos os itens', () => {
    const { result } = renderHook(() => useCarrinho(), { wrapper });
    act(() => {
      result.current.adicionarItem(criarItemTeste({ id: 'a', quantidade: 2 }));
      result.current.adicionarItem(criarItemTeste({ id: 'b', quantidade: 3 }));
    });
    expect(result.current.quantidadeTotal).toBe(5);
  });

  it('useCarrinho fora do provider lança erro claro', () => {
    expect(() => renderHook(() => useCarrinho())).toThrow(
      'useCarrinho deve ser usado dentro de <CarrinhoProvider>',
    );
  });
});
