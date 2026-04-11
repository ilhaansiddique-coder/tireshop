"use client";
import { create } from "zustand";

const DEFAULT_FILTERS = {
  // Common
  query: "",
  page: 1,
  limit: 24,
  sortBy: "relevance",

  // Tyre filters
  tyreType: "2",        // 1=winter, 2=summer, 3=allseason
  vehicleType: "alla",
  diameter: "",
  width: "",
  aspectRatio: "",
  speedIndex: "",
  isRunflat: false,
  isSilence: false,
  isElectricVehicle: false,
  isStaggeredFitment: false,
  minimumTestScore: "0",
  brand: "",

  // Rim filters
  rimType: "",           // 1=Steel, 2=Alloy
  boltPattern: "",       // e.g. "5x114.3"
  etOffsetMin: "",
  etOffsetMax: "",
  centreBore: "",
  rimWidth: "",
  rimDiameter: "",
  isWinterCertified: false,

  // Complete wheel filters
  wheelDiameter: "",
  wheelWidth: "",
};

const useFilterStore = create((set, get) => ({
  ...DEFAULT_FILTERS,

  setFilter: (key, value) => set({ [key]: value, page: key === "page" ? value : 1 }),

  setFilters: (partial) => set({ ...partial, page: 1 }),

  setPage: (page) => set({ page }),

  clearSearchFields: () =>
    set({
      query: "",
      brand: "",
      diameter: "",
      width: "",
      aspectRatio: "",
      speedIndex: "",
      rimWidth: "",
      rimDiameter: "",
      boltPattern: "",
      etOffsetMin: "",
      etOffsetMax: "",
      centreBore: "",
      wheelDiameter: "",
      wheelWidth: "",
      page: 1,
    }),

  resetFilters: () => set({ ...DEFAULT_FILTERS }),

  // Build tyre query params for the API
  toTyreParams: () => {
    const s = get();
    const p = {
      tyreType: s.tyreType,
      vehicleType: s.vehicleType,
      page: s.page,
      limit: s.limit,
      minimumTestScore: s.minimumTestScore,
      isRunflat: String(s.isRunflat),
      isSilence: String(s.isSilence),
      isElectricVehicle: String(s.isElectricVehicle),
      isStaggeredFitment: String(s.isStaggeredFitment),
    };
    if (s.query || s.brand) {
      p.query = [s.query, s.brand].filter(Boolean).join(" ");
    }
    if (s.diameter) p.diameter = s.diameter;
    if (s.width) p.width = s.width;
    if (s.aspectRatio) p.aspectRatio = s.aspectRatio;
    if (s.speedIndex) p.speedIndex = s.speedIndex;
    return p;
  },

  // Build rim query params
  toRimParams: () => {
    const s = get();
    const p = { page: s.page, limit: s.limit };
    if (s.query || s.brand) {
      p.query = [s.query, s.brand].filter(Boolean).join(" ");
    }
    if (s.rimDiameter || s.diameter) p.diameter = s.rimDiameter || s.diameter;
    if (s.rimWidth || s.width) p.width = s.rimWidth || s.width;
    if (s.rimType) p.rimType = s.rimType;
    if (s.boltPattern) p.boltPattern = s.boltPattern;
    return p;
  },

  // Build complete-wheel query params
  toWheelParams: () => {
    const s = get();
    const p = { page: s.page, limit: s.limit };
    if (s.query || s.brand) {
      p.query = [s.query, s.brand].filter(Boolean).join(" ");
    }
    return p;
  },
}));

export default useFilterStore;
