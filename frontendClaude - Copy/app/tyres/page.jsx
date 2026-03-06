"use client";
import { useEffect, useState, useCallback } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import useFilterStore from "@/store/filterStore";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",    label: "Top Rated" },
];

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

function normaliseProductsResponse(payload) {
  const products =
    payload?.products ||
    payload?.result?.products ||
    payload?.data?.products ||
    payload?.items ||
    (Array.isArray(payload?.data) ? payload.data : null) ||
    (Array.isArray(payload) ? payload : []);

  const total =
    payload?.totalCount ??
    payload?.total ??
    payload?.count ??
    payload?.result?.total ??
    payload?.result?.count ??
    payload?.data?.total ??
    payload?.data?.totalCount ??
    payload?.data?.count ??
    (Array.isArray(products) ? products.length : 0);

  return {
    products: Array.isArray(products) ? products : [],
    total: Number.isFinite(Number(total)) ? Number(total) : 0,
  };
}

export default function TyresPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { page, limit, setPage, toParams } = useFilterStore();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = toParams();
      const data = await fetchProducts(params);
      const normalised = normaliseProductsResponse(data);
      setProducts(normalised.products);
      setTotal(normalised.total);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to load tyres.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toParams]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-base-100">
      {/* Page header */}
      <div className="bg-base-200 border-b border-base-300 px-6 md:px-10 py-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8" style={{ background: "#F5C518" }} />
          <span className="text-xs font-body uppercase tracking-[0.2em] text-brand-yellow">
            Our Collection
          </span>
        </div>
        <h1 className="heading-display text-4xl md:text-5xl">
          All <span style={{ color: "#F5C518" }}>Tyres</span>
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <FilterSidebar onFilter={() => setPage(1)} />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden btn btn-sm btn-outline gap-2 font-body normal-case"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <p className="text-sm font-body text-base-content/50">
                {loading ? "Loading…" : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-base-content">
                      {products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-base-content">
                      {total.toLocaleString()}
                    </span>{" "}
                    tyres
                  </>
                )}
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <select className="select select-bordered select-sm font-body text-xs">
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="join">
                  <button
                    className={`join-item btn btn-sm ${gridView ? "btn-active" : "btn-ghost"}`}
                    onClick={() => setGridView(true)}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    className={`join-item btn btn-sm ${!gridView ? "btn-active" : "btn-ghost"}`}
                    onClick={() => setGridView(false)}
                    aria-label="List view"
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error mb-6">
                <span className="font-body text-sm">{error}</span>
                <button className="btn btn-sm btn-ghost ml-auto" onClick={load}>Retry</button>
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 && !error ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-display text-xl font-bold uppercase mb-2">No tyres found</p>
                <p className="font-body text-base-content/50 mb-6">
                  Try adjusting or resetting your filters.
                </p>
                <button
                  className="btn btn-outline font-body normal-case"
                  onClick={() => { useFilterStore.getState().resetFilters(); }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {products.map((p, i) => (
                  <ProductCard key={p.id || i} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="join">
                  <button
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    «
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        className={`join-item btn btn-sm ${page === p ? "btn-active" : "btn-ghost"}`}
                        style={page === p ? { background: "#F5C518", color: "#000", border: "none" } : {}}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    className="join-item btn btn-sm btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-base-100 z-50 overflow-y-auto p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display font-bold uppercase tracking-widest">Filters</span>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <FilterSidebar onFilter={() => { setPage(1); setDrawerOpen(false); }} />
          </div>
        </>
      )}
    </div>
  );
}
