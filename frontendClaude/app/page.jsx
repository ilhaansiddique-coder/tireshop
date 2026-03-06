import Link from "next/link";
import SearchPanel from "@/components/SearchPanel";
import CatalogSection from "@/components/CatalogSection";

export const metadata = {
  title: "Dackcentrum - Premium Tyre Specialists Helsingborg",
};

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-base-100">
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

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 animate-slide-up">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Helsingborg&apos;s Premium Tyre Specialist
              </span>
            </div>

            <h1
              className="heading-display text-[clamp(3.5rem,8vw,7rem)] leading-none text-base-content mb-6 animate-slide-up anim-delay-1"
              style={{ animationFillMode: "both" }}
            >
              Drive with
              <br />
              <span style={{ color: "#F5C518" }}>Confidence.</span>
            </h1>

            <p
              className="font-body text-base-content/60 text-lg max-w-lg leading-relaxed mb-10 animate-slide-up anim-delay-2"
              style={{ animationFillMode: "both" }}
            >
              Thousands of premium tyres from the world&apos;s finest brands. Find your perfect fit by size,
              season, or vehicle.
            </p>

            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-base-content/40 animate-slide-up anim-delay-4"
              style={{ animationFillMode: "both" }}
            >
              {["Verified Brands", "Fast Delivery", "Expert Fitting", "Easy Returns"].map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200 border-y border-base-300 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <SearchPanel />
        </div>
      </section>

      <CatalogSection
        title="All Tyres"
        subtitle="Use the search panel above to filter by size, season, or vehicle."
        typeId={1}
        noun="tyres"
      />

      <section className="py-20 bg-base-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-base-200/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: "#F5C518" }} />
                <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">
                  Ready to Ride?
                </span>
              </div>
              <h2 className="heading-display text-4xl md:text-5xl mb-4">
                Book your fitting
                <br />
                <span style={{ color: "#F5C518" }}>appointment online</span>
              </h2>
              <p className="font-body text-base-content/60 text-base leading-relaxed mb-8 max-w-md">
                Choose your date, drop by our Helsingborg workshop, and our expert team will have you back on the
                road in no time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book">
                  <button
                    className="btn btn-lg font-display tracking-widest uppercase gap-2"
                    style={{ background: "#F5C518", color: "#000", border: "none" }}
                  >
                    Book Appointment
                    <span>-&gt;</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer footer-center p-6 bg-base-200 border-t border-base-300 text-base-content/40 font-body text-xs">
        <p>
          &copy; {new Date().getFullYear()} Dackcentrum Helsingborg - All prices include VAT -{" "}
          <Link href="/terms" className="hover:text-brand-yellow transition-colors">
            Terms
          </Link>
        </p>
      </footer>
    </>
  );
}