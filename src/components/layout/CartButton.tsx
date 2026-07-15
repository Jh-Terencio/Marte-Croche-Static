import { Link } from 'react-router-dom';
import { useCarrinho } from '../../context/CarrinhoContext';
import styles from './CartButton.module.css';

/** Ícone do carrinho com contador de itens (FR-004). */
export function CartButton() {
  const { quantidadeTotal } = useCarrinho();
  const rotulo =
    quantidadeTotal === 1 ? 'Carrinho, 1 item' : `Carrinho, ${quantidadeTotal} itens`;

  return (
    <Link to="/carrinho" className={styles.carrinho} aria-label={rotulo}>
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M6 8V7a6 6 0 0 1 12 0v1h2.5l-1 12.5a1.5 1.5 0 0 1-1.5 1.4H6a1.5 1.5 0 0 1-1.5-1.4L3.5 8H6zm2 0h8V7a4 4 0 0 0-8 0v1z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.contador} aria-hidden="true">
        {quantidadeTotal}
      </span>
    </Link>
  );
}
