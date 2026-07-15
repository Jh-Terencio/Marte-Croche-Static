import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './Botao.module.css';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario';
}

export const Botao = forwardRef<HTMLButtonElement, BotaoProps>(function Botao(
  { variante = 'primario', className, type, ...props },
  ref,
) {
  const classes = [styles.botao, styles[variante], className].filter(Boolean).join(' ');
  return <button ref={ref} type={type ?? 'button'} className={classes} {...props} />;
});
