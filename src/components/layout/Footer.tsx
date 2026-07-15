import { Link } from 'react-router-dom';
import { categorias } from '../../data/categorias';
import { config } from '../../data/config';
import styles from './Footer.module.css';

/** Footer da loja (FR-036) — inclui a seção de contato ancorada pelo menu. */
export function Footer() {
  const anoAtual = new Date().getFullYear();
  const linkWhatsApp = `https://wa.me/${config.numeroWhatsApp}`;

  return (
    <footer className={styles.footer}>
      <div className={styles.conteudo}>
        <div className={styles.colunas}>
          <div className={styles.marca}>
            <p className={styles.nome}>
              Marte <em>Crochê</em>
            </p>
            <p className={styles.frase}>{config.fraseMarca}</p>
            <p className={styles.encomendas}>
              Todas as peças são feitas sob encomenda, uma a uma. O prazo de
              confecção aparece em cada produto e começa a contar após a
              confirmação do pedido pelo WhatsApp.
            </p>
          </div>

          <nav aria-label="Categorias">
            <h2 className={styles.titulo}>Categorias</h2>
            <ul className={styles.lista}>
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <Link to={`/?categoria=${categoria.id}`}>{categoria.nome}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section id="contato" aria-label="Contato">
            <h2 className={styles.titulo}>Contato</h2>
            <ul className={styles.lista}>
              <li>
                <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={config.linkInstagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </section>
        </div>

        <p className={styles.direitos}>
          © {anoAtual} Marte Crochê. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
