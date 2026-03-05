import Link from "next/link";

export default function NavLanding({ title, subtitle, ctaLabel = "Go to Deck", ctaHref = "/" }) {
  return (
    <section className="mx-auto flex min-h-[55vh] w-full max-w-[1400px] items-center px-4 py-20 sm:px-6">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-yellow">
          TireStore
        </p>
        <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-wide text-brand-text sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-base text-brand-muted sm:text-lg">{subtitle}</p>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex rounded-lg bg-brand-yellow px-5 py-3 text-sm font-bold uppercase tracking-wide text-brand-dark hover:bg-brand-amber"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
