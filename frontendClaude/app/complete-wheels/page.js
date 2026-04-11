"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Search,
} from "lucide-react";
import useFilterStore from "@/store/filterStore";
import { fetchCompleteWheelProducts, normaliseProductsResponse } from "@/lib/api";
import ProductCard from "@/app/components/ProductCard";

/* ── constants ─────────────────────────────────────────── */
const DIAMETERS = ["14", "15", "16", "17", "18", "19", "20", "21", "22"];
const TYRE_TYPES = [
  { value: "", label: "All Seasons" },
  { value: "summer", label: "Summer" },
  { value: "winter", label: "Winter" },
];
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A-Z" },
];

/* ── helpers ───────────────────────────────────────────── */
function sortProducts(products, sortBy) {
  if (!products?.length) return products;
  const list = [...products];
  switch (sortBy) {
    case "price_asc":  return list.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
    case "price_desc": return list.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
    case "name_asc":   return list.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
    default:           return list;
  }
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-brand-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-xs font-semibold text-brand-text uppercase tracking-wider hover:text-brand-yellow transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card bg-base-200 border border-base-300 h-full">
      <div className="skeleton-shimmer aspect-square rounded-t-2xl" />
      <div className="card-body p-4 gap-3">
        <div className="skeleton-shimmer h-3 w-16 rounded" />
        <div className="skeleton-shimmer h-5 w-3/4 rounded" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded" />
        <div className="skeleton-shimmer h-8 w-full rounded mt-2" />
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
export default function CompleteWheelsPage() {
  const store = useFilterStore();
  const {
    query, brand, wheelDiameter, diameter, page, limit, sortBy,
    setFilter, setPage, resetFilters,
  } = store;

  const activeDiameter = wheelDiameter || diameter;

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState("");

  const requestParams = useMemo(() => {
    const p = { page, limit };
    const q = [query, brand].filter(Boolean).join(" ");
    if (q) p.query = q;
    return p;
  }, [query, brand, page, limit]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompleteWheelProducts(requestParams);
      const n = normaliseProductsResponse(data);
      setProducts(n.products);
      setTotal(n.total);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load.");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [requestParams]);

  useEffect(() => {
    const hasSearchText = Boolean(query || brand);
    const t = setTimeout(load, hasSearchText ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, query, brand]);

  // Client-side filters for diameter and season (export API doesn't support these)
  const filtered = useMemo(() => {
    let list = products;
    if (activeDiameter) {
      list = list.filter((p) => String(p?.diameter) === activeDiameter);
    }
    if (seasonFilter) {
      list = list.filter((p) => {
        const typeName = (p?.tyre_type_name || p?.tyreTypeName || "").toLowerCase();
        return typeName.includes(seasonFilter);
      });
    }
    return list;
  }, [products, activeDiameter, seasonFilter]);

  const sorted = useMemo(() => sortProducts(filtered, sortBy), [filtered, sortBy]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const activeFilterCount = [brand, activeDiameter, seasonFilter].filter(Boolean).length;

  const filterContent = (
    <div className="px-4">
      <FilterSection title="Search">
        <input
          type="text"
          value={brand}
          onChange={(e) => setFilter("brand", e.target.value)}
          placeholder="Brand or keyword..."
          className="w-full rounded-md border border-brand-border bg-brand-card px-3 py-2 text-sm text-brand-text placeholder-brand-muted"
        />
      </FilterSection>

      <FilterSection title="Season">
        <div className="flex flex-col gap-2">
          {TYRE_TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio" name="wheelSeason" value={t.value}
                checked={seasonFilter === t.value}
                onChange={() => setSeasonFilter(t.value)}
                className="w-4 h-4" style={{ accentColor: "#F5C518" }}
              />
              <span className="text-sm text-brand-muted group-hover:text-brand-text transition-colors">{t.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Diameter (inch)">
        <div className="grid grid-cols-4 gap-1.5">
          {DIAMETERS.map((d) => (
            <button
              key={d}
              onClick={() => setFilter("wheelDiameter", activeDiameter === d ? "" : d)}
              className={`py-1.5 text-xs font-mono font-medium rounded border transition-all ${
                activeDiameter === d
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow"
                  : "bg-brand-card text-brand-muted border-brand-border hover:border-brand-yellow/50"
              }`}
            >
              {d}&quot;
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Per Page" defaultOpen={false}>
        <div className="flex gap-2">
          {[12, 24, 48].map((n) => (
            <button
              key={n}
              onClick={() => setFilter("limit", n)}
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition-all ${
                limit === n
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

  return (
    <div className="bg-base-100 min-h-screen">
      <section className="border-b border-base-300 bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-yellow" />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Complete Wheel Packages</span>
          </div>
          <h1 className="heading-display text-4xl md:text-5xl text-base-content mb-2">
            Complete <span className="text-brand-yellow">Wheels</span>
          </h1>
          <p className="font-body text-base-content/60 max-w-lg">
            Tyre + rim packages ready for fitting. Find the perfect set for your vehicle.
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 bg-brand-surface rounded-xl border border-brand-border overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-yellow" />
                  <span className="font-display text-sm font-bold tracking-wide uppercase">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-brand-yellow text-brand-dark text-xs font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={() => { resetFilters(); setSeasonFilter(""); }} className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-yellow">
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="relative w-[300px] h-full bg-brand-surface overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
                  <span className="font-display text-lg font-bold tracking-wide uppercase">Filters</span>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-brand-muted hover:text-brand-text"><X className="w-5 h-5" /></button>
                </div>
                {filterContent}
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                <input
                  type="search" value={query}
                  onChange={(e) => setFilter("query", e.target.value)}
                  placeholder="Search complete wheels..."
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted focus:border-brand-yellow outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-brand-card border border-brand-border rounded-xl text-sm text-brand-muted">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <select value={sortBy} onChange={(e) => setFilter("sortBy", e.target.value)} className="select select-bordered select-sm font-body text-xs">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="join">
                  <button className={`join-item btn btn-sm ${gridView ? "btn-active" : "btn-ghost"}`} onClick={() => setGridView(true)}><LayoutGrid size={14} /></button>
                  <button className={`join-item btn btn-sm ${!gridView ? "btn-active" : "btn-ghost"}`} onClick={() => setGridView(false)}><List size={14} /></button>
                </div>
              </div>
            </div>

            <p className="text-sm font-body text-base-content/50 mb-5">
              {loading ? "Loading..." : `Showing ${sorted.length} of ${total.toLocaleString()} complete wheels`}
            </p>

            {error && (
              <div className="alert alert-error mb-6">
                <span className="font-body text-sm">{error}</span>
                <button className="btn btn-sm btn-ghost ml-auto" onClick={load}><RefreshCw size={14} /> Retry</button>
              </div>
            )}

            {loading ? (
              <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sorted.length === 0 && !error ? (
              <div className="text-center py-20">
                <p className="font-display text-xl font-bold uppercase mb-2">No complete wheels found</p>
                <p className="font-body text-base-content/50 mb-6">Try adjusting your filters</p>
                <button onClick={() => { resetFilters(); setSeasonFilter(""); }} className="btn btn-sm btn-ghost"><RotateCcw size={14} /> Reset Filters</button>
              </div>
            ) : (
              <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {sorted.map((product, i) => (
                  <Link key={product?.id || i} href={`/complete-wheels/${product?.id || product?.productId}`}>
                    <ProductCard product={product} style={{ animationDelay: `${i * 30}ms`, animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0 }} />
                  </Link>
                ))}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="join">
                  <button className="join-item btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>«</button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    let p;
                    if (totalPages <= 7) { p = i + 1; }
                    else if (page <= 4) { p = i + 1; }
                    else if (page >= totalPages - 3) { p = totalPages - 6 + i; }
                    else { p = page - 3 + i; }
                    return (
                      <button key={p} className={`join-item btn btn-sm ${page === p ? "btn-active" : "btn-ghost"}`} style={page === p ? { background: "#F5C518", color: "#000", border: "none" } : {}} onClick={() => setPage(p)}>{p}</button>
                    );
                  })}
                  <button className="join-item btn btn-sm btn-ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>»</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
