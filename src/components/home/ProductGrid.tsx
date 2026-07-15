import type { Produto } from '../../types/produto';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  produtos: Produto[];
}

/** Grade responsiva de cards do catálogo. */
export function ProductGrid({ produtos }: ProductGridProps) {
  return (
    <div className={styles.grade}>
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
