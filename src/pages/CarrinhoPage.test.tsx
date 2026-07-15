import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CarrinhoPage } from './CarrinhoPage';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import { criarItemTeste } from '../test/fixtures';
import type { ItemCarrinho } from '../types/carrinho';

function semearCarrinho(itens: ItemCarrinho[]) {
  window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 1, itens }));
}

function renderizarCarrinho() {
  return render(
    <MemoryRouter initialEntries={['/carrinho']}>
      <CarrinhoProvider>
        <Routes>
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/finalizacao" element={<h1>Página de finalização</h1>} />
          <Route path="/" element={<h1>Página inicial</h1>} />
        </Routes>
      </CarrinhoProvider>
    </MemoryRouter>,
  );
}

// item baseado em produto real do catálogo (bolsa-lua) para o fluxo de edição
function itemDeBolsaLua(sobrescrever: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return criarItemTeste({
    id: 'item-lua',
    produtoId: 'bolsa-lua',
    nomeProduto: 'Bolsa Lua',
    categoriaNome: 'Bolsas',
    precoUnitarioCentavos: 12000,
    ...sobrescrever,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('CarrinhoPage', () => {
  it('restaura os itens persistidos na montagem (FR-024)', () => {
    semearCarrinho([itemDeBolsaLua({ quantidade: 2 })]);
    renderizarCarrinho();
    expect(screen.getByRole('heading', { name: 'Bolsa Lua' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade')).toHaveValue(2);
    expect(screen.getAllByText('R$ 240,00').length).toBeGreaterThan(0);
  });

  it('alterar a quantidade atualiza subtotal e total imediatamente', async () => {
    const usuario = userEvent.setup();
    semearCarrinho([itemDeBolsaLua()]);
    renderizarCarrinho();

    await usuario.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));

    const resumo = screen.getByRole('region', { name: 'Resumo do pedido' });
    expect(within(resumo).getAllByText('R$ 240,00').length).toBeGreaterThan(0);
    expect(screen.getByText('2 peças')).toBeInTheDocument();
  });

  it('remove um item da lista', async () => {
    const usuario = userEvent.setup();
    semearCarrinho([
      itemDeBolsaLua(),
      criarItemTeste({ id: 'item-b', nomeProduto: 'Bolsa Teste B', produtoId: 'bolsa-sol' }),
    ]);
    renderizarCarrinho();

    const itemA = screen.getByRole('article', { name: 'Bolsa Lua' });
    await usuario.click(within(itemA).getByRole('button', { name: 'Remover' }));

    expect(screen.queryByRole('heading', { name: 'Bolsa Lua' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bolsa Teste B' })).toBeInTheDocument();
  });

  it('esvaziar exige confirmação: cancelar mantém, confirmar limpa', async () => {
    const usuario = userEvent.setup();
    semearCarrinho([itemDeBolsaLua()]);
    renderizarCarrinho();

    await usuario.click(screen.getByRole('button', { name: 'Esvaziar carrinho' }));
    const modal = screen.getByRole('dialog');
    expect(within(modal).getByText('Esvaziar o carrinho?')).toBeInTheDocument();

    await usuario.click(within(modal).getByRole('button', { name: 'Manter itens' }));
    expect(screen.getByRole('heading', { name: 'Bolsa Lua' })).toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Esvaziar carrinho' }));
    await usuario.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Esvaziar carrinho' }),
    );

    expect(
      screen.getByRole('heading', { name: 'Seu carrinho está vazio' }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(CHAVE_CARRINHO)).toBeNull();
  });

  it('carrinho vazio não oferece finalização', () => {
    renderizarCarrinho();
    expect(
      screen.getByRole('heading', { name: 'Seu carrinho está vazio' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Finalizar pedido' }),
    ).not.toBeInTheDocument();
  });

  it('avança para a finalização com itens no carrinho', async () => {
    const usuario = userEvent.setup();
    semearCarrinho([itemDeBolsaLua()]);
    renderizarCarrinho();

    await usuario.click(screen.getByRole('button', { name: 'Finalizar pedido' }));
    expect(
      screen.getByRole('heading', { name: 'Página de finalização' }),
    ).toBeInTheDocument();
  });

  it('item de produto existente tem link de edição; produto removido do catálogo tem aviso e só remoção', () => {
    semearCarrinho([
      itemDeBolsaLua(),
      criarItemTeste({
        id: 'item-fantasma',
        produtoId: 'produto-removido',
        nomeProduto: 'Peça Antiga',
      }),
    ]);
    renderizarCarrinho();

    const itemExistente = screen.getByRole('article', { name: 'Bolsa Lua' });
    expect(within(itemExistente).getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/produto/bolsa-lua?editar=item-lua',
    );

    const itemFantasma = screen.getByRole('article', { name: 'Peça Antiga' });
    expect(within(itemFantasma).getByText(/saiu do catálogo/i)).toBeInTheDocument();
    expect(
      within(itemFantasma).queryByRole('link', { name: 'Editar' }),
    ).not.toBeInTheDocument();
    expect(
      within(itemFantasma).getByRole('button', { name: 'Remover' }),
    ).toBeInTheDocument();
  });
});
