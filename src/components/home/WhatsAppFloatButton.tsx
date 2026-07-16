import { config } from '../../data/config';
import styles from './WhatsAppFloatButton.module.css';

/**
 * Atalho flutuante para o WhatsApp da loja (canto inferior direito da home).
 * Abre a conversa apenas com o clique explícito do cliente — sem mensagem
 * pré-preenchida, como o link de contato do footer (Constituição §2/§3.IV).
 */
export function WhatsAppFloatButton() {
  return (
    <a
      href={`https://wa.me/${config.numeroWhatsApp}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.flutuante}
      aria-label="Falar com a Marte Crochê no WhatsApp"
    >
      <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24">
        <path
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.2 0-.4 0-.5l-.7-1.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.4-.3z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}
