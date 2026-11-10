import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/mockProducts";

const COLUMNS = [
  {
    title: "Loja",
    links: CATEGORIES.map((c) => ({ label: c.label, to: `/produtos/${c.slug}` })),
  },
  {
    title: "Planeje",
    links: [
      { label: "Lista de casamento", to: "/lista-de-casamento" },
      { label: "Planejador de orçamento", to: "/planejador" },
      { label: "Meus favoritos", to: "/favoritos" },
    ],
  },
  {
    title: "Sua conta",
    links: [
      { label: "Entrar", to: "/login" },
      { label: "Criar conta", to: "/cadastro" },
      { label: "Minha conta", to: "/minha-conta" },
      { label: "Carrinho", to: "/carrinho" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-catalina-forest text-catalina-onDark">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-[0.18em]">CATALINA</p>
          <p className="-mt-1 text-[10px] tracking-[0.4em] text-catalina-onDarkMuted">MARRIAGE</p>
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-catalina-onDarkMuted">
            Tudo para o seu grande dia, em um só lugar.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-4 text-[22px]">{column.title}</h2>
            <ul className="space-y-2.5 text-[14px] text-catalina-onDarkMuted">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-catalina-leaf">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-catalina-leaf/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-[12px] text-catalina-onDarkMuted sm:flex-row">
          <p>© {new Date().getFullYear()} Catalina Marriage. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-catalina-leaf">Política de privacidade</a>
            <a href="#" className="hover:text-catalina-leaf">Trocas e devoluções</a>
            <Link to="/admin" className="hover:text-catalina-leaf">Administração</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
