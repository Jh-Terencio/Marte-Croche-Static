import { useId } from 'react';
import { MensagemErro } from '../comuns/MensagemErro';
import styles from './Campo.module.css';

interface CampoSelectProps {
  rotulo: string;
  valor: string;
  onAlterar: (valor: string) => void;
  opcoes: readonly string[];
  obrigatorio?: boolean;
  erro?: string;
  autoComplete?: string;
}

/** Campo de seleção com rótulo associado e erro junto ao campo. */
export function CampoSelect({
  rotulo,
  valor,
  onAlterar,
  opcoes,
  obrigatorio = false,
  erro,
  autoComplete,
}: CampoSelectProps) {
  const campoId = useId();
  const erroId = `${campoId}-erro`;

  return (
    <div className={styles.campo}>
      <label className={styles.rotulo} htmlFor={campoId}>
        {rotulo}{' '}
        {obrigatorio && (
          <span className={styles.obrigatorio} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        id={campoId}
        className={styles.entrada}
        value={valor}
        onChange={(evento) => onAlterar(evento.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? erroId : undefined}
        autoComplete={autoComplete}
      >
        <option value="">Selecione</option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      {erro && <MensagemErro id={erroId}>{erro}</MensagemErro>}
    </div>
  );
}
