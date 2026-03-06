import Link from "next/link";
import SearchPanel from "@/components/SearchPanel";

export const metadata = {
  title: "Däckcentrum — Premium Tyre Specialists Helsingborg",
};

const SERVICES = [
  {
    icon: "🏨",
    title: "Deck Hotel",
    desc: "Climate-controlled seasonal tyre storage — no garage clutter.",
    href: "/tyres?hotel=1",
  },
  {
    icon: "⚙️",
    title: "Wheel Alignment",
    desc: "Computerised precision alignment to extend tyre life and handling.",
    href: "/book?service=alignment",
  },
  {
    icon: "✨",
    title: "Rim Renovation",
    desc: "Professional refinishing — bring your wheels back to showroom condition.",
    href: "/book?service=rim",
  },
  {
    icon: "🔩",
    title: "Complete Wheels",
    desc: "Pre-assembled tyre and rim packages. Ready to fit, ready to drive.",
    href: "/tyres?type=complete",
  },
];

const STATS = [
  { value: "8,400+", label: "Tyre Models" },
  { value: "42",     label: "Premium Brands" },
  { value: "24h",    label: "Fast Delivery" },
  { value: "30y+",   label: "Experience" },
];

const BRANDS = [
  "Michelin", "Continental", "Pirelli", "Bridgestone",
  "Goodyear", "Nokian", "Dunlop", "Hankook",
  "Falken", "Toyo", "Yokohama", "Kumho",
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-base-100">
        {/* Background tire graphic */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="8" fill="none"/>
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="5" fill="none"/>
            <circle cx="100" cy="100" r="18" fill="currentColor"/>
            {[0,45,90,135,180,225,270,315].map((deg, i) => (
              <line key={i}
                x1="100" y1="40"
                x2="100" y2="62"
                stroke="currentColor" strokeWidth="5"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full py-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-slide-up">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Helsingborg&apos;s Premium Tyre Specialist
              </span>
            </div>

            {/* Headline */}
            <h1
              className="heading-display text-[clamp(3.5rem,8vw,7rem)] leading-none text-base-content mb-6 animate-slide-up anim-delay-1"
              style={{ animationFillMode: "both" }}
            >
              Drive with
              <br />
              <span style={{ color: "#F5C518" }}>Confidence.</span>
            </h1>

            {/* Sub */}
            <p
              className="font-body text-base-content/60 text-lg max-w-lg leading-relaxed mb-10 animate-slide-up anim-delay-2"
              style={{ animationFillMode: "both" }}
            >
              Thousands of premium tyres from the world&apos;s finest brands.
              Find your perfect fit by size, season, or vehicle.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-14 animate-slide-up anim-delay-3" style={{ animationFillMode: "both" }}>
              <Link href="/tyres">
                <button
                  className="btn btn-lg gap-2 font-display tracking-widest uppercase"
                  style={{ background: "#F5C518", color: "#000", border: "none" }}
                >
                  Shop All Tyres
                  <span>→</span>
                </button>
              </Link>
              <Link href="/book">
                <button className="btn btn-lg btn-outline font-display tracking-widest uppercase">
                  Book Fitting
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-base-content/40 animate-slide-up anim-delay-4"
              style={{ animationFillMode: "both" }}
            >
              {["✓ Verified Brands", "✓ Fast Delivery", "✓ Expert Fitting", "✓ Easy Returns"].map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH PANEL ── */}
      <section className="bg-base-200 border-y border-base-300 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <SearchPanel />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-base-100 border-b border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 px-6 text-center ${i < 3 ? "border-r border-base-300" : ""}`}
              >
                <p className="heading-display text-4xl md:text-5xl text-brand-yellow mb-1">
                  {stat.value}
                </p>
                <p className="text-xs font-body uppercase tracking-widest text-base-content/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">
                What We Offer
              </span>
            </div>
            <h2 className="heading-display text-4xl md:text-5xl">
              Full-Range <span style={{ color: "#F5C518" }}>Services</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((svc) => (
              <Link key={svc.title} href={svc.href}>
                <div className="card bg-base-200 border border-base-300 h-full card-hover group transition-all">
                  <div className="card-body p-5 gap-3">
                    <span className="text-3xl">{svc.icon}</span>
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide group-hover:text-brand-yellow transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-sm font-body text-base-content/60 leading-relaxed">
                      {svc.desc}
                    </p>
                    <p className="text-xs font-body mt-auto text-brand-yellow/60 group-hover:text-brand-yellow transition-colors">
                      Learn more →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="py-16 bg-base-200 border-y border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">
              Brands We Stock
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/tyres?brand=${brand.toLowerCase()}`}
                className="px-4 py-2 rounded-lg border border-base-300 bg-base-100 text-xs font-display font-bold uppercase tracking-widest text-base-content/60 hover:border-brand-yellow hover:text-brand-yellow transition-all"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOK CTA ── */}
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
                Choose your date, drop by our Helsingborg workshop, and our expert
                team will have you back on the road in no time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book">
                  <button
                    className="btn btn-lg font-display tracking-widest uppercase gap-2"
                    style={{ background: "#F5C518", color: "#000", border: "none" }}
                  >
                    Book Appointment
                    <span>→</span>
                  </button>
                </Link>
                <Link href="/tyres">
                  <button className="btn btn-lg btn-outline font-display tracking-widest uppercase">
                    Browse Tyres
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer footer-center p-6 bg-base-200 border-t border-base-300 text-base-content/40 font-body text-xs">
        <p>
          © {new Date().getFullYear()} Däckcentrum Helsingborg · All prices include VAT ·{" "}
          <Link href="/terms" className="hover:text-brand-yellow transition-colors">
            Terms
          </Link>
        </p>
      </footer>
    </>
  );
}
