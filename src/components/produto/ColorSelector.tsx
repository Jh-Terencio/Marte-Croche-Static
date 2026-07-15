import type { CorDeProduto } from '../../types/produto';
import styles from './ColorSelector.module.css';

interface ColorSelectorProps {
  legenda: string;
  /** Exibido ao lado da legenda: "(obrigatória)" ou "(opcional)". */
  obrigatoriedade?: 'obrigatória' | 'opcional';
  cores: CorDeProduto[];
  selecionadaId: string | null;
  /** null = desmarcada (para grupos opcionais com toggle). */
  onSelecionar: (corId: string | null) => void;
  /** Cores não selecionáveis (ex.: repetição proibida) com o motivo. */
  desabilitadas?: { ids: string[]; motivo: string };
  /** Permite desmarcar clicando na cor já selecionada (grupos opcionais). */
  permiteDesmarcar?: boolean;
}

/**
 * Grupo de amostras de cor (FR-012/FR-013). Estado selecionado é
 * perceptível por borda, fundo e ícone — nunca apenas pela cor.
 */
export function ColorSelector({
  legenda,
  obrigatoriedade,
  cores,
  selecionadaId,
  onSelecionar,
  desabilitadas,
  permiteDesmarcar = false,
}: ColorSelectorProps) {
  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.legenda}>
        {legenda}{' '}
        {obrigatoriedade && (
          <span className={styles.obrigatoriedade}>({obrigatoriedade})</span>
        )}
      </legend>
      <div className={styles.opcoes}>
        {cores.map((cor) => {
          const selecionada = cor.id === selecionadaId;
          const desabilitada = desabilitadas?.ids.includes(cor.id) ?? false;
          return (
            <button
              key={cor.id}
              type="button"
              className={styles.opcao}
              aria-pressed={selecionada}
              disabled={desabilitada}
              title={desabilitada ? desabilitadas?.motivo : undefined}
              onClick={() => {
                if (selecionada) {
                  if (permiteDesmarcar) onSelecionar(null);
                  return;
                }
                onSelecionar(cor.id);
              }}
            >
              <span
                className={styles.amostra}
                style={{ backgroundColor: cor.valorVisual }}
                aria-hidden="true"
              />
              {cor.nome}
              {selecionada && (
                <svg
                  className={styles.confirmacao}
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                >
                  <path
                    d="M2 7.5l3.5 3.5L12 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
