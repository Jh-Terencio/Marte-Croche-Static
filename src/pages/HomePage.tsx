import { Link, useSearchParams } from 'react-router-dom';
import { categorias } from '../data/categorias';
import { produtos } from '../data/produtos';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { ProductGrid } from '../components/home/ProductGrid';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import styles from './HomePage.module.css';

/**
 * Página inicial (FR-003): carrossel de destaque + catálogo em cards,
 * com filtro por categoria via ?categoria= (FR-006).
 */
export function HomePage() {
  const [parametros] = useSearchParams();
  const categoriaId = parametros.get('categoria');
  const categoriaAtiva = categorias.find((c) => c.id === categoriaId);

  const produtosVisiveis = categoriaId
    ? produtos.filter((produto) => produto.categoriaId === categoriaId)
    : produtos;

  return (
    <>
      <h1 className="visualmente-oculto">
        Marte Crochê — bolsas, alças e capinhas artesanais de crochê
      </h1>

      <HeroCarousel />

      <section className={styles.secaoProdutos} aria-labelledby="titulo-produtos">
        <div className={styles.cabecalhoSecao}>
          <h2 id="titulo-produtos">
            {categoriaAtiva ? categoriaAtiva.nome : 'Nossas peças'}
          </h2>
          <p className={styles.subtitulo}>
            Cada peça é única, feita à mão com fio premium e muito carinho.
          </p>
          {categoriaAtiva && (
            <Link to="/" className={styles.verTodas}>
              Ver todas as peças
            </Link>
          )}
        </div>

        {produtosVisiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma peça por aqui ainda"
            descricao="Não encontramos produtos nesta categoria no momento. Que tal conhecer as outras peças da coleção?"
          >
            <Link to="/">Ver todas as peças</Link>
          </EstadoVazio>
        ) : (
          <ProductGrid produtos={produtosVisiveis} />
        )}
      </section>
    </>
  );
}
