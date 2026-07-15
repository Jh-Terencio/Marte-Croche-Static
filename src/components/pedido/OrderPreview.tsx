import type { ItemCarrinho } from '../../types/carrinho';
import type { DadosCliente } from '../../types/cliente';
import { formatarReais, mascaraCep } from '../../lib/formatacao';
import { subtotal, totalPedido } from '../../lib/preco';
import styles from './OrderPreview.module.css';

interface OrderPreviewProps {
  itens: ItemCarrinho[];
  dados: DadosCliente;
  /** Saída exata de montarMensagem — exibida sem nenhuma alteração. */
  mensagem: string;
}

/** Revisão completa do pedido antes do envio (FR-030). */
export function OrderPreview({ itens, dados, mensagem }: OrderPreviewProps) {
  return (
    <div className={styles.previa}>
      <section className={styles.secao} aria-label="Itens do pedido">
        <h2>Itens do pedido</h2>
        {itens.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.detalhesItem}>
              <span className={styles.nomeItem}>{item.nomeProduto}</span>
              {item.corPrincipal && item.corSecundaria ? (
                <span>
                  Cores: {item.corPrincipal.nome} + {item.corSecundaria.nome}
                </span>
              ) : (
                item.corPrincipal && <span>Cor: {item.corPrincipal.nome}</span>
              )}
              {item.comAlca && item.corAlca && (
                <span>Com alça · {item.corAlca.nome}</span>
              )}
              {item.observacoes && <span>Obs.: {item.observacoes}</span>}
              <span>
                {item.quantidade} × {formatarReais(item.precoUnitarioCentavos)}
              </span>
            </div>
            <span className={styles.subtotalItem}>
              {formatarReais(subtotal(item.precoUnitarioCentavos, item.quantidade))}
            </span>
          </div>
        ))}
        <div className={styles.total}>
          <span>Total do pedido</span>
          <span>{formatarReais(totalPedido(itens))}</span>
        </div>
      </section>

      <section className={styles.secao} aria-label="Dados do cliente">
        <h2>Seus dados</h2>
        <p className={styles.dados}>
          <span>{dados.nomeCompleto}</span>
          <span>{dados.telefone}</span>
        </p>
      </section>

      <section className={styles.secao} aria-label="Endereço de entrega">
        <h2>Endereço</h2>
        <p className={styles.dados}>
          <span>
            {dados.endereco}, {dados.numero}
            {dados.complemento && ` — ${dados.complemento}`}
          </span>
          <span>
            {dados.bairro} · {dados.cidade} - {dados.estado}
          </span>
          <span>CEP {mascaraCep(dados.cep)}</span>
          {dados.referencia && <span>Referência: {dados.referencia}</span>}
        </p>
      </section>

      <section className={styles.secao} aria-label="Prévia da mensagem">
        <h2>Mensagem que será enviada</h2>
        <p className={styles.explicacao}>
          É exatamente isto que vai preenchido para o WhatsApp da Marte Crochê —
          você ainda confirma o envio por lá.
        </p>
        <pre className={styles.mensagem}>{mensagem}</pre>
      </section>
    </div>
  );
}
