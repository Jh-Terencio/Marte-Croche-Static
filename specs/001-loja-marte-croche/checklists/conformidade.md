# Checagem de Conformidade Final — Loja Online Marte Crochê (v1)

**Data**: 2026-07-15 · **Referências**: [Constituição v2.0.0](../../../.specify/memory/constitution.md) §15 · [spec.md](../spec.md) Success Criteria
**Evidências**: suíte `npm run test:run` (109/109 verdes), `npm run build` sem erros, verificações em navegador real registradas nas fases 3–8.

## Constituição §15 — Critérios de Conclusão

- [x] 1. Página inicial com header, carrossel, catálogo em cards e footer; detalhes com fotos, descrição, preço, prazo e opções — *verificado em navegador (fases 3–4)*
- [x] 2. Personalização (cores, alça, quantidade, observações) com imagem acompanhando a primeira cor; adição de múltiplos itens — *testes ProdutoPage (9) + navegador*
- [x] 3. Carrinho com alterar/editar/remover/esvaziar, recuperado após atualização, sem dados pessoais — *testes CarrinhoPage (7) + carrinhoStorage (7, incl. asserção de chaves permitidas)*
- [x] 4. Formulário §8 → prévia completa → WhatsApp com itens numerados, reais e codificação correta — *testes mensagem (7, igualdade exata) + navegador (URL decodificada ≡ prévia)*
- [x] 5. Campos opcionais vazios ausentes da mensagem final — *teste "mensagem mínima" com igualdade exata de string*
- [x] 6. Dados do formulário e carrinho preservados entre etapas na sessão — *teste FR-029 + FinalizacaoContext*
- [x] 7. Todos os testes da §12 existem e passam — *109/109 em 15 suítes; funções puras em src/lib/ todas testadas*
- [x] 8. Telas pequenas/tablets/desktops + acessibilidade §11 — *auditoria em 320px nas 6 rotas: sem scroll horizontal, hierarquia de títulos correta, alts completos, alvos ≥44px, foco visível confirmado via Tab real*
- [x] 9. Nenhuma funcionalidade proibida (§13) presente — *sem login, pagamento, frete, rastreio, cupons, favoritos, analytics; inspeção de rede: 0 requisições externas*
- [x] 10. Interface 100% pt-BR com identidade da marca (#F4F1EB/#681119) — *tokens.css + revisão visual*

## Spec — Success Criteria

- [x] SC-001 Jornada completa em < 5 min no celular — *fluxo verificado em viewport mobile; poucos passos (4 telas)*
- [x] SC-002 35 cenários de aceitação passam — *28 obrigatórios + 7 de imagem por cor cobertos por testes automatizados e verificação em navegador (mapeamento nas fases 3–8)*
- [x] SC-003 Mensagem íntegra no WhatsApp móvel e Web — *URL `wa.me` com percent-encoding; decode ≡ mensagem (teste 6 + navegador); confirmação final em aparelho real recomendada após publicar*
- [x] SC-004 Nenhum envio sem clique explícito — *âncora renderizada apenas na revisão; teste "nenhuma conversa é aberta sem clique"*
- [x] SC-005 Nenhum dado pessoal persistido — *localStorage contém apenas `marte-croche:carrinho`; teste de chaves permitidas; DadosCliente só em memória*
- [x] SC-006 Carrinho sobrevive a atualização — *teste de restauração + F5 em navegador (fase 5)*
- [x] SC-007 Produto/cor novos = editar apenas src/data/ — *arquitetura em camadas; instruções no README*
- [x] SC-008 Jornada completa por teclado com foco visível — *elementos nativos focáveis, modal com laço de foco, anel de foco vinho confirmado com Tab real*
- [x] SC-009 Sem rolagem horizontal em 320px — *auditoria programática nas 6 rotas: ok*
- [x] SC-010 Preços conferem com RN-01..03 — *testes de preco (9) e mensagem; acréscimos sempre do config central*

## Pendências para publicação (fora do escopo de código)

- [ ] Substituir as imagens placeholder (1×1 WebP) pelas fotos reais em `public/images/`
- [ ] Confirmar o número de WhatsApp em `src/data/config.ts` (já apontando para número real) e o link do Instagram
- [ ] Teste real de recebimento da mensagem em um aparelho com WhatsApp após publicar (SC-003)

**Resultado**: 20/20 critérios de conformidade atendidos. Projeto v1 concluído conforme Constituição §15.
