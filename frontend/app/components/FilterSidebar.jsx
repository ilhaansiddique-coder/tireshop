"use client";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useFilterStore } from "../store";

const DIAMETERS = ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const WIDTHS = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305"];
const ASPECT_RATIOS = ["25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75"];
const SPEED_INDEXES = ["H", "V", "W", "Y", "Z", "T", "S", "Q"];
const TYRE_TYPES = [
  { value: "1", label: "Summer" },
  { value: "2", label: "All Season" },
  { value: "3", label: "Winter" },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-brand-text uppercase tracking-wider hover:text-brand-yellow transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ isOpen, onClose, isMobile }) {
  const { filters, setFilter, setFilters, resetFilters } = useFilterStore();

  const activeCount = [
    filters.diameter,
    filters.width,
    filters.aspectRatio,
    filters.speedIndex,
    filters.isRunflat,
    filters.isElectricVehicle,
    filters.isSilence,
  ].filter(Boolean).length;

  const Wrapper = isMobile
    ? ({ children }) => (
        <div
          className={`fixed inset-0 z-50 flex ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={onClose}
          />
          <div
            className={`relative w-[300px] h-full bg-brand-surface overflow-y-auto transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
              <span className="font-display text-xl font-bold tracking-wide uppercase">Filters</span>
              <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )
    : ({ children }) => (
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24 bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-yellow" />
                <span className="font-display text-lg font-bold tracking-wide uppercase">Filters</span>
                {activeCount > 0 && (
                  <span className="w-5 h-5 bg-brand-yellow text-brand-dark text-xs font-bold rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </div>
              {activeCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-yellow transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
            {children}
          </div>
        </aside>
      );

  const content = (
    <div className="px-5">
      {/* Tyre Type */}
      <FilterSection title="Tyre Season">
        <div className="flex flex-col gap-2">
          {TYRE_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="tyreType"
                value={t.value}
                checked={filters.tyreType === t.value}
                onChange={() => setFilter("tyreType", t.value)}
                className="w-4 h-4"
                style={{ accentColor: "var(--brand-yellow)" }}
              />
              <span className="text-sm text-brand-muted group-hover:text-brand-text transition-colors">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Diameter */}
      <FilterSection title="Rim Diameter (inch)">
        <div className="grid grid-cols-4 gap-1.5">
          {DIAMETERS.map((d) => (
            <button
              key={d}
              onClick={() => setFilter("diameter", filters.diameter === d ? "" : d)}
              className={`py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                filters.diameter === d
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50 hover:text-brand-text"
              }`}
            >
              {d}"
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Width */}
      <FilterSection title="Tyre Width (mm)">
        <div className="grid grid-cols-3 gap-1.5">
          {WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setFilter("width", filters.width === w ? "" : w)}
              className={`py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                filters.width === w
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50 hover:text-brand-text"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Aspect Ratio */}
      <FilterSection title="Aspect Ratio" defaultOpen={false}>
        <div className="grid grid-cols-4 gap-1.5">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r}
              onClick={() => setFilter("aspectRatio", filters.aspectRatio === r ? "" : r)}
              className={`py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                filters.aspectRatio === r
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50 hover:text-brand-text"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Speed Index */}
      <FilterSection title="Speed Rating" defaultOpen={false}>
        <div className="grid grid-cols-4 gap-1.5">
          {SPEED_INDEXES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter("speedIndex", filters.speedIndex === s ? "" : s)}
              className={`py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                filters.speedIndex === s
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50 hover:text-brand-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Special Features */}
      <FilterSection title="Special Features" defaultOpen={false}>
        <div className="flex flex-col gap-3">
          {[
            { key: "isRunflat", label: "Runflat" },
            { key: "isElectricVehicle", label: "Electric Vehicle" },
            { key: "isSilence", label: "Silence / Noise Reduced" },
            { key: "isStaggeredFitment", label: "Staggered Fitment" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!filters[key]}
                onChange={(e) => setFilter(key, e.target.checked)}
              />
              <span className="text-sm text-brand-muted group-hover:text-brand-text transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Items per page */}
      <FilterSection title="Results per page" defaultOpen={false}>
        <div className="flex gap-2">
          {[12, 24, 48].map((n) => (
            <button
              key={n}
              onClick={() => setFilter("limit", n)}
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition-all ${
                filters.limit === n
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
}
