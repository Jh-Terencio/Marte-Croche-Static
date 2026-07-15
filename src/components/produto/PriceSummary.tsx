import type { Produto } from '../../types/produto';
import { config } from '../../data/config';
import { precoUnitario, subtotal } from '../../lib/preco';
import { formatarReais } from '../../lib/formatacao';
import styles from './PriceSummary.module.css';

interface PriceSummaryProps {
  produto: Produto;
  comAlca: boolean;
  quantidade: number;
}

/** Resumo do preço, atualizado imediatamente a cada escolha (FR-020). */
export function PriceSummary({ produto, comAlca, quantidade }: PriceSummaryProps) {
  const unitario = precoUnitario(produto, comAlca, config);
  const valorSubtotal = subtotal(unitario, quantidade);
  const alcaInclusa = produto.permiteAlca && comAlca;

  return (
    <div className={styles.resumo} aria-live="polite">
      <div className={styles.linha}>
        <span>Peça</span>
        <span>{formatarReais(produto.precoBaseCentavos)}</span>
      </div>
      {alcaInclusa && (
        <div className={styles.linha}>
          <span>Alça de crochê</span>
          <span>+{formatarReais(config.precoAlcaComBolsaCentavos)}</span>
        </div>
      )}
      <div className={styles.linha}>
        <span>Valor unitário</span>
        <span>{formatarReais(unitario)}</span>
      </div>
      <div className={styles.total}>
        <span>
          Subtotal{quantidade > 1 ? ` (×${quantidade})` : ''}
        </span>
        <span>{formatarReais(valorSubtotal)}</span>
      </div>
    </div>
  );
}
