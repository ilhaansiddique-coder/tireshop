import Link from "next/link";

const ALIGNMENT_STEPS = [
  "Visual inspection of tire wear and overall condition.",
  "Suspension adjustment to set wheel angles to manufacturer specifications.",
  "Steering alignment to ensure proper turning response and tracking.",
  "Camber adjustment to optimize tire contact with the road surface.",
];

const WHY_ALIGNMENT_MATTERS = [
  "Safety is the highest priority. Correct wheel angles improve stability and control during evasive maneuvers.",
  "Lower fuel consumption. Proper alignment reduces rolling resistance and carbon dioxide emissions.",
  "Longer tire life. Correct wheel angles reduce unnecessary and uneven wear.",
  "More comfortable driving. The vehicle tracks better and is less sensitive to ruts.",
  "Driver assistance systems work better when wheel angles are correctly set.",
  "If bolts are heavily rusted, an additional fee of SEK 200 may apply. Damage caused by rust is not our responsibility.",
];

export const metadata = {
  title: "Wheel Alignment",
};

export default function WheelAlignmentPage() {
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
              Wheel
              <br />
              <span style={{ color: "#F5C518" }}>Alignment.</span>
            </h1>

            <p className="font-body text-base-content/60 text-lg max-w-2xl leading-relaxed mb-8">
              Wheel alignment is the process of adjusting wheel angles to match vehicle manufacturer specifications.
              It helps improve safety, steering control, tire life, and fuel efficiency.
            </p>

            <Link
              href="/book-appointment"
              className="btn font-display tracking-widest uppercase text-sm px-8"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              Book Wheel Alignment
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
                Why Wheel Alignment
              </span>
            </div>

            <h2 className="heading-display text-4xl md:text-5xl mb-6">Why Wheel Alignment?</h2>

            <div className="space-y-5 text-base-content/70 font-body leading-relaxed">
              <p>
                Wheel alignment is the process of adjusting the angles of a vehicle&apos;s wheels so they are set to
                the manufacturer&apos;s specifications. This supports smooth, safe operation and can improve fuel
                efficiency.
              </p>
              <p>
                Vehicle tires do not wear evenly over time. Improper alignment can cause pulling while steering,
                unstable tracking, and excessive tire wear. Correct alignment helps maintain predictable handling.
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
              Four-Step Process
            </span>
          </div>

          <h2 className="heading-display text-4xl md:text-5xl mb-8">
            How We Perform
            <span style={{ color: "#F5C518" }}> Alignment</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALIGNMENT_STEPS.map((step, index) => (
              <div
                key={step}
                className="card bg-base-100 border border-base-300 hover:border-brand-yellow/60 transition-colors"
              >
                <div className="card-body p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-base-content/45 font-body">
                    Step {index + 1}
                  </p>
                  <p className="font-body text-sm text-base-content/75 mt-2">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Key Benefits
            </span>
          </div>

          <h2 className="heading-display text-4xl md:text-5xl mb-8">What You Gain From Correct Alignment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {WHY_ALIGNMENT_MATTERS.map((item, index) => (
              <div
                key={`${index}-${item}`}
                className="card border border-base-300 bg-base-100 hover:border-brand-yellow/60 transition-colors"
              >
                <div className="card-body p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-base-content/45 font-body">
                    {index + 1}
                  </p>
                  <p className="font-body text-sm text-base-content/75 mt-2">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-200 p-6 md:p-8">
            <h3 className="font-display text-2xl uppercase mb-3">Ready to book?</h3>
            <p className="font-body text-base-content/70 leading-relaxed mb-5">
              Keep your vehicle stable, efficient, and comfortable to drive with professional wheel alignment.
            </p>
            <Link
              href="/book-appointment"
              className="btn btn-sm font-display tracking-widest uppercase"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
