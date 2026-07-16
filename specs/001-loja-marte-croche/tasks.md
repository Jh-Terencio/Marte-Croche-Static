# Tasks: Loja Online Marte Crochê (v1)

**Input**: Design documents from `/specs/001-loja-marte-croche/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: INCLUÍDOS — a Constituição §12 exige funções puras testadas e a spec define casos obrigatórios por contrato. Testes de `src/lib/` seguem os contratos; testes RTL cobrem os fluxos críticos.

**Organization**: tarefas agrupadas por user story (US1–US6 da spec) para implementação e verificação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: user story da spec (US1–US6)

## Path Conventions

Projeto único frontend na raiz do repositório (ver plan.md → Project Structure): `src/`, `public/`, testes colocados junto ao código (`*.test.ts(x)`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: criar o projeto Vite e a base de estilos/estrutura.

- [X] T001 Inicializar projeto Vite `react-ts` na raiz do repositório (scaffold manual — diretório não vazio impede o create interativo), instalar `react-router-dom` (runtime) e `vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom` (dev); adicionar scripts `dev`, `test`, `test:run`, `build`, `preview` em package.json
- [X] T002 Configurar TypeScript strict em tsconfig.json e Vitest em vite.config.ts (environment jsdom, globals, setupFiles); criar src/test/setup.ts importando jest-dom
- [X] T003 [P] Criar src/styles/tokens.css (variáveis: `--cor-fundo: #F4F1EB`, `--cor-destaque: #681119`, neutros, espaçamentos, tipografia com font stacks locais) e src/styles/global.css (reset leve, base mobile-first, foco visível, `box-sizing`), importados em src/main.tsx
- [X] T004 [P] Criar árvore public/images/ (carrossel/, produtos/<produto-id>/{padrao,<cor-id>}/) com imagens WebP placeholder e public/images/fallback-produto.webp

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: tipos, dados, funções puras de base, contexto do carrinho e casca do app — pré-requisitos de TODAS as stories.

**⚠️ CRITICAL**: nenhuma user story começa antes desta fase terminar.

- [X] T005 [P] Criar tipos `Produto`, `CorDeProduto`, `Categoria` em src/types/produto.ts conforme data-model.md
- [X] T006 [P] Criar tipos `ItemCarrinho`, `CarrinhoPersistido` em src/types/carrinho.ts e `DadosCliente` em src/types/cliente.ts conforme data-model.md
- [X] T007 [P] Criar src/data/config.ts (`ConfiguracaoLoja`: numeroWhatsApp placeholder, precoAlcaComBolsaCentavos=1500, precoAlcaAvulsaCentavos=2000, quantidadeMaximaPorItem=20, limiteObservacoes=500, linkInstagram, fraseMarca, imagemFallback)
- [X] T008 [P] Criar src/data/categorias.ts com as 3 categorias iniciais (bolsas, alcas, capinhas-airpods)
- [X] T009 Criar catálogo inicial em src/data/produtos.ts: ≥2 bolsas (cores com listas de imagens, coresAlca, permiteAlca=true, `permiteCorRepetida` variando entre elas), 1 alça avulsa (preço = config), ≥1 capinha de AirPods, com prazoConfeccao, disponibilidade e termosDeBusca (depende de T005, T007, T008)
- [X] T010 [P] Criar src/data/carrossel.ts (≥3 slides com imagem, alt obrigatório e produtoId opcional)
- [X] T011 [P] Implementar src/lib/formatacao.ts (`formatarReais` em centavos via Intl pt-BR, `mascaraTelefone`, `mascaraCep`) + testes src/lib/formatacao.test.ts conforme contracts/funcoes-negocio.md
- [X] T012 [P] Implementar src/lib/preco.ts (`precoUnitario`, `subtotal`, `totalPedido` — RN-01..03) + testes src/lib/preco.test.ts (bolsa sem/com alça, alça avulsa, quantidades, carrinho misto, vazio)
- [X] T013 [P] Implementar src/lib/carrinhoStorage.ts (`carregarCarrinho`, `salvarCarrinho`, `limparCarrinho` com Storage injetado, chave `marte-croche:carrinho`, payload versão 1, leitura defensiva) + testes src/lib/carrinhoStorage.test.ts com os 7 casos de contracts/armazenamento-carrinho.md
- [X] T014 Implementar src/context/CarrinhoContext.tsx (useReducer: adicionarItem, atualizarItem, alterarQuantidade, removerItem, esvaziar, restaurar; sincronização com carrinhoStorage a cada ação; restaurar na montagem) + testes src/context/CarrinhoContext.test.tsx (depende de T006, T013)
- [X] T015 [P] Criar componentes comuns em src/components/comuns/: Botao.tsx, MensagemErro.tsx, EstadoVazio.tsx, ModalConfirmacao.tsx (acessível: foco preso, Esc fecha, aria) com .module.css
- [X] T016 [P] Criar src/components/comuns/ImageWithFallback.tsx (reserva espaço via aspect-ratio, estado de carregamento, onError → imagem padrão do produto → fallback global, alt obrigatório)
- [X] T017 Criar src/main.tsx e src/App.tsx: BrowserRouter com rotas `/`, `/produto/:id`, `/carrinho`, `/finalizacao`, `/revisao`, layout com slots de Header/Footer (placeholders até US1) envolvido por CarrinhoProvider (depende de T014)

**Checkpoint**: fundação pronta — user stories podem iniciar (inclusive em paralelo).

---

## Phase 3: User Story 1 - Explorar o catálogo na página inicial (Priority: P1) 🎯 MVP

**Goal**: home completa (header com menu/categorias/contador, carrossel, grid de cards, footer) com filtro por categoria.

**Independent Test**: abrir `/` e verificar ordem header→carrossel→produtos→footer, cards completos, categorias filtrando, menu mobile por toque (quickstart passos 1–2).

### Implementation for User Story 1

- [X] T018 [P] [US1] Criar src/components/layout/Header.tsx e src/components/layout/Navigation.tsx (logo, "Início" → topo da home, "Contato" → âncora de contato no footer) com .module.css
- [X] T019 [P] [US1] Criar src/components/layout/CatalogMenu.tsx: categorias de src/data/categorias.ts, abre por hover no desktop e por toque/clique no mobile (sem depender de hover), links para `/?categoria=<id>`, acessível por teclado
- [X] T020 [P] [US1] Criar src/components/layout/CartButton.tsx com contador de itens do CarrinhoContext (aria-label "Carrinho, N itens") linkando para /carrinho
- [X] T021 [P] [US1] Criar src/components/layout/Footer.tsx: nome/logo, frase da marca de config.fraseMarca, seção de contato (âncora), link WhatsApp (wa.me do config, sem mensagem), link Instagram, links de categorias, direitos autorais, informações de encomenda/prazo
- [X] T022 [US1] Integrar menu mobile recolhível no Header (botão hambúrguer acessível, Navigation + CatalogMenu empilhados, fecha ao navegar) (depende de T018, T019, T020)
- [X] T023 [P] [US1] Criar src/components/home/HeroCarousel.tsx com dados de src/data/carrossel.ts: navegação manual (setas), indicadores clicáveis com aria-label, autoplay opcional pausável em hover/foco e desativado com prefers-reduced-motion, aspect-ratio fixo (sem layout shift), usa ImageWithFallback
- [X] T024 [P] [US1] Criar src/components/home/ProductCard.tsx: foto principal (padrão), nome, categoria, preço inicial ("a partir de" formatarReais), prazo, resumo de opções (nº de cores/alça), badge e bloqueio quando indisponível, botão "Ver detalhes" → /produto/:id
- [X] T025 [US1] Criar src/components/home/ProductGrid.tsx e src/pages/HomePage.tsx: ordem header/carrossel/seção de produtos/footer (header/footer via App layout), grid responsivo, filtro por `?categoria=`, EstadoVazio para categoria sem produtos (depende de T023, T024)
- [X] T026 [US1] Testes RTL: src/pages/HomePage.test.tsx (cards renderizados do catálogo, filtro por categoria, estado vazio amigável) e src/components/home/HeroCarousel.test.tsx (avanço manual, indicadores, alt presente)

**Checkpoint**: home navegável e testável de forma independente (MVP visual).

---

## Phase 4: User Story 2 - Personalizar um produto com imagem por cor (Priority: P1)

**Goal**: página de produto com galeria que segue a primeira cor, regras de cores/alça/quantidade, preço reativo e adição ao carrinho.

**Independent Test**: abrir `/produto/<bolsa>`, exercitar cores (máx 2, repetição configurável), alça (+R$ 15,00), quantidade e observações; ver galeria trocar sem perder estado; adicionar ao carrinho só quando válido (quickstart passo 4).

### Implementation for User Story 2

- [X] T027 [US2] Implementar `validarPersonalizacao` em src/lib/validacao.ts (RN-04..06, RN-11; mensagens pt-BR por campo) + testes src/lib/validacao.test.ts (cada regra falhando isolada + caso válido)
- [X] T028 [P] [US2] Criar src/components/produto/ColorSelector.tsx: amostras com nome, seleção de cor principal e segunda cor, bloqueio de 3ª cor com aviso, respeito a `permiteCorRepetida`, selecionado destacado não só por cor (borda+ícone), botões com aria-pressed
- [X] T029 [P] [US2] Criar src/components/produto/StrapOptions.tsx: alternância "Sem alça"/"Com alça" (só se produto.permiteAlca), seletor de cor da alça visível apenas com alça marcada, indicação do acréscimo de R$ 15,00 vindo de config
- [X] T030 [P] [US2] Criar src/components/produto/QuantitySelector.tsx: incremento/decremento + input numérico, limites 1..config.quantidadeMaximaPorItem, acessível
- [X] T031 [P] [US2] Criar src/components/produto/PriceSummary.tsx: valor unitário e subtotal via lib/preco + formatarReais, atualização imediata a cada mudança
- [X] T032 [US2] Criar src/components/produto/ProductGallery.tsx: exibe imagens da cor principal selecionada (ou imagensPadrao antes da escolha), primeira imagem como principal + miniaturas, troca completa ao mudar cor sem recarregar página, pré-carregamento das imagens das demais cores, alts descritivos, usa ImageWithFallback (sem layout shift)
- [X] T033 [US2] Criar src/pages/ProdutoPage.tsx: estado PersonalizacaoItem, integração de todos os componentes, descrição/prazo/infos, botão "Adicionar ao carrinho" habilitado só com validarPersonalizacao válido, adição via CarrinhoContext montando snapshot ItemCarrinho (precoUnitario + imagem da cor), suporte a `?editar=<itemId>` pré-carregando personalização (usado pela US3), produto indisponível bloqueado, produto inexistente → EstadoVazio (depende de T027–T032)
- [X] T034 [US2] Testes RTL src/pages/ProdutoPage.test.tsx: imagem padrão antes da cor; galeria troca ao selecionar e ao trocar cor; quantidade/alça/segunda cor preservadas na troca; 3ª cor bloqueada; +R$ 15,00 com alça; cor da alça só aparece com alça; botão desabilitado até válido; adição gera item correto no contexto

**Checkpoint**: personalização completa e testável abrindo qualquer produto.

---

## Phase 5: User Story 3 - Montar e gerenciar o carrinho (Priority: P1)

**Goal**: página do carrinho com edição completa, totais reativos e persistência.

**Independent Test**: com itens adicionados, alterar quantidade, editar personalização, remover, esvaziar (com confirmação) e recarregar a página verificando recuperação (quickstart passo 5).

### Implementation for User Story 3

- [X] T035 [P] [US3] Criar src/components/carrinho/CartItem.tsx: imagem, nome, categoria, personalizações (cores/alça/observações), quantidade editável (QuantitySelector), preço unitário, subtotal, ações "Editar" (→ /produto/:produtoId?editar=:id) e "Remover"
- [X] T036 [P] [US3] Criar src/components/carrinho/CartSummary.tsx: subtotais e total via totalPedido + formatarReais, aviso de que frete/entrega serão combinados no WhatsApp (RN-12)
- [X] T037 [US3] Criar src/pages/CarrinhoPage.tsx: lista de CartItem, CartSummary, "Esvaziar carrinho" com ModalConfirmacao, "Continuar comprando" → /, "Finalizar pedido" → /finalizacao (desabilitado com carrinho vazio), EstadoVazio amigável (depende de T035, T036)
- [X] T038 [US3] Completar fluxo de edição: ProdutoPage com `?editar=` chama atualizarItem (em vez de adicionar) e navega de volta a /carrinho; item cujo produtoId não existe mais no catálogo exibido com aviso e opção de remoção (edge case da spec)
- [X] T039 [US3] Testes RTL src/pages/CarrinhoPage.test.tsx: alterar quantidade atualiza subtotal/total; remover item atualiza contador; esvaziar exige confirmação; estado restaurado do storage na montagem; vazio bloqueia finalização

**Checkpoint**: carrinho totalmente funcional e persistente.

---

## Phase 6: User Story 4 - Finalizar o pedido e enviar pelo WhatsApp (Priority: P1)

**Goal**: formulário validado, revisão com prévia exata e abertura do WhatsApp com mensagem codificada; pós-envio seguro (RN-10).

**Independent Test**: com carrinho montado, preencher /finalizacao, revisar em /revisao (prévia idêntica ao contrato), clicar enviar e conferir URL wa.me; "Novo pedido" esvazia só após confirmação (quickstart passos 6–7).

### Implementation for User Story 4

- [X] T040 [US4] Implementar `validarDadosCliente` em src/lib/validacao.ts (obrigatórios §8, telefone 10–11 dígitos, CEP `\d{5}-?\d{3}`, UF válida, limites de observações) + ampliar src/lib/validacao.test.ts
- [X] T041 [US4] Implementar src/lib/mensagem.ts (`montarMensagem`, `montarUrlWhatsApp` conforme contracts/mensagem-whatsapp.md, incluindo regras de linhas de cor e omissão de opcionais) + src/lib/mensagem.test.ts com os 7 testes obrigatórios do contrato
- [X] T042 [P] [US4] Criar src/components/checkout/CampoTexto.tsx e CampoSelect.tsx: label visível associado, indicação de obrigatório, máscara opcional (telefone/CEP via lib/formatacao), inputmode/autocomplete adequados, MensagemErro junto ao campo
- [X] T043 [US4] Criar src/context/FinalizacaoContext.tsx: DadosCliente em memória de sessão (NUNCA persistido), disponível entre /carrinho ↔ /finalizacao ↔ /revisao; provider no App (depende de T017)
- [X] T044 [US4] Criar src/components/checkout/CheckoutForm.tsx e src/pages/CheckoutPage.tsx: 11 campos da Constituição §8, validação por campo no envio (sem apagar dados válidos), select de UF com 27 estados, "Voltar ao carrinho" preservando dados, "Revisar pedido" → /revisao só com formulário válido; redireciona para /carrinho se carrinho vazio (depende de T040, T042, T043)
- [X] T045 [US4] Criar src/components/pedido/OrderPreview.tsx: itens com personalizações/quantidades/subtotais, total, dados do cliente, endereço e bloco de prévia exata (`<pre>` com saída de montarMensagem) (depende de T041)
- [X] T046 [US4] Criar src/components/pedido/WhatsAppOrderButton.tsx (âncora `wa.me` com target _blank rel noopener, montarUrlWhatsApp; após clique mantém link visível como fallback de pop-up) e src/pages/RevisaoPage.tsx: OrderPreview + ações "Editar carrinho", "Editar informações", "Enviar pedido pelo WhatsApp"; estado pós-clique com "Novo pedido" (ModalConfirmacao → esvaziar → /) e "Continuar com este carrinho" — carrinho nunca limpo automaticamente (RN-10) (depende de T043, T045)
- [X] T047 [US4] Testes RTL: src/pages/CheckoutPage.test.tsx (erros por campo pt-BR, dados válidos preservados, voltar/retornar mantém dados) e src/pages/RevisaoPage.test.tsx (prévia idêntica a montarMensagem, nenhuma URL aberta sem clique, href correto do botão, "Novo pedido" só esvazia após confirmação)

**Checkpoint**: jornada completa catálogo→WhatsApp funcional — produto entregável.

---

## Phase 7: User Story 5 - Buscar produtos (Priority: P2)

**Goal**: busca por nome/categoria/descrição/termos com normalização de acentos.

**Independent Test**: buscar termos com e sem acento e conferir resultados e mensagem de vazio (quickstart passo 3).

### Implementation for User Story 5

- [X] T048 [US5] Implementar src/lib/busca.ts (`filtrarProdutos` com normalização NFD sem diacríticos, casando nome/categoria/descrição/termosDeBusca) + testes src/lib/busca.test.ts
- [X] T049 [US5] Criar src/components/layout/Search.tsx: botão de busca no Header expandindo campo (acessível, Esc fecha), submit navega para `/?busca=<termo>`; integrar no Header desktop e no menu mobile (depende de T048)
- [X] T050 [US5] Aplicar filtro `?busca=` na HomePage via filtrarProdutos (combinável com categoria), mensagem amigável sem resultados; ampliar src/pages/HomePage.test.tsx (resultado com/sem acento, vazio)

**Checkpoint**: busca funcional de ponta a ponta.

---

## Phase 8: User Story 6 - Usar a loja no celular e por teclado (Priority: P1)

**Goal**: jornada completa impecável em 320 px e 100% operável por teclado.

**Independent Test**: quickstart passos 8–9 (viewport 320 px sem rolagem horizontal; navegação só por teclado com foco visível).

### Implementation for User Story 6

- [X] T051 [US6] Passada de responsividade em todas as páginas/componentes (.module.css): breakpoints 480/768/1024, sem rolagem horizontal em 320 px, imagens contidas (`max-width:100%`), alvos de toque ≥ 44 px, carrinho/formulário confortáveis no celular, sem layout shift na troca de imagens
- [X] T052 [US6] Passada de acessibilidade: hierarquia de títulos por página, alts revisados, labels/aria nos controles (carrossel, ColorSelector, ModalConfirmacao, menu mobile), foco visível consistente (tokens.css), estados selecionados perceptíveis sem cor apenas, skip para conteúdo se necessário
- [X] T053 [US6] Executar quickstart passos 8–9 (mobile DevTools 320 px + jornada completa por teclado) e corrigir toda falha encontrada

**Checkpoint**: todas as user stories funcionais em qualquer viewport e por teclado.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [X] T054 [P] Criar README.md: como rodar (quickstart), como adicionar produto/cor/categoria/slide do carrossel editando apenas src/data/ (Constituição §3.V), onde configurar número do WhatsApp
- [X] T055 Auditoria final: `npm run test:run` 100% verde, `npm run build` sem erros, aba Network sem requisições a domínios externos (exceto navegação wa.me por clique), roteiro quickstart passos 1–7 completo sem falhas
- [X] T056 Checagem de conformidade: critérios 1–10 da Constituição §15 e SC-001..SC-010 da spec verificados um a um; registrar resultado em specs/001-loja-marte-croche/checklists/conformidade.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências;
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories;
- **US1 (Phase 3)**: depende da Phase 2; nenhuma dependência de outra story;
- **US2 (Phase 4)**: depende da Phase 2; independente da US1 (usa rotas da casca do app);
- **US3 (Phase 5)**: depende da Phase 2; T038 integra com a ProdutoPage da US2 (T033);
- **US4 (Phase 6)**: depende da Phase 2; precisa de carrinho populável (US2 T033 mínimo) para teste ponta a ponta, mas suas libs (T040, T041) são independentes;
- **US5 (Phase 7)**: depende da Phase 2 e do Header (US1 T018/T022) para integração da UI;
- **US6 (Phase 8)**: depende de todas as páginas existirem (US1–US5);
- **Polish (Phase 9)**: depende de tudo.

### User Story Dependencies

- Ordem recomendada de entrega: US1 → US2 → US3 → US4 → US5 → US6 (a US6 é transversal e fecha a jornada; a US5 pode ser adiantada por outro dev após T022).

### Within Each User Story

- Funções puras + testes antes dos componentes que as usam; componentes folha [P] antes das páginas que os integram; testes RTL da página por último.

### Parallel Opportunities

- Phase 1: T003 ∥ T004 (após T001–T002);
- Phase 2: T005–T008 e T010–T013 e T015–T016 majoritariamente ∥ (T009 após T005/T007/T008; T014 após T006/T013; T017 após T014);
- US1: T018–T021, T023, T024 todos ∥; depois T022, T025, T026;
- US2: T028–T031 ∥ (após T027); depois T032 → T033 → T034;
- US3: T035 ∥ T036; depois T037 → T038 → T039;
- US4: T042 ∥ T040/T041; depois T043 → T044/T045 → T046 → T047;
- Com dois devs após a Phase 2: Dev A segue US1→US5, Dev B segue US2→US3→US4.

---

## Parallel Example: User Story 1

```text
# Após o checkpoint da Phase 2, disparar em paralelo:
Task: "T018 Header + Navigation em src/components/layout/"
Task: "T019 CatalogMenu em src/components/layout/CatalogMenu.tsx"
Task: "T020 CartButton em src/components/layout/CartButton.tsx"
Task: "T021 Footer em src/components/layout/Footer.tsx"
Task: "T023 HeroCarousel em src/components/home/HeroCarousel.tsx"
Task: "T024 ProductCard em src/components/home/ProductCard.tsx"
# Em seguida, sequencial: T022 → T025 → T026
```

---

## Implementation Strategy

### MVP First

1. Phase 1 (Setup) → Phase 2 (Foundational);
2. Phase 3 (US1): home navegável — **primeiro incremento demonstrável**;
3. Phases 4–6 (US2→US3→US4): jornada de compra completa — **produto utilizável de verdade** (parar e validar com o quickstart a cada checkpoint);
4. Phase 7 (US5) e Phase 8 (US6): busca e passada mobile/teclado;
5. Phase 9: auditoria final e documentação de manutenção.

### Incremental Delivery

Cada checkpoint é um estado estável e testável: home (US1) → personalização (US2) → carrinho (US3) → pedido via WhatsApp (US4, primeira versão "vendável") → busca (US5) → acessibilidade/responsividade consolidadas (US6) → polish.

---

## Notes

- Tarefas [P] = arquivos diferentes sem dependência pendente;
- Commit após cada tarefa ou grupo lógico;
- Testes de lib devem FALHAR antes da implementação correspondente quando escritos primeiro (TDD recomendado nas T011–T013, T027, T040, T041, T048);
- Nunca adicionar dependência de runtime além das aprovadas no plan.md sem reavaliar o Constitution Check;
- Nenhum dado pessoal em localStorage — verificado por teste (T013) e auditoria (T055/T056).
