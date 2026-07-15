import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { useFinalizacao } from '../context/FinalizacaoContext';
import { config } from '../data/config';
import { montarMensagem, montarUrlWhatsApp } from '../lib/mensagem';
import { validarDadosCliente } from '../lib/validacao';
import { OrderPreview } from '../components/pedido/OrderPreview';
import { WhatsAppOrderButton } from '../components/pedido/WhatsAppOrderButton';
import { Botao } from '../components/comuns/Botao';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import { ModalConfirmacao } from '../components/comuns/ModalConfirmacao';
import styles from './RevisaoPage.module.css';

/**
 * Revisão e envio (FR-030/031/035, RN-10): nada é aberto sem clique;
 * após abrir o WhatsApp o carrinho permanece intacto — só "Novo pedido",
 * com confirmação, o esvazia.
 */
export function RevisaoPage() {
  const { itens, esvaziar } = useCarrinho();
  const { dados } = useFinalizacao();
  const navegar = useNavigate();
  const [pedidoEncaminhado, setPedidoEncaminhado] = useState(false);
  const [confirmandoNovoPedido, setConfirmandoNovoPedido] = useState(false);

  if (itens.length === 0) {
    return (
      <EstadoVazio
        titulo="Seu carrinho está vazio"
        descricao="Escolha uma peça para montar seu pedido."
      >
        <Botao onClick={() => navegar('/')}>Ver o catálogo</Botao>
      </EstadoVazio>
    );
  }

  if (!validarDadosCliente(dados).valido) {
    return (
      <EstadoVazio
        titulo="Falta completar seus dados"
        descricao="Precisamos do seu nome, telefone e endereço para montar a mensagem do pedido."
      >
        <Botao onClick={() => navegar('/finalizacao')}>Preencher meus dados</Botao>
      </EstadoVazio>
    );
  }

  const mensagem = montarMensagem(itens, dados, config);
  const url = montarUrlWhatsApp(mensagem, config);

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Revise seu pedido</h1>

      <OrderPreview itens={itens} dados={dados} mensagem={mensagem} />

      {pedidoEncaminhado ? (
        <div className={styles.encaminhado}>
          <h2>Pedido encaminhado ao WhatsApp</h2>
          <p className={styles.encaminhadoTexto}>
            Confirme o envio da mensagem lá no aplicativo. Seu carrinho continua
            guardado aqui — nada se perde se algo der errado.
          </p>
          <p className={styles.fallback}>
            O WhatsApp não abriu?{' '}
            <a href={url} target="_blank" rel="noopener noreferrer">
              Toque aqui para abrir o WhatsApp.
            </a>
          </p>
          <div className={styles.acoes}>
            <Botao onClick={() => setConfirmandoNovoPedido(true)}>Novo pedido</Botao>
            <Botao variante="secundario" onClick={() => setPedidoEncaminhado(false)}>
              Continuar com este carrinho
            </Botao>
          </div>
        </div>
      ) : (
        <div className={styles.acoes}>
          <WhatsAppOrderButton url={url} onEnviado={() => setPedidoEncaminhado(true)} />
          <Botao variante="secundario" onClick={() => navegar('/carrinho')}>
            Editar carrinho
          </Botao>
          <Botao variante="secundario" onClick={() => navegar('/finalizacao')}>
            Editar informações
          </Botao>
        </div>
      )}

      <ModalConfirmacao
        aberto={confirmandoNovoPedido}
        titulo="Começar um novo pedido?"
        descricao="O carrinho atual será esvaziado. Faça isso apenas se você já enviou a mensagem no WhatsApp."
        textoConfirmar="Esvaziar e começar de novo"
        textoCancelar="Manter este pedido"
        onConfirmar={() => {
          esvaziar();
          setConfirmandoNovoPedido(false);
          navegar('/');
        }}
        onCancelar={() => setConfirmandoNovoPedido(false)}
      />
    </div>
  );
}
