import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DadosCliente } from '../types/cliente';

/**
 * Dados do cliente em MEMÓRIA DE SESSÃO, compartilhados entre
 * carrinho ↔ finalização ↔ revisão para nada se perder ao navegar.
 * É PROIBIDO persistir estes dados em qualquer armazenamento
 * (Constituição §6, FR-039).
 */

export const DADOS_CLIENTE_VAZIOS: DadosCliente = {
  nomeCompleto: '',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  referencia: '',
  observacoesGerais: '',
};

interface FinalizacaoApi {
  dados: DadosCliente;
  alterarDados: (mudanca: Partial<DadosCliente>) => void;
}

const FinalizacaoContext = createContext<FinalizacaoApi | null>(null);

export function FinalizacaoProvider({
  children,
  inicial = DADOS_CLIENTE_VAZIOS,
}: {
  children: ReactNode;
  /** Estado inicial — útil em testes. */
  inicial?: DadosCliente;
}) {
  const [dados, setDados] = useState<DadosCliente>(inicial);

  const alterarDados = (mudanca: Partial<DadosCliente>) =>
    setDados((atuais) => ({ ...atuais, ...mudanca }));

  return (
    <FinalizacaoContext.Provider value={{ dados, alterarDados }}>
      {children}
    </FinalizacaoContext.Provider>
  );
}

export function useFinalizacao(): FinalizacaoApi {
  const contexto = useContext(FinalizacaoContext);
  if (!contexto) {
    throw new Error('useFinalizacao deve ser usado dentro de <FinalizacaoProvider>');
  }
  return contexto;
}
