import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { CartButton } from './CartButton';
import { Search } from './Search';
import styles from './Header.module.css';

/**
 * Header da loja (FR-004/FR-005): logo, navegação, carrinho.
 * No celular a navegação vive em um painel recolhível controlado
 * pelo botão de menu; no desktop fica sempre visível.
 */
export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  // fecha o painel ao navegar para qualquer rota
  useEffect(() => {
    setMenuAberto(false);
  }, [location]);

  return (
    <header className={styles.header}>
      <div className={styles.conteudo}>
        <Link to="/" className={styles.logo} onClick={() => window.scrollTo({ top: 0 })}>
          Marte <em>Crochê</em>
        </Link>
        <div className={styles.acoes}>
          <Search />
          <CartButton />
          <button
            type="button"
            className={styles.botaoMenu}
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuAberto((valor) => !valor)}
          >
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
              {menuAberto ? (
                <path
                  d="M5 5l14 14M19 5L5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <div id="menu-principal" className={menuAberto ? styles.menuAberto : styles.menu}>
        <Navigation />
      </div>
    </header>
  );
}
