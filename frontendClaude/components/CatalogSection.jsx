"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, RefreshCw } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { fetchCompleteWheelProducts, fetchProducts } from "@/lib/api";
import useFilterStore from "@/store/filterStore";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name A-Z" },
];

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

function productName(product) {
  if (!product) return "";
  if (typeof product.name === "string") return product.name;
  if (typeof product.productName === "string") return product.productName;
  if (typeof product.model === "string") return product.model;
  if (typeof product?.model?.name === "string") return product.model.name;
  return "";
}

function sortProducts(products, sortBy) {
  if (!Array.isArray(products) || products.length === 0) return products;

  const list = [...products];

  switch (sortBy) {
    case "price_asc":
      return list.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
    case "price_desc":
      return list.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
    case "name_asc":
      return list.sort((a, b) => productName(a).localeCompare(productName(b)));
    default:
      return list;
  }
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

export default function CatalogSection({
  title,
  subtitle,
  typeId = 1,
  noun = "products",
  source = "products",
  className = "",
}) {
  const {
    query,
    tyreType,
    vehicleType,
    diameter,
    width,
    aspectRatio,
    speedIndex,
    isRunflat,
    isSilence,
    isElectricVehicle,
    minimumTestScore,
    page,
    limit,
    setPage,
    resetFilters,
  } = useFilterStore();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [gridView, setGridView] = useState(true);

  const isTyreCatalog = source === "products" && Number(typeId) === 1;

  const requestParams = useMemo(() => {
    const params = {
      page,
      limit,
    };

    if (query) params.query = query;

    if (source === "products") {
      params.typeId = String(typeId);
    }

    if (isTyreCatalog) {
      params.tyreType = tyreType;
      params.vehicleType = vehicleType;
      params.minimumTestScore = minimumTestScore;
      params.isRunflat = String(isRunflat);
      params.isSilence = String(isSilence);
      params.isElectricVehicle = String(isElectricVehicle);

      if (diameter) params.diameter = diameter;
      if (width) params.width = width;
      if (aspectRatio) params.aspectRatio = aspectRatio;
      if (speedIndex) params.speedIndex = speedIndex;
    }

    return params;
  }, [
    typeId,
    page,
    limit,
    query,
    source,
    isTyreCatalog,
    tyreType,
    vehicleType,
    minimumTestScore,
    isRunflat,
    isSilence,
    isElectricVehicle,
    diameter,
    width,
    aspectRatio,
    speedIndex,
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        source === "complete-wheels"
          ? await fetchCompleteWheelProducts(requestParams)
          : await fetchProducts(requestParams);
      const normalised = normaliseProductsResponse(data);
      setProducts(normalised.products);
      setTotal(normalised.total);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load products.");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [requestParams, source]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedProducts = useMemo(() => sortProducts(products, sortBy), [products, sortBy]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className={`bg-base-100 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="heading-display text-3xl md:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered select-sm font-body text-xs"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
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

            <button
              className="btn btn-sm btn-ghost"
              onClick={() => resetFilters()}
              title="Reset filters"
            >
              Reset
            </button>
          </div>
        </div>

        <p className="text-sm font-body text-base-content/50 mb-5">
          {loading ? "Loading..." : `Showing ${sortedProducts.length} of ${total.toLocaleString()} ${noun}`}
        </p>

        {error && (
          <div className="alert alert-error mb-6">
            <span className="font-body text-sm">{error}</span>
            <button className="btn btn-sm btn-ghost ml-auto" onClick={load}>
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: Math.min(Number(limit) || 12, 24) }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : sortedProducts.length === 0 && !error ? (
          <div className="text-center py-20">
            <p className="font-display text-xl font-bold uppercase mb-2">No {noun} found</p>
            <p className="font-body text-base-content/50 mb-6">Try another search phrase.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${gridView ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {sortedProducts.map((product, i) => (
              <ProductCard
                key={product?.id || product?.productId || i}
                product={product}
                index={i}
                linkToDetail={isTyreCatalog}
              />
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
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
    </section>
  );
}
