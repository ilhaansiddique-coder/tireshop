import Link from "next/link";

const BENEFITS = [
  "Tires last longer with proper storage",
  "You get instant feedback on the condition of your tires",
  "We can wash your tires so they are clean and fresh before installation",
  "You do not have to carry dirty wheels or dirty your car",
  "Fast and easy",
];

const PACKAGES = [
  {
    name: "Economy",
    details: "Shifting and storage",
  },
  {
    name: "Standard",
    details: "Shift, storage with wheel wash",
    featured: true,
  },
  {
    name: "Luxury",
    details: "Shifting, storage, wheel washing and balancing",
  },
];

export const metadata = {
  title: "Deck Hotel",
};

export default function DeckHotelPage() {
  return (
    <>
      <section className="relative min-h-[56vh] flex flex-col justify-center overflow-hidden bg-base-100 border-b border-base-300">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.05] pointer-events-none">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Tire Center
              </span>
            </div>

            <h1 className="heading-display text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-base-content mb-4">
              Deck Hotel
              <br />
              <span style={{ color: "#F5C518" }}>Helsingborg.</span>
            </h1>

            <p className="font-body text-base-content/60 text-lg max-w-2xl leading-relaxed mb-8">
              Professional seasonal wheel storage with condition checks, cleaning, and balancing. Keep your wheel
              sets protected and ready before every tire change.
            </p>

            <Link
              href="/book-appointment"
              className="btn font-display tracking-widest uppercase text-sm px-8"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              Click Here For A Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Before Changing Tires
              </span>
            </div>

            <h2 className="heading-display text-4xl md:text-5xl mb-6">Store Tires The Right Way</h2>

            <div className="space-y-5 text-base-content/70 font-body leading-relaxed">
              <p>
                There are many things to consider when looking after your tires correctly. Storing tires in the best
                possible way helps prevent the rubber from drying out and cracking. Tires should be stored indoors in
                a cool, dry place to extend service life.
              </p>
              <p>
                Prepare the storage area with moisture protection and avoid leaving tires directly on dirty or damp
                surfaces. Taking the time to store them correctly protects your investment and reduces avoidable damage.
              </p>
              <p>
                Clean wheel bolts, add a little extra air pressure to preserve tire shape, wash the tire before
                storage, and label each wheel position clearly so reinstallation is easier in the next season.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200 border-y border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Why Store With Us
            </span>
          </div>

          <h2 className="heading-display text-4xl md:text-5xl mb-8">
            Less Worry,
            <span style={{ color: "#F5C518" }}> More Control</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {BENEFITS.map((item) => (
              <div
                key={item}
                className="card bg-base-100 border border-base-300 hover:border-brand-yellow/60 transition-colors"
              >
                <div className="card-body p-5">
                  <p className="font-body text-sm text-base-content/70">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8">
            <h3 className="font-display text-2xl uppercase mb-3">Less worries</h3>
            <p className="font-body text-base-content/70 leading-relaxed">
              With a tire hotel package, you save time on changeovers and storage while improving tire lifespan with
              proper handling. We can also balance your tires to reduce wear and improve comfort.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Three-Step Packages
            </span>
          </div>

          <h2 className="heading-display text-4xl md:text-5xl mb-8">Choose Your Service Level</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`card border ${
                  pkg.featured ? "border-brand-yellow bg-base-200" : "border-base-300 bg-base-100"
                }`}
              >
                <div className="card-body p-6">
                  {pkg.featured && (
                    <span className="badge badge-sm font-body mb-3" style={{ background: "#F5C518", color: "#000" }}>
                      Most Popular
                    </span>
                  )}
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/45 font-body">{pkg.name}</p>
                  <p className="font-body text-base-content/80 mt-3">{pkg.details}</p>
                  <div className="mt-6">
                    <Link
                      href="/book-appointment"
                      className="btn btn-sm font-display tracking-widest uppercase"
                      style={{ background: "#F5C518", color: "#000", border: "none" }}
                    >
                      Select
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm font-body text-base-content/55">
            Need help choosing?{" "}
            <Link href="/contact" className="text-brand-yellow hover:underline underline-offset-2">
              Contact us
            </Link>{" "}
            and we will recommend the right package.
          </p>
        </div>
      </section>
    </>
  );
}
