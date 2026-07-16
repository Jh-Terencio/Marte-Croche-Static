import type { Produto } from '../../types/produto';
import { precoUnitario, subtotal } from '../../lib/preco';
import { formatarReais } from '../../lib/formatacao';
import styles from './PriceSummary.module.css';

interface PriceSummaryProps {
  produto: Produto;
  adicionaisIds: string[];
  quantidade: number;
}

export function PriceSummary({ produto, adicionaisIds, quantidade }: PriceSummaryProps) {
  const unitario = precoUnitario(produto, adicionaisIds);
  const valorSubtotal = subtotal(unitario, quantidade);

  const adicionaisSelecionados = produto.adicionais.filter((a) =>
    adicionaisIds.includes(a.id),
  );

  return (
    <div className={styles.resumo} aria-live="polite">
      <div className={styles.linha}>
        <span>Peça</span>
        <span>{formatarReais(produto.precoBaseCentavos)}</span>
      </div>
      {adicionaisSelecionados.map((a) => (
        <div key={a.id} className={styles.linha}>
          <span>{a.nome}</span>
          <span>+{formatarReais(a.precoCentavos)}</span>
        </div>
      ))}
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
