import { Component } from "react";

/** Captura erros de renderização e mostra uma mensagem em vez de uma tela em branco. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Erro na página:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="mb-2 text-[34px]">Algo deu errado</h1>
        <p className="mb-6 max-w-sm text-[14px] text-catalina-muted">
          Não foi possível mostrar esta página. Recarregue para tentar de novo.
        </p>
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="rounded-full bg-catalina-green px-7 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-catalina-greenDark"
        >
          Voltar para a home
        </button>
      </div>
    );
  }
}
