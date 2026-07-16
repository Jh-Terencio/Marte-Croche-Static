import { Link } from 'react-router-dom';
import type { Produto } from '../../types/produto';
import { nomeDaCategoria } from '../../data/categorias';
import { formatarReais } from '../../lib/formatacao';
import { ImageWithFallback } from '../comuns/ImageWithFallback';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  produto: Produto;
}

function resumoDasOpcoes(produto: Produto): string {
  const partes: string[] = [];
  if (produto.cores.length > 0) {
    partes.push(produto.cores.length === 1 ? '1 cor' : `${produto.cores.length} cores`);
  }
  if (produto.adicionais.length > 0) {
    partes.push('com adicionais');
  }
  return partes.join(' · ');
}

/** Card do catálogo (FR-008). */
export function ProductCard({ produto }: ProductCardProps) {
  const resumo = resumoDasOpcoes(produto);

  return (
    <article className={styles.card} aria-label={produto.nome}>
      <ImageWithFallback
        src={produto.imagensPadrao[0] ?? ''}
        alt={`${produto.nome} — foto principal`}
        className={styles.imagem}
      />
      <div className={styles.corpo}>
        <span className={styles.categoria}>{nomeDaCategoria(produto.categoriaId)}</span>
        <h3 className={styles.nome}>{produto.nome}</h3>
        <p className={styles.preco}>
          {produto.adicionais.length > 0 && (
            <span className={styles.aPartirDe}>a partir de</span>
          )}
          {formatarReais(produto.precoBaseCentavos)}
        </p>
        <div className={styles.detalhes}>
          <span>Confecção: {produto.prazoConfeccao}</span>
          {resumo && (
            <span className={styles.cores}>
              {produto.cores.map((cor) => (
                <span
                  key={cor.id}
                  className={styles.amostraCor}
                  style={{ backgroundColor: cor.valorVisual }}
                  title={cor.nome}
                />
              ))}
              {resumo}
            </span>
          )}
        </div>
        {!produto.disponivel && (
          <span className={styles.indisponivel}>Indisponível no momento</span>
        )}
        <div className={styles.acao}>
          {produto.disponivel ? (
            <Link to={`/produto/${produto.id}`} className={styles.botaoDetalhes}>
              Ver detalhes
            </Link>
          ) : (
            <span aria-hidden="true" className={styles.botaoDetalhes} style={{ opacity: 0.5 }}>
              Ver detalhes
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
