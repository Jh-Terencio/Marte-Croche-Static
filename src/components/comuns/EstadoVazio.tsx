import type { ReactNode } from 'react';
import styles from './EstadoVazio.module.css';

interface EstadoVazioProps {
  titulo: string;
  descricao?: string;
  /** Use 1 quando o estado vazio for o conteúdo principal da página. */
  nivelTitulo?: 1 | 2;
  /** Ação opcional (ex.: botão "Continuar comprando"). */
  children?: ReactNode;
}

/** Estado vazio amigável em pt-BR (catálogo, busca, carrinho). */
export function EstadoVazio({
  titulo,
  descricao,
  nivelTitulo = 2,
  children,
}: EstadoVazioProps) {
  const Titulo = nivelTitulo === 1 ? 'h1' : 'h2';
  return (
    <div className={styles.vazio}>
      <Titulo>{titulo}</Titulo>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {children}
    </div>
  );
}
