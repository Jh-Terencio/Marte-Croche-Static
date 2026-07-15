import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categorias } from '../../data/categorias';
import styles from './CatalogMenu.module.css';

/**
 * Menu "Catálogo" com as categorias (FR-005/FR-006).
 * Abre por hover no desktop E por clique/toque/teclado em qualquer
 * dispositivo — nenhuma função depende só de hover (Constituição §11).
 */
export function CatalogMenu() {
  const [aberto, setAberto] = useState(false);
  // Em dispositivos de toque, mouseenter dispara junto do toque e faria o
  // menu abrir e fechar no mesmo gesto — hover só vale onde há hover real.
  const [suportaHover] = useState(
    () => window.matchMedia('(hover: hover)').matches,
  );
  const location = useLocation();

  // fecha ao navegar (clique em categoria ou qualquer mudança de rota)
  useEffect(() => {
    setAberto(false);
  }, [location]);

  return (
    <div
      className={styles.catalogo}
      onMouseEnter={suportaHover ? () => setAberto(true) : undefined}
      onMouseLeave={suportaHover ? () => setAberto(false) : undefined}
      onKeyDown={(evento) => {
        if (evento.key === 'Escape') setAberto(false);
      }}
    >
      <button
        type="button"
        className={styles.gatilho}
        aria-expanded={aberto}
        aria-haspopup="true"
        onClick={() => setAberto((valor) => !valor)}
      >
        Catálogo
        <svg
          className={styles.seta}
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {aberto && (
        <ul className={styles.submenu}>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <Link to={`/?categoria=${categoria.id}`}>{categoria.nome}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
