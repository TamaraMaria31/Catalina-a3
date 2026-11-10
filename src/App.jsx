import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import PageLoader from "./components/PageLoader";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <a
              href="#conteudo"
              className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-catalina-green focus:px-4 focus:py-2 focus:text-white"
            >
              Pular para o conteúdo
            </a>
            <ScrollToTop />
            <Header />
            <main id="conteudo" tabIndex={-1} className="outline-none">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AppRoutes />
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
