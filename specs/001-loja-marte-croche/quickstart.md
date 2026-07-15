# Quickstart — Loja Online Marte Crochê (v1)

Guia de execução e verificação ponta a ponta. Referências: [spec.md](spec.md) (cenários), [data-model.md](data-model.md) (entidades), [contracts/](contracts/) (formatos exatos).

## Pré-requisitos

- Node.js 20+ e npm 10+;
- Navegador moderno (verificação mobile via DevTools ou aparelho real).

## Setup

```powershell
# na raiz do repositório (o app vive na raiz, ver plan.md → Project Structure)
npm install
```

O projeto é criado com `npm create vite@latest . -- --template react-ts` na primeira tarefa de implementação; depois disso, apenas `npm install`.

## Comandos

```powershell
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm test           # Vitest em modo watch
npm run test:run   # Vitest execução única (CI/verificação)
npm run build      # build estático de produção em dist/
npm run preview    # serve o build de produção localmente
```

## Verificação automatizada

`npm run test:run` deve passar 100%, cobrindo no mínimo os contratos:

| Suíte | Contrato verificado |
| --- | --- |
| `src/lib/preco.test.ts` | RN-01..03 — preços (bolsa, +R$ 15,00 alça, alça avulsa R$ 20,00, totais) |
| `src/lib/formatacao.test.ts` | Reais pt-BR, máscaras de telefone/CEP |
| `src/lib/validacao.test.ts` | Personalização (cores, alça, quantidade) e dados do cliente |
| `src/lib/mensagem.test.ts` | [mensagem-whatsapp.md](contracts/mensagem-whatsapp.md) §Testes (7 casos) |
| `src/lib/busca.test.ts` | Busca com normalização de acentos |
| `src/lib/carrinhoStorage.test.ts` | [armazenamento-carrinho.md](contracts/armazenamento-carrinho.md) §Testes (7 casos) |
| `src/**/*.test.tsx` | Fluxos: personalização→carrinho, validação do formulário, revisão |

## Verificação manual ponta a ponta (roteiro mínimo)

Com `npm run dev` aberto:

1. **Home** — header (logo, Início, Catálogo, Contato, busca, carrinho com contador), carrossel com setas/indicadores, cards de produtos, footer com a frase "Feito à mão para quem valoriza o que é único." *(US1)*
2. **Categorias** — menu Catálogo (hover no desktop, toque no mobile) → escolher "Bolsas" filtra o grid. *(US1)*
3. **Busca** — buscar "bolsa" mostra resultados; buscar "xyzabc" mostra mensagem amigável. *(US5)*
4. **Produto** — abrir uma bolsa: imagem padrão exibida; "Adicionar ao carrinho" desabilitado. Selecionar cor principal → galeria troca na hora e escolha fica destacada; escolher segunda cor; tentar terceira cor → impedido; marcar "Com alça" → seletor de cor da alça aparece e preço sobe R$ 15,00; quantidade 2 → resumo dobra. *(US2)*
5. **Carrinho** — adicionar bolsa + uma alça avulsa (R$ 20,00): contador do header = 2; alterar quantidade, editar item (personalização volta preenchida), remover item; atualizar a página (F5) → carrinho permanece; conferir em DevTools → Application → Local Storage: só a chave `marte-croche:carrinho`, sem dados pessoais. *(US3)*
6. **Finalização** — avançar com campos vazios → erros por campo em pt-BR, sem apagar o que foi digitado; preencher tudo (CEP `01234-567`, telefone com DDD); voltar ao carrinho e retornar → dados preservados. *(US4)*
7. **Revisão** — conferir itens, totais, dados e a prévia da mensagem idêntica ao contrato; clicar "Enviar pedido pelo WhatsApp" → `wa.me` abre com a mensagem íntegra (acentos e quebras corretos); voltar ao site → carrinho intacto; "Novo pedido" → pede confirmação → esvazia. *(US4, RN-10)*
8. **Mobile** — DevTools em 320 px: percorrer 1–7 sem rolagem horizontal, com toque em tudo (sem hover) e sem saltos de layout na troca de imagens. *(US6)*
9. **Teclado** — jornada completa só com Tab/Enter/setas, foco visível em todos os passos. *(US6)*

## Resultado esperado

- `npm run test:run` verde; `npm run build` sem erros;
- Roteiro manual 1–9 completo sem falhas — cobre os 28 cenários obrigatórios + 7 de imagem por cor da spec;
- Nenhuma requisição de rede a domínios externos (verificar na aba Network) além da navegação para `wa.me` iniciada por clique.
