"use client";
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useFilterStore } from "../store";

export default function SearchBar() {
  const { filters, setFilter } = useFilterStore();
  const ref = useRef(null);

  const clear = () => {
    setFilter("query", "");
    ref.current?.focus();
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={filters.query}
        onChange={(e) => setFilter("query", e.target.value)}
        placeholder="Search by brand, model, or part number..."
        className="w-full pl-10 pr-10 py-3 bg-brand-card border border-brand-border rounded-xl text-sm text-brand-text placeholder-brand-muted focus:border-brand-yellow outline-none transition-colors"
      />
      {filters.query && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-brand-muted hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
