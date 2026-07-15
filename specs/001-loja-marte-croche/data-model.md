# Data Model — Loja Online Marte Crochê (v1)

**Fase 1 do plano** | Data: 2026-07-14

Convenções: preços em **centavos** (inteiros, ver research D10); identificadores em kebab-case; todos os textos exibíveis em pt-BR. Tipos definidos em `src/types/`; instâncias do catálogo em `src/data/`.

## Diagrama de relacionamentos

```text
ConfiguracaoLoja (singleton, src/data/config.ts)
Categoria 1 ─── N Produto 1 ─── N CorDeProduto 1 ─── N caminho de imagem
                    │
                    └──referenciado por── ItemCarrinho N ─── 1 Carrinho (persistido)
                                                                  │
DadosCliente (memória de sessão) ──── + Carrinho ────► Pedido/Mensagem (efêmero)
```

## ConfiguracaoLoja

Singleton em `src/data/config.ts` — único lugar com valores de negócio configuráveis (Constituição §3.V).

| Campo | Tipo | Regra |
| --- | --- | --- |
| `numeroWhatsApp` | `string` | Formato internacional só dígitos (ex.: `"5511999999999"`); usado por `montarUrlWhatsApp` |
| `precoAlcaComBolsaCentavos` | `number` | `1500` (R$ 15,00) — RN-01/RN-03 |
| `precoAlcaAvulsaCentavos` | `number` | `2000` (R$ 20,00) — RN-02/RN-03 (preço base do produto alça avulsa referencia este valor) |
| `quantidadeMaximaPorItem` | `number` | `20` — RN-11 |
| `limiteObservacoes` | `number` | `500` caracteres |
| `linkInstagram` | `string` | URL do perfil (footer) |
| `fraseMarca` | `string` | `"Feito à mão para quem valoriza o que é único."` |
| `imagemFallback` | `string` | `"/images/fallback-produto.webp"` |

## Categoria

`src/data/categorias.ts` — lista extensível.

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | `string` | `"bolsas" \| "alcas" \| "capinhas-airpods"` (iniciais; novas categorias = nova entrada) |
| `nome` | `string` | Exibição: "Bolsas", "Alças", "Capinhas de AirPods" |

## CorDeProduto

Embutida no produto (não há paleta global — cada produto lista suas cores; §7).

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | `string` | Único dentro do produto (ex.: `"vinho"`) |
| `nome` | `string` | Nome exibido (ex.: `"Vinho"`) |
| `valorVisual` | `string` | Cor CSS da amostra (ex.: `"#681119"`) |
| `imagens` | `string[]` | Caminhos completos sob `public/`; **a primeira é a imagem principal**; pode ser vazia (usa imagens padrão do produto) |

**Validações**: `id` único no produto; caminhos nunca derivados de `nome` (FR/spec); toda imagem exibida recebe `alt` gerado: `"{produto.nome} na cor {cor.nome} — foto {n}"`.

## Produto

`src/data/produtos.ts` — adicionar produto = adicionar entrada aqui + imagens (SC-007).

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | `string` | Único no catálogo |
| `nome` | `string` | Obrigatório |
| `categoriaId` | `string` | Deve existir em `categorias.ts` |
| `descricao` | `string` | Obrigatória |
| `precoBaseCentavos` | `number` | Inteiro > 0; para alça avulsa, igual a `config.precoAlcaAvulsaCentavos` |
| `imagensPadrao` | `string[]` | Exibidas antes da escolha de cor (e fallback de cor sem imagens) |
| `cores` | `CorDeProduto[]` | Pode ser vazia (produto sem escolha de cor); só cores listadas são ofertadas (RN-08) |
| `coresAlca` | `CorDeProduto[]` | Opções de cor da alça (sem imagens próprias necessárias) |
| `permiteAlca` | `boolean` | Habilita opção com/sem alça (bolsas) |
| `permiteCorRepetida` | `boolean` | RN-05: mesma cor nas duas posições |
| `prazoConfeccao` | `string` | Texto exibível (ex.: `"7 a 10 dias úteis"`) |
| `disponivel` | `boolean` | `false` → card indica indisponível, encomenda bloqueada (FR-011) |
| `informacoesAdicionais` | `string?` | Opcional |
| `termosDeBusca` | `string[]?` | Termos extras para a busca (D14) |

**Invariantes**:
- Bolsa (`categoriaId: "bolsas"`): `cores.length ≥ 1`, `permiteAlca: true` tipicamente.
- Alça avulsa (`categoriaId: "alcas"`): `permiteAlca: false`, usa `cores` como a cor única da alça.
- Capinha: análoga à bolsa, sem alça, cores conforme cadastro.

## PersonalizacaoItem (estado da página de produto)

Estado local de `ProdutoPage`; validado por `validarPersonalizacao` antes de habilitar "Adicionar ao carrinho".

| Campo | Tipo | Regra de validação |
| --- | --- | --- |
| `corPrincipalId` | `string \| null` | Obrigatória se `produto.cores.length > 0` (RN-04) |
| `corSecundariaId` | `string \| null` | Opcional; ≠ `corPrincipalId` se `!permiteCorRepetida` (RN-05); máx. 2 cores no total (RN-04) |
| `comAlca` | `boolean` | Só relevante se `permiteAlca` |
| `corAlcaId` | `string \| null` | Obrigatória ⇔ `comAlca === true` (RN-06); deve existir em `coresAlca` |
| `quantidade` | `number` | Inteiro, `1 ≤ q ≤ config.quantidadeMaximaPorItem` (RN-11) |
| `observacoes` | `string` | Opcional, ≤ `config.limiteObservacoes` |

**Transições relevantes**: trocar `corPrincipalId` altera galeria (RN-07) e **não** reseta os demais campos (FR-016); desmarcar `comAlca` limpa `corAlcaId` e oculta o seletor.

## ItemCarrinho

Item persistível — **snapshot** do produto no momento da adição (nome/preço/imagem copiados, para o carrinho não quebrar se o catálogo mudar; edge case da spec). Sem dados pessoais.

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | `string` | UUID gerado na adição (`crypto.randomUUID()`) |
| `produtoId` | `string` | Referência ao catálogo (para "editar personalização") |
| `nomeProduto` | `string` | Snapshot |
| `categoriaNome` | `string` | Snapshot (usado na mensagem) |
| `imagem` | `string` | Caminho da imagem principal da cor escolhida (ou padrão) |
| `precoUnitarioCentavos` | `number` | Calculado por `precoUnitario()` na adição/edição |
| `quantidade` | `number` | 1–20 |
| `corPrincipal` | `{ id, nome } \| null` | Snapshot da cor |
| `corSecundaria` | `{ id, nome } \| null` | Opcional |
| `comAlca` | `boolean` | — |
| `corAlca` | `{ id, nome } \| null` | Presente ⇔ `comAlca` |
| `observacoes` | `string` | Pode ser vazia |

**Derivado (não armazenado)**: `subtotalCentavos = precoUnitarioCentavos × quantidade` — sempre calculado por `subtotal()` para nunca divergir.

## Carrinho (estado + persistência)

Estado do `CarrinhoContext`: `{ itens: ItemCarrinho[] }`. Total derivado por `totalPedido(itens)`.

**Ações do reducer**: `adicionarItem`, `atualizarItem` (edição de personalização), `alterarQuantidade`, `removerItem`, `esvaziar`, `restaurar` (carga inicial do storage).

**Formato persistido** (`localStorage`, chave `marte-croche:carrinho`) — contrato completo em [contracts/armazenamento-carrinho.md](contracts/armazenamento-carrinho.md):

```json
{ "versao": 1, "itens": [ /* ItemCarrinho[] */ ] }
```

Leitura defensiva: JSON inválido, `versao` ≠ 1 ou estrutura inesperada ⇒ descarta e inicia vazio (sem erro visível).

## DadosCliente

**Somente memória de sessão** (estado do fluxo de finalização; nunca serializado para storage — Constituição §6, FR-039).

| Campo | Tipo | Validação (pt-BR nas mensagens) |
| --- | --- | --- |
| `nomeCompleto` | `string` | Obrigatório, ≥ 3 caracteres |
| `telefone` | `string` | Obrigatório, 10–11 dígitos (com máscara visual) |
| `cep` | `string` | Obrigatório, formato `00000-000` (só formato, sem consulta — FR-028) |
| `endereco` | `string` | Obrigatório |
| `numero` | `string` | Obrigatório (string: aceita "s/n", "12-A") |
| `complemento` | `string` | Opcional |
| `bairro` | `string` | Obrigatório |
| `cidade` | `string` | Obrigatório |
| `estado` | `string` | Obrigatório, uma das 27 UFs |
| `referencia` | `string` | Opcional |
| `observacoesGerais` | `string` | Opcional, ≤ 500 caracteres |

## Pedido (mensagem) — efêmero

Nunca armazenado; construído por `montarMensagem(itens, dadosCliente, config)` na prévia e no envio. Formato do texto: [contracts/mensagem-whatsapp.md](contracts/mensagem-whatsapp.md).

## Slide do carrossel

`src/data/carrossel.ts`:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `imagem` | `string` | Caminho sob `public/images/carrossel/` |
| `alt` | `string` | Obrigatório (acessibilidade) |
| `produtoId` | `string?` | Opcional: slide clicável leva ao produto |
