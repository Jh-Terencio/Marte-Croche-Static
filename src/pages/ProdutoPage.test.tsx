import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProdutoPage } from './ProdutoPage';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import type { ItemCarrinho } from '../types/carrinho';

// bolsa-lua: 3 cores (vinho com 3 fotos, bege com 2, preto com 2),
// permiteAlca, permiteCorRepetida: false, base R$ 120,00

function renderizarProduto(rota = '/produto/bolsa-lua') {
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

function corNoGrupo(grupo: 'Cor principal' | 'Segunda cor' | 'Cor da alça', nome: string) {
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
    expect(screen.getByAltText('Bolsa Lua — foto 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeDisabled();
    expect(screen.getByText('Escolha a cor principal.')).toBeInTheDocument();
  });

  it('troca toda a galeria ao selecionar a cor principal e habilita a adição', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));

    expect(screen.getByAltText('Bolsa Lua na cor Vinho — foto 1')).toBeInTheDocument();
    // vinho tem 3 fotos → 3 miniaturas na galeria
    expect(
      screen.getAllByRole('button', { name: /ver bolsa lua na cor vinho/i }),
    ).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: 'Adicionar ao carrinho' }),
    ).toBeEnabled();
  });

  it('ao trocar de cor substitui as imagens e mantém as demais escolhas (FR-016)', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    await usuario.click(screen.getByRole('button', { name: /com alça de crochê/i }));
    await usuario.click(corNoGrupo('Cor da alça', 'Preto'));
    await usuario.click(screen.getByRole('button', { name: 'Aumentar quantidade' }));

    await usuario.click(corNoGrupo('Cor principal', 'Bege'));

    expect(screen.getByAltText('Bolsa Lua na cor Bege — foto 1')).toBeInTheDocument();
    expect(screen.queryByAltText(/na cor vinho — foto 1/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade')).toHaveValue(2);
    expect(screen.getByRole('button', { name: /com alça de crochê/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(corNoGrupo('Cor da alça', 'Preto')).toHaveAttribute('aria-pressed', 'true');
  });

  it('estrutura impede terceira cor: apenas dois grupos e a segunda cor é substituída', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    expect(
      screen.getByText('A bolsa pode combinar no máximo duas cores.'),
    ).toBeInTheDocument();

    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    await usuario.click(corNoGrupo('Segunda cor', 'Bege'));
    await usuario.click(corNoGrupo('Segunda cor', 'Preto'));

    expect(corNoGrupo('Segunda cor', 'Preto')).toHaveAttribute('aria-pressed', 'true');
    expect(corNoGrupo('Segunda cor', 'Bege')).toHaveAttribute('aria-pressed', 'false');
  });

  it('bloqueia cor repetida quando o produto não permite (RN-05)', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    expect(corNoGrupo('Segunda cor', 'Vinho')).toBeDisabled();

    // bolsa-sol permite repetir: a mesma cor fica habilitada na segunda posição
    renderizarProduto('/produto/bolsa-sol');
  });

  it('acresce R$ 15,00 ao marcar "com alça" e o seletor de cor da alça só existe nesse caso', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    expect(
      screen.queryByRole('group', { name: /^cor da alça/i }),
    ).not.toBeInTheDocument();
    // subtotal sem alça
    expect(screen.getAllByText('R$ 120,00').length).toBeGreaterThan(0);

    await usuario.click(screen.getByRole('button', { name: /com alça de crochê/i }));

    expect(screen.getByRole('group', { name: /^cor da alça/i })).toBeInTheDocument();
    expect(screen.getAllByText('R$ 135,00').length).toBeGreaterThan(0);
    // com alça marcada mas sem cor da alça, adição continua bloqueada
    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    expect(screen.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeDisabled();
    expect(screen.getByText('Escolha a cor da alça.')).toBeInTheDocument();
  });

  it('adiciona o item personalizado ao carrinho e navega para o carrinho', async () => {
    const usuario = userEvent.setup();
    renderizarProduto();

    await usuario.click(corNoGrupo('Cor principal', 'Vinho'));
    await usuario.click(corNoGrupo('Segunda cor', 'Bege'));
    await usuario.click(screen.getByRole('button', { name: /com alça de crochê/i }));
    await usuario.click(corNoGrupo('Cor da alça', 'Preto'));
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
    expect(item.produtoId).toBe('bolsa-lua');
    expect(item.precoUnitarioCentavos).toBe(13500);
    expect(item.quantidade).toBe(2);
    expect(item.corPrincipal).toEqual({ id: 'vinho', nome: 'Vinho' });
    expect(item.corSecundaria).toEqual({ id: 'bege', nome: 'Bege' });
    expect(item.comAlca).toBe(true);
    expect(item.corAlca).toEqual({ id: 'preto', nome: 'Preto' });
    expect(item.observacoes).toBe('Com laço, por favor');
    expect(item.imagem).toBe('/images/produtos/bolsa-lua/vinho/01-principal.webp');
  });

  it('com ?editar= carrega a personalização do item e salva alterações', async () => {
    const usuario = userEvent.setup();
    const itemSalvo: ItemCarrinho = {
      id: 'item-editavel',
      produtoId: 'bolsa-lua',
      nomeProduto: 'Bolsa Lua',
      categoriaNome: 'Bolsas',
      imagem: '/images/produtos/bolsa-lua/vinho/01-principal.webp',
      precoUnitarioCentavos: 12000,
      quantidade: 1,
      corPrincipal: { id: 'vinho', nome: 'Vinho' },
      corSecundaria: null,
      comAlca: false,
      corAlca: null,
      observacoes: '',
    };
    window.localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify({ versao: 1, itens: [itemSalvo] }),
    );

    renderizarProduto('/produto/bolsa-lua?editar=item-editavel');

    // personalização pré-carregada
    expect(corNoGrupo('Cor principal', 'Vinho')).toHaveAttribute('aria-pressed', 'true');
    const botaoSalvar = screen.getByRole('button', { name: 'Salvar alterações' });
    expect(botaoSalvar).toBeEnabled();

    await usuario.click(corNoGrupo('Cor principal', 'Bege'));
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
