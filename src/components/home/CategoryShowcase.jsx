import { Link } from "react-router-dom";
import LetterButton from "../ui/LetterButton";
import ArchImage from "../ui/ArchImage";
import { CATEGORIES } from "../../data/mockProducts";

export default function CategoryShowcase() {
  return (
    <section className="bg-catalina-forest text-catalina-onDark">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-lg text-4xl leading-[1.1] sm:text-5xl">Tudo o que você precisa para o grande dia</h2>
            <p className="mt-3 max-w-md text-[15px] text-catalina-onDarkMuted">
              Do vestido às lembrancinhas, escolha por categoria.
            </p>
          </div>
          <LetterButton to="/produtos" label="VER LOJA" hoverLabel="CATALINA" className="self-start md:self-auto" />
        </div>

        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.filter((c) => !c.hideOnHome).map((category) => (
            <li key={category.slug}>
              <Link to={`/produtos/${category.slug}`} className="group block">
                <ArchImage src={category.image} alt="" />
                <h3 className="mt-4 text-[22px] leading-tight transition-colors group-hover:text-catalina-leaf">
                  {category.label}
                </h3>
                <p className="text-[13px] text-catalina-onDarkMuted">{category.sub}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
