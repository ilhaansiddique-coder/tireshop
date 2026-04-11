"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Car, ChevronDown, X, Check, Info } from "lucide-react";
import { getManufacturers, getModels, getVariants, parseTyreDimension } from "@/lib/vehicleData";

function AutocompleteDropdown({ label, placeholder, options, value, onChange, disabled }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setQuery(value || ""); }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  function handleSelect(opt) {
    setQuery(opt);
    setOpen(false);
    onChange(opt);
  }

  function handleClear() {
    setQuery("");
    setOpen(false);
    onChange("");
  }

  return (
    <div ref={ref} className="relative">
      <label className="label pt-0 pb-1">
        <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">{label}</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange(""); }}
          onFocus={() => setOpen(true)}
          placeholder={disabled ? "—" : placeholder}
          disabled={disabled}
          className={`input input-bordered w-full pr-16 text-sm ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && !disabled && (
            <button type="button" onClick={handleClear} className="p-1 text-base-content/30 hover:text-base-content/60">
              <X size={12} />
            </button>
          )}
          {!disabled && (
            <button type="button" onClick={() => setOpen(!open)} className="p-1 text-base-content/30 hover:text-base-content/60">
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {open && !disabled && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-base-100 border border-base-300 rounded-xl shadow-xl">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-4 py-2 text-sm font-body hover:bg-base-200 transition-colors flex items-center justify-between ${
                value === opt ? "bg-brand-yellow/10 text-brand-yellow font-semibold" : "text-base-content/80"
              }`}
            >
              {opt}
              {value === opt && <Check size={14} className="text-brand-yellow flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
      {open && !disabled && filtered.length === 0 && query && (
        <div className="absolute z-50 mt-1 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl px-4 py-3">
          <p className="text-sm text-base-content/50">No match found</p>
        </div>
      )}
    </div>
  );
}

export default function CarPicker({ onSizeSelected }) {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const manufacturers = useMemo(() => getManufacturers(), []);
  const models = useMemo(() => (selectedMake ? getModels(selectedMake) : []), [selectedMake]);
  const variants = useMemo(() => (selectedMake && selectedModel ? getVariants(selectedMake, selectedModel) : []), [selectedMake, selectedModel]);
  const variantNames = useMemo(() => variants.map((v) => v.name), [variants]);

  function handleMakeChange(make) {
    setSelectedMake(make);
    setSelectedModel("");
    setSelectedVariant(null);
  }

  function handleModelChange(model) {
    setSelectedModel(model);
    setSelectedVariant(null);
  }

  function handleVariantChange(variantName) {
    if (!variantName) { setSelectedVariant(null); return; }
    const v = variants.find((x) => x.name === variantName);
    setSelectedVariant(v || null);
  }

  function handleClickSize(dim, position) {
    const parsed = parseTyreDimension(dim);
    if (!parsed) return;
    onSizeSelected?.({
      width: parsed.width,
      aspectRatio: parsed.aspectRatio,
      diameter: parsed.diameter,
      position,
      car: { make: selectedMake, model: selectedModel, variant: selectedVariant?.name },
    });
  }

  const hasVariantData = selectedVariant && selectedVariant.front;
  const isStaggered = selectedVariant?.rear && selectedVariant.rear !== selectedVariant.front;

  return (
    <div className="space-y-4">
      {/* ── Cascade dropdowns ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AutocompleteDropdown
          label="Manufacturer"
          placeholder="Select manufacturer..."
          options={manufacturers}
          value={selectedMake}
          onChange={handleMakeChange}
        />
        <AutocompleteDropdown
          label="Model"
          placeholder={selectedMake ? "Select model..." : "Select manufacturer first"}
          options={models}
          value={selectedModel}
          onChange={handleModelChange}
          disabled={!selectedMake}
        />
        <AutocompleteDropdown
          label="Variant"
          placeholder={selectedModel ? "Select variant..." : "Select model first"}
          options={variantNames}
          value={selectedVariant?.name || ""}
          onChange={handleVariantChange}
          disabled={!selectedModel}
        />
      </div>

      {/* ── Vehicle info + sizes after variant selection ── */}
      {selectedVariant && (
        <div className="bg-base-200 border border-base-300 rounded-xl overflow-hidden">
          {/* Vehicle header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-300/30">
            <div className="w-8 h-8 rounded-lg bg-brand-yellow/10 flex items-center justify-center">
              <Car size={16} className="text-brand-yellow" />
            </div>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wide">
                {selectedMake} {selectedModel} {selectedVariant.name}
              </p>
            </div>
          </div>

          {hasVariantData ? (
            <div className="p-4 space-y-4">
              {/* Front */}
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-wider text-base-content/50 mb-2">
                  Front
                </p>
                <button
                  type="button"
                  onClick={() => handleClickSize(selectedVariant.front, "front")}
                  className="flex items-center justify-between gap-3 w-full sm:w-auto py-2.5 px-4 rounded-lg border border-base-300 bg-base-100 hover:border-brand-yellow/50 hover:text-brand-yellow text-base-content/80 transition-all text-left"
                >
                  <span className="font-mono text-sm font-medium">{selectedVariant.front}</span>
                  <span className="text-[10px] font-mono text-base-content/40">(0.00%)</span>
                </button>
              </div>

              {/* Rear */}
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-wider text-base-content/50 mb-2">
                  Rear
                </p>
                <button
                  type="button"
                  onClick={() => handleClickSize(selectedVariant.rear || selectedVariant.front, "rear")}
                  className="flex items-center justify-between gap-3 w-full sm:w-auto py-2.5 px-4 rounded-lg border border-base-300 bg-base-100 hover:border-brand-yellow/50 hover:text-brand-yellow text-base-content/80 transition-all text-left"
                >
                  <span className="font-mono text-sm font-medium">{selectedVariant.rear || selectedVariant.front}</span>
                  <span className="text-[10px] font-mono text-base-content/40">(0.00%)</span>
                </button>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 text-xs text-base-content/40 font-body pt-1">
                <Info size={12} className="flex-shrink-0 mt-0.5" />
                <span>Click a size to search matching tyres.{isStaggered ? " This vehicle has staggered fitment (different front/rear sizes)." : ""}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-base-content/50 mb-2">
                <Info size={16} />
                <p className="font-body text-sm font-medium">
                  We currently don&apos;t have enough info for this model.
                </p>
              </div>
              <p className="text-xs text-base-content/40 font-body">
                Try searching by tyre dimension instead, or use the Size / Plate tab.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
