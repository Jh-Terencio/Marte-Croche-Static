import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { produtos } from '../data/produtos';
import { config } from '../data/config';

function renderizarHome(rota = '/') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('exibe todos os produtos do catálogo em cards', () => {
    renderizarHome();
    for (const produto of produtos) {
      expect(screen.getByRole('heading', { name: produto.nome })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('link', { name: 'Ver detalhes' }).length).toBeGreaterThan(0);
  });

  it('mostra estado vazio amigável para categoria sem produtos', () => {
    renderizarHome('/?categoria=inexistente');
    expect(
      screen.getByRole('heading', { name: 'Nenhuma peça por aqui ainda' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas as peças' })).toBeInTheDocument();
  });

  it('exibe preço "a partir de" quando o produto tem adicionais', () => {
    renderizarHome();
    expect(screen.getAllByText('a partir de').length).toBe(
      produtos.filter((p) => p.adicionais.length > 0).length,
    );
  });

  it('filtra por busca via ?busca=, ignorando acentos', () => {
    renderizarHome('/?busca=venus');
    expect(
      screen.getByRole('heading', { name: 'Resultados para "venus"' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Bolsa Vênus' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bolsa Marte' })).not.toBeInTheDocument();
  });

  it('busca sem resultados mostra mensagem amigável', () => {
    renderizarHome('/?busca=xyzabc');
    expect(
      screen.getByRole('heading', { name: 'Não encontramos nada com esse termo' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Ver todas as peças' }).length,
    ).toBeGreaterThan(0);
  });

  it('busca combinada com categoria filtra dentro da categoria', () => {
    renderizarHome('/?categoria=bolsas&busca=marte');
    expect(screen.getByRole('heading', { name: 'Bolsa Marte' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bolsa Vênus' })).not.toBeInTheDocument();
  });

  it('exibe o botão flutuante que abre o WhatsApp da loja', () => {
    renderizarHome();
    const botao = screen.getByRole('link', {
      name: 'Falar com a Marte Crochê no WhatsApp',
    });
    expect(botao).toHaveAttribute('href', `https://wa.me/${config.numeroWhatsApp}`);
    expect(botao).toHaveAttribute('target', '_blank');
    expect(botao).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
