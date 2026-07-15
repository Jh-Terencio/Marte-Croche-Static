# Feature Specification: Loja Online Marte Crochê (v1)

**Feature Branch**: `001-loja-marte-croche`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Especificação funcional completa para a primeira versão da aplicação frontend da Marte Crochê — loja online simples, exclusivamente frontend, em React, para apresentação e encomenda de produtos artesanais (bolsas, alças avulsas e capinhas de AirPods), com carrinho temporário e finalização do pedido via WhatsApp."

**Governança**: A [Constituição do Projeto v2.0.0](../../.specify/memory/constitution.md) é regra obrigatória. Em caso de conflito entre esta especificação e a constituição, a constituição prevalece.

## Objetivo

Permitir que clientes da Marte Crochê conheçam os produtos artesanais, personalizem itens (cores, alça, quantidade), montem um pedido com um ou mais produtos e o enviem à empresa pelo WhatsApp, com revisão completa antes do envio — tudo em uma aplicação exclusivamente frontend, mobile-first, acolhedora e fácil de manter.

## Escopo

**Dentro do escopo (v1):**

- Página inicial com header, carrossel de destaque, catálogo de produtos em cards e footer;
- Navegação por categorias (Bolsas, Alças, Capinhas de AirPods) e busca de produtos;
- Página ou modal de detalhes do produto com galeria de imagens que acompanha a primeira cor selecionada;
- Personalização de bolsas (cor principal obrigatória, segunda cor opcional, alça opcional com cor própria, quantidade, observações);
- Carrinho temporário multi-itens com persistência local (sem dados pessoais);
- Formulário de dados do cliente e entrega;
- Prévia completa do pedido e da mensagem;
- Abertura do WhatsApp com a mensagem preenchida e corretamente codificada.

**Fora do escopo:** ver seção [Fora do Escopo](#fora-do-escopo).

## Personas

- **Cliente compradora (persona principal)**: pessoa que conheceu a Marte Crochê pelo Instagram ou indicação, navega principalmente pelo celular, tem pouca experiência com compras online e já usa WhatsApp no dia a dia. Precisa de um caminho simples e confiável do produto ao pedido.
- **Artesã/dona da loja (persona secundária, indireta)**: recebe os pedidos pelo WhatsApp e mantém o catálogo. Precisa que a mensagem chegue completa e organizada, e que adicionar produtos/cores seja trivial.

## Jornada Principal

1. Cliente abre o site no celular → vê o carrossel e o catálogo;
2. Filtra por categoria ou busca um produto → abre os detalhes;
3. Escolhe a cor principal (a imagem muda para a cor escolhida), opcionalmente uma segunda cor, decide se quer alça (e a cor da alça), define quantidade e observações → vê o preço atualizar em tempo real → adiciona ao carrinho;
4. Repete para outros produtos, se desejar;
5. Abre o carrinho → revisa itens, quantidades e total → avança para a finalização;
6. Preenche nome, telefone e endereço → revisa a prévia do pedido com a mensagem exata;
7. Clica em "Enviar pedido pelo WhatsApp" → o WhatsApp abre com a mensagem preenchida → cliente confirma o envio manualmente dentro do WhatsApp;
8. De volta ao site, pode iniciar um "Novo pedido" (esvaziando o carrinho após confirmação) ou manter o carrinho.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar o catálogo na página inicial (Priority: P1)

Como cliente, quero ver os produtos da Marte Crochê na página inicial, organizados em cards com foto, nome, categoria e preço, e navegar por categorias, para encontrar rapidamente o que me interessa.

**Why this priority**: sem catálogo visível não existe loja; é a porta de entrada de toda jornada.

**Independent Test**: abrir a página inicial e verificar header, carrossel, cards de produtos e footer, e que cada categoria filtra/direciona corretamente — sem depender de carrinho ou checkout.

**Acceptance Scenarios**:

1. **Given** a página inicial carregada, **When** o cliente a visualiza, **Then** ela exibe, nesta ordem: header, carrossel de destaque, seção de produtos em cards e footer. *(Cenário obrigatório 1)*
2. **Given** a página inicial, **When** o cliente observa um card de produto, **Then** o card mostra (quando disponível): foto principal, nome, categoria, preço inicial, prazo de confecção, resumo das opções e um botão "Ver detalhes" ou "Escolher produto".
3. **Given** o desktop, **When** o cliente passa o mouse sobre "Catálogo" no header, **Then** aparece um menu com as categorias Bolsas, Alças e Capinhas de AirPods. *(Cenário obrigatório 2)*
4. **Given** um celular, **When** o cliente toca no menu, **Then** as categorias ficam acessíveis por toque, sem depender de hover, podendo usar menu recolhível.
5. **Given** o menu de categorias aberto, **When** o cliente escolhe uma categoria, **Then** a aplicação filtra ou direciona para os produtos daquela categoria. *(Cenário obrigatório 2)*
6. **Given** qualquer página, **When** o cliente clica em "Início", **Then** é levado ao começo da página inicial; **When** clica em "Contato", **Then** é levado às informações de contato da loja.
7. **Given** o carrossel, **When** as imagens são exibidas, **Then** há navegação manual, indicadores da imagem atual, avanço automático opcional que pode ser pausado/controlado pelo usuário, textos alternativos e nenhuma mudança brusca de layout durante o carregamento.
8. **Given** o footer, **When** o cliente o visualiza, **Then** ele contém: logo ou nome da Marte Crochê, a frase "Feito à mão para quem valoriza o que é único.", link para contato, link para WhatsApp, link para Instagram, links para as categorias, aviso de direitos autorais e informações básicas sobre encomendas/prazo de confecção.

---

### User Story 2 - Personalizar um produto com imagem por cor (Priority: P1)

Como cliente, quero abrir os detalhes de uma bolsa, escolher cores (vendo a bolsa na cor escolhida), decidir sobre a alça e a quantidade, e ver o preço atualizar imediatamente, para montar exatamente o item que desejo.

**Why this priority**: a personalização é o coração da proposta artesanal; sem ela não há item válido para o carrinho.

**Independent Test**: abrir os detalhes de uma bolsa e exercitar todas as opções de personalização verificando imagem, preço e validações — sem precisar concluir pedido.

**Acceptance Scenarios**:

1. **Given** o catálogo, **When** o cliente abre uma bolsa, **Then** vê: nome, galeria de imagens, descrição, preço, prazo estimado de confecção, cores disponíveis, opção com/sem alça, cor da alça (quando aplicável), quantidade, observações, resumo do preço e botão "Adicionar ao carrinho". *(Cenário obrigatório 4)*
2. **Given** os detalhes de uma bolsa recém-abertos, **When** nenhuma cor foi selecionada, **Then** a imagem padrão do produto é exibida e o botão "Adicionar ao carrinho" permanece indisponível, com indicação clara de que a cor principal é obrigatória. *(Cenários obrigatório 5 e adicional 1)*
3. **Given** os detalhes de uma bolsa, **When** o cliente seleciona a cor principal, **Then** a imagem principal e a galeria mudam imediatamente para as imagens daquela cor, sem recarregar a página, e a opção selecionada permanece visualmente destacada (não apenas por cor). *(Cenários adicionais 2 e 3)*
4. **Given** uma cor principal já selecionada, **When** o cliente troca para outra cor, **Then** todas as imagens anteriores são substituídas pelas da nova cor, a primeira imagem da lista vira a imagem principal, e quantidade, alça, segunda cor e observações já preenchidas são mantidas. *(Cenários adicionais 4 e 5)*
5. **Given** uma cor com várias fotos, **When** ela é selecionada, **Then** todas as fotos daquela cor aparecem na galeria, cada uma com texto alternativo adequado. *(Cenário adicional 3)*
6. **Given** uma imagem de cor que falha ao carregar, **When** a galeria é exibida, **Then** um estado visual de carregamento aparece enquanto carrega e, em caso de falha, a imagem padrão do produto ou uma imagem de fallback é usada. *(Cenário adicional 6)*
7. **Given** os detalhes de uma bolsa, **When** o cliente seleciona uma segunda cor opcional, **Then** a seleção é registrada, o rótulo deixa claro que é opcional, e as imagens não precisam mudar por causa da segunda cor. *(Cenário obrigatório 6)*
8. **Given** duas cores já selecionadas, **When** o cliente tenta selecionar uma terceira cor, **Then** a aplicação impede a seleção e comunica que a bolsa aceita no máximo duas cores. *(Cenário obrigatório 7)*
9. **Given** um produto configurado para não permitir cor repetida, **When** o cliente tenta usar a mesma cor nas duas posições, **Then** a aplicação impede e explica; **Given** um produto configurado para permitir, **When** o cliente repete a cor, **Then** a seleção é aceita (regra configurável por produto).
10. **Given** os detalhes de uma bolsa, **When** a opção "com alça" não está selecionada, **Then** o seletor de cor da alça não é exibido; **When** o cliente marca "com alça", **Then** o seletor de cor da alça aparece e passa a ser obrigatório. *(Cenários obrigatórios 8, 9 e 12)*
11. **Given** uma bolsa com preço base configurado, **When** o cliente marca "com alça", **Then** o resumo de preço acresce R$ 15,00 imediatamente; **When** desmarca, **Then** o acréscimo é removido imediatamente. *(Cenário obrigatório 10)*
12. **Given** os detalhes do produto, **When** o cliente altera a quantidade, **Then** o resumo de preço (valor unitário × quantidade) atualiza imediatamente. *(Cenário obrigatório 17, parte de detalhes)*
13. **Given** uma alça avulsa no catálogo, **When** o cliente a visualiza, **Then** o preço exibido é R$ 20,00. *(Cenário obrigatório 11)*
14. **Given** uma cor não cadastrada como disponível para o produto, **When** o cliente vê as opções, **Then** essa cor não é oferecida para seleção.
15. **Given** opções obrigatórias incompletas, **When** o cliente tenta adicionar ao carrinho, **Then** o botão permanece indisponível e mensagens de validação claras em português brasileiro indicam exatamente o que falta.

---

### User Story 3 - Montar e gerenciar o carrinho (Priority: P1)

Como cliente, quero adicionar um ou mais produtos personalizados a um carrinho temporário, revisar, editar, remover e ver os totais, e não perder o carrinho se a página atualizar, para montar meu pedido com calma.

**Why this priority**: o carrinho conecta a personalização à finalização; sem ele não há pedido multi-itens.

**Independent Test**: adicionar itens ao carrinho, manipulá-los (quantidade, edição, remoção, esvaziar) e atualizar a página, verificando estado e totais — sem precisar preencher o formulário.

**Acceptance Scenarios**:

1. **Given** um produto com todas as opções obrigatórias preenchidas, **When** o cliente clica em "Adicionar ao carrinho", **Then** o item entra no carrinho com todas as personalizações e o ícone do carrinho no header passa a mostrar a quantidade de itens. *(Cenário obrigatório 13)*
2. **Given** um item já no carrinho, **When** o cliente adiciona outros produtos (ex.: uma bolsa e uma alça avulsa), **Then** todos aparecem como itens separados, cada um com suas personalizações, preço unitário e subtotal. *(Cenário obrigatório 14)*
3. **Given** o carrinho aberto, **When** o cliente o visualiza, **Then** vê para cada item: imagem, nome, categoria, personalizações (cores, alça e cor da alça quando houver, observações), quantidade, preço unitário e subtotal; e vê o valor total do pedido.
4. **Given** o carrinho com itens, **When** o cliente altera a quantidade de um item, **Then** o subtotal do item e o total do pedido atualizam imediatamente. *(Cenário obrigatório 17)*
5. **Given** o carrinho com itens, **When** o cliente escolhe editar um item, **Then** retorna à personalização daquele item com as escolhas atuais carregadas e, ao confirmar, o item é atualizado no carrinho (incluindo preço). *(Cenário obrigatório 15)*
6. **Given** o carrinho com itens, **When** o cliente remove um item, **Then** o item some e os totais e o contador do header atualizam. *(Cenário obrigatório 16)*
7. **Given** o carrinho com itens, **When** o cliente escolhe esvaziar o carrinho, **Then** a aplicação pede confirmação antes de esvaziar.
8. **Given** o carrinho com itens, **When** o cliente atualiza a página acidentalmente, **Then** o carrinho é recuperado do armazenamento local do navegador, sem nenhum dado pessoal persistido. *(Cenário obrigatório 18)*
9. **Given** o carrinho vazio, **When** o cliente o abre, **Then** vê uma mensagem amigável em português e um caminho claro para continuar comprando; o avanço para a finalização fica indisponível.
10. **Given** o carrinho com itens, **When** o cliente escolhe "Continuar comprando", **Then** retorna ao catálogo sem perder o carrinho.

---

### User Story 4 - Finalizar o pedido e enviar pelo WhatsApp (Priority: P1)

Como cliente, quero preencher meus dados de entrega, revisar o pedido completo com a mensagem exata que será enviada e abrir o WhatsApp com tudo preenchido, para concluir a encomenda com segurança.

**Why this priority**: é o desfecho de negócio de toda a jornada; sem ele nenhum pedido chega à empresa.

**Independent Test**: com um carrinho previamente montado, preencher o formulário, verificar validações, conferir a prévia e verificar a URL do WhatsApp gerada.

**Acceptance Scenarios**:

1. **Given** o carrinho com itens, **When** o cliente avança para a finalização, **Then** vê um formulário com: Nome completo, Telefone, CEP, Endereço, Número, Complemento (opcional), Bairro, Cidade, Estado, Referência (opcional) e Observações gerais (opcionais), com rótulos visíveis, indicação de obrigatórios e máscaras quando apropriado. *(Cenário obrigatório 19)*
2. **Given** o formulário com campos obrigatórios vazios ou inválidos, **When** o cliente tenta avançar, **Then** erros claros em português aparecem junto a cada campo problemático, os dados válidos já digitados não são apagados e o avanço fica bloqueado. *(Cenário obrigatório 20)*
3. **Given** um CEP digitado, **When** validado, **Then** apenas o formato brasileiro é conferido (sem consulta externa de endereço).
4. **Given** o formulário válido, **When** o cliente avança, **Then** vê a etapa de revisão com: todos os itens, personalizações, quantidades, subtotais, valor total, dados do cliente, endereço e a prévia exata da mensagem do WhatsApp. *(Cenário obrigatório 21)*
5. **Given** a etapa de revisão, **When** o cliente escolhe editar o carrinho ou editar seus dados, **Then** retorna à etapa correspondente com todos os dados da sessão preservados e consegue voltar à revisão. *(Cenário obrigatório 22)*
6. **Given** a etapa de revisão, **When** o cliente ainda não confirmou, **Then** nenhuma conversa de WhatsApp é aberta automaticamente, em nenhuma hipótese.
7. **Given** a revisão confirmada, **When** o cliente clica em "Enviar pedido pelo WhatsApp", **Then** a aplicação abre a URL do WhatsApp (compatível com WhatsApp Web e aplicativo móvel) com a mensagem completa preenchida e corretamente codificada, e o envio é confirmado manualmente pelo cliente dentro do WhatsApp. *(Cenário obrigatório 25)*
8. **Given** a mensagem gerada, **When** inspecionada, **Then** contém todos os itens do carrinho numerados, com personalizações, valores unitários, subtotais e total formatados em reais, seguida dos dados do cliente e endereço, conforme o modelo da constituição (Seção 9). *(Cenário obrigatório 23)*
9. **Given** campos opcionais vazios (segunda cor, cor da alça quando sem alça, complemento, referência, observações), **When** a mensagem é gerada, **Then** as linhas correspondentes são omitidas por completo — sem rótulos vazios, "undefined" ou linhas em branco duplicadas. *(Cenário obrigatório 24)*
10. **Given** o cliente abriu o WhatsApp, **When** retorna ao site, **Then** o carrinho continua intacto e uma opção "Novo pedido" é oferecida; **When** o cliente escolhe "Novo pedido" e confirma, **Then** o carrinho é esvaziado. *(Cenário obrigatório 28 — ver RN-10)*

---

### User Story 5 - Buscar produtos (Priority: P2)

Como cliente, quero buscar produtos por nome, categoria, descrição ou termos relevantes, para chegar rápido ao que procuro.

**Why this priority**: acelera a jornada, mas o catálogo pequeno da v1 permite navegar sem busca; valor incremental.

**Independent Test**: abrir a busca, digitar termos e verificar resultados e o estado sem resultados.

**Acceptance Scenarios**:

1. **Given** o header, **When** o cliente aciona o botão de busca, **Then** um campo de busca abre (campo expansível, modal ou área dedicada). *(Cenário obrigatório 3)*
2. **Given** a busca aberta, **When** o cliente digita um termo presente no nome, categoria, descrição ou termos relevantes de um produto, **Then** os resultados correspondentes aparecem de forma simples e rápida.
3. **Given** um termo sem correspondência, **When** a busca executa, **Then** uma mensagem amigável em português informa que nada foi encontrado e sugere continuar navegando.

---

### User Story 6 - Usar a loja no celular e por teclado (Priority: P1)

Como cliente no celular (ou navegando por teclado), quero completar toda a jornada sem obstáculos, para comprar de onde estiver e do jeito que consigo usar.

**Why this priority**: a maioria dos clientes usa celular; acessibilidade é obrigação constitucional, não extra.

**Independent Test**: executar a jornada completa em viewport de 320–414 px e, separadamente, apenas com teclado.

**Acceptance Scenarios**:

1. **Given** uma tela pequena (a partir de 320 px), **When** o cliente percorre catálogo, detalhes, carrinho, formulário e revisão, **Then** tudo funciona sem rolagem horizontal involuntária, imagens não ultrapassam a largura da tela, botões têm área de toque adequada e nada depende de hover. *(Cenários obrigatório 26 e adicional 7)*
2. **Given** a troca de imagem por cor no celular, **When** as imagens mudam, **Then** não ocorrem deslocamentos bruscos de layout. *(Cenário adicional 7)*
3. **Given** navegação somente por teclado, **When** o cliente percorre a jornada completa, **Then** todos os elementos interativos são alcançáveis e acionáveis, com foco visível em todos os passos. *(Cenário obrigatório 27)*
4. **Given** qualquer estado selecionado (cor, alça, item ativo), **When** exibido, **Then** é perceptível sem depender somente de cor (ex.: borda, ícone ou texto).

---

### Edge Cases

- **Armazenamento local indisponível ou bloqueado** (modo privado, permissões): o carrinho funciona em memória durante a sessão e a aplicação não quebra; a persistência simplesmente não ocorre.
- **Dados do carrinho corrompidos ou de versão antiga** no armazenamento local: a aplicação descarta com segurança o conteúdo inválido e inicia com carrinho vazio, sem erro visível ao cliente.
- **Produto do carrinho removido do catálogo** (dados atualizados entre visitas): o item é sinalizado ou removido com aviso amigável; a aplicação não quebra ao renderizar o carrinho.
- **Imagem específica de uma cor ausente ou com falha de rede**: estado de carregamento seguido de fallback para a imagem padrão do produto.
- **Bolsa sem segunda cor disponível ou produto sem opção de alça**: os controles correspondentes não aparecem; nenhuma validação órfã bloqueia o fluxo.
- **Quantidade nos limites**: quantidade mínima 1; tentativas de zero, negativos ou não numéricos são impedidas; acima do máximo por item (RN-11) é impedida com mensagem clara.
- **Mensagem muito longa** (muitos itens/observações extensas): a mensagem continua íntegra e codificada; a aplicação impõe limite razoável de caracteres nas observações (ver Validações) para evitar URLs excessivas.
- **Pop-up/aba bloqueada ao abrir o WhatsApp**: a aplicação oferece um link direto clicável como alternativa, mantendo a exigência de ação explícita.
- **Carrinho esvaziado em outra aba** do mesmo navegador: ao interagir, a aplicação reflete o estado atual sem quebrar.
- **Cliente volta da revisão, edita um item e o preço muda**: a revisão subsequente reflete os novos valores; a mensagem é sempre gerada a partir do estado atual.
- **Catálogo vazio ou categoria sem produtos**: mensagem amigável em português com convite a ver outras categorias.

## Requirements *(mandatory)*

### Functional Requirements

**Identidade visual**

- **FR-001**: A interface DEVE usar `#F4F1EB` como fundo principal e `#681119` como cor de destaque, podendo usar branco, preto, cinzas e variações suaves dessas cores para textos, bordas, hover, fundos secundários, elementos desabilitados, mensagens de erro e contraste.
- **FR-002**: A identidade visual DEVE transmitir trabalho artesanal, elegância, delicadeza, exclusividade, acolhimento e simplicidade, sem parecer excessivamente tecnológica ou genérica.

**Página inicial e header**

- **FR-003**: A página inicial DEVE conter, nesta ordem: header, carrossel de destaque, seção de produtos e footer.
- **FR-004**: O header DEVE conter logo da Marte Crochê, link "Início", item "Catálogo" com as categorias (Bolsas, Alças, Capinhas de AirPods), link "Contato", botão de busca e botão/ícone do carrinho com contador de itens.
- **FR-005**: No desktop, o menu "Catálogo" DEVE abrir ao passar o mouse; em dispositivos de toque, DEVE abrir por toque, sem depender de hover; o header DEVE ser completamente utilizável em celular, podendo usar menu recolhível.
- **FR-006**: Cada categoria DEVE filtrar ou direcionar o cliente aos produtos correspondentes; "Início" DEVE levar ao topo da página inicial; "Contato" DEVE levar às informações de contato da loja.

**Carrossel**

- **FR-007**: O carrossel DEVE ser responsivo, aceitar múltiplas imagens, ter navegação manual e indicadores da imagem atual, permitir avanço automático opcional com pausa/controle do usuário, usar textos alternativos e não causar mudanças de layout durante o carregamento; suas imagens DEVEM ser configuráveis em um único local.

**Catálogo e produtos**

- **FR-008**: Cada card de produto DEVE mostrar, quando disponível: foto principal, nome, categoria, preço inicial, prazo de confecção, resumo das opções e botão "Ver detalhes"/"Escolher produto".
- **FR-009**: Os dados dos produtos DEVEM ficar separados dos componentes visuais; adicionar produto, cor ou categoria DEVE exigir apenas mudanças na estrutura de dados e imagens (constituição, Seção 7).
- **FR-010**: Cada produto PODE possuir: identificador, nome, categoria, descrição, imagens (padrão e por cor), preço base, cores disponíveis, cores de alça disponíveis, possibilidade de alça, configuração de repetição de cores, prazo de confecção, disponibilidade e informações adicionais.
- **FR-011**: Produtos indisponíveis, quando exibidos, DEVEM indicar claramente a indisponibilidade e NÃO DEVEM permitir encomenda.

**Personalização e imagem por cor**

- **FR-012**: A personalização de bolsas DEVE oferecer: cor principal (obrigatória), segunda cor (opcional, máximo de duas cores no total), opção com/sem alça, cor da alça (obrigatória apenas quando "com alça" e visível somente nesse caso), quantidade e observações opcionais.
- **FR-013**: A interface DEVE comunicar com clareza quais escolhas são obrigatórias e quais são opcionais, e DEVE impedir a seleção de mais de duas cores.
- **FR-014**: A permissão de repetir a mesma cor nas duas posições DEVE ser configurável por produto e respeitada pela interface.
- **FR-015**: Antes da escolha da primeira cor, a imagem padrão do produto DEVE ser exibida; ao escolher ou trocar a primeira cor, a imagem principal e toda a galeria DEVEM mudar imediatamente para as imagens daquela cor, sem recarregar a página, com a primeira imagem da lista como principal.
- **FR-016**: A troca de cor NÃO DEVE apagar quantidade, alça, segunda cor ou observações já preenchidas.
- **FR-017**: Imagens DEVEM ter estado visual de carregamento e fallback (imagem padrão do produto ou imagem genérica) em caso de falha; cores sem cadastro para o produto NÃO DEVEM ser ofertadas.

**Preços**

- **FR-018**: Cada bolsa DEVE ter preço base sem alça; quando a alça for comprada junto, o acréscimo DEVE ser de R$ 15,00; a alça avulsa DEVE custar R$ 20,00; ambos os valores DEVEM ser configuráveis em um único local central.
- **FR-019**: Valores DEVEM ser armazenados como números e exibidos formatados em reais brasileiros (R$ 0,00) por função de formatação única.
- **FR-020**: O preço exibido DEVE atualizar imediatamente ao adicionar/remover alça, alterar quantidade ou mudar qualquer configuração que afete o preço; o botão "Adicionar ao carrinho" DEVE ficar disponível apenas com as opções obrigatórias completas.

**Carrinho**

- **FR-021**: O carrinho DEVE aceitar múltiplos itens; cada item DEVE guardar: identificador do item, identificador do produto, nome, categoria, imagem, preço unitário, quantidade, primeira cor, segunda cor (quando houver), inclusão de alça, cor da alça (quando aplicável), observações e subtotal.
- **FR-022**: O cliente DEVE poder alterar quantidade, remover item, editar a personalização, esvaziar o carrinho (com confirmação), continuar comprando e avançar para a finalização.
- **FR-023**: O carrinho DEVE exibir itens, personalizações, quantidades, preço unitário, subtotal por item e valor total; NÃO DEVE haver cálculo de frete.
- **FR-024**: O carrinho DEVE ser persistido em armazenamento local do navegador com estrutura versionada, sem qualquer dado pessoal, e recuperado após atualização da página; conteúdo inválido DEVE ser descartado com segurança.

**Busca**

- **FR-025**: A busca DEVE encontrar produtos por nome, categoria, descrição e termos relevantes, atualizar resultados de forma simples e rápida, e exibir mensagem amigável em português quando não houver resultados.

**Finalização**

- **FR-026**: O formulário de finalização DEVE conter exatamente os campos da constituição (Seção 8): Nome completo*, Telefone*, CEP*, Endereço*, Número*, Complemento, Bairro*, Cidade*, Estado*, Referência, Observações gerais (* = obrigatório).
- **FR-027**: O formulário DEVE ter rótulos visíveis, indicação de obrigatórios, máscaras quando apropriado (telefone, CEP), erros junto aos campos, preservação de dados válidos após erro, acessibilidade por teclado e bom funcionamento em celular.
- **FR-028**: O CEP DEVE ser validado apenas quanto ao formato, sem consulta externa.
- **FR-029**: O cliente DEVE poder voltar ao carrinho ou à edição de dados sem perder as informações preenchidas na sessão atual.

**Prévia e mensagem do WhatsApp**

- **FR-030**: Antes de abrir o WhatsApp, a etapa de revisão DEVE exibir: todos os itens com personalizações, quantidades, subtotais, total, dados do cliente, endereço e a prévia exata da mensagem.
- **FR-031**: Nenhuma conversa DEVE ser aberta antes da confirmação explícita do cliente; a partir da revisão, o cliente DEVE poder editar carrinho, editar dados, confirmar e abrir o WhatsApp.
- **FR-032**: A mensagem DEVE seguir o modelo da constituição (Seção 9): itens numerados com categoria, cores, alça, quantidade, valor unitário e subtotal; total do pedido; dados do cliente; endereço; observações gerais — com valores em reais e quebras de linha preservadas.
- **FR-033**: Linhas de campos opcionais vazios DEVEM ser omitidas por completo da mensagem (sem rótulos vazios, "undefined" ou linhas em branco duplicadas).
- **FR-034**: A mensagem DEVE ser codificada corretamente para URL (acentos, caracteres especiais, espaços, quebras de linha) e aberta por URL compatível com WhatsApp Web e aplicativo móvel; o número da empresa DEVE ser configurado em um único local.
- **FR-035**: Após abrir o WhatsApp, o carrinho DEVE ser mantido; o esvaziamento DEVE ocorrer apenas quando o cliente escolher "Novo pedido" e confirmar (ver RN-10).

**Footer**

- **FR-036**: O footer DEVE conter: logo ou nome da Marte Crochê, a frase da marca "Feito à mão para quem valoriza o que é único.", link para contato, link para WhatsApp, link para Instagram, links para as categorias, aviso de direitos autorais e informações básicas sobre encomendas/prazo de confecção.

**Responsividade e acessibilidade**

- **FR-037**: A aplicação DEVE funcionar corretamente em celulares, tablets, notebooks e monitores maiores, com prioridade mobile; sem rolagem horizontal involuntária e sem imagens excedendo a largura da tela.
- **FR-038**: A aplicação DEVE atender: textos alternativos, rótulos associados, foco visível, navegação por teclado, contraste suficiente, botões com nomes acessíveis, estados selecionados perceptíveis sem depender só de cor, mensagens de erro compreensíveis e hierarquia semântica de títulos.

**Privacidade**

- **FR-039**: Dados pessoais DEVEM existir apenas em memória durante a sessão; NÃO DEVEM ser persistidos nem enviados a serviços externos além da URL do WhatsApp aberta pelo cliente; NÃO DEVE haver rastreamento.

### Key Entities

- **Produto**: item do catálogo. Atributos: identificador, nome, categoria, descrição, preço base, imagens padrão, cores disponíveis (com imagens próprias), cores de alça, permite alça (sim/não), permite cor repetida (sim/não), prazo de confecção, disponibilidade, informações adicionais.
- **Cor de Produto**: opção de cor de um produto. Atributos: identificador, nome exibido, valor visual (amostra), lista ordenada de imagens (a primeira é a principal).
- **Categoria**: agrupamento de produtos (inicialmente Bolsas, Alças avulsas, Capinhas de AirPods), extensível sem mudanças estruturais.
- **Item do Carrinho**: produto personalizado adicionado ao pedido. Atributos: identificador do item, referência ao produto, nome, categoria, imagem, preço unitário calculado, quantidade, primeira cor, segunda cor (opcional), inclusão de alça, cor da alça (condicional), observações, subtotal. Não contém dados pessoais.
- **Carrinho**: coleção versionada de itens + total; persistível localmente; sem dados pessoais.
- **Dados do Cliente**: nome completo, telefone, CEP, endereço, número, complemento, bairro, cidade, estado, referência, observações gerais. Existem apenas em memória de sessão.
- **Pedido (mensagem)**: composição de carrinho + dados do cliente no formato de mensagem do WhatsApp; existe apenas no momento da geração/prévia.
- **Configuração da Loja**: número do WhatsApp, preço da alça com bolsa (R$ 15,00), preço da alça avulsa (R$ 20,00), imagens do carrossel, links (Instagram, contato) — tudo em local único.

## Regras de Negócio

- **RN-01 — Preço da bolsa**: preço unitário = preço base do produto + R$ 15,00 se "com alça". Subtotal do item = preço unitário × quantidade. Total do pedido = soma dos subtotais.
- **RN-02 — Alça avulsa**: produto próprio da categoria Alças, preço R$ 20,00.
- **RN-03 — Preços centrais**: os valores R$ 15,00 (alça com bolsa) e R$ 20,00 (alça avulsa) são configuração central única; nenhum componente repete esses números.
- **RN-04 — Limite de cores**: bolsa aceita no mínimo 1 e no máximo 2 cores; a primeira é obrigatória, a segunda opcional.
- **RN-05 — Cor repetida**: repetir a mesma cor nas duas posições é permitido ou proibido conforme configuração individual do produto.
- **RN-06 — Cor da alça**: obrigatória se e somente se "com alça" estiver selecionado; o seletor só aparece nesse caso.
- **RN-07 — Imagem segue a primeira cor**: a primeira cor é a cor visual principal; galeria e imagem principal sempre refletem a primeira cor selecionada (ou a imagem padrão antes da seleção). A segunda cor não altera imagens na v1.
- **RN-08 — Disponibilidade**: apenas cores cadastradas para o produto são ofertadas; produtos indisponíveis não podem ser encomendados.
- **RN-09 — Mensagem**: itens numerados na ordem do carrinho; linhas de campos opcionais vazios omitidas integralmente; valores em formato de reais brasileiros; estrutura conforme constituição Seção 9.
- **RN-10 — Limpeza do carrinho (decisão)**: abrir o WhatsApp NÃO altera o carrinho. Após a abertura, a aplicação exibe a opção "Novo pedido"; ao acioná-la, o cliente confirma e só então o carrinho é esvaziado. Escolhida por ser a solução mais simples e segura: nenhuma perda irreversível caso o envio no WhatsApp não se concretize.
- **RN-11 — Quantidade**: inteiro entre 1 e 20 por item (limite máximo definido por premissa; ver Assumptions).
- **RN-12 — Sem frete**: nenhum cálculo de frete é exibido; combinação de entrega ocorre na conversa do WhatsApp.

## Estados de Interface

| Contexto | Estado | Comportamento exigido |
| --- | --- | --- |
| Catálogo | Vazio (sem produtos/categoria vazia) | Mensagem amigável em português + convite a explorar outras categorias |
| Imagens (galeria, cards, carrossel) | Carregando | Indicador/placeholder que reserva espaço (sem saltos de layout) |
| Imagens | Falha | Fallback: imagem padrão do produto ou imagem genérica da loja |
| Detalhes do produto | Cor principal não selecionada | Imagem padrão; "Adicionar ao carrinho" desabilitado com motivo claro |
| Detalhes do produto | "Com alça" desmarcado | Seletor de cor da alça oculto |
| Carrinho | Vazio | Mensagem amigável + "Continuar comprando"; finalização indisponível |
| Carrinho | Com itens | Lista completa + totais; ações por item disponíveis |
| Formulário | Erro de validação | Erro junto ao campo; dados válidos preservados; avanço bloqueado |
| Revisão | Dados completos | Prévia exata da mensagem + ações: editar carrinho, editar dados, enviar |
| Pós-WhatsApp | Retorno ao site | Carrinho intacto + opção "Novo pedido" (com confirmação) |
| Busca | Sem resultados | Mensagem amigável em português |
| Botões de ação principal | Pré-requisitos incompletos | Desabilitados, com indicação do que falta |

## Validações e Casos de Erro

| Campo/Ação | Regra | Mensagem (exemplo, pt-BR) |
| --- | --- | --- |
| Cor principal | Obrigatória para bolsas | "Escolha a cor principal da bolsa." |
| Terceira cor | Bloqueada | "A bolsa aceita no máximo duas cores." |
| Cor repetida (produto que proíbe) | Bloqueada | "Este modelo não permite repetir a mesma cor." |
| Cor da alça (com alça) | Obrigatória | "Escolha a cor da alça." |
| Quantidade | Inteiro, 1–20 | "Informe uma quantidade entre 1 e 20." |
| Nome completo | Obrigatório, mín. 3 caracteres | "Informe seu nome completo." |
| Telefone | Obrigatório, 10–11 dígitos com máscara | "Informe um telefone válido com DDD." |
| CEP | Obrigatório, formato 00000-000 | "Informe um CEP válido (ex.: 01234-567)." |
| Endereço, Número, Bairro, Cidade | Obrigatórios, não vazios | "Preencha este campo." |
| Estado | Obrigatório, UF válida | "Selecione o estado." |
| Observações (item e gerais) | Opcionais, máx. 500 caracteres cada | "As observações podem ter até 500 caracteres." |
| Avançar com carrinho vazio | Bloqueado | "Seu carrinho está vazio. Escolha um produto para continuar." |
| Abrir WhatsApp com bloqueio de pop-up | Alternativa | Link direto clicável exibido: "Toque aqui para abrir o WhatsApp." |
| Carrinho local corrompido/versão antiga | Descarte seguro | Sem mensagem de erro técnica; carrinho inicia vazio |

Erros técnicos nunca são exibidos em formato cru ao cliente; a aplicação não deve quebrar em nenhum dos casos acima.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um cliente novo, no celular, completa a jornada do catálogo até a abertura do WhatsApp com a mensagem preenchida em menos de 5 minutos, sem ajuda externa.
- **SC-002**: 100% dos 35 cenários de aceitação desta especificação (28 obrigatórios + 7 de imagem por cor) passam em verificação manual ou automatizada.
- **SC-003**: A mensagem gerada abre corretamente (texto íntegro, acentos e quebras de linha preservados) tanto no WhatsApp de celular quanto no WhatsApp Web/desktop.
- **SC-004**: Em nenhuma circunstância um pedido é enviado ou uma conversa é aberta sem clique explícito do cliente (0 ocorrências em teste exploratório).
- **SC-005**: Nenhum dado pessoal do cliente permanece armazenado no navegador após o fechamento da aba (verificável por inspeção do armazenamento local).
- **SC-006**: O carrinho sobrevive a uma atualização de página em 100% dos casos com armazenamento local disponível.
- **SC-007**: Adicionar um novo produto ou uma nova cor ao catálogo exige mudanças em um único ponto de dados (mais os arquivos de imagem), verificável por revisão.
- **SC-008**: A jornada completa é realizável apenas com teclado, com foco visível em 100% dos elementos interativos.
- **SC-009**: Em viewport de 320 px não há rolagem horizontal involuntária em nenhuma tela da jornada.
- **SC-010**: Todos os preços exibidos e presentes na mensagem conferem com as regras RN-01 a RN-03 em 100% das combinações testadas (sem alça, com alça, alça avulsa, quantidades variadas).

## Dependências

- Número de WhatsApp comercial da Marte Crochê (configuração central; placeholder até fornecimento).
- URL do perfil do Instagram da marca (link do footer).
- Fotos dos produtos por cor, logo e imagens do carrossel fornecidas pela artesã, otimizadas para web.
- Textos definitivos de descrição dos produtos, prazos de confecção e informações de encomenda do footer.
- Constituição do projeto v2.0.0 (regra superior desta especificação).

## Assumptions

- **Limpeza do carrinho**: adotada a opção "manter o carrinho até o cliente escolher 'Novo pedido', com confirmação antes de limpar" (RN-10), por ser a mais simples e segura entre as três previstas no pedido.
- **Quantidade máxima por item**: 20 unidades — valor razoável para produção artesanal; ajustável na configuração central.
- **Limite de observações**: 500 caracteres por campo de observação, para manter a URL do WhatsApp em tamanho seguro.
- **Telefone**: formato brasileiro com DDD (10–11 dígitos), com máscara; sem verificação de existência.
- **Estado**: seleção entre as 27 UFs brasileiras.
- **Moeda**: exclusivamente real brasileiro (R$), formatação pt-BR.
- **Idioma**: 100% português brasileiro; sem internacionalização na v1.
- **Catálogo inicial pequeno** (ordem de dezenas de produtos): a busca pode operar sobre os dados locais sem indexação especial.
- **Aplicação de página única** servida estaticamente; o React foi definido pelo solicitante como tecnologia do frontend (detalhes de arquitetura ficam para o plano técnico).
- **Sem SEO avançado, sem analytics** (proibido pela constituição).
- **Conexão**: cliente possui conexão suficiente para carregar imagens; otimização de imagens mitiga conexões lentas.

## Fora do Escopo

Backend; banco de dados; login; cadastro de clientes; pagamento online; cálculo automático de frete; rastreamento de pedidos; painel administrativo; controle de estoque; cupons; cashback; avaliações; favoritos; integração com transportadoras; envio automático de mensagens; armazenamento permanente dos dados pessoais; confirmação automática de que o pedido foi recebido.

Esses itens são PROIBIDOS pela constituição (Seção 13) e só podem entrar por emenda.

## Critérios de Conclusão

Esta feature está concluída quando:

1. Todos os requisitos funcionais FR-001 a FR-039 estão implementados e verificados;
2. Todos os cenários de aceitação das User Stories 1–6 passam;
3. Todos os Success Criteria SC-001 a SC-010 são atingidos;
4. As regras de negócio RN-01 a RN-12 estão cobertas por testes de funções puras (cálculo de preço, montagem da mensagem, omissão de opcionais, codificação de URL, validações), conforme a constituição (Seção 12);
5. Os critérios de conclusão da constituição (Seção 15) são atendidos;
6. Nenhum item da seção Fora do Escopo está presente na aplicação.

## Notas para o Planejamento Técnico

*(Orientações não vinculantes de estrutura; nomes exatos podem mudar, responsabilidades não.)*

O pedido sugere componentes com responsabilidades separadas, como: Header, Navigation, CatalogMenu, Search, HeroCarousel, ProductGrid, ProductCard, ProductDetails, ProductGallery, ColorSelector, StrapOptions, QuantitySelector, CartButton, CartDrawer/CartPage, CartItem, CheckoutForm, OrderPreview, WhatsAppOrderButton, Footer. Exige-se: separação dados/interface/regras de negócio; funções puras para preço, formatação monetária e montagem da mensagem; tipos consistentes para produto e item do carrinho; estado global mínimo (carrinho); imagens organizadas por produto e por cor com relação registrada nos dados do produto (sem depender do nome digitado da cor para localizar arquivos); estrutura preparada para testes; sem dependências desnecessárias.
