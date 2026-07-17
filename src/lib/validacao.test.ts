import { validarPersonalizacao, validarDadosCliente } from './validacao';
import { criarConfigTeste, criarProdutoTeste } from '../test/fixtures';
import type { PersonalizacaoItem } from '../types/carrinho';
import type { DadosCliente } from '../types/cliente';

const config = criarConfigTeste();

function personalizacaoValida(
  sobrescrever: Partial<PersonalizacaoItem> = {},
): PersonalizacaoItem {
  return {
    quantidadeCores: 1,
    corPrincipalId: 'vinho',
    corSecundariaId: null,
    adicionaisSelecionados: {},
    quantidade: 1,
    observacoes: '',
    ...sobrescrever,
  };
}

describe('validarPersonalizacao', () => {
  const bolsa = criarProdutoTeste();

  it('aceita uma personalização completa e válida', () => {
    const resultado = validarPersonalizacao(personalizacaoValida(), bolsa, config);
    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toEqual({});
  });

  it('exige cor principal quando o produto tem cores (RN-04)', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({ corPrincipalId: null }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.corPrincipal).toBe('Escolha a cor principal.');
  });

  it('não exige cor quando o produto não tem opções de cor', () => {
    const semCores = criarProdutoTeste({ cores: [] });
    const resultado = validarPersonalizacao(
      personalizacaoValida({ corPrincipalId: null }),
      semCores,
      config,
    );
    expect(resultado.valido).toBe(true);
  });

  it('rejeita cor principal que não pertence ao produto (RN-08)', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({ corPrincipalId: 'roxo-inexistente' }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.corPrincipal).toBe('Escolha uma das cores disponíveis.');
  });

  it('exige segunda cor quando quantidadeCores é 2', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({ quantidadeCores: 2, corSecundariaId: null }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.corSecundaria).toBe('Escolha a segunda cor.');
  });

  it('impede cor repetida quando o produto não permite (RN-05)', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({ quantidadeCores: 2, corSecundariaId: 'vinho' }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.corSecundaria).toBe(
      'Este modelo não permite repetir a mesma cor.',
    );
  });

  it('aceita cor repetida quando o produto permite (RN-05)', () => {
    const bolsaFlex = criarProdutoTeste({ permiteCorRepetida: true });
    const resultado = validarPersonalizacao(
      personalizacaoValida({ quantidadeCores: 2, corSecundariaId: 'vinho' }),
      bolsaFlex,
      config,
    );
    expect(resultado.valido).toBe(true);
  });

  it('exige opção obrigatória de adicional quando selecionado', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({
        adicionaisSelecionados: { 'alca-longa-croche': { 'cor-alca': null } },
      }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros['adicional_alca-longa-croche_cor-alca']).toBeDefined();
  });

  it('aceita adicional com opção obrigatória preenchida', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({
        adicionaisSelecionados: { 'alca-longa-croche': { 'cor-alca': 'vinho' } },
      }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(true);
  });

  it('aceita adicional sem opções (alça de corrente)', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({
        adicionaisSelecionados: { 'alca-corrente': {} },
      }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(true);
  });

  it('valida quantidade como inteiro entre 1 e o máximo (RN-11)', () => {
    for (const quantidade of [0, -1, 1.5, 21, Number.NaN]) {
      const resultado = validarPersonalizacao(
        personalizacaoValida({ quantidade }),
        bolsa,
        config,
      );
      expect(resultado.valido).toBe(false);
      expect(resultado.erros.quantidade).toBe('Informe uma quantidade entre 1 e 20.');
    }
    expect(
      validarPersonalizacao(personalizacaoValida({ quantidade: 20 }), bolsa, config)
        .valido,
    ).toBe(true);
  });

  it('limita as observações do item a 500 caracteres', () => {
    const resultado = validarPersonalizacao(
      personalizacaoValida({ observacoes: 'a'.repeat(501) }),
      bolsa,
      config,
    );
    expect(resultado.valido).toBe(false);
    expect(resultado.erros.observacoes).toBe(
      'As observações podem ter até 500 caracteres.',
    );
  });
});

function dadosValidos(sobrescrever: Partial<DadosCliente> = {}): DadosCliente {
  return {
    nomeCompleto: 'Maria da Silva',
    email: 'maria@exemplo.com',
    cpf: '123.456.789-01',
    telefone: '(11) 91234-5678',
    cep: '01234-567',
    endereco: 'Rua das Flores',
    numero: '123',
    complemento: '',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    estado: 'SP',
    referencia: '',
    observacoesGerais: '',
    ...sobrescrever,
  };
}

describe('validarDadosCliente', () => {
  it('aceita dados completos e válidos, com opcionais vazios', () => {
    const resultado = validarDadosCliente(dadosValidos());
    expect(resultado.valido).toBe(true);
    expect(resultado.erros).toEqual({});
  });

  it('exige nome completo com pelo menos 3 caracteres', () => {
    for (const nomeCompleto of ['', '  ', 'Jo']) {
      const resultado = validarDadosCliente(dadosValidos({ nomeCompleto }));
      expect(resultado.valido).toBe(false);
      expect(resultado.erros.nomeCompleto).toBe('Informe seu nome completo.');
    }
  });

  it('valida o telefone com 10 ou 11 dígitos', () => {
    for (const telefone of ['', '123', '(11) 1234-567']) {
      expect(validarDadosCliente(dadosValidos({ telefone })).erros.telefone).toBe(
        'Informe um telefone válido com DDD.',
      );
    }
    expect(validarDadosCliente(dadosValidos({ telefone: '1112345678' })).valido).toBe(true);
    expect(validarDadosCliente(dadosValidos({ telefone: '11912345678' })).valido).toBe(true);
  });

  it('valida o CEP apenas quanto ao formato (FR-028)', () => {
    for (const cep of ['', '0123', '01234-56', 'abcde-fgh']) {
      expect(validarDadosCliente(dadosValidos({ cep })).erros.cep).toBe(
        'Informe um CEP válido (ex.: 01234-567).',
      );
    }
    expect(validarDadosCliente(dadosValidos({ cep: '01234567' })).valido).toBe(true);
    expect(validarDadosCliente(dadosValidos({ cep: '01234-567' })).valido).toBe(true);
  });

  it('exige endereço, número, bairro e cidade não vazios', () => {
    for (const campo of ['endereco', 'numero', 'bairro', 'cidade'] as const) {
      const resultado = validarDadosCliente(dadosValidos({ [campo]: '  ' }));
      expect(resultado.valido).toBe(false);
      expect(resultado.erros[campo]).toBe('Preencha este campo.');
    }
  });

  it('exige uma UF válida', () => {
    for (const estado of ['', 'XX', 'sp ']) {
      expect(validarDadosCliente(dadosValidos({ estado })).erros.estado).toBe(
        'Selecione o estado.',
      );
    }
    expect(validarDadosCliente(dadosValidos({ estado: 'RJ' })).valido).toBe(true);
  });

  it('limita as observações gerais a 500 caracteres', () => {
    const resultado = validarDadosCliente(
      dadosValidos({ observacoesGerais: 'a'.repeat(501) }),
    );
    expect(resultado.erros.observacoesGerais).toBe(
      'As observações podem ter até 500 caracteres.',
    );
  });
});
