import { useEffect, useState, type CSSProperties } from 'react';
import { config } from '../../data/config';
import styles from './ImageWithFallback.module.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  /** Fallback específico (ex.: imagem padrão do produto) tentado antes do global. */
  fallbackSrc?: string;
  /**
   * Reserva o espaço e evita saltos de layout (ex.: "1 / 1").
   * Sem a prop, vale o padrão 4/3 — sobrescrevível por CSS via --proporcao-imagem.
   */
  aspectRatio?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Imagem com estado de carregamento e cadeia de fallback (FR-017):
 * src → fallbackSrc (imagem padrão do produto) → config.imagemFallback.
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  aspectRatio,
  className,
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [srcAtual, setSrcAtual] = useState(src);
  const [carregada, setCarregada] = useState(false);

  // Troca de cor muda o src: recomeça o ciclo de carregamento.
  useEffect(() => {
    setSrcAtual(src);
    setCarregada(false);
  }, [src]);

  function aoFalhar() {
    if (fallbackSrc && srcAtual !== fallbackSrc && srcAtual !== config.imagemFallback) {
      setSrcAtual(fallbackSrc);
    } else if (srcAtual !== config.imagemFallback) {
      setSrcAtual(config.imagemFallback);
    } else {
      // até o fallback global falhou — mantém o esqueleto como fundo
      setCarregada(true);
    }
  }

  const estiloMoldura: CSSProperties | undefined = aspectRatio
    ? ({ '--proporcao-imagem': aspectRatio } as CSSProperties)
    : undefined;

  return (
    <span className={[styles.moldura, className].filter(Boolean).join(' ')} style={estiloMoldura}>
      {!carregada && <span className={styles.esqueleto} aria-hidden="true" />}
      <img
        src={srcAtual}
        alt={alt}
        loading={loading}
        className={[styles.imagem, carregada ? '' : styles.carregando].join(' ')}
        onLoad={() => setCarregada(true)}
        onError={aoFalhar}
      />
    </span>
  );
}
