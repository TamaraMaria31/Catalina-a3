import Hero from "../components/home/Hero";
import CategoryShowcase from "../components/home/CategoryShowcase";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoryRail from "../components/home/CategoryRail";
import PlannerBand from "../components/home/PlannerBand";
import usePageTitle from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle();

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <CategoryRail slug="madrinhas" title="Madrinhas e cortejo" subtitle="Vestidos para madrinhas, damas de honra e pajem." tone="sand" />
      <CategoryRail slug="joias" title="Joias e anéis" subtitle="Alianças, brincos e colares para o grande dia." />
      <CategoryRail slug="veus" title="Véus e tiaras" subtitle="O toque final do visual da noiva." tone="sand" />
      <PlannerBand />
    </>
  );
}
