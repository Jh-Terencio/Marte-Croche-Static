import { useState, type FormEvent } from 'react';
import { useFinalizacao } from '../../context/FinalizacaoContext';
import { validarDadosCliente, UFS } from '../../lib/validacao';
import { mascaraTelefone, mascaraCep } from '../../lib/formatacao';
import { config } from '../../data/config';
import { CampoTexto } from './CampoTexto';
import { CampoSelect } from './CampoSelect';
import { Botao } from '../comuns/Botao';
import styles from './CheckoutForm.module.css';

interface CheckoutFormProps {
  onRevisar: () => void;
  onVoltarAoCarrinho: () => void;
}

/**
 * Formulário de finalização (Constituição §8, FR-026/027): os 11 campos,
 * validação por campo no envio, dados preservados no contexto de sessão —
 * um erro nunca apaga o que já foi digitado.
 */
export function CheckoutForm({ onRevisar, onVoltarAoCarrinho }: CheckoutFormProps) {
  const { dados, alterarDados } = useFinalizacao();
  const [erros, setErros] = useState<Record<string, string>>({});

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const resultado = validarDadosCliente(dados);
    setErros(resultado.erros);
    if (resultado.valido) onRevisar();
  }

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <p className={styles.legendaObrigatorios}>
        Campos marcados com <span aria-hidden="true">*</span>
        <span className="visualmente-oculto">asterisco</span> são obrigatórios.
      </p>

      <CampoTexto
        rotulo="Nome completo"
        valor={dados.nomeCompleto}
        onAlterar={(valor) => alterarDados({ nomeCompleto: valor })}
        obrigatorio
        erro={erros.nomeCompleto}
        autoComplete="name"
      />
      <CampoTexto
        rotulo="Telefone"
        valor={dados.telefone}
        onAlterar={(valor) => alterarDados({ telefone: valor })}
        obrigatorio
        erro={erros.telefone}
        mascara={mascaraTelefone}
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="(11) 91234-5678"
      />
      <CampoTexto
        rotulo="CEP"
        valor={dados.cep}
        onAlterar={(valor) => alterarDados({ cep: valor })}
        obrigatorio
        erro={erros.cep}
        mascara={mascaraCep}
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="01234-567"
      />
      <div className={styles.linhaDupla}>
        <CampoTexto
          rotulo="Endereço"
          valor={dados.endereco}
          onAlterar={(valor) => alterarDados({ endereco: valor })}
          obrigatorio
          erro={erros.endereco}
          autoComplete="address-line1"
        />
        <CampoTexto
          rotulo="Número"
          valor={dados.numero}
          onAlterar={(valor) => alterarDados({ numero: valor })}
          obrigatorio
          erro={erros.numero}
        />
      </div>
      <CampoTexto
        rotulo="Complemento"
        valor={dados.complemento}
        onAlterar={(valor) => alterarDados({ complemento: valor })}
        erro={erros.complemento}
        autoComplete="address-line2"
      />
      <CampoTexto
        rotulo="Bairro"
        valor={dados.bairro}
        onAlterar={(valor) => alterarDados({ bairro: valor })}
        obrigatorio
        erro={erros.bairro}
      />
      <div className={styles.linhaDupla}>
        <CampoTexto
          rotulo="Cidade"
          valor={dados.cidade}
          onAlterar={(valor) => alterarDados({ cidade: valor })}
          obrigatorio
          erro={erros.cidade}
          autoComplete="address-level2"
        />
        <CampoSelect
          rotulo="Estado"
          valor={dados.estado}
          onAlterar={(valor) => alterarDados({ estado: valor })}
          opcoes={UFS}
          obrigatorio
          erro={erros.estado}
          autoComplete="address-level1"
        />
      </div>
      <CampoTexto
        rotulo="Referência"
        valor={dados.referencia}
        onAlterar={(valor) => alterarDados({ referencia: valor })}
        erro={erros.referencia}
        placeholder="Ex.: portão azul, próximo à padaria"
      />
      <CampoTexto
        rotulo="Observações gerais"
        valor={dados.observacoesGerais}
        onAlterar={(valor) => alterarDados({ observacoesGerais: valor })}
        erro={erros.observacoesGerais}
        multilinha
        maxLength={config.limiteObservacoes}
      />

      <div className={styles.acoes}>
        <Botao type="submit">Revisar pedido</Botao>
        <Botao variante="secundario" onClick={onVoltarAoCarrinho}>
          Voltar ao carrinho
        </Botao>
      </div>
    </form>
  );
}
