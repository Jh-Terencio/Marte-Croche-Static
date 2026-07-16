import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import { Botao } from '../components/comuns/Botao';
import styles from './CheckoutPage.module.css';

/** Etapa de dados do cliente e entrega (FR-026..029). */
export function CheckoutPage() {
  const { itens } = useCarrinho();
  const navegar = useNavigate();

  if (itens.length === 0) {
    return (
      <EstadoVazio
        titulo="Seu carrinho está vazio"
        descricao="Escolha um produto para continuar. Depois é só preencher seus dados e enviar o pedido pelo WhatsApp."
        nivelTitulo={1}
      >
        <Botao onClick={() => navegar('/')}>Ver o catálogo</Botao>
      </EstadoVazio>
    );
  }

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Seus dados</h1>
      <p className={styles.subtitulo}>
        Usamos essas informações apenas para montar a mensagem do seu pedido —
        nada fica salvo no site.
      </p>
      <CheckoutForm
        onRevisar={() => navegar('/revisao')}
        onVoltarAoCarrinho={() => navegar('/carrinho')}
      />
    </div>
  );
}
