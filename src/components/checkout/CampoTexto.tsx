import { useId, type HTMLInputAutoCompleteAttribute } from 'react';
import { MensagemErro } from '../comuns/MensagemErro';
import styles from './Campo.module.css';

interface CampoTextoProps {
  rotulo: string;
  valor: string;
  onAlterar: (valor: string) => void;
  obrigatorio?: boolean;
  erro?: string;
  /** Aplicada a cada digitação (ex.: mascaraTelefone, mascaraCep). */
  mascara?: (valor: string) => string;
  multilinha?: boolean;
  inputMode?: 'text' | 'numeric' | 'tel';
  autoComplete?: HTMLInputAutoCompleteAttribute;
  placeholder?: string;
  maxLength?: number;
}

/**
 * Campo de texto do formulário (FR-027): rótulo visível associado,
 * indicação de obrigatório, máscara opcional e erro junto ao campo.
 */
export function CampoTexto({
  rotulo,
  valor,
  onAlterar,
  obrigatorio = false,
  erro,
  mascara,
  multilinha = false,
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
}: CampoTextoProps) {
  const campoId = useId();
  const erroId = `${campoId}-erro`;

  const propsComuns = {
    id: campoId,
    className: styles.entrada,
    value: valor,
    onChange: (
      evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onAlterar(mascara ? mascara(evento.target.value) : evento.target.value),
    'aria-invalid': erro ? true : undefined,
    'aria-describedby': erro ? erroId : undefined,
    placeholder,
    maxLength,
  };

  return (
    <div className={styles.campo}>
      <label className={styles.rotulo} htmlFor={campoId}>
        {rotulo}{' '}
        {obrigatorio ? (
          <span className={styles.obrigatorio} aria-hidden="true">
            *
          </span>
        ) : (
          <span className={styles.opcional}>(opcional)</span>
        )}
      </label>
      {multilinha ? (
        <textarea {...propsComuns} />
      ) : (
        <input type="text" inputMode={inputMode} autoComplete={autoComplete} {...propsComuns} />
      )}
      {erro && <MensagemErro id={erroId}>{erro}</MensagemErro>}
    </div>
  );
}
