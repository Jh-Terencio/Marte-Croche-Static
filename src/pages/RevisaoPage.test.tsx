import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RevisaoPage } from './RevisaoPage';
import { CarrinhoProvider } from '../context/CarrinhoContext';
import {
  FinalizacaoProvider,
  DADOS_CLIENTE_VAZIOS,
} from '../context/FinalizacaoContext';
import { CHAVE_CARRINHO } from '../lib/carrinhoStorage';
import { montarMensagem, montarUrlWhatsApp } from '../lib/mensagem';
import { config } from '../data/config';
import { criarItemTeste } from '../test/fixtures';
import type { DadosCliente } from '../types/cliente';
import type { ItemCarrinho } from '../types/carrinho';

const dadosDeTeste: DadosCliente = {
  nomeCompleto: 'Maria da Silva',
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
};

function itensDeTeste(): ItemCarrinho[] {
  return [
    criarItemTeste({
      id: 'a',
      produtoId: 'bolsa-lua',
      nomeProduto: 'Bolsa Lua',
      categoriaNome: 'Bolsas',
      precoUnitarioCentavos: 13500,
      comAlca: true,
      corAlca: { id: 'preto', nome: 'Preto' },
    }),
  ];
}

function renderizarRevisao(dados: DadosCliente = dadosDeTeste) {
  return render(
    <MemoryRouter initialEntries={['/revisao']}>
      <CarrinhoProvider>
        <FinalizacaoProvider inicial={dados}>
          <Routes>
            <Route path="/revisao" element={<RevisaoPage />} />
            <Route path="/" element={<h1>Página inicial</h1>} />
            <Route path="/carrinho" element={<h1>Página do carrinho</h1>} />
            <Route path="/finalizacao" element={<h1>Página de finalização</h1>} />
          </Routes>
        </FinalizacaoProvider>
      </CarrinhoProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('RevisaoPage', () => {
  it('exibe a prévia EXATAMENTE igual à mensagem de montarMensagem', () => {
    const itens = itensDeTeste();
    window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 1, itens }));
    renderizarRevisao();

    const esperada = montarMensagem(itens, dadosDeTeste, config);
    const previa = screen.getByRole('region', { name: 'Prévia da mensagem' });
    expect(within(previa).getByText(/PEDIDO — Marte Crochê/).closest('pre')).toHaveTextContent(
      // toHaveTextContent normaliza espaços; compara também o texto bruto
      'PEDIDO — Marte Crochê',
    );
    expect(previa.querySelector('pre')?.textContent).toBe(esperada);
  });

  it('nenhuma conversa é aberta sem clique: o botão é uma âncora com a URL correta', () => {
    const itens = itensDeTeste();
    window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 1, itens }));
    renderizarRevisao();

    const link = screen.getByRole('link', { name: /enviar pedido pelo whatsapp/i });
    const esperada = montarUrlWhatsApp(montarMensagem(itens, dadosDeTeste, config), config);
    expect(link).toHaveAttribute('href', esperada);
    expect(link).toHaveAttribute('target', '_blank');
    // estado pós-envio ainda não existe
    expect(screen.queryByText(/pedido encaminhado/i)).not.toBeInTheDocument();
  });

  it('após o clique o carrinho permanece intacto e "Novo pedido" só esvazia com confirmação (RN-10)', async () => {
    const usuario = userEvent.setup();
    const itens = itensDeTeste();
    window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ versao: 1, itens }));
    renderizarRevisao();

    await usuario.click(screen.getByRole('link', { name: /enviar pedido pelo whatsapp/i }));

    // estado pós-envio com fallback e ações
    expect(screen.getByText('Pedido encaminhado ao WhatsApp')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /toque aqui para abrir o whatsapp/i }),
    ).toBeInTheDocument();
    // carrinho intacto
    expect(JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!).itens).toHaveLength(1);

    // cancelar mantém o carrinho
    await usuario.click(screen.getByRole('button', { name: 'Novo pedido' }));
    await usuario.click(screen.getByRole('button', { name: 'Manter este pedido' }));
    expect(JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!).itens).toHaveLength(1);

    // confirmar esvazia e volta para a home
    await usuario.click(screen.getByRole('button', { name: 'Novo pedido' }));
    await usuario.click(
      screen.getByRole('button', { name: 'Esvaziar e começar de novo' }),
    );
    expect(window.localStorage.getItem(CHAVE_CARRINHO)).toBeNull();
    expect(screen.getByRole('heading', { name: 'Página inicial' })).toBeInTheDocument();
  });

  it('"Continuar com este carrinho" sai do estado pós-envio sem tocar no carrinho', async () => {
    const usuario = userEvent.setup();
    window.localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify({ versao: 1, itens: itensDeTeste() }),
    );
    renderizarRevisao();

    await usuario.click(screen.getByRole('link', { name: /enviar pedido pelo whatsapp/i }));
    await usuario.click(
      screen.getByRole('button', { name: 'Continuar com este carrinho' }),
    );

    expect(screen.queryByText(/pedido encaminhado/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /enviar pedido pelo whatsapp/i }),
    ).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(CHAVE_CARRINHO)!).itens).toHaveLength(1);
  });

  it('sem dados completos direciona para a finalização', () => {
    window.localStorage.setItem(
      CHAVE_CARRINHO,
      JSON.stringify({ versao: 1, itens: itensDeTeste() }),
    );
    renderizarRevisao(DADOS_CLIENTE_VAZIOS);

    expect(
      screen.getByRole('heading', { name: 'Falta completar seus dados' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /enviar pedido pelo whatsapp/i }),
    ).not.toBeInTheDocument();
  });

  it('com carrinho vazio mostra estado vazio', () => {
    renderizarRevisao();
    expect(
      screen.getByRole('heading', { name: 'Seu carrinho está vazio' }),
    ).toBeInTheDocument();
  });
});
