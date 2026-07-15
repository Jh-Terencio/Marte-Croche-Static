# Research — Loja Online Marte Crochê (v1)

**Fase 0 do plano** | Data: 2026-07-14

Nenhum item ficou marcado como NEEDS CLARIFICATION no Technical Context; este documento registra as decisões técnicas, seus racionais e as alternativas descartadas, todas avaliadas contra a Constituição v2.0.0 (simplicidade, frontend-only, dependências mínimas).

## D1 — Ferramenta de build: Vite

- **Decision**: Vite com template `react-ts`.
- **Rationale**: padrão atual para SPAs React; dev server rápido; build estático simples de hospedar; suporte nativo a CSS Modules, assets e Vitest sem configuração extra.
- **Alternatives considered**:
  - *Create React App*: descontinuado, dependências desatualizadas.
  - *Next.js*: traz SSR/rotas de servidor — proibido pelo escopo frontend-only e complexidade desnecessária (§3.I).
  - *HTML + React via CDN sem build*: sem TypeScript, sem testes integrados, manutenção pior.

## D2 — Linguagem: TypeScript (strict)

- **Decision**: TypeScript 5.x com `strict: true`.
- **Rationale**: a spec exige "tipos ou interfaces consistentes para produtos e itens do carrinho" (Notas para o Planejamento Técnico); TS entrega isso nativamente, previne erros no catálogo (dados editados à mão pela manutenção) e não adiciona dependência de runtime.
- **Alternatives considered**:
  - *JavaScript + JSDoc*: tipos mais frágeis e verbosos; ganho de simplicidade marginal.
  - *PropTypes*: verificação só em runtime, cobertura parcial.

## D3 — Roteamento: react-router-dom

- **Decision**: `react-router-dom` v6 com rotas: `/` (home, aceitando `?categoria=` e `?busca=`), `/produto/:id`, `/carrinho`, `/finalizacao`, `/revisao`.
- **Rationale**: botão voltar do navegador funciona nas etapas (exigência de UX de "voltar sem perder dados"); links diretos para categorias; biblioteca pequena, padrão e estável — uma única dependência justificada pela necessidade direta (§5).
- **Alternatives considered**:
  - *Estado de vista manual (sem rotas)*: quebra o botão voltar e links de categoria; mais código próprio para manter.
  - *Hash routing manual*: reinventa roteador; mais complexo de manter que usar a biblioteca padrão.
  - *TanStack Router*: mais recursos do que o necessário.

## D4 — Estado global: Context + useReducer (somente carrinho)

- **Decision**: um único `CarrinhoContext` com `useReducer`; dados do cliente em estado compartilhado apenas do fluxo de finalização (mantido em contexto de sessão não persistido), demais estados locais aos componentes.
- **Rationale**: "estado global apenas quando realmente necessário" (spec); o carrinho é o único estado verdadeiramente compartilhado (header, páginas, revisão). Reducer facilita testes das transições.
- **Alternatives considered**:
  - *Redux/Zustand/Jotai*: dependência extra sem necessidade — viola §3.I/§5.
  - *Prop drilling*: espalha acoplamento por todas as páginas.

## D5 — Persistência do carrinho: localStorage com schema versionado

- **Decision**: chave única `marte-croche:carrinho`, payload `{ versao: 1, itens: [...] }`; leitura defensiva (try/catch + validação estrutural; descarte silencioso se inválido ou versão desconhecida); escrita a cada mudança do reducer; dados pessoais NUNCA entram nessa chave.
- **Rationale**: atende recuperação pós-refresh (FR-024) e a exigência de estrutura versionável; `localStorage` é síncrono e suficiente para um objeto pequeno.
- **Alternatives considered**:
  - *sessionStorage*: perde o carrinho ao fechar a aba — pior para o cliente que volta depois.
  - *IndexedDB*: assíncrono e complexo demais para um carrinho pequeno.
  - *Cookies*: enviados em requisições, limite de tamanho, semântica errada.

## D6 — Estilo: CSS puro com variáveis + CSS Modules

- **Decision**: `tokens.css` com custom properties (`--cor-fundo: #F4F1EB`, `--cor-destaque: #681119`, neutros, espaçamentos, tipografia); componentes estilizados via CSS Modules (`.module.css`), abordagem mobile-first com `min-width` breakpoints (480/768/1024 px).
- **Rationale**: zero dependências; identidade artesanal exige design próprio (não "genérico" — spec FR-002), o que frameworks utilitários atrapalham; CSS Modules evita colisão de nomes e vem pronto no Vite.
- **Alternatives considered**:
  - *Tailwind*: dependência + estética utilitária genérica; contra FR-002 e §3.I.
  - *styled-components/emotion*: dependência de runtime + CSS-in-JS desnecessário.
  - *Sass*: etapa extra sem ganho real sobre custom properties.

## D7 — Tipografia e ícones

- **Decision**: fontes do sistema com fallback elegante (serifada para títulos via font stack — ex.: `Georgia, 'Times New Roman', serif` — e sans-serif humanista para texto) OU uma única família via `@fontsource` empacotada localmente se a identidade exigir (decidir na implementação; sem Google Fonts via CDN). Ícones: SVGs inline próprios (carrinho, busca, lupa, setas) — sem biblioteca de ícones.
- **Rationale**: CDN de fontes = requisição externa evitável (privacidade §6); meia dúzia de ícones não justifica dependência.
- **Alternatives considered**: *Google Fonts CDN* (requisição a terceiro), *react-icons* (dependência pesada para ~6 ícones).

## D8 — Carrossel: implementação própria

- **Decision**: componente `HeroCarousel` próprio: container com `overflow: hidden`, translação CSS, botões prev/next, indicadores (botões com `aria-label`), autoplay opcional via `setInterval` com pausa em hover/foco/`prefers-reduced-motion`, dimensões reservadas via `aspect-ratio` (sem layout shift).
- **Rationale**: bibliotecas de carrossel (Swiper, Embla) são grandes e genéricas; o requisito é simples e bem delimitado (FR-007).
- **Alternatives considered**: *Swiper* (~40 kB+, API enorme), *Embla* (melhor, mas ainda dependência evitável), *CSS scroll-snap puro* (indicadores/autoplay ficam desajeitados — usado como base interna onde couber).

## D9 — Máscaras e validação: funções próprias

- **Decision**: `mascaraTelefone` (`(11) 91234-5678`), `mascaraCep` (`01234-567`) e validadores em `src/lib/validacao.ts` como funções puras que recebem valores e devolvem `{ valido, erros }` com mensagens em pt-BR.
- **Rationale**: 2 máscaras e ~10 regras não justificam react-hook-form/zod/imask; funções puras são diretamente testáveis (§12).
- **Alternatives considered**: *react-hook-form + zod* (2 dependências, curva de manutenção), *validação HTML5 apenas* (mensagens do navegador não seguem o tom pt-BR da marca; usada como reforço `inputmode`/`autocomplete`, não como fonte única).

## D10 — Formatação monetária: Intl.NumberFormat

- **Decision**: `formatarReais(centavos: number)` usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`; **preços armazenados em centavos (inteiros)** nos dados e cálculos.
- **Rationale**: nativo do navegador; centavos evitam erro de ponto flutuante em somas (ex.: R$ 15,00 = `1500`).
- **Alternatives considered**: *números decimais* (risco `0.1 + 0.2`), *dinero.js* (dependência desnecessária).

## D11 — URL do WhatsApp

- **Decision**: `https://wa.me/<numero>?text=<encodeURIComponent(mensagem)>`, número em formato internacional sem símbolos (ex.: `5511999999999`) definido em `src/data/config.ts`; abertura via âncora `target="_blank" rel="noopener noreferrer"` renderizada no clique de confirmação (âncora real evita bloqueio de pop-up melhor que `window.open`; ainda assim, após a tentativa, um link direto visível permanece como fallback).
- **Rationale**: `wa.me` funciona em WhatsApp Web e app móvel (FR-034); `encodeURIComponent` trata acentos, `*`, quebras de linha (`%0A`) e emojis corretamente.
- **Alternatives considered**: *`api.whatsapp.com/send`* (equivalente, URL mais longa), *`whatsapp://`* (só app, quebra no desktop).

## D12 — Testes: Vitest + React Testing Library

- **Decision**: Vitest (roda nativo no Vite) para `src/lib/*.test.ts`; RTL + `@testing-library/user-event` + jsdom para componentes e fluxos críticos (personalização, carrinho, formulário, revisão); `localStorage` mockado nos testes de storage.
- **Rationale**: exigência constitucional (§12) de funções puras testadas; Vitest não adiciona config paralela (usa a do Vite).
- **Alternatives considered**: *Jest* (config duplicada com Vite), *Playwright/Cypress e2e* (valioso, porém custo alto para v1 — cenários e2e cobertos manualmente via quickstart.md; pode entrar depois).

## D13 — Imagens por cor e fallback

- **Decision**: arquivos WebP em `public/images/produtos/<produto-id>/<cor-id | padrao>/NN-nome.webp`; os **caminhos completos ficam listados nos dados do produto** (nunca montados a partir do nome digitado da cor); componente `ImageWithFallback` com placeholder que reserva espaço (`aspect-ratio`), estado de carregamento e `onError` → imagem padrão do produto → `fallback-produto.webp`; `loading="lazy"` fora da dobra; pré-carregamento (`new Image()`) das imagens das demais cores ao abrir o produto para troca instantânea.
- **Rationale**: atende FR-015/016/017 e os critérios da spec sobre organização por produto/cor com relação registrada nos dados; `public/` simplifica caminhos estáveis referenciados em dados.
- **Alternatives considered**: *imports em `src/assets` com bundler* (hash nos nomes complica listar caminhos em dados; import dinâmico por cor adiciona complexidade), *derivar caminho do nome da cor* (explicitamente vedado pela spec).

## D14 — Busca

- **Decision**: filtro em memória (`filtrarProdutos(termo, produtos)`) com normalização de acentos (`String.normalize('NFD')` + remoção de diacríticos), casando nome, categoria, descrição e `termosDeBusca` do produto; UI como campo expansível no header que navega para `/?busca=termo`.
- **Rationale**: catálogo de dezenas de itens dispensa indexação; URL com termo preserva estado ao voltar/compartilhar.
- **Alternatives considered**: *Fuse.js* (fuzzy search — dependência desnecessária nesta escala), *modal dedicado* (mais componentes; campo expansível é mais simples).

## D15 — Fluxo pós-WhatsApp (RN-10)

- **Decision**: ao clicar em "Enviar pedido pelo WhatsApp", a revisão passa a exibir estado "pedido encaminhado" com dois caminhos: "Novo pedido" (abre `ModalConfirmacao`; ao confirmar, `limparCarrinho()` e navega para home) e "Continuar com este carrinho". O carrinho nunca é limpo automaticamente.
- **Rationale**: implementa exatamente a decisão RN-10 da spec (opção mais simples e segura).
- **Alternatives considered**: *limpar ao abrir WhatsApp* (perda irreversível se envio falhar — vetado pela spec), *flag "encaminhado" persistida com recuperação* (mais estados para manter, ganho marginal).
