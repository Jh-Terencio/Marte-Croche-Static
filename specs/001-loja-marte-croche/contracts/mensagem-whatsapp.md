# Contrato — Mensagem do WhatsApp

Formato exato produzido por `montarMensagem` (Constituição §9, spec FR-032/033, RN-09). A prévia exibida na revisão é **exatamente** esta string; `montarUrlWhatsApp` aplica `encodeURIComponent` sobre ela.

## Template

Blocos separados por UMA linha em branco. Linhas de campos opcionais vazios são **omitidas por completo** (sem rótulo vazio, sem linha em branco residual).

```text
*PEDIDO — Marte Crochê*

Olá! Gostaria de fazer uma encomenda.

*ITENS DO PEDIDO*

{para cada item, numerado a partir de 1, na ordem do carrinho:}
{n}. *{nomeProduto}*
Categoria: {categoriaNome}
{se corSecundaria: }Cor principal: {corPrincipal.nome}
{se corSecundaria: }Segunda cor: {corSecundaria.nome}
{se NÃO corSecundaria e corPrincipal: }Cor: {corPrincipal.nome}
{se produto permite alça: }Alça: {comAlca ? "Com alça" : "Sem alça"}
{se comAlca: }Cor da alça: {corAlca.nome}
Quantidade: {quantidade}
Valor unitário: {formatarReais(precoUnitarioCentavos)}
Subtotal: {formatarReais(subtotal)}
{se observacoes não vazia: }Observações: {observacoes}

*TOTAL DO PEDIDO: {formatarReais(total)}*

*DADOS DO CLIENTE*

Nome: {nomeCompleto}
Telefone: {telefone com máscara}

*ENDEREÇO*

Endereço: {endereco}, {numero}
{se complemento: }Complemento: {complemento}
Bairro: {bairro}
Cidade/Estado: {cidade} - {estado}
CEP: {cep com máscara}
{se referencia: }Referência: {referencia}

{se observacoesGerais: }Observações gerais: {observacoesGerais}
```

Regras de renderização das cores (compatível com o exemplo da spec):
- Item com duas cores → linhas `Cor principal:` e `Segunda cor:`;
- Item com uma cor só → linha única `Cor:`;
- Item sem cores (produto sem opção de cor) → nenhuma linha de cor.

## Exemplo completo (todos os campos)

```text
*PEDIDO — Marte Crochê*

Olá! Gostaria de fazer uma encomenda.

*ITENS DO PEDIDO*

1. *Bolsa Lua*
Categoria: Bolsas
Cor principal: Vinho
Segunda cor: Bege
Alça: Com alça
Cor da alça: Preto
Quantidade: 1
Valor unitário: R$ 135,00
Subtotal: R$ 135,00
Observações: Presente, embrulhar com carinho

2. *Alça de Crochê*
Categoria: Alças
Cor: Vinho
Quantidade: 2
Valor unitário: R$ 20,00
Subtotal: R$ 40,00

*TOTAL DO PEDIDO: R$ 175,00*

*DADOS DO CLIENTE*

Nome: Maria da Silva
Telefone: (11) 91234-5678

*ENDEREÇO*

Endereço: Rua das Flores, 123
Complemento: Apto 45
Bairro: Jardim Primavera
Cidade/Estado: São Paulo - SP
CEP: 01234-567
Referência: Portão azul, ao lado da padaria

Observações gerais: Entregar após as 18h
```

## Exemplo mínimo (opcionais vazios omitidos)

Bolsa de uma cor, sem alça, sem observações; cliente sem complemento/referência/observações gerais:

```text
*PEDIDO — Marte Crochê*

Olá! Gostaria de fazer uma encomenda.

*ITENS DO PEDIDO*

1. *Bolsa Lua*
Categoria: Bolsas
Cor: Vinho
Alça: Sem alça
Quantidade: 1
Valor unitário: R$ 120,00
Subtotal: R$ 120,00

*TOTAL DO PEDIDO: R$ 120,00*

*DADOS DO CLIENTE*

Nome: Maria da Silva
Telefone: (11) 91234-5678

*ENDEREÇO*

Endereço: Rua das Flores, 123
Bairro: Jardim Primavera
Cidade/Estado: São Paulo - SP
CEP: 01234-567
```

Repare: sem linha `Segunda cor`, `Cor da alça`, `Observações`, `Complemento`, `Referência` nem bloco `Observações gerais` — e sem linhas em branco duplicadas onde eles estariam.

## URL

```text
https://wa.me/{config.numeroWhatsApp}?text={encodeURIComponent(mensagem)}
```

- Quebras de linha viram `%0A`; asteriscos são preservados (formatação de negrito do WhatsApp); acentos e emojis codificados em UTF-8 percent-encoding.
- Compatível com WhatsApp Web (desktop) e aplicativo (mobile).

## Testes obrigatórios (mensagem.test.ts)

1. Mensagem completa (exemplo 1) — igualdade exata da string;
2. Mensagem mínima (exemplo 2) — igualdade exata, provando omissão dos opcionais;
3. Múltiplos itens numerados na ordem do carrinho;
4. Valores formatados em reais (inclusive milhares: `R$ 1.234,56`);
5. Item de produto sem alça não gera linha `Alça:`;
6. URL: contém `wa.me/` + número do config; `decodeURIComponent(url.text) === mensagem`; quebras de linha preservadas após decode;
7. Acentos/caracteres especiais (ç, ã, é, –, emoji em observações) sobrevivem ao ciclo encode/decode.
