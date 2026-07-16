import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import { Search } from './Search';

function DestinoDaBusca() {
  const [parametros] = useSearchParams();
  return <p>busca-aplicada: {parametros.get('busca') ?? '(nenhuma)'}</p>;
}

function renderizarBusca() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Search />
              <DestinoDaBusca />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Search', () => {
  it('expande o campo ao acionar o botão, com foco no campo', async () => {
    const usuario = userEvent.setup();
    renderizarBusca();

    expect(screen.queryByRole('search')).not.toBeInTheDocument();
    await usuario.click(screen.getByRole('button', { name: 'Buscar produtos' }));

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Buscar produtos' })).toHaveFocus();
  });

  it('submeter navega para /?busca=<termo> e fecha o campo', async () => {
    const usuario = userEvent.setup();
    renderizarBusca();

    await usuario.click(screen.getByRole('button', { name: 'Buscar produtos' }));
    await usuario.type(screen.getByRole('searchbox'), 'bolsa lua');
    await usuario.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByText('busca-aplicada: bolsa lua')).toBeInTheDocument();
    expect(screen.queryByRole('search')).not.toBeInTheDocument();
  });

  it('Esc fecha o campo sem buscar', async () => {
    const usuario = userEvent.setup();
    renderizarBusca();

    await usuario.click(screen.getByRole('button', { name: 'Buscar produtos' }));
    await usuario.keyboard('{Escape}');

    expect(screen.queryByRole('search')).not.toBeInTheDocument();
    expect(screen.getByText('busca-aplicada: (nenhuma)')).toBeInTheDocument();
  });
});
