import { montarMensagem, montarUrlWhatsApp } from './mensagem';
import { criarConfigTeste, criarItemTeste } from '../test/fixtures';
import type { DadosCliente } from '../types/cliente';
import type { ItemCarrinho } from '../types/carrinho';

const config = criarConfigTeste();

function dadosCompletos(sobrescrever: Partial<DadosCliente> = {}): DadosCliente {
  return {
    nomeCompleto: 'Maria da Silva',
    email: 'maria@exemplo.com',
    cpf: '12345678901',
    telefone: '11912345678',
    cep: '01234567',
    endereco: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    estado: 'SP',
    referencia: 'Portão azul, ao lado da padaria',
    observacoesGerais: 'Entregar após as 18h',
    ...sobrescrever,
  };
}

function itemBolsa(sobrescrever: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return criarItemTeste({
    id: 'a',
    produtoId: 'bolsa-marte',
    nomeProduto: 'Bolsa Marte',
    categoriaNome: 'Bolsas',
    precoUnitarioCentavos: 12000,
    corPrincipal: { id: 'vinho', nome: 'Vinho' },
    ...sobrescrever,
  });
}

describe('montarMensagem', () => {
  it('mensagem completa com adicionais — igualdade exata', () => {
    const itens = [
      itemBolsa({
        precoUnitarioCentavos: 13500,
        corSecundaria: { id: 'bege', nome: 'Bege' },
        adicionais: [
          {
            adicionalId: 'alca-longa-croche',
            nomeAdicional: 'Alça longa de crochê',
            precoCentavos: 1500,
            opcoes: [
              { opcaoId: 'cor-alca', nomeOpcao: 'Cor da alça', valorId: 'preto', valorNome: 'Preto' },
            ],
          },
        ],
        observacoes: 'Presente, embrulhar com carinho',
      }),
      criarItemTeste({
        id: 'b',
        produtoId: 'bolsa-venus',
        nomeProduto: 'Bolsa Vênus',
        categoriaNome: 'Bolsas',
        precoUnitarioCentavos: 9800,
        corPrincipal: { id: 'vinho', nome: 'Vinho' },
        quantidade: 2,
      }),
    ];

    const esperada = `*PEDIDO — Marte Crochê*

Olá! Gostaria de fazer uma encomenda.

*ITENS DO PEDIDO*

1. *Bolsa Marte*
Categoria: Bolsas
Cor principal: Vinho
Segunda cor: Bege
Adicional: Alça longa de crochê
Cor da alça: Preto
Quantidade: 1
Valor unitário: R$ 135,00
Subtotal: R$ 135,00
Observações: Presente, embrulhar com carinho

2. *Bolsa Vênus*
Categoria: Bolsas
Cor: Vinho
Quantidade: 2
Valor unitário: R$ 98,00
Subtotal: R$ 196,00

*TOTAL DO PEDIDO: R$ 331,00*

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

Observações gerais: Entregar após as 18h`;

    expect(montarMensagem(itens, dadosCompletos(), config)).toBe(esperada);
  });

  it('mensagem mínima — opcionais vazios omitidos por completo', () => {
    const itens = [itemBolsa()];
    const dados = dadosCompletos({
      complemento: '',
      referencia: '',
      observacoesGerais: '',
    });

    const esperada = `*PEDIDO — Marte Crochê*

Olá! Gostaria de fazer uma encomenda.

*ITENS DO PEDIDO*

1. *Bolsa Marte*
Categoria: Bolsas
Cor: Vinho
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
CEP: 01234-567`;

    expect(montarMensagem(itens, dados, config)).toBe(esperada);
    expect(montarMensagem(itens, dados, config)).not.toContain('undefined');
    expect(montarMensagem(itens, dados, config)).not.toContain('\n\n\n');
  });

  it('múltiplos itens numerados na ordem do carrinho', () => {
    const itens = [
      itemBolsa({ id: '1' }),
      itemBolsa({ id: '2', nomeProduto: 'Bolsa Vênus', produtoId: 'bolsa-venus' }),
    ];
    const mensagem = montarMensagem(itens, dadosCompletos(), config);
    expect(mensagem.indexOf('1. *Bolsa Marte*')).toBeGreaterThan(-1);
    expect(mensagem.indexOf('2. *Bolsa Vênus*')).toBeGreaterThan(
      mensagem.indexOf('1. *Bolsa Marte*'),
    );
  });

  it('valores formatados em reais, inclusive milhares', () => {
    const itens = [itemBolsa({ precoUnitarioCentavos: 123456 })];
    const mensagem = montarMensagem(itens, dadosCompletos(), config);
    expect(mensagem).toContain('Valor unitário: R$ 1.234,56');
    expect(mensagem).toContain('*TOTAL DO PEDIDO: R$ 1.234,56*');
  });

  it('produto sem adicionais não gera linha "Adicional:"', () => {
    const capinha = criarItemTeste({
      produtoId: 'capinha-teste',
      nomeProduto: 'Capinha de Fones',
      categoriaNome: 'Capinhas de Fones',
      precoUnitarioCentavos: 4500,
    });
    const mensagem = montarMensagem([capinha], dadosCompletos(), config);
    expect(mensagem).not.toContain('Adicional:');
  });

  it('URL do WhatsApp: número do config e mensagem íntegra após decode', () => {
    const mensagem = montarMensagem([itemBolsa()], dadosCompletos(), config);
    const url = montarUrlWhatsApp(mensagem, config);

    expect(url.startsWith(`https://wa.me/${config.numeroWhatsApp}?text=`)).toBe(true);
    expect(url).toContain('%0A');

    const texto = url.split('?text=')[1];
    expect(decodeURIComponent(texto)).toBe(mensagem);
  });

  it('acentos, caracteres especiais e emojis sobrevivem ao ciclo encode/decode', () => {
    const itens = [
      itemBolsa({ observacoes: 'Coração ♥ açaí & crochê — 100% amor 🧶' }),
    ];
    const dados = dadosCompletos({ cidade: 'São João del-Rei' });
    const mensagem = montarMensagem(itens, dados, config);
    const url = montarUrlWhatsApp(mensagem, config);
    const decodificada = decodeURIComponent(url.split('?text=')[1]);

    expect(decodificada).toContain('Coração ♥ açaí & crochê — 100% amor 🧶');
    expect(decodificada).toContain('São João del-Rei');
    expect(decodificada).toBe(mensagem);
  });
});
