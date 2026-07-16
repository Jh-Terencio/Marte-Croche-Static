import { Link, Route, Routes } from 'react-router-dom';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { FinalizacaoProvider } from './context/FinalizacaoContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProdutoPage } from './pages/ProdutoPage';
import { CarrinhoPage } from './pages/CarrinhoPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { RevisaoPage } from './pages/RevisaoPage';
import { EstadoVazio } from './components/comuns/EstadoVazio';

/** Layout da aplicação: Header e Footer fixos em todas as rotas. */
function App() {
  return (
    <CarrinhoProvider>
      <FinalizacaoProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produto/:id" element={<ProdutoPage />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/finalizacao" element={<CheckoutPage />} />
            <Route path="/revisao" element={<RevisaoPage />} />
            <Route
              path="*"
              element={
                <EstadoVazio
                  titulo="Página não encontrada"
                  descricao="O endereço que você acessou não existe."
                  nivelTitulo={1}
                >
                  <Link to="/">Voltar ao início</Link>
                </EstadoVazio>
              }
            />
          </Routes>
        </main>
        <Footer />
      </FinalizacaoProvider>
    </CarrinhoProvider>
  );
}

export default App;
