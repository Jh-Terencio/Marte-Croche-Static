import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { ItemCarrinho } from '../types/carrinho';
import { carregarCarrinho, salvarCarrinho, limparCarrinho } from '../lib/carrinhoStorage';

/**
 * Único estado global da aplicação (research D4).
 * Cada ação sincroniza com o localStorage via efeito;
 * dados pessoais nunca passam por aqui.
 */

type AcaoCarrinho =
  | { tipo: 'adicionar'; item: ItemCarrinho }
  | { tipo: 'atualizar'; item: ItemCarrinho }
  | { tipo: 'alterarQuantidade'; itemId: string; quantidade: number }
  | { tipo: 'remover'; itemId: string }
  | { tipo: 'esvaziar' };

export function carrinhoReducer(itens: ItemCarrinho[], acao: AcaoCarrinho): ItemCarrinho[] {
  switch (acao.tipo) {
    case 'adicionar':
      return [...itens, acao.item];
    case 'atualizar':
      return itens.map((item) => (item.id === acao.item.id ? acao.item : item));
    case 'alterarQuantidade':
      return itens.map((item) =>
        item.id === acao.itemId
          ? { ...item, quantidade: Math.max(1, Math.trunc(acao.quantidade)) }
          : item,
      );
    case 'remover':
      return itens.filter((item) => item.id !== acao.itemId);
    case 'esvaziar':
      return [];
  }
}

interface CarrinhoApi {
  itens: ItemCarrinho[];
  /** Soma das quantidades — contador do ícone do carrinho. */
  quantidadeTotal: number;
  adicionarItem: (item: ItemCarrinho) => void;
  atualizarItem: (item: ItemCarrinho) => void;
  alterarQuantidade: (itemId: string, quantidade: number) => void;
  removerItem: (itemId: string) => void;
  esvaziar: () => void;
}

const CarrinhoContext = createContext<CarrinhoApi | null>(null);

/** Acesso protegido: em modo privado/bloqueado retorna null e seguimos só em memória. */
function obterStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, dispatch] = useReducer(carrinhoReducer, undefined, () => {
    const storage = obterStorage();
    return storage ? carregarCarrinho(storage) : [];
  });

  useEffect(() => {
    const storage = obterStorage();
    if (!storage) return;
    if (itens.length === 0) {
      // esvaziar remove a chave de fato (contrato armazenamento-carrinho.md)
      limparCarrinho(storage);
    } else {
      salvarCarrinho(storage, itens);
    }
  }, [itens]);

  const api = useMemo<CarrinhoApi>(
    () => ({
      itens,
      quantidadeTotal: itens.reduce((soma, item) => soma + item.quantidade, 0),
      adicionarItem: (item) => dispatch({ tipo: 'adicionar', item }),
      atualizarItem: (item) => dispatch({ tipo: 'atualizar', item }),
      alterarQuantidade: (itemId, quantidade) =>
        dispatch({ tipo: 'alterarQuantidade', itemId, quantidade }),
      removerItem: (itemId) => dispatch({ tipo: 'remover', itemId }),
      esvaziar: () => dispatch({ tipo: 'esvaziar' }),
    }),
    [itens],
  );

  return <CarrinhoContext.Provider value={api}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho(): CarrinhoApi {
  const contexto = useContext(CarrinhoContext);
  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de <CarrinhoProvider>');
  }
  return contexto;
}
