import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

function renderizarApp(rota = '/') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('exibe a home com header, carrinho e footer', () => {
    renderizarApp('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /marte crochê/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrinho, 0 itens' })).toBeInTheDocument();
    expect(
      screen.getByText('Feito à mão para quem valoriza o que é único.'),
    ).toBeInTheDocument();
  });

  it('renderiza a rota do carrinho (vazia) com estado amigável', () => {
    renderizarApp('/carrinho');
    expect(
      screen.getByRole('heading', { name: 'Seu carrinho está vazio' }),
    ).toBeInTheDocument();
  });
});
