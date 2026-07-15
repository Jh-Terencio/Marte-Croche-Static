import type { ReactNode } from 'react';
import type { ItemCarrinho } from '../../types/carrinho';
import { totalPedido } from '../../lib/preco';
import { formatarReais } from '../../lib/formatacao';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  itens: ItemCarrinho[];
  /** Ações da página (finalizar, continuar comprando, esvaziar). */
  children?: ReactNode;
}

/** Resumo do pedido: total sempre derivado das funções puras (RN-01). */
export function CartSummary({ itens, children }: CartSummaryProps) {
  const quantidadeDePecas = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <section className={styles.resumo} aria-label="Resumo do pedido">
      <h2 className={styles.titulo}>Resumo do pedido</h2>
      <div className={styles.linha}>
        <span>
          {quantidadeDePecas === 1 ? '1 peça' : `${quantidadeDePecas} peças`}
        </span>
        <span>{formatarReais(totalPedido(itens))}</span>
      </div>
      <div className={styles.total}>
        <span>Total</span>
        <span>{formatarReais(totalPedido(itens))}</span>
      </div>
      <p className={styles.aviso}>
        O valor e a forma da entrega são combinados com a gente pelo WhatsApp
        depois do envio do pedido.
      </p>
      <div className={styles.acoes}>{children}</div>
    </section>
  );
}
