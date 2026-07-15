import { useEffect, useState } from 'react';
import type { Produto } from '../../types/produto';
import { ImageWithFallback } from '../comuns/ImageWithFallback';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  produto: Produto;
  /** Cor principal selecionada — a galeria sempre a acompanha (RN-07). */
  corSelecionadaId: string | null;
}

/**
 * Galeria do produto (FR-015): antes da escolha da cor mostra as imagens
 * padrão; ao escolher/trocar a cor, TODA a galeria muda imediatamente,
 * com a primeira imagem da lista como principal. As imagens das demais
 * cores são pré-carregadas para a troca ser instantânea (research D13).
 */
export function ProductGallery({ produto, corSelecionadaId }: ProductGalleryProps) {
  const cor = produto.cores.find((c) => c.id === corSelecionadaId);
  const imagens =
    cor && cor.imagens.length > 0 ? cor.imagens : produto.imagensPadrao;
  const [indicePrincipal, setIndicePrincipal] = useState(0);

  // trocar de cor sempre volta para a primeira imagem daquela cor
  useEffect(() => {
    setIndicePrincipal(0);
  }, [corSelecionadaId]);

  // pré-carrega as imagens de todas as cores uma única vez
  useEffect(() => {
    for (const c of produto.cores) {
      for (const caminho of c.imagens) {
        const imagem = new Image();
        imagem.src = caminho;
      }
    }
  }, [produto]);

  const altDaFoto = (posicao: number) =>
    cor
      ? `${produto.nome} na cor ${cor.nome} — foto ${posicao + 1}`
      : `${produto.nome} — foto ${posicao + 1}`;

  const principal = imagens[Math.min(indicePrincipal, imagens.length - 1)] ?? '';

  return (
    <div className={styles.galeria}>
      <ImageWithFallback
        key={principal}
        src={principal}
        alt={altDaFoto(Math.min(indicePrincipal, imagens.length - 1))}
        fallbackSrc={produto.imagensPadrao[0]}
        className={styles.principal}
        loading="eager"
      />

      {imagens.length > 1 && (
        <ul className={styles.miniaturas} aria-label="Mais fotos desta cor">
          {imagens.map((caminho, posicao) => (
            <li key={caminho}>
              <button
                type="button"
                className={styles.miniatura}
                aria-current={posicao === indicePrincipal}
                aria-label={`Ver ${altDaFoto(posicao)}`}
                onClick={() => setIndicePrincipal(posicao)}
              >
                <ImageWithFallback
                  src={caminho}
                  alt=""
                  fallbackSrc={produto.imagensPadrao[0]}
                  className={styles.miniaturaImagem}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
