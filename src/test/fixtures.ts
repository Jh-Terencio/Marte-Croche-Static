import type { Produto } from '../types/produto';
import type { ItemCarrinho } from '../types/carrinho';
import type { ConfiguracaoLoja } from '../data/config';

export function criarConfigTeste(sobrescrever: Partial<ConfiguracaoLoja> = {}): ConfiguracaoLoja {
  return {
    numeroWhatsApp: '5511999999999',
    precoAlcaComBolsaCentavos: 1500,
    precoAlcaAvulsaCentavos: 2000,
    quantidadeMaximaPorItem: 20,
    limiteObservacoes: 500,
    linkInstagram: 'https://www.instagram.com/teste',
    fraseMarca: 'Feito à mão para quem valoriza o que é único.',
    imagemFallback: '/images/fallback-produto.webp',
    ...sobrescrever,
  };
}

export function criarProdutoTeste(sobrescrever: Partial<Produto> = {}): Produto {
  return {
    id: 'bolsa-teste',
    nome: 'Bolsa Teste',
    categoriaId: 'bolsas',
    descricao: 'Bolsa de teste.',
    precoBaseCentavos: 12000,
    imagensPadrao: ['/images/produtos/bolsa-teste/padrao/01-principal.webp'],
    cores: [
      {
        id: 'vinho',
        nome: 'Vinho',
        valorVisual: '#681119',
        imagens: ['/images/produtos/bolsa-teste/vinho/01-principal.webp'],
      },
      {
        id: 'bege',
        nome: 'Bege',
        valorVisual: '#d9c7a7',
        imagens: ['/images/produtos/bolsa-teste/bege/01-principal.webp'],
      },
    ],
    permiteCorRepetida: false,
    permiteDuasCores: true,
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
              { id: 'preto', nome: 'Preto', valorVisual: '#2b2622' },
            ],
          },
        ],
      },
    ],
    prazoConfeccao: '7 a 10 dias úteis',
    disponivel: true,
    ...sobrescrever,
  };
}

export function criarItemTeste(sobrescrever: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return {
    id: 'item-1',
    produtoId: 'bolsa-teste',
    nomeProduto: 'Bolsa Teste',
    categoriaNome: 'Bolsas',
    imagem: '/images/produtos/bolsa-teste/vinho/01-principal.webp',
    precoUnitarioCentavos: 12000,
    quantidade: 1,
    corPrincipal: { id: 'vinho', nome: 'Vinho' },
    corSecundaria: null,
    adicionais: [],
    observacoes: '',
    ...sobrescrever,
  };
}
