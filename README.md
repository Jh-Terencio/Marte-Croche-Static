# Marte Crochê — Loja Online

Loja estática da Marte Crochê: catálogo de peças artesanais de crochê com
personalização (cores, alça, quantidade), carrinho temporário e envio do
pedido pelo **WhatsApp** — sem backend, sem banco de dados, sem pagamento
no site.

> Regras do projeto: [Constituição](.specify/memory/constitution.md) ·
> Especificação e planos: [specs/001-loja-marte-croche/](specs/001-loja-marte-croche/)

## Como rodar

Pré-requisitos: Node.js 20+ e npm 10+.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm run test:run   # todos os testes (Vitest + Testing Library)
npm run build      # build de produção em dist/
npm run preview    # serve o build localmente
```

Publicação: o conteúdo de `dist/` é um site estático — funciona em qualquer
hospedagem estática (Netlify, Vercel, GitHub Pages, etc.).

## Onde configurar a loja

Tudo que é da loja (não do código) vive em **`src/data/`** — ninguém precisa
mexer em componentes para o dia a dia:

| Arquivo | O que controla |
| --- | --- |
| [`src/data/config.ts`](src/data/config.ts) | **Número do WhatsApp**, preço da alça com bolsa (R$ 15,00), preço da alça avulsa (R$ 20,00), quantidade máxima por item, link do Instagram, frase da marca |
| [`src/data/produtos.ts`](src/data/produtos.ts) | O catálogo completo |
| [`src/data/categorias.ts`](src/data/categorias.ts) | As categorias do menu |
| [`src/data/carrossel.ts`](src/data/carrossel.ts) | Os slides do carrossel da página inicial |

### Adicionar um produto novo

1. Coloque as fotos em `public/images/produtos/<id-do-produto>/`:
   - `padrao/` — fotos exibidas antes de o cliente escolher uma cor;
   - uma pasta por cor (ex.: `vinho/`, `bege/`) — a **primeira foto da lista
     é a principal**. Use WebP otimizado para web.
2. Adicione uma entrada em `src/data/produtos.ts` copiando um produto
   existente como modelo. Campos importantes:
   - `precoBaseCentavos`: preço **em centavos** (R$ 120,00 = `12000`);
   - `cores`: cada cor com `id`, `nome`, `valorVisual` (cor da bolinha) e a
     lista `imagens` com os caminhos completos das fotos daquela cor;
   - `permiteAlca`: `true` para bolsas com opção de alça (+R$ 15,00);
   - `coresAlca`: as cores oferecidas para a alça;
   - `permiteCorRepetida`: se a mesma cor pode ser usada duas vezes;
   - `disponivel`: `false` esconde o botão de encomenda sem tirar o card.

Pronto — nada mais precisa ser alterado.

### Adicionar uma cor a um produto

1. Crie a pasta da cor com as fotos em `public/images/produtos/<produto>/<cor>/`;
2. Adicione a cor na lista `cores` do produto em `src/data/produtos.ts`.

### Adicionar uma categoria

Adicione uma entrada em `src/data/categorias.ts` e use o novo `categoriaId`
nos produtos. O menu, o footer e os filtros se atualizam sozinhos.

### Trocar as fotos do carrossel

Coloque as imagens em `public/images/carrossel/` e ajuste
`src/data/carrossel.ts` (o `alt` é obrigatório; `produtoId` torna o slide
clicável para a página do produto).

## Arquitetura (resumo)

```text
src/
├── data/        # dados e configuração (a única camada editada na manutenção)
├── lib/         # regras de negócio puras e testadas (preço, mensagem, validação…)
├── context/     # carrinho (persistido em localStorage, sem dados pessoais)
│                # e dados do cliente (somente memória — nunca persistidos)
├── components/  # componentes visuais pequenos e reutilizáveis
└── pages/       # as 5 telas: home, produto, carrinho, finalização, revisão
```

Privacidade: os dados pessoais digitados pelo cliente existem apenas em
memória durante a sessão; a única transmissão é a URL do WhatsApp aberta por
clique explícito. O site não usa cookies, analytics nem serviços externos.
