import type { ReactNode } from 'react';
import styles from './MensagemErro.module.css';

interface MensagemErroProps {
  children: ReactNode;
  /** Para associar ao campo via aria-describedby. */
  id?: string;
}

/** Mensagem de erro exibida junto ao campo correspondente (Constituição §10). */
export function MensagemErro({ children, id }: MensagemErroProps) {
  return (
    <p role="alert" id={id} className={styles.erro}>
      {children}
    </p>
  );
}
