import SearchPanel from "@/components/SearchPanel";
import CatalogSection from "@/components/CatalogSection";

export default function RimPage() {
  return (
    <>
      <section className="relative min-h-[55vh] flex flex-col justify-center overflow-hidden bg-base-100">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="8" fill="none" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle cx="100" cy="100" r="18" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line
                key={i}
                x1="100"
                y1="40"
                x2="100"
                y2="62"
                stroke="currentColor"
                strokeWidth="5"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-slide-up">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Rim Collection
              </span>
            </div>

            <h1
              className="heading-display text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-base-content mb-6 animate-slide-up anim-delay-1"
              style={{ animationFillMode: "both" }}
            >
              Find Premium
              <br />
              <span style={{ color: "#F5C518" }}>Rims.</span>
            </h1>

            <p
              className="font-body text-base-content/60 text-lg max-w-lg leading-relaxed animate-slide-up anim-delay-2"
              style={{ animationFillMode: "both" }}
            >
              Browse alloy and steel rims with live API data. Use the search panel to narrow results quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-base-200 border-y border-base-300 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <SearchPanel
            targetPath="/rim"
            panelTitle="Find Your Rim"
            primaryButtonLabel="Search Rims"
            browseHref="/rim"
            browseLabel="Or browse all rims ->"
          />
        </div>
      </section>

      <CatalogSection
        title="All Rims"
        subtitle="Rim catalog from API"
        typeId={2}
        noun="rims"
      />
    </>
  );
}