"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Info } from "lucide-react";
import { parseDimension } from "@/lib/api";
import useFilterStore from "@/store/filterStore";

const SEASONS = [
  { value: "2", label: "Summer",    icon: "☀️" },
  { value: "1", label: "Winter",    icon: "❄️" },
  { value: "3", label: "All Season", icon: "🌤" },
];

export default function SearchPanel() {
  const router = useRouter();
  const { setFilter, tyreType } = useFilterStore();
  const [input, setInput] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("2");
  const [inputError, setInputError] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    setInputError("");

    setFilter("tyreType", selectedSeason);

    const trimmed = input.trim();

    if (!trimmed) {
      router.push("/tyres");
      return;
    }

    // Try dimension parse first (e.g., 205/55R16)
    const dim = parseDimension(trimmed);
    if (dim) {
      setFilter("width", dim.width);
      setFilter("aspectRatio", dim.aspectRatio);
      setFilter("diameter", dim.diameter);
      router.push("/tyres");
      return;
    }

    // Otherwise treat as free-text / license plate query
    setFilter("query", trimmed);
    router.push("/tyres");
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body p-5 gap-5">
          {/* Top label */}
          <div className="flex items-center gap-2">
            <Search size={16} className="text-brand-yellow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-base-content/70">
              Find Your Tyre
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dimension / Licence plate input */}
            <div className="md:col-span-1">
              <label className="label pt-0">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
                  Dimension or Licence Plate
                </span>
                <span className="label-text-alt">
                  <div
                    className="tooltip tooltip-left font-body text-xs"
                    data-tip="Enter tyre dimension like 205/55R16, or your vehicle licence plate number to auto-detect size"
                  >
                    <Info size={13} className="text-base-content/40 cursor-help" />
                  </div>
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`input input-bordered w-full font-mono text-sm pr-10 ${inputError ? "input-error" : ""}`}
                  placeholder="205/55R16 or ABC123"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setInputError(""); }}
                />
                {input && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60"
                    onClick={() => setInput("")}
                  >
                    ×
                  </button>
                )}
              </div>
              {inputError && (
                <p className="text-xs text-error mt-1 font-body">{inputError}</p>
              )}
              <p className="text-[10px] text-base-content/30 mt-1 font-body">
                e.g. 205/55R16 · 215 55 R17 · ABC 123
              </p>
            </div>

            {/* Season selector */}
            <div>
              <label className="label pt-0">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
                  Season
                </span>
              </label>
              <div className="join w-full">
                {SEASONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={`join-item btn flex-1 gap-1 text-xs normal-case font-body transition-all ${
                      selectedSeason === s.value
                        ? "text-black"
                        : "btn-ghost border-base-300"
                    }`}
                    style={selectedSeason === s.value ? { background: "#F5C518", border: "1px solid #F5C518" } : {}}
                    onClick={() => setSelectedSeason(s.value)}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle type + search */}
            <div className="flex flex-col justify-end gap-2">
              <label className="label pt-0">
                <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
                  Vehicle Type
                </span>
              </label>
              <select
                className="select select-bordered text-sm font-body"
                onChange={(e) => setFilter("vehicleType", e.target.value)}
              >
                <option value="alla">All Vehicles</option>
                <option value="1">Passenger Car</option>
                <option value="2">SUV / 4x4</option>
                <option value="3">Van / Light Truck</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              type="submit"
              className="btn gap-2 font-display tracking-widest uppercase text-sm px-8"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              <Search size={16} />
              Search Tyres
            </button>
            <a
              href="/tyres"
              className="text-xs font-body text-base-content/40 hover:text-brand-yellow underline-offset-2 hover:underline transition-colors"
            >
              Or browse all tyres →
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}
