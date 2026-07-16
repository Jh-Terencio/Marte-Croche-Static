/**
 * Tipos do carrinho (data-model.md).
 * ItemCarrinho é um SNAPSHOT do produto no momento da adição —
 * o carrinho não quebra se o catálogo mudar entre visitas.
 * NUNCA contém dados pessoais (Constituição §6).
 */

export interface CorEscolhida {
  id: string;
  nome: string;
}

export interface OpcaoEscolhida {
  opcaoId: string;
  nomeOpcao: string;
  valorId: string;
  valorNome: string;
}

export interface AdicionalEscolhido {
  adicionalId: string;
  nomeAdicional: string;
  precoCentavos: number;
  opcoes: OpcaoEscolhida[];
}

export interface ItemCarrinho {
  /** UUID gerado na adição. */
  id: string;
  /** Referência ao catálogo (para "editar personalização"). */
  produtoId: string;
  nomeProduto: string;
  categoriaNome: string;
  /** Imagem principal da cor escolhida (ou padrão). */
  imagem: string;
  /** Calculado por precoUnitario() na adição/edição (centavos). */
  precoUnitarioCentavos: number;
  quantidade: number;
  corPrincipal: CorEscolhida | null;
  corSecundaria: CorEscolhida | null;
  adicionais: AdicionalEscolhido[];
  observacoes: string;
}

/** Payload persistido em localStorage (contrato armazenamento-carrinho.md). */
export interface CarrinhoPersistido {
  versao: 1;
  itens: ItemCarrinho[];
}

/**
 * Estado de personalização na página do produto (data-model.md).
 * Validado por validarPersonalizacao antes de virar ItemCarrinho.
 */
export interface PersonalizacaoItem {
  quantidadeCores: 1 | 2;
  corPrincipalId: string | null;
  corSecundariaId: string | null;
  /** adicionalId → { opcaoId → valorId | null } */
  adicionaisSelecionados: Record<string, Record<string, string | null>>;
  quantidade: number;
  observacoes: string;
}
