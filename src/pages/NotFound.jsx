import { Link } from "react-router-dom";
import { Flower2 } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Página não encontrada");
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5  bg-catalina-cream text-catalina-text">
      <Flower2 size={56} strokeWidth={1.25} className="text-catalina-sage mb-4" />
      <h1 className="text-[24px] mb-2">Página não encontrada</h1>
      <p className="text-[14px] text-catalina-muted mb-6">O endereço que você tentou acessar não existe.</p>
      <Link to="/" className="bg-catalina-green text-white text-[13px] tracking-wide px-6 py-3 rounded-sm hover:bg-catalina-greenDark transition-colors">
        VOLTAR À HOME
      </Link>
    </div>
  );
}
