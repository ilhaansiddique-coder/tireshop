import Hero from "./components/Hero";
import QuickFinder from "./components/QuickFinder";
import ProductsGrid from "./components/ProductsGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickFinder />

      <section id="products" className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-brand-text sm:text-4xl">
            All Tyres
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Use filters to narrow down by size, season, or features
          </p>
        </div>
        <ProductsGrid />
      </section>
    </>
  );
}
