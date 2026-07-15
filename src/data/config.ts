/**
 * Configuração central da loja (Constituição §3.V — local ÚNICO para
 * número do WhatsApp, preços da alça, limites e links da marca).
 * Nenhum componente deve repetir estes valores.
 */

export interface ConfiguracaoLoja {
  /** Formato internacional, só dígitos (ex.: "5511999999999"). */
  numeroWhatsApp: string;
  /** Acréscimo da alça comprada junto com a bolsa (RN-01). */
  precoAlcaComBolsaCentavos: number;
  /** Preço da alça avulsa como produto (RN-02). */
  precoAlcaAvulsaCentavos: number;
  /** Limite de quantidade por item do carrinho (RN-11). */
  quantidadeMaximaPorItem: number;
  /** Máximo de caracteres por campo de observações. */
  limiteObservacoes: number;
  linkInstagram: string;
  fraseMarca: string;
  /** Imagem genérica usada quando a do produto falha. */
  imagemFallback: string;
}

export const config: ConfiguracaoLoja = {
  // TODO: substituir pelo número comercial real da Marte Crochê antes de publicar.
  numeroWhatsApp: '5500000000000',
  precoAlcaComBolsaCentavos: 1500,
  precoAlcaAvulsaCentavos: 2000,
  quantidadeMaximaPorItem: 20,
  limiteObservacoes: 500,
  // TODO: substituir pelo perfil real do Instagram antes de publicar.
  linkInstagram: 'https://www.instagram.com/martecroche',
  fraseMarca: 'Feito à mão para quem valoriza o que é único.',
  imagemFallback: '/images/fallback-produto.webp',
};
