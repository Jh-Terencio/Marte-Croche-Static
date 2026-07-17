import type { Categoria } from '../types/produto';

/** Categorias iniciais — adicionar uma nova = incluir uma entrada aqui. */
export const categorias: Categoria[] = [
  { id: 'bolsas', nome: 'Bolsas' },
  { id: 'alcas', nome: 'Alças' },
  { id: 'capinhas-fones', nome: 'Capinhas de Fones' },
];

export function nomeDaCategoria(categoriaId: string): string {
  return categorias.find((c) => c.id === categoriaId)?.nome ?? categoriaId;
}
