/**
 * Tipos do catálogo (data-model.md).
 * Instâncias vivem em src/data/ — única camada a editar para
 * adicionar produto, cor ou categoria (Constituição §7).
 */

export interface Categoria {
  id: string;
  nome: string;
}

export interface CorDeProduto {
  /** Único dentro do produto (ex.: "vinho"). */
  id: string;
  /** Nome exibido (ex.: "Vinho"). */
  nome: string;
  /** Cor CSS da amostra (ex.: "#681119"). */
  valorVisual: string;
  /**
   * Caminhos completos sob public/ — a primeira imagem é a principal.
   * Nunca derivados do nome da cor (exigência da spec).
   * Vazio = usa as imagens padrão do produto.
   */
  imagens: string[];
}

export interface Produto {
  id: string;
  nome: string;
  categoriaId: string;
  descricao: string;
  /** Preço em centavos (inteiro) — evita erro de ponto flutuante. */
  precoBaseCentavos: number;
  /** Exibidas antes da escolha de cor e como fallback. */
  imagensPadrao: string[];
  /** Somente cores listadas aqui são ofertadas (RN-08). */
  cores: CorDeProduto[];
  /** Opções de cor da alça (quando permiteAlca). */
  coresAlca: CorDeProduto[];
  /** Habilita a opção com/sem alça (RN-06). */
  permiteAlca: boolean;
  /** Mesma cor nas duas posições da bolsa (RN-05). */
  permiteCorRepetida: boolean;
  /** Texto exibível (ex.: "7 a 10 dias úteis"). */
  prazoConfeccao: string;
  /** false → encomenda bloqueada (FR-011). */
  disponivel: boolean;
  informacoesAdicionais?: string;
  /** Termos extras para a busca (D14). */
  termosDeBusca?: string[];
}
