import { filtrarProdutos } from './busca';
import { criarProdutoTeste } from '../test/fixtures';
import type { Categoria } from '../types/produto';

const categorias: Categoria[] = [
  { id: 'bolsas', nome: 'Bolsas' },
  { id: 'alcas', nome: 'Alças' },
];

const produtos = [
  criarProdutoTeste({
    id: 'bolsa-lua',
    nome: 'Bolsa Lua',
    categoriaId: 'bolsas',
    descricao: 'Bolsa de crochê com botão de madeira.',
    termosDeBusca: ['presente', 'artesanal'],
  }),
  criarProdutoTeste({
    id: 'alca-classica',
    nome: 'Alça de Crochê Clássica',
    categoriaId: 'alcas',
    descricao: 'Alça avulsa resistente e macia.',
  }),
];

describe('filtrarProdutos', () => {
  it('termo vazio ou só espaços devolve todos os produtos', () => {
    expect(filtrarProdutos('', produtos, categorias)).toEqual(produtos);
    expect(filtrarProdutos('   ', produtos, categorias)).toEqual(produtos);
  });

  it('busca por nome ignorando acentos e caixa', () => {
    expect(filtrarProdutos('alca', produtos, categorias)).toEqual([produtos[1]]);
    expect(filtrarProdutos('ALÇA', produtos, categorias)).toEqual([produtos[1]]);
    expect(filtrarProdutos('bolsa lua', produtos, categorias)).toEqual([produtos[0]]);
  });

  it('busca pelo nome da categoria', () => {
    expect(filtrarProdutos('bolsas', produtos, categorias)).toEqual([produtos[0]]);
  });

  it('busca pela descrição', () => {
    expect(filtrarProdutos('botão de madeira', produtos, categorias)).toEqual([
      produtos[0],
    ]);
    expect(filtrarProdutos('botao', produtos, categorias)).toEqual([produtos[0]]);
  });

  it('busca pelos termos de busca extras', () => {
    expect(filtrarProdutos('presente', produtos, categorias)).toEqual([produtos[0]]);
  });

  it('sem correspondência devolve lista vazia', () => {
    expect(filtrarProdutos('xyzabc', produtos, categorias)).toEqual([]);
  });

  it('grafia errada não encontra ("bolca" não acha "Bolsa")', () => {
    expect(filtrarProdutos('bolca', produtos, categorias)).toEqual([]);
  });
});
