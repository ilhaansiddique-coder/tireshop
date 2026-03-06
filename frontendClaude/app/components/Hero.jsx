"use client";
import { ChevronRight, Shield, Truck, Star, RotateCcw } from "lucide-react";

const TRUST_BADGES = [
  { Icon: Shield, label: "Verified Brands" },
  { Icon: Truck, label: "Fast Shipping" },
  { Icon: Star, label: "Top Rated" },
  { Icon: RotateCcw, label: "Easy Returns" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />
        <div className="hero-grid" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 pb-4 pt-14 sm:px-6">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-[2px] md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-yellow" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-yellow">
                Premium Selection Available
              </span>
            </div>

            <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-brand-text sm:text-6xl lg:text-7xl">
              Find Your
              <br />
              <span className="text-gradient">Perfect</span>
              <br />
              Tyre
            </h1>

            <p className="mb-8 mt-5 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              Browse trusted brands, compare test scores, and filter by size, season, and vehicle type in one smooth flow.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-yellow px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-amber"
              >
                Shop All Tyres
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="/book-appointment"
                className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-brand-text transition-colors hover:border-white/40"
              >
                Book Appointment
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-brand-yellow/10 p-6">
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-brand-yellow/30" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full border border-white/10" />
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Why drivers choose TireStore
              </p>
              <div className="grid gap-3">
                {[
                  { title: "2,000+", note: "Tyres in catalogue" },
                  { title: "A-G", note: "EU efficiency labels" },
                  { title: "24h", note: "Fast handling on in-stock items" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-black/35 px-4 py-3"
                  >
                    <p className="font-display text-3xl font-bold tracking-tight text-brand-yellow">
                      {item.title}
                    </p>
                    <p className="text-sm text-brand-muted">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 border-t border-brand-border pt-6">
          {TRUST_BADGES.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-brand-muted">
              <Icon className="h-4 w-4 text-brand-yellow" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
