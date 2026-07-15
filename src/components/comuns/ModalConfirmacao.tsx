import { useEffect, useRef, type KeyboardEvent } from 'react';
import { Botao } from './Botao';
import styles from './ModalConfirmacao.module.css';

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  textoConfirmar: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Diálogo de confirmação acessível: foco inicial no cancelar (ação segura),
 * Esc cancela, Tab circula entre os controles, foco restaurado ao fechar.
 */
export function ModalConfirmacao({
  aberto,
  titulo,
  descricao,
  textoConfirmar,
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  const caixaRef = useRef<HTMLDivElement>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const focoAnterior = document.activeElement as HTMLElement | null;
    cancelarRef.current?.focus();
    return () => focoAnterior?.focus();
  }, [aberto]);

  if (!aberto) return null;

  function aoTeclar(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      onCancelar();
      return;
    }
    if (evento.key === 'Tab') {
      // laço de foco simples entre os elementos focáveis da caixa
      const focaveis = caixaRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focaveis || focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  }

  return (
    <div className={styles.fundo} onClick={onCancelar}>
      <div
        ref={caixaRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className={styles.caixa}
        onClick={(evento) => evento.stopPropagation()}
        onKeyDown={aoTeclar}
      >
        <h2 id="modal-titulo">{titulo}</h2>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
        <div className={styles.acoes}>
          <Botao ref={cancelarRef} variante="secundario" onClick={onCancelar}>
            {textoCancelar}
          </Botao>
          <Botao variante="primario" onClick={onConfirmar}>
            {textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
