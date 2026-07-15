# Contrato — Armazenamento do Carrinho (localStorage)

Persistência do carrinho entre visitas/atualizações (spec FR-024, Constituição §6). **Nenhum dado pessoal entra neste armazenamento.**

## Chave

```text
marte-croche:carrinho
```

Única chave usada pela aplicação no `localStorage`. Nenhuma outra escrita em storage é permitida (em particular, dados do cliente NUNCA).

## Payload (versão 1)

```json
{
  "versao": 1,
  "itens": [
    {
      "id": "b3f0c1e2-...",
      "produtoId": "bolsa-lua",
      "nomeProduto": "Bolsa Lua",
      "categoriaNome": "Bolsas",
      "imagem": "/images/produtos/bolsa-lua/vinho/01-principal.webp",
      "precoUnitarioCentavos": 13500,
      "quantidade": 1,
      "corPrincipal": { "id": "vinho", "nome": "Vinho" },
      "corSecundaria": { "id": "bege", "nome": "Bege" },
      "comAlca": true,
      "corAlca": { "id": "preto", "nome": "Preto" },
      "observacoes": "Presente, embrulhar com carinho"
    }
  ]
}
```

Campos opcionais ausentes são `null` (`corPrincipal`, `corSecundaria`, `corAlca`) ou string vazia (`observacoes`).

## Regras de leitura (carregarCarrinho)

Leitura é **defensiva** — qualquer condição abaixo descarta o conteúdo e retorna carrinho vazio, sem mensagem de erro ao cliente e sem exceção não tratada:

1. Chave ausente → `[]`;
2. JSON inválido (`JSON.parse` lança) → `[]` e remove a chave;
3. `versao !== 1` → `[]` e remove a chave (migrações futuras exigirão nova versão + rotina de conversão);
4. `itens` não é array, ou algum item falha na validação estrutural (campos obrigatórios com tipos corretos, `quantidade` inteiro ≥ 1, `precoUnitarioCentavos` inteiro > 0) → item inválido é descartado; se todos inválidos, `[]`;
5. `localStorage` indisponível (modo privado/bloqueado — acesso lança) → `[]`; a aplicação segue funcionando só em memória.

## Regras de escrita (salvarCarrinho / limparCarrinho)

- Escrita síncrona a cada ação do reducer (`adicionar`, `atualizar`, `alterarQuantidade`, `remover`, `esvaziar`);
- `esvaziar` remove a chave (não grava `{versao:1, itens:[]}`) — storage limpo de fato;
- Falha de escrita (cota, indisponibilidade) é silenciosa: try/catch, aplicação continua em memória.

## Interação entre abas (edge case da spec)

Sem sincronização ativa entre abas na v1 (simplicidade §3.I). Garantia mínima: nenhuma aba pode quebrar por conteúdo gravado por outra — a leitura defensiva cobre isso. Comportamento aceito: cada aba mantém seu estado em memória; a última escrita vence.

## Testes obrigatórios (carrinhoStorage.test.ts)

1. Round-trip: salvar → carregar devolve itens equivalentes;
2. JSON corrompido → `[]` sem lançar;
3. Versão desconhecida (`versao: 99`) → `[]`;
4. Item com estrutura inválida no meio de itens válidos → só os válidos retornam;
5. Storage mock que lança em `getItem`/`setItem` → funções não propagam exceção;
6. `limparCarrinho` remove a chave;
7. Payload não contém nenhum campo de dados pessoais (asserção sobre as chaves serializadas).
