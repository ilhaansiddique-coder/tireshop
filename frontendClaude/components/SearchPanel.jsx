"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Info, Car } from "lucide-react";
import { parseDimension } from "@/lib/api";
import useFilterStore from "@/store/filterStore";
import CarPicker from "./CarPicker";

const SEASONS = [
  { value: "2", label: "Summer", icon: "Sun" },
  { value: "1", label: "Winter", icon: "Snow" },
  { value: "3", label: "All Season", icon: "All" },
];

export default function SearchPanel({
  targetPath = "/tyres",
  panelTitle = "Find Your Tyre",
  primaryButtonLabel = "Search Tyres",
  browseHref = "/tyres",
  browseLabel = "Or browse all tyres ->",
}) {
  const router = useRouter();
  const { setFilter, clearSearchFields } = useFilterStore();
  const [input, setInput] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("2");
  const [inputError, setInputError] = useState("");
  const [searchMode, setSearchMode] = useState("dimension"); // "dimension" | "car"

  function handleSearch(e) {
    e.preventDefault();
    setInputError("");
    setFilter("tyreType", selectedSeason);
    clearSearchFields();

    const trimmed = input.trim();
    if (!trimmed) {
      router.push(targetPath);
      return;
    }

    const dim = parseDimension(trimmed);
    if (dim) {
      setFilter("width", dim.width);
      setFilter("aspectRatio", dim.aspectRatio);
      setFilter("diameter", dim.diameter);
      router.push(targetPath);
      return;
    }

    setFilter("query", trimmed);
    router.push(targetPath);
  }

  function handleCarSizeSelected(sizeData) {
    if (!sizeData) return;
    clearSearchFields();
    setFilter("tyreType", selectedSeason);
    if (sizeData.width) setFilter("width", sizeData.width);
    if (sizeData.aspectRatio) setFilter("aspectRatio", sizeData.aspectRatio);
    if (sizeData.diameter) setFilter("diameter", sizeData.diameter);
    router.push(targetPath);
  }

  return (
    <div className="w-full">
      <div className="card bg-base-200 border border-base-300 shadow-xl">
        <div className="card-body p-5 gap-5">
          {/* Header + mode toggle */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-brand-yellow" />
              <span className="font-display text-sm font-bold uppercase tracking-widest text-base-content/70">
                {panelTitle}
              </span>
            </div>
            <div className="join">
              <button
                type="button"
                onClick={() => setSearchMode("dimension")}
                className={`join-item btn btn-sm gap-1.5 text-xs font-body normal-case ${
                  searchMode === "dimension" ? "text-black" : "btn-ghost border-base-300"
                }`}
                style={searchMode === "dimension" ? { background: "#F5C518", border: "1px solid #F5C518" } : {}}
              >
                <Search size={12} /> Size / Plate
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("car")}
                className={`join-item btn btn-sm gap-1.5 text-xs font-body normal-case ${
                  searchMode === "car" ? "text-black" : "btn-ghost border-base-300"
                }`}
                style={searchMode === "car" ? { background: "#F5C518", border: "1px solid #F5C518" } : {}}
              >
                <Car size={12} /> Car Picker
              </button>
            </div>
          </div>

          {/* ── SIZE / PLATE MODE ── */}
          {searchMode === "dimension" && (
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="label pt-0">
                    <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
                      Search dimension / license plate number
                    </span>
                    <span className="label-text-alt">
                      <div className="tooltip tooltip-left font-body text-xs" data-tip="Enter tyre dimension like 205/55R16, or your vehicle licence plate number">
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
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/60" onClick={() => setInput("")}>x</button>
                    )}
                  </div>
                  {inputError && <p className="text-xs text-error mt-1 font-body">{inputError}</p>}
                  <p className="text-[10px] text-base-content/30 mt-1 font-body">e.g. 205/55R16, 215 55 R17, ABC 123</p>
                </div>

                <div>
                  <label className="label pt-0">
                    <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Season</span>
                  </label>
                  <div className="join w-full">
                    {SEASONS.map((season) => (
                      <button
                        key={season.value} type="button"
                        className={`join-item btn flex-1 gap-1 text-xs normal-case font-body transition-all ${
                          selectedSeason === season.value ? "text-black" : "btn-ghost border-base-300"
                        }`}
                        style={selectedSeason === season.value ? { background: "#F5C518", border: "1px solid #F5C518" } : {}}
                        onClick={() => setSelectedSeason(season.value)}
                      >
                        <span>{season.icon}</span>
                        <span className="hidden sm:inline">{season.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-2">
                  <label className="label pt-0">
                    <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Vehicle Type</span>
                  </label>
                  <select className="select select-bordered text-sm font-body" onChange={(e) => setFilter("vehicleType", e.target.value)}>
                    <option value="alla">All Vehicles</option>
                    <option value="0">Passenger Car</option>
                    <option value="7">SUV / 4x4</option>
                    <option value="4">Van / Light Truck</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap mt-5">
                <button type="submit" className="btn gap-2 font-display tracking-widest uppercase text-sm px-8" style={{ background: "#F5C518", color: "#000", border: "none" }}>
                  <Search size={16} /> {primaryButtonLabel}
                </button>
                <a href={browseHref} className="text-xs font-body text-base-content/40 hover:text-brand-yellow underline-offset-2 hover:underline transition-colors">
                  {browseLabel}
                </a>
              </div>
            </form>
          )}

          {/* ── CAR PICKER MODE ── */}
          {searchMode === "car" && (
            <div className="space-y-4">
              {/* Car Picker cascading dropdowns */}
              <CarPicker
                onSizeSelected={handleCarSizeSelected}
              />

              <p className="text-[10px] text-base-content/30 font-body">
                Select your car manufacturer, enter license plate to find your vehicle. Then pick a tyre size to search matching products.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
