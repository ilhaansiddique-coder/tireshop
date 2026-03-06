"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterStore } from "../store";

export default function Pagination({ totalPages, totalItems }) {
  const { filters, setFilter } = useFilterStore();
  const { page } = filters;

  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      {totalItems > 0 && (
        <p className="text-sm text-brand-muted">
          Page {page} of {totalPages} · {totalItems} tyres found
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFilter("page", page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-yellow/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-3 py-2 text-brand-muted text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setFilter("page", p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all border ${
                p === page
                  ? "bg-brand-yellow text-brand-dark border-brand-yellow font-bold"
                  : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-yellow/50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => setFilter("page", page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-yellow/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
