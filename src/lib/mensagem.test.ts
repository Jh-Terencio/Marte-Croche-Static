import { montarMensagem, montarUrlWhatsApp } from './mensagem';
import { criarConfigTeste, criarItemTeste } from '../test/fixtures';
import type { DadosCliente } from '../types/cliente';
import type { ItemCarrinho } from '../types/carrinho';

const config = criarConfigTeste();

function dadosCompletos(sobrescrever: Partial<DadosCliente> = {}): DadosCliente {
  return {
    nomeCompleto: 'Maria da Silva',
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

// itens baseados em produtos reais do catálogo (a linha "Alça:" depende
// de o produto permitir alça)
function itemBolsaLua(sobrescrever: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return criarItemTeste({
    id: 'a',
    produtoId: 'bolsa-lua',
    nomeProduto: 'Bolsa Lua',
    categoriaNome: 'Bolsas',
    precoUnitarioCentavos: 12000,
    corPrincipal: { id: 'vinho', nome: 'Vinho' },
    ...sobrescrever,
  });
}

function itemAlcaAvulsa(sobrescrever: Partial<ItemCarrinho> = {}): ItemCarrinho {
  return criarItemTeste({
    id: 'b',
    produtoId: 'alca-classica',
    nomeProduto: 'Alça de Crochê Clássica',
    categoriaNome: 'Alças',
    precoUnitarioCentavos: 2000,
    corPrincipal: { id: 'vinho', nome: 'Vinho' },
    comAlca: false,
    corAlca: null,
    ...sobrescrever,
  });
}

describe('montarMensagem', () => {
  it('1. mensagem completa — igualdade exata da string', () => {
    const itens = [
      itemBolsaLua({
        precoUnitarioCentavos: 13500,
        corSecundaria: { id: 'bege', nome: 'Bege' },
        comAlca: true,
        corAlca: { id: 'preto', nome: 'Preto' },
        observacoes: 'Presente, embrulhar com carinho',
      }),
      itemAlcaAvulsa({ quantidade: 2 }),
    ];

    const esperada = `*PEDIDO — Marte Crochê*

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

2. *Alça de Crochê Clássica*
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

Observações gerais: Entregar após as 18h`;

    expect(montarMensagem(itens, dadosCompletos(), config)).toBe(esperada);
  });

  it('2. mensagem mínima — opcionais vazios omitidos por completo', () => {
    const itens = [itemBolsaLua()];
    const dados = dadosCompletos({
      complemento: '',
      referencia: '',
      observacoesGerais: '',
    });

    const esperada = `*PEDIDO — Marte Crochê*

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
CEP: 01234-567`;

    expect(montarMensagem(itens, dados, config)).toBe(esperada);
    expect(montarMensagem(itens, dados, config)).not.toContain('undefined');
    expect(montarMensagem(itens, dados, config)).not.toContain('\n\n\n');
  });

  it('3. múltiplos itens numerados na ordem do carrinho', () => {
    const itens = [
      itemBolsaLua({ id: '1º' }),
      itemAlcaAvulsa({ id: '2º' }),
      itemBolsaLua({ id: '3º', nomeProduto: 'Bolsa Sol', produtoId: 'bolsa-sol' }),
    ];
    const mensagem = montarMensagem(itens, dadosCompletos(), config);
    expect(mensagem.indexOf('1. *Bolsa Lua*')).toBeGreaterThan(-1);
    expect(mensagem.indexOf('2. *Alça de Crochê Clássica*')).toBeGreaterThan(
      mensagem.indexOf('1. *Bolsa Lua*'),
    );
    expect(mensagem.indexOf('3. *Bolsa Sol*')).toBeGreaterThan(
      mensagem.indexOf('2. *Alça de Crochê Clássica*'),
    );
  });

  it('4. valores formatados em reais, inclusive milhares', () => {
    const itens = [itemBolsaLua({ precoUnitarioCentavos: 123456 })];
    const mensagem = montarMensagem(itens, dadosCompletos(), config);
    expect(mensagem).toContain('Valor unitário: R$ 1.234,56');
    expect(mensagem).toContain('*TOTAL DO PEDIDO: R$ 1.234,56*');
  });

  it('5. produto sem opção de alça não gera linha "Alça:"', () => {
    const capinha = criarItemTeste({
      produtoId: 'capinha-airpods',
      nomeProduto: 'Capinha de AirPods',
      categoriaNome: 'Capinhas de AirPods',
      precoUnitarioCentavos: 4500,
      comAlca: false,
      corAlca: null,
    });
    const mensagem = montarMensagem([capinha], dadosCompletos(), config);
    expect(mensagem).not.toContain('Alça:');
  });

  it('6. URL do WhatsApp: número do config e mensagem íntegra após decode', () => {
    const mensagem = montarMensagem([itemBolsaLua()], dadosCompletos(), config);
    const url = montarUrlWhatsApp(mensagem, config);

    expect(url.startsWith(`https://wa.me/${config.numeroWhatsApp}?text=`)).toBe(true);
    expect(url).toContain('%0A'); // quebras de linha preservadas na codificação

    const texto = url.split('?text=')[1];
    expect(decodeURIComponent(texto)).toBe(mensagem);
  });

  it('7. acentos, caracteres especiais e emojis sobrevivem ao ciclo encode/decode', () => {
    const itens = [
      itemBolsaLua({ observacoes: 'Coração ♥ açaí & crochê — 100% amor 🧶' }),
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
