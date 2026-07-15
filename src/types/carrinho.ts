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
  comAlca: boolean;
  /** Presente ⇔ comAlca. */
  corAlca: CorEscolhida | null;
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
  corPrincipalId: string | null;
  corSecundariaId: string | null;
  comAlca: boolean;
  corAlcaId: string | null;
  quantidade: number;
  observacoes: string;
}
