import { Link, useSearchParams } from 'react-router-dom';
import { categorias } from '../data/categorias';
import { produtos } from '../data/produtos';
import { filtrarProdutos } from '../lib/busca';
// import { HeroCarousel } from '../components/home/HeroCarousel';
import { ProductGrid } from '../components/home/ProductGrid';
import { WhatsAppFloatButton } from '../components/home/WhatsAppFloatButton';
import { EstadoVazio } from '../components/comuns/EstadoVazio';
import styles from './HomePage.module.css';

/**
 * Página inicial (FR-003): carrossel de destaque + catálogo em cards,
 * com filtros por categoria (?categoria=, FR-006) e por busca
 * (?busca=, FR-025) — combináveis.
 */
export function HomePage() {
  const [parametros] = useSearchParams();
  const categoriaId = parametros.get('categoria');
  const termoDeBusca = parametros.get('busca') ?? '';
  const categoriaAtiva = categorias.find((c) => c.id === categoriaId);

  const daCategoria = categoriaId
    ? produtos.filter((produto) => produto.categoriaId === categoriaId)
    : produtos;
  const produtosVisiveis = filtrarProdutos(termoDeBusca, daCategoria, categorias);

  const titulo = termoDeBusca
    ? `Resultados para "${termoDeBusca}"`
    : (categoriaAtiva?.nome ?? 'Nossas peças');

  const filtroAtivo = Boolean(termoDeBusca || categoriaAtiva);

  return (
    <>
      <h1 className="visualmente-oculto">
        Marte Crochê — bolsas, alças e capinhas artesanais de crochê
      </h1>

      {/* <HeroCarousel /> */}

      <section className={styles.secaoProdutos} aria-labelledby="titulo-produtos">
        <div className={styles.cabecalhoSecao}>
          <h2 id="titulo-produtos">{titulo}</h2>
          <p className={styles.subtitulo}>
            Cada peça é única, feita à mão com fio premium e muito carinho.
          </p>
          {filtroAtivo && (
            <Link to="/" className={styles.verTodas}>
              Ver todas as peças
            </Link>
          )}
        </div>

        {produtosVisiveis.length === 0 ? (
          <EstadoVazio
            titulo={
              termoDeBusca
                ? 'Não encontramos nada com esse termo'
                : 'Nenhuma peça por aqui ainda'
            }
            descricao={
              termoDeBusca
                ? 'Tente buscar por outro nome, categoria ou palavra da descrição. Que tal dar uma olhada em todas as peças?'
                : 'Não encontramos produtos nesta categoria no momento. Que tal conhecer as outras peças da coleção?'
            }
          >
            <Link to="/">Ver todas as peças</Link>
          </EstadoVazio>
        ) : (
          <ProductGrid produtos={produtosVisiveis} />
        )}
      </section>

      <WhatsAppFloatButton />
    </>
  );
}
