"use client";
import { useMemo, useState } from "react";
import {
  Search,
  CarFront,
  Star,
  SlidersHorizontal,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useFilterStore } from "../store";

const TYRE_TYPES = [
  { value: "1", label: "Summer" },
  { value: "2", label: "All Season" },
  { value: "3", label: "Winter" },
];

const QUALITY_LEVELS = [
  { id: "premium", label: "Premium", score: 4 },
  { id: "medium", label: "Medium", score: 3 },
  { id: "budget", label: "Budget", score: 0 },
];

const VEHICLE_TYPES = [
  { value: "alla", label: "All types of vehicles" },
  { value: "personbil", label: "Passenger car" },
  { value: "suv", label: "SUV / Crossover" },
  { value: "transport", label: "Van / Transport" },
];

function qualityFromScore(score) {
  if (score >= 4) return "premium";
  if (score >= 3) return "medium";
  return "budget";
}

export default function QuickFinder() {
  const { filters, setFilter } = useFilterStore();
  const [showMore, setShowMore] = useState(false);

  const selectedQuality = useMemo(
    () => qualityFromScore(Number(filters.minimumTestScore) || 0),
    [filters.minimumTestScore]
  );

  const runSearch = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-12 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e14]/95 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(245,197,24,0.2),transparent_50%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-brand-yellow/90">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Quick Finder</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Search Dimension / License Plate Number
              </p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilter("query", e.target.value)}
                  placeholder="e.g. 235/45R18 or ABC123"
                  className="w-full rounded-xl border border-brand-border bg-brand-card py-3 pl-10 pr-3 text-sm text-brand-text placeholder-brand-muted transition-colors focus:border-brand-yellow"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Tyre Type
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TYRE_TYPES.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter("tyreType", item.value)}
                    className={`rounded-xl border px-2 py-3 text-xs font-semibold uppercase tracking-wide transition-all ${
                      filters.tyreType === item.value
                        ? "border-brand-yellow bg-brand-yellow text-brand-dark"
                        : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-yellow/40 hover:text-brand-text"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Quality
              </p>
              <div className="grid grid-cols-3 gap-2">
                {QUALITY_LEVELS.map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-3 text-xs font-medium transition-colors ${
                      selectedQuality === item.id
                        ? "border-brand-yellow bg-brand-yellow/10 text-brand-text"
                        : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-yellow/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuality === item.id}
                      onChange={() => setFilter("minimumTestScore", item.score)}
                      className="h-3.5 w-3.5"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Brand
              </p>
              <input
                type="text"
                value={filters.brand}
                onChange={(e) => setFilter("brand", e.target.value)}
                placeholder="Any brand"
                className="w-full rounded-xl border border-brand-border bg-brand-card px-3 py-3 text-sm text-brand-text placeholder-brand-muted transition-colors focus:border-brand-yellow"
              />
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                Vehicle Type
              </p>
              <div className="relative">
                <CarFront className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
                <select
                  value={filters.vehicleType}
                  onChange={(e) => setFilter("vehicleType", e.target.value)}
                  className="w-full rounded-xl border border-brand-border bg-brand-card py-3 pl-10 pr-8 text-sm text-brand-text"
                >
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={runSearch}
              className="h-[46px] self-end rounded-xl bg-brand-yellow px-6 text-sm font-bold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-amber"
            >
              Search
            </button>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="inline-flex items-center gap-2 text-xs font-medium text-brand-muted transition-colors hover:text-brand-yellow"
            >
              {showMore ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
              {showMore ? "Hide extra filters" : "Show more filters"}
            </button>

            {showMore && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { key: "isRunflat", label: "Runflat" },
                  { key: "isElectricVehicle", label: "Electric Vehicle" },
                  { key: "isSilence", label: "Low Noise" },
                  { key: "isStaggeredFitment", label: "Staggered Fitment" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-muted transition-colors hover:border-brand-yellow/40 hover:text-brand-text"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(filters[key])}
                      onChange={(e) => setFilter(key, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-brand-muted">
            <span className="rounded-full border border-white/10 px-2.5 py-1">
              Test result: {Number(filters.minimumTestScore) || 0}+
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">
              Season: {TYRE_TYPES.find((item) => item.value === filters.tyreType)?.label}
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-1">
              Vehicle: {VEHICLE_TYPES.find((item) => item.value === filters.vehicleType)?.label}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= (Number(filters.minimumTestScore) || 0)
                      ? "fill-brand-yellow text-brand-yellow"
                      : "text-brand-border"
                  }`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
