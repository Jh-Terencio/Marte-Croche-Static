/** Slides do carrossel de destaque — trocar imagens = editar somente este arquivo. */

export interface SlideCarrossel {
  imagem: string;
  /** Texto alternativo obrigatório (acessibilidade). */
  alt: string;
  /** Quando presente, o slide leva à página do produto. */
  produtoId?: string;
}

export const slidesCarrossel: SlideCarrossel[] = [
  {
    imagem: '/images/carrossel/01-destaque.webp',
    alt: 'Bolsa de crochê Lua na cor vinho sobre fundo neutro',
    produtoId: 'bolsa-lua',
  },
  {
    imagem: '/images/carrossel/02-destaque.webp',
    alt: 'Bolsa de crochê Sol na cor bege com alça artesanal',
    produtoId: 'bolsa-sol',
  },
  {
    imagem: '/images/carrossel/03-destaque.webp',
    alt: 'Detalhe do ponto de crochê artesanal da Marte Crochê',
  },
];
