import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import { CATEGORIES, getProductsByCategory } from "../../data/mockProducts";

/** Faixa da home com alguns produtos de uma categoria. */
export default function CategoryRail({ slug, title, subtitle, tone = "light", count = 4 }) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  const products = getProductsByCategory(slug).slice(0, count);
  if (!category || products.length === 0) return null;

  return (
    <section className={tone === "sand" ? "bg-catalina-sand/60" : ""}>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 text-[14px] text-catalina-muted">{subtitle}</p>}
          </div>
          <Link
            to={`/produtos/${slug}`}
            className="flex-shrink-0 text-[14px] text-catalina-sage underline underline-offset-4 hover:text-catalina-green"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
