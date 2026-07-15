import { Link } from 'react-router-dom';
import { CatalogMenu } from './CatalogMenu';
import styles from './Navigation.module.css';

/**
 * Navegação principal: Início, Catálogo (categorias) e Contato.
 * "Contato" ancora na seção de contato do footer — presente em
 * todas as páginas, então o link funciona em qualquer rota.
 */
export function Navigation() {
  return (
    <nav aria-label="Navegação principal">
      <ul className={styles.lista}>
        <li>
          <Link to="/" onClick={() => window.scrollTo({ top: 0 })}>
            Início
          </Link>
        </li>
        <li>
          <CatalogMenu />
        </li>
        <li>
          <a href="#contato">Contato</a>
        </li>
      </ul>
    </nav>
  );
}
