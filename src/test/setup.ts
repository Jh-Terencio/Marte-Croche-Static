import '@testing-library/jest-dom/vitest';

// jsdom não implementa matchMedia — stub com "reduz movimento" ativo,
// o que também desliga o autoplay do carrossel nos testes.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
