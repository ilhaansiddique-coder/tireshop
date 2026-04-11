import Link from "next/link";
import SearchPanel from "@/components/SearchPanel";

export const metadata = {
  title: "Dackcentrum - Premium Tyre Specialists Helsingborg",
};

const STATS = [
  { value: "8,400+", label: "Tyre Models" },
  { value: "42", label: "Premium Brands" },
  { value: "24h", label: "Fast Delivery" },
  { value: "30y+", label: "Experience" },
];

const CATEGORIES = [
  {
    title: "Tyres",
    desc: "Summer, winter and all-season tyres from the world's top brands.",
    href: "/tyres",
    icon: (
      <svg viewBox="0 0 80 80" className="w-12 h-12" fill="currentColor">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="none" />
        <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="40" cy="40" r="5" />
      </svg>
    ),
  },
  {
    title: "Rims",
    desc: "Alloy and steel rims in all sizes and bolt patterns.",
    href: "/rim",
    icon: (
      <svg viewBox="0 0 80 80" className="w-12 h-12" fill="currentColor">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="none" />
        <circle cx="40" cy="40" r="8" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <line key={deg} x1="40" y1="12" x2="40" y2="28" stroke="currentColor" strokeWidth="4" transform={`rotate(${deg} 40 40)`} />
        ))}
      </svg>
    ),
  },
  {
    title: "Complete Wheels",
    desc: "Tyre + rim packages ready for fitting. One click, done.",
    href: "/complete-wheels",
    icon: (
      <svg viewBox="0 0 80 80" className="w-12 h-12" fill="currentColor">
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="none" />
        <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="40" cy="40" r="4" />
      </svg>
    ),
  },
  {
    title: "Deck Hotel",
    desc: "Professional seasonal wheel storage with condition checks.",
    href: "/deck-hotel",
    icon: (
      <svg viewBox="0 0 80 80" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="4">
        <rect x="12" y="20" width="56" height="44" rx="4" />
        <line x1="12" y1="36" x2="68" y2="36" />
        <circle cx="30" cy="52" r="6" fill="currentColor" />
        <circle cx="50" cy="52" r="6" fill="currentColor" />
      </svg>
    ),
  },
];

const BRANDS = [
  "Michelin", "Continental", "Pirelli", "Bridgestone", "Goodyear",
  "Nokian", "Dunlop", "Hankook", "Falken", "Toyo", "Yokohama", "Kumho",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col justify-center overflow-hidden bg-base-100">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="8" fill="none" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle cx="100" cy="100" r="18" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line key={i} x1="100" y1="40" x2="100" y2="62" stroke="currentColor" strokeWidth="5" transform={`rotate(${deg} 100 100)`} />
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

            <div className="flex flex-wrap gap-3 animate-slide-up anim-delay-3" style={{ animationFillMode: "both" }}>
              <Link href="/tyres">
                <button className="btn btn-lg font-display tracking-widest uppercase gap-2" style={{ background: "#F5C518", color: "#000", border: "none" }}>
                  Browse Tyres <span>-&gt;</span>
                </button>
              </Link>
              <Link href="/book">
                <button className="btn btn-lg btn-outline font-display tracking-widest uppercase border-base-content/20 text-base-content hover:bg-base-200 hover:border-brand-yellow">
                  Book Fitting
                </button>
              </Link>
            </div>

            <div
              className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-base-content/40 mt-8 animate-slide-up anim-delay-4"
              style={{ animationFillMode: "both" }}
            >
              {["Verified Brands", "Fast Delivery", "Expert Fitting", "Easy Returns"].map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Panel */}
      <section className="bg-base-200 border-y border-base-300 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <SearchPanel targetPath="/tyres" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-base-100 border-b border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="heading-display text-4xl md:text-5xl text-brand-yellow">{stat.value}</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-base-content/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Shop By Category</span>
          </div>
          <h2 className="heading-display text-4xl md:text-5xl mb-8">
            Find What You <span className="text-brand-yellow">Need</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.href} href={cat.href}>
                <div className="card bg-base-200 border border-base-300 hover:border-brand-yellow/60 transition-all duration-300 group h-full">
                  <div className="card-body p-6 gap-4">
                    <div className="text-base-content/20 group-hover:text-brand-yellow/60 transition-colors">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold uppercase group-hover:text-brand-yellow transition-colors">
                        {cat.title}
                      </h3>
                      <p className="font-body text-sm text-base-content/50 mt-1">{cat.desc}</p>
                    </div>
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                      Browse -&gt;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-base-200 border-y border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14">
          <div className="text-center mb-8">
            <h2 className="heading-display text-3xl md:text-4xl">Trusted <span className="text-brand-yellow">Brands</span></h2>
            <p className="font-body text-base-content/50 mt-2">We carry the world&apos;s leading tyre manufacturers</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {BRANDS.map((brand) => (
              <span key={brand} className="font-display text-sm uppercase tracking-widest text-base-content/30 hover:text-brand-yellow transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-base-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-base-200/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ background: "#F5C518" }} />
                <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">Ready to Ride?</span>
              </div>
              <h2 className="heading-display text-4xl md:text-5xl mb-4">
                Book your fitting<br /><span style={{ color: "#F5C518" }}>appointment online</span>
              </h2>
              <p className="font-body text-base-content/60 text-base leading-relaxed mb-8 max-w-md">
                Choose your date, drop by our Helsingborg workshop, and our expert team will have you back on the road in no time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book">
                  <button className="btn btn-lg font-display tracking-widest uppercase gap-2" style={{ background: "#F5C518", color: "#000", border: "none" }}>
                    Book Appointment <span>-&gt;</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 border-t border-base-300 text-base-content/40 font-body text-xs">
        <p>
          &copy; {new Date().getFullYear()} Dackcentrum Helsingborg - All prices excl. VAT unless stated -{" "}
          <Link href="/terms" className="hover:text-brand-yellow transition-colors">Terms</Link>
          {" "}-{" "}
          <Link href="/contact" className="hover:text-brand-yellow transition-colors">Contact</Link>
        </p>
      </footer>
    </>
  );
}
