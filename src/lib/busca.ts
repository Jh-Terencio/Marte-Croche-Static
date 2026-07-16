import type { Produto, Categoria } from '../types/produto';

/**
 * Busca do catálogo (research D14) — filtro em memória, função pura.
 * Ignora acentos e caixa: "alca" encontra "Alça".
 */

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Casa o termo com nome, categoria, descrição e termos de busca do produto. */
export function filtrarProdutos(
  termo: string,
  produtos: Produto[],
  categorias: Categoria[],
): Produto[] {
  const termoNormalizado = normalizar(termo);
  if (!termoNormalizado) return produtos;

  return produtos.filter((produto) => {
    const nomeCategoria =
      categorias.find((c) => c.id === produto.categoriaId)?.nome ?? '';
    const camposDeBusca = [
      produto.nome,
      nomeCategoria,
      produto.descricao,
      ...(produto.termosDeBusca ?? []),
    ];
    return camposDeBusca.some((campo) => normalizar(campo).includes(termoNormalizado));
  });
}
