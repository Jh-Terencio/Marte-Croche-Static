import type { Produto } from '../types/produto';
import { config } from './config';

/**
 * Catálogo da Marte Crochê.
 * Adicionar um produto ou uma cor = editar SOMENTE este arquivo
 * (mais os arquivos de imagem em public/images/produtos/).
 * Os caminhos de imagem ficam registrados aqui — nunca são montados
 * a partir do nome da cor (exigência da spec).
 */
export const produtos: Produto[] = [
  {
    id: 'bolsa-lua',
    nome: 'Bolsa Lua',
    categoriaId: 'bolsas',
    descricao:
      'Bolsa de crochê feita à mão em fio premium, com fechamento por botão de madeira e forro interno em tecido. Espaçosa e delicada, perfeita para o dia a dia.',
    precoBaseCentavos: 12000,
    imagensPadrao: ['/images/produtos/bolsa-lua/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: [
          '/images/produtos/bolsa-lua/vinho/01-principal.webp',
          '/images/produtos/bolsa-lua/vinho/02-lateral.webp',
          '/images/produtos/bolsa-lua/vinho/03-detalhes.webp',
        ],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#d9c7a7',
        imagens: [
          '/images/produtos/bolsa-lua/bege/01-principal.webp',
          '/images/produtos/bolsa-lua/bege/02-lateral.webp',
        ],
      },
      {
        id: 'preto',
        nome: 'Preto',
        valorVisual: '#2b2622',
        imagens: [
          '/images/produtos/bolsa-lua/preto/01-principal.webp',
          '/images/produtos/bolsa-lua/preto/02-lateral.webp',
        ],
      },
    ],
    coresAlca: [
      { id: 'vinho', nome: 'Vinho', valorVisual: '#681119', imagens: [] },
      { id: 'bege', nome: 'Bege', valorVisual: '#d9c7a7', imagens: [] },
      { id: 'preto', nome: 'Preto', valorVisual: '#2b2622', imagens: [] },
    ],
    permiteAlca: true,
    permiteCorRepetida: false,
    prazoConfeccao: '7 a 10 dias úteis',
    disponivel: true,
    informacoesAdicionais: 'Pode ser feita em duas cores combinadas. Lavar à mão com sabão neutro.',
    termosDeBusca: ['bolsa', 'croche', 'artesanal', 'lua', 'duas cores'],
  },
  {
    id: 'bolsa-sol',
    nome: 'Bolsa Sol',
    categoriaId: 'bolsas',
    descricao:
      'Bolsa de crochê compacta com ponto fantasia, ideal para passeios. Feita à mão com acabamento reforçado e opção de alça em crochê.',
    precoBaseCentavos: 9800,
    imagensPadrao: ['/images/produtos/bolsa-sol/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: [
          '/images/produtos/bolsa-sol/vinho/01-principal.webp',
          '/images/produtos/bolsa-sol/vinho/02-lateral.webp',
        ],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#d9c7a7',
        imagens: [
          '/images/produtos/bolsa-sol/bege/01-principal.webp',
          '/images/produtos/bolsa-sol/bege/02-lateral.webp',
        ],
      },
    ],
    coresAlca: [
      { id: 'vinho', nome: 'Vinho', valorVisual: '#681119', imagens: [] },
      { id: 'bege', nome: 'Bege', valorVisual: '#d9c7a7', imagens: [] },
    ],
    permiteAlca: true,
    permiteCorRepetida: true,
    prazoConfeccao: '5 a 8 dias úteis',
    disponivel: true,
    termosDeBusca: ['bolsa', 'croche', 'artesanal', 'sol', 'compacta', 'passeio'],
  },
  {
    id: 'alca-classica',
    nome: 'Alça de Crochê Clássica',
    categoriaId: 'alcas',
    descricao:
      'Alça avulsa de crochê feita à mão, resistente e macia. Combina com qualquer bolsa da coleção ou com a sua bolsa favorita.',
    precoBaseCentavos: config.precoAlcaAvulsaCentavos,
    imagensPadrao: ['/images/produtos/alca-classica/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: ['/images/produtos/alca-classica/vinho/01-principal.webp'],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#d9c7a7',
        imagens: ['/images/produtos/alca-classica/bege/01-principal.webp'],
      },
      {
        id: 'preto',
        nome: 'Preto',
        valorVisual: '#2b2622',
        imagens: ['/images/produtos/alca-classica/preto/01-principal.webp'],
      },
    ],
    coresAlca: [],
    permiteAlca: false,
    permiteCorRepetida: false,
    prazoConfeccao: '3 a 5 dias úteis',
    disponivel: true,
    termosDeBusca: ['alca', 'alça avulsa', 'croche', 'acessorio'],
  },
  {
    id: 'capinha-airpods',
    nome: 'Capinha de AirPods',
    categoriaId: 'capinhas-airpods',
    descricao:
      'Capinha de crochê para estojo de AirPods, com argola para prender na bolsa ou no chaveiro. Proteção delicada e cheia de personalidade.',
    precoBaseCentavos: 4500,
    imagensPadrao: ['/images/produtos/capinha-airpods/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: [
          '/images/produtos/capinha-airpods/vinho/01-principal.webp',
          '/images/produtos/capinha-airpods/vinho/02-detalhes.webp',
        ],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#d9c7a7',
        imagens: ['/images/produtos/capinha-airpods/bege/01-principal.webp'],
      },
    ],
    coresAlca: [],
    permiteAlca: false,
    permiteCorRepetida: false,
    prazoConfeccao: '3 a 5 dias úteis',
    disponivel: true,
    termosDeBusca: ['capinha', 'airpods', 'fone', 'estojo', 'croche'],
  },
];

export function produtoPorId(id: string): Produto | undefined {
  return produtos.find((p) => p.id === id);
}
