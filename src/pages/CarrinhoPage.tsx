import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { CartItem } from '../components/carrinho/CartItem';
import { CartSummary } from '../components/carrinho/CartSummary';
import { Botao } from '../components/comuns/Botao';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import { ModalConfirmacao } from '../components/comuns/ModalConfirmacao';
import styles from './CarrinhoPage.module.css';

/**
 * Página do carrinho (FR-021..024): lista editável, totais reativos,
 * esvaziar com confirmação e avanço para a finalização.
 */
export function CarrinhoPage() {
  const { itens, alterarQuantidade, removerItem, esvaziar } = useCarrinho();
  const [confirmandoEsvaziar, setConfirmandoEsvaziar] = useState(false);
  const navegar = useNavigate();

  if (itens.length === 0) {
    return (
      <EstadoVazio
        titulo="Seu carrinho está vazio"
        descricao="Escolha uma peça feita à mão para começar a sua encomenda."
        nivelTitulo={1}
      >
        <Botao onClick={() => navegar('/')}>Continuar comprando</Botao>
      </EstadoVazio>
    );
  }

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Seu carrinho</h1>

      <div className={styles.conteudo}>
        <div className={styles.lista}>
          {itens.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onAlterarQuantidade={(quantidade) =>
                alterarQuantidade(item.id, quantidade)
              }
              onRemover={() => removerItem(item.id)}
            />
          ))}
          <button
            type="button"
            className={styles.esvaziar}
            onClick={() => setConfirmandoEsvaziar(true)}
          >
            Esvaziar carrinho
          </button>
        </div>

        <CartSummary itens={itens}>
          <Botao onClick={() => navegar('/finalizacao')}>Finalizar pedido</Botao>
          <Botao variante="secundario" onClick={() => navegar('/')}>
            Continuar comprando
          </Botao>
        </CartSummary>
      </div>

      <ModalConfirmacao
        aberto={confirmandoEsvaziar}
        titulo="Esvaziar o carrinho?"
        descricao="Todas as peças e personalizações escolhidas serão removidas."
        textoConfirmar="Esvaziar carrinho"
        textoCancelar="Manter itens"
        onConfirmar={() => {
          esvaziar();
          setConfirmandoEsvaziar(false);
        }}
        onCancelar={() => setConfirmandoEsvaziar(false)}
      />
    </div>
  );
}
