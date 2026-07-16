import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { PersonalizacaoItem, ItemCarrinho, AdicionalEscolhido } from '../types/carrinho';
import type { Produto } from '../types/produto';
import { produtoPorId } from '../data/produtos';
import { nomeDaCategoria } from '../data/categorias';
import { config } from '../data/config';
import { precoUnitario } from '../lib/preco';
import { validarPersonalizacao } from '../lib/validacao';
import { useCarrinho } from '../context/CarrinhoContext';
import { ProductGallery } from '../components/produto/ProductGallery';
import { ColorSelector } from '../components/produto/ColorSelector';
import { AdicionaisSelector } from '../components/produto/AdicionaisSelector';
import { QuantitySelector } from '../components/produto/QuantitySelector';
import { PriceSummary } from '../components/produto/PriceSummary';
import { Botao } from '../components/comuns/Botao';
import { MensagemErro } from '../components/comuns/MensagemErro';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import styles from './ProdutoPage.module.css';

const PERSONALIZACAO_INICIAL: PersonalizacaoItem = {
  quantidadeCores: 1,
  corPrincipalId: null,
  corSecundariaId: null,
  adicionaisSelecionados: {},
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
  const adicionaisSelecionados: Record<string, Record<string, string | null>> = {};
  for (const adicional of item.adicionais) {
    const opcoes: Record<string, string | null> = {};
    for (const opcao of adicional.opcoes) {
      opcoes[opcao.opcaoId] = opcao.valorId;
    }
    adicionaisSelecionados[adicional.adicionalId] = opcoes;
  }

  return {
    quantidadeCores: item.corSecundaria ? 2 : 1,
    corPrincipalId: item.corPrincipal?.id ?? null,
    corSecundariaId: item.corSecundaria?.id ?? null,
    adicionaisSelecionados,
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
    personalizacao.quantidadeCores === 2
      ? (produto.cores.find((c) => c.id === personalizacao.corSecundariaId) ?? null)
      : null;

  const adicionaisIds = Object.keys(personalizacao.adicionaisSelecionados);
  const adicionais: AdicionalEscolhido[] = produto.adicionais
    .filter((a) => adicionaisIds.includes(a.id))
    .map((a) => ({
      adicionalId: a.id,
      nomeAdicional: a.nome,
      precoCentavos: a.precoCentavos,
      opcoes: a.opcoes
        .filter((o) => personalizacao.adicionaisSelecionados[a.id]?.[o.id])
        .map((o) => ({
          opcaoId: o.id,
          nomeOpcao: o.legenda,
          valorId: personalizacao.adicionaisSelecionados[a.id][o.id]!,
          valorNome:
            o.valores.find(
              (v) => v.id === personalizacao.adicionaisSelecionados[a.id][o.id],
            )?.nome ?? '',
        })),
    }));

  return {
    id,
    produtoId: produto.id,
    nomeProduto: produto.nome,
    categoriaNome: nomeDaCategoria(produto.categoriaId),
    imagem:
      corPrincipal && corPrincipal.imagens.length > 0
        ? corPrincipal.imagens[0]
        : (produto.imagensPadrao[0] ?? ''),
    precoUnitarioCentavos: precoUnitario(produto, adicionaisIds),
    quantidade: personalizacao.quantidade,
    corPrincipal: corPrincipal && { id: corPrincipal.id, nome: corPrincipal.nome },
    corSecundaria: corSecundaria && { id: corSecundaria.id, nome: corSecundaria.nome },
    adicionais,
    observacoes: personalizacao.observacoes,
  };
}

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
        nivelTitulo={1}
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

  const podeTerDuasCores = produto.cores.length > 1;

  const coresRepetidasProibidas =
    !produto.permiteCorRepetida && personalizacao.corPrincipalId
      ? {
          ids: [personalizacao.corPrincipalId],
          motivo: 'Este modelo não permite repetir a mesma cor.',
        }
      : undefined;

  function toggleAdicional(adicionalId: string) {
    setPersonalizacao((atual) => {
      const novo = { ...atual.adicionaisSelecionados };
      if (adicionalId in novo) {
        delete novo[adicionalId];
      } else {
        novo[adicionalId] = {};
      }
      return { ...atual, adicionaisSelecionados: novo };
    });
  }

  function setOpcaoAdicional(
    adicionalId: string,
    opcaoId: string,
    valorId: string | null,
  ) {
    setPersonalizacao((atual) => ({
      ...atual,
      adicionaisSelecionados: {
        ...atual.adicionaisSelecionados,
        [adicionalId]: {
          ...atual.adicionaisSelecionados[adicionalId],
          [opcaoId]: valorId,
        },
      },
    }));
  }

  const adicionaisIds = Object.keys(personalizacao.adicionaisSelecionados);

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
              {podeTerDuasCores && (
                <fieldset className={styles.toggleCores}>
                  <legend className={styles.legendaCores}>Quantas cores?</legend>
                  <div className={styles.opcoesCores}>
                    <button
                      type="button"
                      className={styles.opcaoCor}
                      aria-pressed={personalizacao.quantidadeCores === 1}
                      onClick={() =>
                        alterar({ quantidadeCores: 1, corSecundariaId: null })
                      }
                    >
                      1 cor
                    </button>
                    <button
                      type="button"
                      className={styles.opcaoCor}
                      aria-pressed={personalizacao.quantidadeCores === 2}
                      onClick={() => alterar({ quantidadeCores: 2 })}
                    >
                      2 cores
                    </button>
                  </div>
                </fieldset>
              )}

              <ColorSelector
                legenda={personalizacao.quantidadeCores === 2 ? 'Cor principal' : 'Cor'}
                obrigatoriedade="obrigatória"
                cores={produto.cores}
                selecionadaId={personalizacao.corPrincipalId}
                onSelecionar={(corId) => {
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

              {personalizacao.quantidadeCores === 2 && (
                <>
                  <ColorSelector
                    legenda="Segunda cor"
                    obrigatoriedade="obrigatória"
                    cores={produto.cores}
                    selecionadaId={personalizacao.corSecundariaId}
                    onSelecionar={(corId) => alterar({ corSecundariaId: corId })}
                    desabilitadas={coresRepetidasProibidas}
                  />
                  {erros.corSecundaria && (
                    <MensagemErro>{erros.corSecundaria}</MensagemErro>
                  )}
                </>
              )}
            </>
          )}

          <AdicionaisSelector
            adicionais={produto.adicionais}
            selecionados={personalizacao.adicionaisSelecionados}
            onToggle={toggleAdicional}
            onOpcao={setOpcaoAdicional}
            erros={erros}
          />

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
            adicionaisIds={adicionaisIds}
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
