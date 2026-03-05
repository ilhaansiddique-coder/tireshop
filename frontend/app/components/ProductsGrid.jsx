"use client";
import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List, SlidersHorizontal, AlertCircle, RefreshCw } from "lucide-react";
import { useFilterStore } from "../store";
import { fetchProducts } from "../lib/api";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import Pagination from "./Pagination";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "./SearchBar";

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "brand_asc", label: "Brand A-Z" },
];

function sortProducts(products, sortBy) {
  if (!products?.length) return products;
  const arr = [...products];
  switch (sortBy) {
    case "price_asc":
      return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    case "price_desc":
      return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    case "brand_asc":
      return arr.sort((a, b) =>
        (a.brandName || "").localeCompare(b.brandName || "")
      );
    default:
      return arr;
  }
}

export default function ProductsGrid() {
  const { filters, setFilter } = useFilterStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProducts({
        ...filters,
        query: filters.query || undefined,
        diameter: filters.diameter || undefined,
        width: filters.width || undefined,
        aspectRatio: filters.aspectRatio || undefined,
        speedIndex: filters.speedIndex || undefined,
      });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, filters.query ? 400 : 0);
    return () => clearTimeout(t);
  }, [load, filters.query]);

  // Trigger immediately for non-query changes
  useEffect(() => {
    if (filters.query) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.page,
    filters.limit,
    filters.diameter,
    filters.width,
    filters.aspectRatio,
    filters.speedIndex,
    filters.tyreType,
    filters.isRunflat,
    filters.isElectricVehicle,
    filters.isSilence,
    filters.isStaggeredFitment,
  ]);

  // Normalise response to get products array
  const rawProducts =
    data?.products ||
    data?.result?.products ||
    data?.data?.products ||
    data?.items ||
    (Array.isArray(data) ? data : []);

  const totalItems = data?.total || data?.result?.total || data?.totalCount || rawProducts.length || 0;
  const totalPages = data?.pages || data?.result?.pages || data?.totalPages || Math.ceil(totalItems / filters.limit) || 1;

  const products = sortProducts(rawProducts, filters.sortBy);

  return (
    <div className="flex gap-8">
      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <FilterSidebar isMobile={false} isOpen />
      </div>

      {/* Mobile filter drawer */}
      <FilterSidebar isMobile isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter btn */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-brand-card border border-brand-border rounded-xl text-sm text-brand-muted hover:text-brand-text hover:border-brand-yellow/50 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter("sortBy", e.target.value)}
                className="pl-3 pr-8 py-2.5 text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex bg-brand-card border border-brand-border rounded-lg overflow-hidden">
              {[
                { id: "grid", Icon: LayoutGrid },
                { id: "list", Icon: List },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`p-2.5 transition-colors ${
                    view === id
                      ? "bg-brand-yellow text-brand-dark"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && totalItems > 0 && (
          <p className="text-sm text-brand-muted mb-4">
            Showing <span className="text-brand-text font-medium">{products.length}</span> of{" "}
            <span className="text-brand-text font-medium">{totalItems}</span> tyres
          </p>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold uppercase tracking-wide text-brand-text">
                Failed to load tyres
              </p>
              <p className="text-sm text-brand-muted mt-1">{error}</p>
            </div>
            <button
              onClick={load}
              className="flex items-center gap-2 px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text hover:border-brand-yellow/50 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-brand-border flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-border" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold uppercase tracking-wide text-brand-text">
                No tyres found
              </p>
              <p className="text-sm text-brand-muted mt-1">
                Try adjusting your filters or search term
              </p>
            </div>
          </div>
        )}

        {/* Grid */}
        {(loading || products.length > 0) && (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {loading
              ? Array.from({ length: filters.limit }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : products.map((product, i) => (
                  <ProductCard
                    key={product.id || product.articleNumber || i}
                    product={product}
                    style={{
                      animationDelay: `${i * 30}ms`,
                      animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                      opacity: 0,
                    }}
                  />
                ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination totalPages={totalPages} totalItems={totalItems} />
        )}
      </div>
    </div>
  );
}
