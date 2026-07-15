import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { slidesCarrossel } from '../../data/carrossel';
import { ImageWithFallback } from '../comuns/ImageWithFallback';
import styles from './HeroCarousel.module.css';

const INTERVALO_AUTOPLAY_MS = 5000;

function prefereMenosMovimento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Carrossel de destaque (FR-007): navegação manual, indicadores,
 * autoplay opcional pausável (desligado com prefers-reduced-motion)
 * e espaço reservado — sem saltos de layout.
 */
export function HeroCarousel() {
  const [indice, setIndice] = useState(0);
  const [emPausaTemporaria, setEmPausaTemporaria] = useState(false);
  const [autoplayAtivo, setAutoplayAtivo] = useState(() => !prefereMenosMovimento());
  const total = slidesCarrossel.length;

  useEffect(() => {
    if (!autoplayAtivo || emPausaTemporaria || total <= 1) return;
    const temporizador = setInterval(
      () => setIndice((atual) => (atual + 1) % total),
      INTERVALO_AUTOPLAY_MS,
    );
    return () => clearInterval(temporizador);
  }, [autoplayAtivo, emPausaTemporaria, total]);

  if (total === 0) return null;

  const anterior = () => setIndice((atual) => (atual - 1 + total) % total);
  const proxima = () => setIndice((atual) => (atual + 1) % total);

  return (
    <section
      className={styles.carrossel}
      aria-label="Destaques da Marte Crochê"
      onMouseEnter={() => setEmPausaTemporaria(true)}
      onMouseLeave={() => setEmPausaTemporaria(false)}
      onFocusCapture={() => setEmPausaTemporaria(true)}
      onBlurCapture={() => setEmPausaTemporaria(false)}
    >
      <div className={styles.janela}>
        <ul
          className={styles.trilha}
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {slidesCarrossel.map((slide, posicao) => {
            const visivel = posicao === indice;
            const imagem = (
              <ImageWithFallback
                src={slide.imagem}
                alt={slide.alt}
                className={styles.slideImagem}
                loading={posicao === 0 ? 'eager' : 'lazy'}
              />
            );
            return (
              <li key={slide.imagem} className={styles.slide} aria-hidden={!visivel}>
                {slide.produtoId ? (
                  <Link
                    to={`/produto/${slide.produtoId}`}
                    className={styles.slideLink}
                    tabIndex={visivel ? 0 : -1}
                  >
                    {imagem}
                  </Link>
                ) : (
                  imagem
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className={`${styles.controle} ${styles.anterior}`}
            aria-label="Imagem anterior"
            onClick={anterior}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M12.5 4l-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.controle} ${styles.proxima}`}
            aria-label="Próxima imagem"
            onClick={proxima}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M7.5 4l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className={styles.indicadores}>
            {slidesCarrossel.map((slide, posicao) => (
              <button
                key={slide.imagem}
                type="button"
                className={styles.indicador}
                aria-label={`Ir para imagem ${posicao + 1} de ${total}`}
                aria-current={posicao === indice}
                onClick={() => setIndice(posicao)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.pausa}
            aria-pressed={!autoplayAtivo}
            aria-label={
              autoplayAtivo ? 'Pausar avanço automático' : 'Ativar avanço automático'
            }
            onClick={() => setAutoplayAtivo((valor) => !valor)}
          >
            {autoplayAtivo ? (
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
                <path d="M4 2l8 5-8 5z" fill="currentColor" />
              </svg>
            )}
          </button>
        </>
      )}
    </section>
  );
}
