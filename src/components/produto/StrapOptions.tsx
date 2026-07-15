import type { Produto } from '../../types/produto';
import { config } from '../../data/config';
import { formatarReais } from '../../lib/formatacao';
import { ColorSelector } from './ColorSelector';
import styles from './StrapOptions.module.css';

interface StrapOptionsProps {
  produto: Produto;
  comAlca: boolean;
  corAlcaId: string | null;
  onAlterarAlca: (comAlca: boolean) => void;
  onSelecionarCorAlca: (corId: string | null) => void;
}

/**
 * Opção com/sem alça (FR-012): o seletor de cor da alça só existe
 * quando "Com alça" está marcado (RN-06); o acréscimo exibido vem
 * da configuração central (RN-03).
 */
export function StrapOptions({
  produto,
  comAlca,
  corAlcaId,
  onAlterarAlca,
  onSelecionarCorAlca,
}: StrapOptionsProps) {
  if (!produto.permiteAlca) return null;

  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.legenda}>Alça</legend>
      <div className={styles.opcoes}>
        <button
          type="button"
          className={styles.opcao}
          aria-pressed={!comAlca}
          onClick={() => onAlterarAlca(false)}
        >
          Sem alça
        </button>
        <button
          type="button"
          className={styles.opcao}
          aria-pressed={comAlca}
          onClick={() => onAlterarAlca(true)}
        >
          Com alça de crochê{' '}
          <span className={styles.acrescimo}>
            +{formatarReais(config.precoAlcaComBolsaCentavos)}
          </span>
        </button>
      </div>

      {comAlca && (
        <ColorSelector
          legenda="Cor da alça"
          obrigatoriedade="obrigatória"
          cores={produto.coresAlca}
          selecionadaId={corAlcaId}
          onSelecionar={onSelecionarCorAlca}
        />
      )}
    </fieldset>
  );
}
