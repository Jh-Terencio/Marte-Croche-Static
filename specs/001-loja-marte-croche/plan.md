# Implementation Plan: Loja Online Marte Crochê (v1)

**Branch**: `001-loja-marte-croche` | **Date**: 2026-07-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-loja-marte-croche/spec.md`

## Summary

Construir do zero uma SPA estática em React (Vite + TypeScript) para a Marte Crochê: catálogo de produtos artesanais com personalização (cores com troca de imagem, alça, quantidade), carrinho temporário multi-itens persistido em `localStorage` (sem dados pessoais), formulário de finalização com validação em pt-BR, prévia exata da mensagem e abertura do WhatsApp via `wa.me` com mensagem codificada. Regras de negócio (preço, validação, montagem/codificação da mensagem) como funções puras testadas com Vitest, separadas dos componentes visuais e dos dados do catálogo.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 18.x

**Primary Dependencies**: `react`, `react-dom`, `react-router-dom` (runtime — nada além disso); dev: `vite`, `typescript`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`

**Storage**: `localStorage` apenas para o carrinho (schema versionado, sem dados pessoais); dados do cliente somente em memória de sessão (estado React)

**Testing**: Vitest (funções puras em `src/lib/`) + React Testing Library (componentes e fluxos críticos)

**Target Platform**: navegadores modernos (mobile-first, a partir de 320 px); hospedagem estática (build do Vite)

**Project Type**: aplicação web frontend estática (SPA)

**Performance Goals**: carregamento inicial rápido em rede móvel (imagens WebP otimizadas, lazy loading); troca de imagem por cor sem recarregar página e sem layout shift; resultados de busca imediatos (filtro em memória sobre catálogo pequeno)

**Constraints**: exclusivamente frontend (Constituição §2); sem analytics/rastreamento (§6); dependências mínimas (§5); pt-BR em toda a interface (§3.VI); acessibilidade básica obrigatória (§11)

**Scale/Scope**: catálogo na ordem de dezenas de produtos, 3 categorias iniciais; ~5 vistas (home, produto, carrinho, finalização, revisão); usuário único por sessão, sem concorrência

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constituição de referência: [constitution.md v2.0.0](../../.specify/memory/constitution.md)

| Gate | Princípio/Seção | Avaliação | Status |
| --- | --- | --- | --- |
| G1 | §3.I Simplicidade | 3 dependências de runtime; sem Redux/Zustand (Context + useReducer); carrossel, máscaras e validação feitos à mão; CSS puro com variáveis | ✅ PASS |
| G2 | §3.II Exclusivamente frontend | SPA estática Vite; nenhuma API própria; única integração externa é a URL do WhatsApp e links da marca | ✅ PASS |
| G3 | §3.III / §6 Privacidade | `localStorage` guarda apenas itens do carrinho (produto + personalização); dados do cliente vivem só no estado React; zero analytics, zero cookies | ✅ PASS |
| G4 | §3.IV Controle explícito | `window.open`/link `wa.me` disparado exclusivamente por clique no botão de envio, após etapa de revisão; fallback de link clicável se pop-up bloqueado | ✅ PASS |
| G5 | §3.V / §5 Manutenção | Camadas separadas: `src/data/` (catálogo + config central), `src/components/` + `src/pages/` (visual), `src/lib/` (regras puras); novo produto/cor = editar só `src/data/produtos.ts` + imagens | ✅ PASS |
| G6 | §3.VI Mobile-first pt-BR | CSS mobile-first; todos os textos em pt-BR centralizáveis; identidade `#F4F1EB`/`#681119` em variáveis CSS | ✅ PASS |
| G7 | §8 Formulário | Campos exatamente os da constituição; máscaras próprias para telefone/CEP; validação por campo | ✅ PASS |
| G8 | §9 WhatsApp | Modelo de mensagem multi-itens; `encodeURIComponent`; número em `src/data/config.ts` (local único) | ✅ PASS |
| G9 | §12 Testes | Funções puras (`preco`, `mensagem`, `validacao`, `formatacao`, `carrinhoStorage`) com testes unitários; fluxos críticos com RTL | ✅ PASS |
| G10 | §13 Proibições | Nenhuma funcionalidade proibida no design (sem login, pagamento, frete, favoritos etc.) | ✅ PASS |

**Resultado pré-Fase 0**: todos os gates passam. Nenhuma violação a justificar.

**Re-avaliação pós-Fase 1**: design detalhado em `data-model.md` e `contracts/` mantém todos os gates ✅ — nenhuma entidade guarda dado pessoal de forma persistente, nenhum contrato introduz serviço externo, estrutura de camadas preservada.

## Project Structure

### Documentation (this feature)

```text
specs/001-loja-marte-croche/
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — decisões técnicas e alternativas
├── data-model.md        # Fase 1 — entidades, campos e validações
├── quickstart.md        # Fase 1 — guia de execução e verificação
├── contracts/           # Fase 1 — contratos internos
│   ├── funcoes-negocio.md
│   ├── mensagem-whatsapp.md
│   └── armazenamento-carrinho.md
└── tasks.md             # Fase 2 — saída de /speckit-tasks (não criado aqui)
```

### Source Code (repository root)

```text
index.html                     # entrada Vite
public/
└── images/
    ├── fallback-produto.webp  # imagem genérica de fallback
    ├── carrossel/             # fotos do carrossel de destaque
    └── produtos/
        └── <produto-id>/
            ├── padrao/        # imagens antes da escolha de cor
            └── <cor-id>/      # imagens por cor (principal primeiro)

src/
├── main.tsx                   # bootstrap React + Router
├── App.tsx                    # layout (Header/Footer) + rotas
├── styles/
│   ├── tokens.css             # variáveis: cores da marca, espaçamentos, tipografia
│   └── global.css             # reset leve, base mobile-first, foco visível
├── types/
│   ├── produto.ts             # Produto, CorDeProduto, Categoria
│   ├── carrinho.ts            # ItemCarrinho, CarrinhoPersistido
│   └── cliente.ts             # DadosCliente (somente memória)
├── data/                      # CAMADA DE DADOS (única a editar p/ novo produto)
│   ├── config.ts              # nº WhatsApp, preços da alça, limites, links da marca
│   ├── categorias.ts          # categorias iniciais (extensível)
│   ├── produtos.ts            # catálogo completo
│   └── carrossel.ts           # slides do carrossel
├── lib/                       # CAMADA DE REGRAS (funções puras — 100% testadas)
│   ├── preco.ts               # precoUnitario, subtotal, totalPedido
│   ├── formatacao.ts          # formatarReais, mascaraTelefone, mascaraCep
│   ├── validacao.ts           # validarPersonalizacao, validarDadosCliente
│   ├── mensagem.ts            # montarMensagem, montarUrlWhatsApp
│   ├── busca.ts               # filtrarProdutos (nome/categoria/descrição/termos)
│   └── carrinhoStorage.ts     # carregar/salvar/limpar com schema versionado
├── context/
│   └── CarrinhoContext.tsx    # Context + useReducer; sincroniza com storage
├── components/                # CAMADA VISUAL (componentes pequenos e reutilizáveis)
│   ├── layout/    (Header, Navigation, CatalogMenu, SearchButton, CartButton, Footer)
│   ├── home/      (HeroCarousel, ProductGrid, ProductCard)
│   ├── produto/   (ProductGallery, ColorSelector, StrapOptions,
│   │               QuantitySelector, PriceSummary, ImageWithFallback)
│   ├── carrinho/  (CartItem, CartSummary)
│   ├── checkout/  (CheckoutForm, CampoTexto, CampoSelect)
│   ├── pedido/    (OrderPreview, WhatsAppOrderButton)
│   └── comuns/    (Botao, MensagemErro, EstadoVazio, ModalConfirmacao)
├── pages/
│   ├── HomePage.tsx           # carrossel + grid (filtro por categoria/busca via URL)
│   ├── ProdutoPage.tsx        # detalhes + personalização (/produto/:id)
│   ├── CarrinhoPage.tsx       # itens + totais (/carrinho)
│   ├── CheckoutPage.tsx       # formulário de dados (/finalizacao)
│   └── RevisaoPage.tsx        # prévia + envio (/revisao)
└── test/
    └── setup.ts               # setup RTL/jsdom

# Testes colocados junto ao código:
# src/lib/*.test.ts            (unitários das funções puras)
# src/components/**/*.test.tsx (componentes críticos)
# src/pages/*.test.tsx         (fluxos: personalizar→carrinho→checkout→revisão)
```

**Structure Decision**: projeto único frontend (SPA Vite). As três camadas da constituição mapeiam para `src/data/` (dados/config), `src/components/` + `src/pages/` (visual) e `src/lib/` (regras de negócio puras). Estado global restrito ao carrinho (`CarrinhoContext`); dados do cliente ficam em estado local compartilhado apenas entre as etapas de finalização (state da rota/contexto de sessão, nunca persistido). Imagens em `public/images/` organizadas por produto e cor, com caminhos registrados nos dados do produto (nunca derivados do nome digitado da cor).

## Complexity Tracking

> Nenhuma violação constitucional — tabela não aplicável.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
