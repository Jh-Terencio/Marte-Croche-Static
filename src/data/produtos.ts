import type { Produto } from '../types/produto';

/**
 * Catálogo da Marte Crochê.
 * Adicionar um produto ou uma cor = editar SOMENTE este arquivo
 * (mais os arquivos de imagem em public/images/produtos/).
 * Os caminhos de imagem ficam registrados aqui — nunca são montados
 * a partir do nome da cor (exigência da spec).
 */
export const produtos: Produto[] = [
  {
    id: 'bolsa-marte',
    nome: 'Bolsa Marte',
    categoriaId: 'bolsas',
    descricao:
      'Bolsa de crochê feita à mão em fio premium, com fechamento por botão de madeira e forro interno em tecido. Espaçosa e delicada, perfeita para o dia a dia.',
    precoBaseCentavos: 15000,
    imagensPadrao: ['/images/produtos/bolsa-marte/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: [],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#e4c5b0',
        imagens: [],
      },
      {
        id: 'branco',
        nome: 'Branco',
        valorVisual: '#f0eff4',
        imagens: [],
      },
      {
        id: 'azul-marinho',
        nome: 'Azul Marinho',
        valorVisual: '#383757',
        imagens: [
          '/images/produtos/bolsa-marte/azul-marinho/01-principal.webp',
        ],
      },
      {
        id: 'amarelo-manteiga',
        nome: 'Amarelo Manteiga',
        valorVisual: '#efc96e',
        imagens: [
          '/images/produtos/bolsa-marte/amarelo-manteiga/01-principal.webp',
        ],
      },
      {
        id: 'rosa-bebe',
        nome: 'Rosa Bebê',
        valorVisual: '#fdcee1',
        imagens: [],
      },
      {
        id: 'azul-bebe',
        nome: 'Azul Bebê',
        valorVisual: '#ceebf6',
        imagens: [],
      },
      {
        id: 'lavanda',
        nome: 'Lavânda',
        valorVisual: '#c195d2',
        imagens: [],
      },
      {
        id: 'esmeralda',
        nome: 'Esmeralda',
        valorVisual: '#0f5555',
        imagens: [],
      },
      {
        id: 'chocolate',
        nome: 'Chocolate',
        valorVisual: '#3b1d20',
        imagens: [],
      },
      {
        id: 'preto',
        nome: 'Preto',
        valorVisual: '#0c0c17',
        imagens: [],
      },
      {
        id: 'grafite',
        nome: 'Grafite',
        valorVisual: '#413e45',
        imagens: [],
      },
    ],
    permiteCorRepetida: false,
    adicionais: [
      {
        id: 'alca-corrente',
        nome: 'Alça de corrente',
        precoCentavos: 1500,
        opcoes: [],
      },
      {
        id: 'alca-longa-croche',
        nome: 'Alça longa de crochê',
        precoCentavos: 1500,
        opcoes: [
          {
            id: 'cor-alca',
            tipo: 'cor',
            legenda: 'Cor da alça',
            obrigatoria: true,
            valores: [
              { id: 'vinho', nome: 'Vinho', valorVisual: '#681119' },
              { id: 'bege', nome: 'Bege', valorVisual: '#d9c7a7' },
              { id: 'azul-marinho', nome: 'Azul Marinho', valorVisual: '#383757' },
              { id: 'amarelo-manteiga', nome: 'Amarelo Manteiga', valorVisual: '#efc96e' },
            ],
          },
        ],
      },
    ],
    prazoConfeccao: '10 dias úteis',
    disponivel: true,
    informacoesAdicionais: 'Pode ser feita em duas cores combinadas. Lavar à mão com sabão neutro.',
    termosDeBusca: ['bolsa', 'croche', 'artesanal', 'marte', 'duas cores'],
  },
  {
    id: 'bolsa-venus',
    nome: 'Bolsa Vênus',
    categoriaId: 'bolsas',
    descricao:
      'Bolsa de crochê compacta com ponto fantasia, ideal para passeios. Feita à mão com acabamento reforçado e opção de alça em crochê.',
    precoBaseCentavos: 14000,
    imagensPadrao: ['/images/produtos/bolsa-venus/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: [
          '/images/produtos/bolsa-venus/vinho/01-principal.webp',
        ],
      },
    ],
    permiteCorRepetida: true,
    adicionais: [
      {
        id: 'botao-magnetico',
        nome: 'Botão Magnético',
        precoCentavos: 1500,
        opcoes: [],
      },
      {
        id: 'alca-corrente',
        nome: 'Alça de corrente',
        precoCentavos: 1500,
        opcoes: [],
      },
      {
        id: 'alca-longa-croche',
        nome: 'Alça longa de crochê',
        precoCentavos: 1500,
        opcoes: [
          {
            id: 'cor-alca',
            tipo: 'cor',
            legenda: 'Cor da alça',
            obrigatoria: true,
            valores: [
              { id: 'vinho', nome: 'Vinho', valorVisual: '#681119' },
              { id: 'bege', nome: 'Bege', valorVisual: '#d9c7a7' },
            ],
          },
        ],
      },
    ],
    prazoConfeccao: '10 dias úteis',
    disponivel: true,
    termosDeBusca: ['bolsa', 'croche', 'artesanal', 'venus', 'compacta', 'passeio'],
  },
];

export function produtoPorId(id: string): Produto | undefined {
  return produtos.find((p) => p.id === id);
}
