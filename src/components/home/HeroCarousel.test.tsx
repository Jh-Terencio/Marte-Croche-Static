import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HeroCarousel } from './HeroCarousel';
import { slidesCarrossel } from '../../data/carrossel';

function renderizarCarrossel() {
  return render(
    <MemoryRouter>
      <HeroCarousel />
    </MemoryRouter>,
  );
}

describe('HeroCarousel', () => {
  it('renderiza todos os slides com texto alternativo', () => {
    renderizarCarrossel();
    for (const slide of slidesCarrossel) {
      expect(screen.getByAltText(slide.alt)).toBeInTheDocument();
    }
  });

  it('possui um indicador por slide, com o primeiro ativo', () => {
    renderizarCarrossel();
    const indicadores = screen.getAllByRole('button', { name: /ir para imagem/i });
    expect(indicadores).toHaveLength(slidesCarrossel.length);
    expect(indicadores[0]).toHaveAttribute('aria-current', 'true');
  });

  it('avança e volta com os controles manuais', async () => {
    const usuario = userEvent.setup();
    renderizarCarrossel();

    await usuario.click(screen.getByRole('button', { name: 'Próxima imagem' }));
    let indicadores = screen.getAllByRole('button', { name: /ir para imagem/i });
    expect(indicadores[1]).toHaveAttribute('aria-current', 'true');

    await usuario.click(screen.getByRole('button', { name: 'Imagem anterior' }));
    indicadores = screen.getAllByRole('button', { name: /ir para imagem/i });
    expect(indicadores[0]).toHaveAttribute('aria-current', 'true');
  });

  it('navega direto pelo indicador', async () => {
    const usuario = userEvent.setup();
    renderizarCarrossel();

    const indicadores = screen.getAllByRole('button', { name: /ir para imagem/i });
    await usuario.click(indicadores[2]);
    expect(indicadores[2]).toHaveAttribute('aria-current', 'true');
  });

  it('com prefers-reduced-motion o autoplay começa desativado', () => {
    renderizarCarrossel();
    // o stub de matchMedia dos testes responde "reduce" → botão oferece ativar
    expect(
      screen.getByRole('button', { name: 'Ativar avanço automático' }),
    ).toBeInTheDocument();
  });
});
