import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProdutoPage } from './ProdutoPage';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import type { ItemCarrinho } from '../types/carrinho';

function renderizarProduto(rota = '/produto/bolsa-marte') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <CarrinhoProvider>
        <Routes>
          <Route path="/produto/:id" element={<ProdutoPage />} />
          <Route path="/carrinho" element={<h1>Página do carrinho</h1>} />
        </Routes>
      </CarrinhoProvider>
    </MemoryRouter>,
  );
}

function corNoGrupo(grupo: string, nome: string) {
  const fieldset = screen.getByRole('group', { name: new RegExp(`^${grupo}`, 'i') });
  const botoes = Array.from(fieldset.querySelectorAll('button'));
  return botoes.find((b) => b.textContent?.includes(nome))!;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('ProdutoPage', () => {
  it('exibe a imagem padrão antes da escolha da cor e desabilita a adição', () => {
    renderizarProduto();
    expect(screen.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeDisabled();
    expect(screen.getByText('Escolha a cor principal.')).toBeInTheDocument();
  });

  it('habilita a adição ao selecionar a cor', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor', 'Vinho'));
    expect(
      screen.getByRole('button', { name: 'Adicionar ao carrinho' }),
    ).toBeEnabled();
  });

  it('mostra toggle "1 cor" / "2 cores" quando o produto tem múltiplas cores', () => {
    renderizarProduto();
    expect(screen.getByRole('button', { name: '1 cor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2 cores' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 cor' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('não mostra toggle quando o produto tem apenas 1 cor', () => {
    renderizarProduto('/produto/bolsa-venus');
    expect(screen.queryByRole('button', { name: '1 cor' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '2 cores' })).not.toBeInTheDocument();
  });

  it('exibe segundo seletor de cor ao clicar "2 cores" e esconde ao voltar para "1 cor"', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    expect(screen.queryByRole('group', { name: /^segunda cor/i })).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: '2 cores' }));
    expect(screen.getByRole('group', { name: /^segunda cor/i })).toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: '1 cor' }));
    expect(screen.queryByRole('group', { name: /^segunda cor/i })).not.toBeInTheDocument();
  });

  it('bloqueia cor repetida quando o produto não permite (RN-05)', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(screen.getByRole('button', { name: '2 cores' }));
    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    expect(corNoGrupo('Segunda cor', 'Vinho')).toBeDisabled();
  });

  it('exibe adicionais e acrescenta o preço ao selecionar', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor', 'Vinho'));
    expect(screen.getAllByText('R$ 150,00').length).toBeGreaterThan(0);

    await usuario.click(screen.getByRole('button', { name: /alça de corrente/i }));
    expect(screen.getAllByText('R$ 165,00').length).toBeGreaterThan(0);
  });

  it('exibe seletor de cor da alça quando "Alça longa de crochê" é selecionada', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    expect(screen.queryByRole('group', { name: /^cor da alça/i })).not.toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: /alça longa de crochê/i }));
    expect(screen.getByRole('group', { name: /^cor da alça/i })).toBeInTheDocument();
  });

  it('adiciona o item personalizado ao carrinho e navega para o carrinho', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(screen.getByRole('button', { name: '2 cores' }));
    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    await usuario.click(corNoGrupo('Segunda cor', 'Bege'));
    await usuario.click(screen.getByRole('button', { name: /alça longa de crochê/i }));
    await usuario.click(corNoGrupo('Cor da alça', 'Vinho'));
    await usuario.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));
    await usuario.type(screen.getByLabelText(/observações/i), 'Com laço, por favor');

    await usuario.click(screen.getByRole('button', { name: 'Adicionar ao carrinho' }));

    expect(
      screen.getByRole('heading', { name: 'Página do carrinho' }),
    ).toBeInTheDocument();

    const persistido = JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!) as {
      itens: ItemCarrinho[];
    };
    expect(persistido.itens).toHaveLength(1);
    const item = persistido.itens[0];
    expect(item.produtoId).toBe('bolsa-marte');
    expect(item.quantidade).toBe(2);
    expect(item.corPrincipal).toEqual({ id: 'vinho', nome: 'Vinho' });
    expect(item.corSecundaria).toEqual({ id: 'bege', nome: 'Bege' });
    expect(item.adicionais).toHaveLength(1);
    expect(item.adicionais[0].adicionalId).toBe('alca-longa-croche');
    expect(item.adicionais[0].opcoes[0].valorNome).toBe('Vinho');
    expect(item.observacoes).toBe('Com laço, por favor');
  });

  it('com ?editar= carrega a personalização do item e salva alterações', async () => {
    const usuario = userEvent.setup();
    const itemSalvo: ItemCarrinho = {
      id: 'item-editavel',
      produtoId: 'bolsa-marte',
      nomeProduto: 'Bolsa Marte',
      categoriaNome: 'Bolsas',
      imagem: '/images/produtos/bolsa-marte/padrao/01-principal.webp',
      precoUnitarioCentavos: 15000,
      quantidade: 1,
      corPrincipal: { id: 'vinho', nome: 'Vinho' },
      corSecundaria: null,
      adicionais: [],
      observacoes: '',
    };
    window.localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify({ versao: 1, itens: [itemSalvo] }),
    );

    renderizarProduto('/produto/bolsa-marte?editar=item-editavel');

    expect(corNoGrupo('Cor', 'Vinho')).toHaveAttribute('aria-pressed', 'true');
    const botaoSalvar = screen.getByRole('button', { name: 'Salvar alterações' });
    expect(botaoSalvar).toBeEnabled();

    await usuario.click(corNoGrupo('Cor', 'Bege'));
    await usuario.click(botaoSalvar);

    const persistido = JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!) as {
      itens: ItemCarrinho[];
    };
    expect(persistido.itens).toHaveLength(1);
    expect(persistido.itens[0].id).toBe('item-editavel');
    expect(persistido.itens[0].corPrincipal).toEqual({ id: 'bege', nome: 'Bege' });
  });

  it('produto inexistente mostra estado vazio amigável', () => {
    renderizarProduto('/produto/nao-existe');
    expect(
      screen.getByRole('heading', { name: 'Produto não encontrado' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas as peças' })).toBeInTheDocument();
  });
});
