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
    <section className="relative pt-20 pb-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-yellow/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-yellow/3 blur-3xl" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f5c518 1px, transparent 1px), linear-gradient(to bottom, #f5c518 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-16 pb-4">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-pulse" />
            <span className="text-xs font-semibold text-brand-yellow tracking-wider uppercase">
              Premium Selection Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-900 text-5xl sm:text-6xl lg:text-7xl uppercase leading-none tracking-tight text-brand-text mb-4">
            FIND YOUR
            <br />
            <span className="text-gradient">PERFECT</span>
            <br />
            TYRE
          </h1>

          <p className="text-brand-muted text-base sm:text-lg max-w-lg leading-relaxed mb-8">
            Browse thousands of tyres from top brands. Filter by size, season, and performance rating to find exactly what your vehicle needs.
          </p>

          <a
            href="#products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide"
          >
            Shop All Tyres
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-brand-border">
          {TRUST_BADGES.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-brand-muted">
              <Icon className="w-4 h-4 text-brand-yellow" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
