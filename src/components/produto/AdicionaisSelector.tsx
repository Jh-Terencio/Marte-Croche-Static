import type { AdicionalDoProduto } from '../../types/produto';
import { formatarReais } from '../../lib/formatacao';
import { ColorSelector } from './ColorSelector';
import styles from './AdicionaisSelector.module.css';

interface AdicionaisSelectorProps {
  adicionais: AdicionalDoProduto[];
  selecionados: Record<string, Record<string, string | null>>;
  onToggle: (adicionalId: string) => void;
  onOpcao: (adicionalId: string, opcaoId: string, valorId: string | null) => void;
  erros: Record<string, string>;
}

export function AdicionaisSelector({
  adicionais,
  selecionados,
  onToggle,
  onOpcao,
  erros,
}: AdicionaisSelectorProps) {
  if (adicionais.length === 0) return null;

  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.legenda}>Adicionais</legend>
      <div className={styles.lista}>
        {adicionais.map((adicional) => {
          const ativo = adicional.id in selecionados;
          return (
            <div key={adicional.id} className={styles.adicional}>
              <button
                type="button"
                className={styles.opcao}
                aria-pressed={ativo}
                onClick={() => onToggle(adicional.id)}
              >
                {adicional.nome}
                {adicional.precoCentavos > 0 && (
                  <span className={styles.acrescimo}>
                    +{formatarReais(adicional.precoCentavos)}
                  </span>
                )}
              </button>

              {ativo &&
                adicional.opcoes.map((opcao) => {
                  const erroKey = `adicional_${adicional.id}_${opcao.id}`;
                  return (
                    <div key={opcao.id} className={styles.subOpcao}>
                      {opcao.tipo === 'cor' ? (
                        <ColorSelector
                          legenda={opcao.legenda}
                          obrigatoriedade={opcao.obrigatoria ? 'obrigatória' : 'opcional'}
                          cores={opcao.valores.map((v) => ({
                            id: v.id,
                            nome: v.nome,
                            valorVisual: v.valorVisual ?? '#ccc',
                            imagens: [],
                          }))}
                          selecionadaId={selecionados[adicional.id]?.[opcao.id] ?? null}
                          onSelecionar={(valorId) =>
                            onOpcao(adicional.id, opcao.id, valorId)
                          }
                        />
                      ) : (
                        <div className={styles.selecaoOpcoes}>
                          <span className={styles.legendaOpcao}>{opcao.legenda}</span>
                          <div className={styles.valoresOpcao}>
                            {opcao.valores.map((valor) => (
                              <button
                                key={valor.id}
                                type="button"
                                className={styles.valorOpcao}
                                aria-pressed={
                                  selecionados[adicional.id]?.[opcao.id] === valor.id
                                }
                                onClick={() =>
                                  onOpcao(adicional.id, opcao.id, valor.id)
                                }
                              >
                                {valor.nome}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {erros[erroKey] && (
                        <p className={styles.erro}>{erros[erroKey]}</p>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
