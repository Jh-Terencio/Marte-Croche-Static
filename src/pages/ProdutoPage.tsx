import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PersonalizacaoItem, ItemCarrinho } from '../types/carrinho';
import type { Produto } from '../types/produto';
import { produtoPorId } from '../data/produtos';
import { nomeDaCategoria } from '../data/categorias';
import { config } from '../data/config';
import { precoUnitario } from '../lib/preco';
import { validarPersonalizacao } from '../lib/validacao';
import { useCarrinho } from '../context/CarrinhoContext';
import { ProductGallery } from '../components/produto/ProductGallery';
import { ColorSelector } from '../components/produto/ColorSelector';
import { StrapOptions } from '../components/produto/StrapOptions';
import { QuantitySelector } from '../components/produto/QuantitySelector';
import { PriceSummary } from '../components/produto/PriceSummary';
import { Botao } from '../components/comuns/Botao';
import { MensagemErro } from '../components/comuns/MensagemErro';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import styles from './ProdutoPage.module.css';

const PERSONALIZACAO_INICIAL: PersonalizacaoItem = {
  corPrincipalId: null,
  corSecundariaId: null,
  comAlca: false,
  corAlcaId: null,
  quantidade: 1,
  observacoes: '',
};

function gerarIdDeItem(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function personalizacaoDoItem(item: ItemCarrinho): PersonalizacaoItem {
  return {
    corPrincipalId: item.corPrincipal?.id ?? null,
    corSecundariaId: item.corSecundaria?.id ?? null,
    comAlca: item.comAlca,
    corAlcaId: item.corAlca?.id ?? null,
    quantidade: item.quantidade,
    observacoes: item.observacoes,
  };
}

function montarItem(
  id: string,
  produto: Produto,
  personalizacao: PersonalizacaoItem,
): ItemCarrinho {
  const corPrincipal =
    produto.cores.find((c) => c.id === personalizacao.corPrincipalId) ?? null;
  const corSecundaria =
    produto.cores.find((c) => c.id === personalizacao.corSecundariaId) ?? null;
  const comAlca = produto.permiteAlca && personalizacao.comAlca;
  const corAlca = comAlca
    ? (produto.coresAlca.find((c) => c.id === personalizacao.corAlcaId) ?? null)
    : null;

  return {
    id,
    produtoId: produto.id,
    nomeProduto: produto.nome,
    categoriaNome: nomeDaCategoria(produto.categoriaId),
    imagem:
      corPrincipal && corPrincipal.imagens.length > 0
        ? corPrincipal.imagens[0]
        : (produto.imagensPadrao[0] ?? ''),
    precoUnitarioCentavos: precoUnitario(produto, comAlca, config),
    quantidade: personalizacao.quantidade,
    corPrincipal: corPrincipal && { id: corPrincipal.id, nome: corPrincipal.nome },
    corSecundaria: corSecundaria && { id: corSecundaria.id, nome: corSecundaria.nome },
    comAlca,
    corAlca: corAlca && { id: corAlca.id, nome: corAlca.nome },
    observacoes: personalizacao.observacoes,
  };
}

/**
 * Página do produto (FR-012..FR-020): personalização completa com a
 * galeria acompanhando a primeira cor. Com ?editar=<itemId>, carrega a
 * personalização do item do carrinho e atualiza em vez de adicionar.
 */
export function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const { itens, adicionarItem, atualizarItem } = useCarrinho();

  const produto = id ? produtoPorId(id) : undefined;
  const itemEmEdicao = itens.find((item) => item.id === parametros.get('editar'));

  const [personalizacao, setPersonalizacao] = useState<PersonalizacaoItem>(() =>
    itemEmEdicao ? personalizacaoDoItem(itemEmEdicao) : PERSONALIZACAO_INICIAL,
  );

  if (!produto) {
    return (
      <EstadoVazio
        titulo="Produto não encontrado"
        descricao="Esta peça não está mais no catálogo. Que tal conhecer as outras?"
      >
        <Link to="/">Ver todas as peças</Link>
      </EstadoVazio>
    );
  }

  const { valido, erros } = validarPersonalizacao(personalizacao, produto, config);
  const podeAdicionar = valido && produto.disponivel;

  function alterar(mudanca: Partial<PersonalizacaoItem>) {
    setPersonalizacao((atual) => ({ ...atual, ...mudanca }));
  }

  function confirmar() {
    if (!podeAdicionar || !produto) return;
    if (itemEmEdicao) {
      atualizarItem(montarItem(itemEmEdicao.id, produto, personalizacao));
    } else {
      adicionarItem(montarItem(gerarIdDeItem(), produto, personalizacao));
    }
    navegar('/carrinho');
  }

  const coresRepetidasProibidas =
    !produto.permiteCorRepetida && personalizacao.corPrincipalId
      ? {
          ids: [personalizacao.corPrincipalId],
          motivo: 'Este modelo não permite repetir a mesma cor.',
        }
      : undefined;

  return (
    <div className={styles.pagina}>
      <Link to="/" className={styles.voltar}>
        ← Voltar ao catálogo
      </Link>

      <div className={styles.conteudo}>
        <ProductGallery
          produto={produto}
          corSelecionadaId={personalizacao.corPrincipalId}
        />

        <div className={styles.info}>
          <div>
            <span className={styles.categoria}>
              {nomeDaCategoria(produto.categoriaId)}
            </span>
            <h1 className={styles.nome}>{produto.nome}</h1>
          </div>

          <p className={styles.descricao}>{produto.descricao}</p>
          <p className={styles.prazo}>
            <strong>Prazo de confecção:</strong> {produto.prazoConfeccao}
          </p>
          {produto.informacoesAdicionais && (
            <p className={styles.informacoesAdicionais}>
              {produto.informacoesAdicionais}
            </p>
          )}

          {!produto.disponivel && (
            <p className={styles.indisponivel}>
              Esta peça está indisponível para encomenda no momento.
            </p>
          )}

          {produto.cores.length > 0 && (
            <>
              <ColorSelector
                legenda="Cor principal"
                obrigatoriedade="obrigatória"
                cores={produto.cores}
                selecionadaId={personalizacao.corPrincipalId}
                onSelecionar={(corId) => {
                  // trocar a cor principal não apaga as demais escolhas (FR-016);
                  // apenas a segunda cor é ajustada se a repetição for proibida
                  const mudanca: Partial<PersonalizacaoItem> = {
                    corPrincipalId: corId,
                  };
                  if (
                    !produto.permiteCorRepetida &&
                    corId !== null &&
                    personalizacao.corSecundariaId === corId
                  ) {
                    mudanca.corSecundariaId = null;
                  }
                  alterar(mudanca);
                }}
              />
              {erros.corPrincipal && <MensagemErro>{erros.corPrincipal}</MensagemErro>}

              {produto.cores.length > 1 && (
                <>
                  <ColorSelector
                    legenda="Segunda cor"
                    obrigatoriedade="opcional"
                    cores={produto.cores}
                    selecionadaId={personalizacao.corSecundariaId}
                    onSelecionar={(corId) => alterar({ corSecundariaId: corId })}
                    desabilitadas={coresRepetidasProibidas}
                    permiteDesmarcar
                  />
                  <p className={styles.dicaCores}>
                    A bolsa pode combinar no máximo duas cores.
                  </p>
                  {erros.corSecundaria && (
                    <MensagemErro>{erros.corSecundaria}</MensagemErro>
                  )}
                </>
              )}
            </>
          )}

          <StrapOptions
            produto={produto}
            comAlca={personalizacao.comAlca}
            corAlcaId={personalizacao.corAlcaId}
            onAlterarAlca={(comAlca) =>
              alterar(comAlca ? { comAlca } : { comAlca, corAlcaId: null })
            }
            onSelecionarCorAlca={(corId) => alterar({ corAlcaId: corId })}
          />
          {erros.corAlca && <MensagemErro>{erros.corAlca}</MensagemErro>}

          <QuantitySelector
            quantidade={personalizacao.quantidade}
            onAlterar={(quantidade) => alterar({ quantidade })}
          />
          {erros.quantidade && <MensagemErro>{erros.quantidade}</MensagemErro>}

          <div className={styles.observacoes}>
            <label htmlFor="observacoes-item">Observações (opcional)</label>
            <textarea
              id="observacoes-item"
              className={styles.campoObservacoes}
              maxLength={config.limiteObservacoes}
              value={personalizacao.observacoes}
              onChange={(evento) => alterar({ observacoes: evento.target.value })}
              placeholder="Algum detalhe especial? Conte para a gente."
            />
            <span className={styles.contador}>
              {personalizacao.observacoes.length}/{config.limiteObservacoes}
            </span>
          </div>

          <PriceSummary
            produto={produto}
            comAlca={produto.permiteAlca && personalizacao.comAlca}
            quantidade={personalizacao.quantidade}
          />

          <Botao onClick={confirmar} disabled={!podeAdicionar}>
            {itemEmEdicao ? 'Salvar alterações' : 'Adicionar ao carrinho'}
          </Botao>
        </div>
      </div>
    </div>
  );
}
