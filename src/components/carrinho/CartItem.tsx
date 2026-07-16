import { Link } from 'react-router-dom';
import type { ItemCarrinho } from '../../types/carrinho';
import { produtoPorId } from '../../data/produtos';
import { formatarReais } from '../../lib/formatacao';
import { subtotal } from '../../lib/preco';
import { ImageWithFallback } from '../comuns/ImageWithFallback';
import { QuantitySelector } from '../produto/QuantitySelector';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: ItemCarrinho;
  onAlterarQuantidade: (quantidade: number) => void;
  onRemover: () => void;
}

export function CartItem({ item, onAlterarQuantidade, onRemover }: CartItemProps) {
  const produtoAindaExiste = produtoPorId(item.produtoId) !== undefined;

  return (
    <article className={styles.item} aria-label={item.nomeProduto}>
      <ImageWithFallback
        src={item.imagem}
        alt={`${item.nomeProduto}${item.corPrincipal ? ` na cor ${item.corPrincipal.nome}` : ''}`}
        className={styles.imagem}
      />

      <div className={styles.corpo}>
        <div className={styles.cabecalho}>
          <h2 className={styles.nome}>{item.nomeProduto}</h2>
          <span className={styles.categoria}>{item.categoriaNome}</span>
        </div>

        <ul className={styles.personalizacoes}>
          {item.corPrincipal && item.corSecundaria ? (
            <>
              <li>Cor principal: {item.corPrincipal.nome}</li>
              <li>Segunda cor: {item.corSecundaria.nome}</li>
            </>
          ) : (
            item.corPrincipal && <li>Cor: {item.corPrincipal.nome}</li>
          )}
          {item.adicionais.map((adicional) => (
            <li key={adicional.adicionalId}>
              {adicional.nomeAdicional}
              {adicional.opcoes.map((opcao) => (
                <span key={opcao.opcaoId}> · {opcao.nomeOpcao}: {opcao.valorNome}</span>
              ))}
            </li>
          ))}
          {item.observacoes && <li>Observações: {item.observacoes}</li>}
        </ul>

        {!produtoAindaExiste && (
          <p className={styles.aviso}>
            Esta peça saiu do catálogo. Você pode removê-la do carrinho ou enviar o
            pedido mesmo assim.
          </p>
        )}

        <QuantitySelector
          quantidade={item.quantidade}
          onAlterar={onAlterarQuantidade}
        />

        <div className={styles.rodape}>
          <div className={styles.precos}>
            <span>{formatarReais(item.precoUnitarioCentavos)} cada</span>
            <span className={styles.subtotal}>
              {formatarReais(subtotal(item.precoUnitarioCentavos, item.quantidade))}
            </span>
          </div>
          <div className={styles.acoes}>
            {produtoAindaExiste && (
              <Link
                to={`/produto/${item.produtoId}?editar=${item.id}`}
                className={styles.acaoLink}
              >
                Editar
              </Link>
            )}
            <button type="button" className={styles.acaoLink} onClick={onRemover}>
              Remover
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
