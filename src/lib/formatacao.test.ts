import { formatarReais, mascaraTelefone, mascaraCep } from './formatacao';

describe('formatarReais', () => {
  it('formata valores simples', () => {
    expect(formatarReais(1500)).toBe('R$ 15,00');
    expect(formatarReais(2000)).toBe('R$ 20,00');
  });

  it('formata milhares com separador pt-BR', () => {
    expect(formatarReais(123456)).toBe('R$ 1.234,56');
  });

  it('formata zero', () => {
    expect(formatarReais(0)).toBe('R$ 0,00');
  });

  it('formata centavos quebrados', () => {
    expect(formatarReais(9801)).toBe('R$ 98,01');
  });
});

describe('mascaraTelefone', () => {
  it('mascara celular com 11 dígitos', () => {
    expect(mascaraTelefone('11912345678')).toBe('(11) 91234-5678');
  });

  it('mascara fixo com 10 dígitos', () => {
    expect(mascaraTelefone('1112345678')).toBe('(11) 1234-5678');
  });

  it('mascara entrada parcial progressivamente', () => {
    expect(mascaraTelefone('')).toBe('');
    expect(mascaraTelefone('1')).toBe('(1');
    expect(mascaraTelefone('11')).toBe('(11');
    expect(mascaraTelefone('119')).toBe('(11) 9');
    expect(mascaraTelefone('119123')).toBe('(11) 9123');
  });

  it('ignora letras e símbolos', () => {
    expect(mascaraTelefone('(11) 91234-5678')).toBe('(11) 91234-5678');
    expect(mascaraTelefone('11a9b1234c5678')).toBe('(11) 91234-5678');
  });

  it('descarta dígitos além de 11', () => {
    expect(mascaraTelefone('119123456789999')).toBe('(11) 91234-5678');
  });
});

describe('mascaraCep', () => {
  it('mascara CEP completo', () => {
    expect(mascaraCep('01234567')).toBe('01234-567');
  });

  it('não adiciona hífen antes do sexto dígito', () => {
    expect(mascaraCep('01234')).toBe('01234');
    expect(mascaraCep('012345')).toBe('01234-5');
  });

  it('ignora não-dígitos e limita a 8 dígitos', () => {
    expect(mascaraCep('01234-567')).toBe('01234-567');
    expect(mascaraCep('01234567999')).toBe('01234-567');
    expect(mascaraCep('ab012cd34567')).toBe('01234-567');
  });
});
