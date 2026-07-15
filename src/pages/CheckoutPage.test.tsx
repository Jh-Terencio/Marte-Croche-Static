import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { CheckoutPage } from './CheckoutPage';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import { FinalizacaoProvider } from '../context/FinalizacaoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import { criarItemTeste } from '../test/fixtures';

function semearCarrinho() {
  window.localStorage.setItem(
    CHAVE_CARRINHO,
    JSON.stringify({ versao: 1, itens: [criarItemTeste()] }),
  );
}

function renderizarCheckout() {
  return render(
    <MemoryRouter initialEntries={['/finalizacao']}>
      <CarrinhoProvider>
        <FinalizacaoProvider>
          <Routes>
            <Route path="/finalizacao" element={<CheckoutPage />} />
            <Route path="/revisao" element={<h1>Página de revisão</h1>} />
            <Route
              path="/carrinho"
              element={
                <>
                  <h1>Página do carrinho</h1>
                  <Link to="/finalizacao">Ir para finalização</Link>
                </>
              }
            />
          </Routes>
        </FinalizacaoProvider>
      </CarrinhoProvider>
    </MemoryRouter>,
  );
}

async function preencherFormularioValido(usuario: ReturnType<typeof userEvent.setup>) {
  await usuario.type(screen.getByLabelText(/nome completo/i), 'Maria da Silva');
  await usuario.type(screen.getByLabelText(/telefone/i), '11912345678');
  await usuario.type(screen.getByLabelText(/cep/i), '01234567');
  await usuario.type(screen.getByLabelText(/^endereço/i), 'Rua das Flores');
  await usuario.type(screen.getByLabelText(/número/i), '123');
  await usuario.type(screen.getByLabelText(/bairro/i), 'Jardim Primavera');
  await usuario.type(screen.getByLabelText(/cidade/i), 'São Paulo');
  await usuario.selectOptions(screen.getByLabelText(/estado/i), 'SP');
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('CheckoutPage', () => {
  it('com carrinho vazio não mostra o formulário', () => {
    renderizarCheckout();
    expect(
      screen.getByRole('heading', { name: 'Seu carrinho está vazio' }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/nome completo/i)).not.toBeInTheDocument();
  });

  it('valida campos obrigatórios sem apagar o que já foi digitado', async () => {
    const usuario = userEvent.setup();
    semearCarrinho();
    renderizarCheckout();

    await usuario.type(screen.getByLabelText(/nome completo/i), 'Maria da Silva');
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }));

    // erros claros por campo, em pt-BR
    expect(screen.getByText('Informe um telefone válido com DDD.')).toBeInTheDocument();
    expect(screen.getByText('Informe um CEP válido (ex.: 01234-567).')).toBeInTheDocument();
    expect(screen.getAllByText('Preencha este campo.').length).toBeGreaterThan(0);
    expect(screen.getByText('Selecione o estado.')).toBeInTheDocument();

    // dados válidos preservados; navegação bloqueada
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Maria da Silva');
    expect(
      screen.queryByRole('heading', { name: 'Página de revisão' }),
    ).not.toBeInTheDocument();
  });

  it('aplica máscaras de telefone e CEP durante a digitação', async () => {
    const usuario = userEvent.setup();
    semearCarrinho();
    renderizarCheckout();

    await usuario.type(screen.getByLabelText(/telefone/i), '11912345678');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('(11) 91234-5678');

    await usuario.type(screen.getByLabelText(/cep/i), '01234567');
    expect(screen.getByLabelText(/cep/i)).toHaveValue('01234-567');
  });

  it('com dados válidos avança para a revisão', async () => {
    const usuario = userEvent.setup();
    semearCarrinho();
    renderizarCheckout();

    await preencherFormularioValido(usuario);
    await usuario.click(screen.getByRole('button', { name: 'Revisar pedido' }));

    expect(screen.getByRole('heading', { name: 'Página de revisão' })).toBeInTheDocument();
  });

  it('voltar ao carrinho e retornar preserva os dados da sessão (FR-029)', async () => {
    const usuario = userEvent.setup();
    semearCarrinho();
    renderizarCheckout();

    await usuario.type(screen.getByLabelText(/nome completo/i), 'Maria da Silva');
    await usuario.type(screen.getByLabelText(/telefone/i), '11912345678');

    await usuario.click(screen.getByRole('button', { name: 'Voltar ao carrinho' }));
    expect(screen.getByRole('heading', { name: 'Página do carrinho' })).toBeInTheDocument();

    await usuario.click(screen.getByRole('link', { name: 'Ir para finalização' }));
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Maria da Silva');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('(11) 91234-5678');
  });
});
