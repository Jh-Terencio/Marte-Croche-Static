import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Search.module.css';

/**
 * Busca do header (FR-025): botão que expande um campo abaixo do header;
 * o envio navega para /?busca=<termo> e a HomePage aplica o filtro.
 */
export function Search() {
  const [aberta, setAberta] = useState(false);
  const [parametros] = useSearchParams();
  const [termo, setTermo] = useState('');
  const campoRef = useRef<HTMLInputElement>(null);
  const navegar = useNavigate();

  // ao abrir, foca o campo e herda o termo atual da URL
  useEffect(() => {
    if (aberta) {
      setTermo(parametros.get('busca') ?? '');
      campoRef.current?.focus();
    }
  }, [aberta]); // intencional: só reage à abertura, não à URL

  return (
    <>
      <button
        type="button"
        className={styles.botaoBusca}
        aria-expanded={aberta}
        aria-controls="busca-loja"
        aria-label={aberta ? 'Fechar busca' : 'Buscar produtos'}
        onClick={() => setAberta((valor) => !valor)}
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {aberta && (
        <form
          id="busca-loja"
          className={styles.formulario}
          role="search"
          onSubmit={(evento) => {
            evento.preventDefault();
            navegar(termo.trim() ? `/?busca=${encodeURIComponent(termo.trim())}` : '/');
            setAberta(false);
          }}
          onKeyDown={(evento) => {
            if (evento.key === 'Escape') setAberta(false);
          }}
        >
          <input
            ref={campoRef}
            type="search"
            className={styles.campo}
            value={termo}
            onChange={(evento) => setTermo(evento.target.value)}
            placeholder="Buscar por nome, categoria ou descrição"
            aria-label="Buscar produtos"
          />
          <button type="submit" className={styles.enviar}>
            Buscar
          </button>
        </form>
      )}
    </>
  );
}
