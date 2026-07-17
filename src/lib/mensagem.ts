import type { ItemCarrinho } from '../types/carrinho';
import type { DadosCliente } from '../types/cliente';
import type { ConfiguracaoLoja } from '../data/config';
import { formatarReais, mascaraTelefone, mascaraCep, mascaraCpf } from './formatacao';
import { subtotal, totalPedido } from './preco';

function linhasDoItem(item: ItemCarrinho, numero: number): string {
  const linhas: string[] = [
    `${numero}. *${item.nomeProduto}*`,
    `Categoria: ${item.categoriaNome}`,
  ];

  if (item.corPrincipal && item.corSecundaria) {
    linhas.push(`Cor principal (Cor da Alça): ${item.corPrincipal.nome}`);
    linhas.push(`Segunda cor: ${item.corSecundaria.nome}`);
  } else if (item.corPrincipal) {
    linhas.push(`Cor: ${item.corPrincipal.nome}`);
  }

  for (const adicional of item.adicionais) {
    linhas.push(`Adicional: ${adicional.nomeAdicional}`);
    for (const opcao of adicional.opcoes) {
      linhas.push(`${opcao.nomeOpcao}: ${opcao.valorNome}`);
    }
  }

  linhas.push(`Quantidade: ${item.quantidade}`);
  linhas.push(`Valor unitário: ${formatarReais(item.precoUnitarioCentavos)}`);
  linhas.push(
    `Subtotal: ${formatarReais(subtotal(item.precoUnitarioCentavos, item.quantidade))}`,
  );

  if (item.observacoes.trim()) {
    linhas.push(`Observações: ${item.observacoes.trim()}`);
  }

  return linhas.join('\n');
}

/** Texto completo da mensagem — NÃO codificado (a prévia mostra isto). */
export function montarMensagem(
  itens: ItemCarrinho[],
  dados: DadosCliente,
  _config: ConfiguracaoLoja,
): string {
  const linhasDeEndereco = [
    `Endereço: ${dados.endereco.trim()}, ${dados.numero.trim()}`,
  ];
  if (dados.complemento.trim()) {
    linhasDeEndereco.push(`Complemento: ${dados.complemento.trim()}`);
  }
  linhasDeEndereco.push(`Bairro: ${dados.bairro.trim()}`);
  linhasDeEndereco.push(`Cidade/Estado: ${dados.cidade.trim()} - ${dados.estado}`);
  linhasDeEndereco.push(`CEP: ${mascaraCep(dados.cep)}`);
  if (dados.referencia.trim()) {
    linhasDeEndereco.push(`Referência: ${dados.referencia.trim()}`);
  }

  const blocos = [
    '*PEDIDO — Marte Crochê*',
    'Olá! Gostaria de fazer uma encomenda.',
    '*ITENS DO PEDIDO*',
    ...itens.map((item, indice) => linhasDoItem(item, indice + 1)),
    `*TOTAL DO PEDIDO: ${formatarReais(totalPedido(itens))}*`,
    '*DADOS DO CLIENTE*',
    `Nome: ${dados.nomeCompleto.trim()}\nE-mail: ${dados.email.trim()}\nCPF: ${mascaraCpf(dados.cpf)}\nTelefone: ${mascaraTelefone(dados.telefone)}`,
    '*ENDEREÇO*',
    linhasDeEndereco.join('\n'),
  ];

  if (dados.observacoesGerais.trim()) {
    blocos.push(`Observações gerais: ${dados.observacoesGerais.trim()}`);
  }

  return blocos.join('\n\n');
}

/** URL compatível com WhatsApp Web e aplicativo móvel (FR-034). */
export function montarUrlWhatsApp(mensagem: string, config: ConfiguracaoLoja): string {
  return `https://wa.me/${config.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
}
