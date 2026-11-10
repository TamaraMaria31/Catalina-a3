import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import { getFeaturedProducts } from "../../data/mockProducts";

export default function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-4xl">Destaques da semana</h2>
        <Link to="/produtos" className="text-[14px] text-catalina-sage underline underline-offset-4 hover:text-catalina-green">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
