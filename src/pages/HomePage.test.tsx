import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { produtos } from '../data/produtos';

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

  it('filtra por categoria via ?categoria=', () => {
    renderizarHome('/?categoria=alcas');
    expect(screen.getByRole('heading', { name: 'Alças' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Alça de Crochê Clássica' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bolsa Lua' })).not.toBeInTheDocument();
  });

  it('mostra estado vazio amigável para categoria sem produtos', () => {
    renderizarHome('/?categoria=inexistente');
    expect(
      screen.getByRole('heading', { name: 'Nenhuma peça por aqui ainda' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver todas as peças' })).toBeInTheDocument();
  });

  it('exibe preço "a partir de" quando o produto permite alça', () => {
    renderizarHome();
    expect(screen.getAllByText('a partir de').length).toBe(
      produtos.filter((p) => p.permiteAlca).length,
    );
  });
});
