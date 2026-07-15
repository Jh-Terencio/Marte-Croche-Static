import type { ReactNode } from 'react';
import styles from './EstadoVazio.module.css';

interface EstadoVazioProps {
  titulo: string;
  descricao?: string;
  /** Ação opcional (ex.: botão "Continuar comprando"). */
  children?: ReactNode;
}

/** Estado vazio amigável em pt-BR (catálogo, busca, carrinho). */
export function EstadoVazio({ titulo, descricao, children }: EstadoVazioProps) {
  return (
    <div className={styles.vazio}>
      <h2>{titulo}</h2>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {children}
    </div>
  );
}
