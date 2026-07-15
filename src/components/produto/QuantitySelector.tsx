import { useId } from 'react';
import { config } from '../../data/config';
import styles from './QuantitySelector.module.css';

interface QuantitySelectorProps {
  quantidade: number;
  onAlterar: (quantidade: number) => void;
  maximo?: number;
}

/** Seletor de quantidade 1..máximo (RN-11), acessível e com área de toque adequada. */
export function QuantitySelector({
  quantidade,
  onAlterar,
  maximo = config.quantidadeMaximaPorItem,
}: QuantitySelectorProps) {
  const campoId = useId();

  function aplicar(valor: number) {
    if (Number.isNaN(valor)) return;
    onAlterar(Math.min(maximo, Math.max(1, Math.trunc(valor))));
  }

  return (
    <div className={styles.grupo}>
      <label className={styles.rotulo} htmlFor={campoId}>
        Quantidade
      </label>
      <div className={styles.controles}>
        <button
          type="button"
          className={styles.botao}
          aria-label="Diminuir quantidade"
          disabled={quantidade <= 1}
          onClick={() => aplicar(quantidade - 1)}
        >
          −
        </button>
        <input
          id={campoId}
          className={styles.campo}
          type="number"
          inputMode="numeric"
          min={1}
          max={maximo}
          value={quantidade}
          onChange={(evento) => aplicar(evento.target.valueAsNumber)}
        />
        <button
          type="button"
          className={styles.botao}
          aria-label="Aumentar quantidade"
          disabled={quantidade >= maximo}
          onClick={() => aplicar(quantidade + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
