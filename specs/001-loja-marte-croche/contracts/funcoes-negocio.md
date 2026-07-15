# Contrato — Funções de Negócio (src/lib/)

Todas são **funções puras** (sem I/O, sem estado, sem acesso a DOM), exigência da Constituição §12. Tipos referem-se ao [data-model.md](../data-model.md). Cada função tem arquivo de teste próprio (`*.test.ts`).

## preco.ts

```ts
/** Preço unitário em centavos: base + alça quando aplicável (RN-01). */
precoUnitario(produto: Produto, comAlca: boolean, config: ConfiguracaoLoja): number
// comAlca=true só tem efeito se produto.permiteAlca; caso contrário ignora o acréscimo.

/** Subtotal do item em centavos (RN-01). */
subtotal(precoUnitarioCentavos: number, quantidade: number): number

/** Total do pedido em centavos: soma dos subtotais (RN-01). */
totalPedido(itens: ItemCarrinho[]): number
```

**Casos de teste mínimos**: bolsa sem alça = base; bolsa com alça = base + 1500; alça avulsa = 2000; quantidade multiplica; carrinho vazio → total 0; carrinho misto (bolsa com alça ×2 + alça avulsa ×1) soma correta.

## formatacao.ts

```ts
/** Centavos → "R$ 1.234,56" (pt-BR/BRL). */
formatarReais(centavos: number): string

/** Dígitos → máscara "(11) 91234-5678" ou "(11) 1234-5678"; ignora não-dígitos. */
mascaraTelefone(valor: string): string

/** Dígitos → máscara "01234-567"; ignora não-dígitos; máx. 8 dígitos. */
mascaraCep(valor: string): string
```

**Casos de teste mínimos**: `1500 → "R$ 15,00"`; `123456 → "R$ 1.234,56"`; `0 → "R$ 0,00"`; máscaras com entrada parcial, completa e com lixo (letras/símbolos).

## validacao.ts

```ts
type ResultadoValidacao = { valido: boolean; erros: Record<string, string> }
// erros: chave = nome do campo, valor = mensagem em pt-BR pronta para exibição.

/** Valida personalização antes de habilitar "Adicionar ao carrinho" (RN-04..06, RN-11). */
validarPersonalizacao(p: PersonalizacaoItem, produto: Produto, config: ConfiguracaoLoja): ResultadoValidacao

/** Valida o formulário de finalização (Constituição §8). */
validarDadosCliente(d: DadosCliente): ResultadoValidacao
```

**Regras cobertas**: cor principal obrigatória; cor repetida conforme `permiteCorRepetida`; cor da alça obrigatória ⇔ `comAlca`; quantidade 1–20 inteira; nome ≥ 3; telefone 10–11 dígitos; CEP `\d{5}-?\d{3}`; UF válida; obrigatórios não vazios; observações ≤ 500.

**Casos de teste mínimos**: cada regra falhando isoladamente (mensagem correta por campo) + um caso totalmente válido.

## mensagem.ts

```ts
/** Monta o texto completo da mensagem (NÃO codificado). Contrato: mensagem-whatsapp.md */
montarMensagem(itens: ItemCarrinho[], dados: DadosCliente, config: ConfiguracaoLoja): string

/** URL final: https://wa.me/<numero>?text=<mensagem codificada>. */
montarUrlWhatsApp(mensagem: string, config: ConfiguracaoLoja): string
```

**Casos de teste mínimos**: ver [mensagem-whatsapp.md](mensagem-whatsapp.md) §Testes.

## busca.ts

```ts
/** Filtra por nome, categoria, descrição e termosDeBusca; ignora acentos e caixa (D14). */
filtrarProdutos(termo: string, produtos: Produto[], categorias: Categoria[]): Produto[]
```

**Casos de teste mínimos**: casa sem acento ("bolca" não; "bolsa" acha "Bolsa Lua"); "alça" ≡ "alca"; termo vazio → todos; sem correspondência → `[]`.

## carrinhoStorage.ts

Única exceção parcial de pureza: encapsula `localStorage`, mas com a serialização/validação separadas em funções puras testáveis. Contrato: [armazenamento-carrinho.md](armazenamento-carrinho.md).

```ts
carregarCarrinho(storage: Storage): ItemCarrinho[]   // defensivo: inválido → []
salvarCarrinho(storage: Storage, itens: ItemCarrinho[]): void
limparCarrinho(storage: Storage): void
// `storage` injetado para permitir teste com mock e degradar sem quebrar quando indisponível.
```
