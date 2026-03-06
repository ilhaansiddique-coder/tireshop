"use client";
import { create } from "zustand";

const DEFAULT_FILTERS = {
  query: "",
  tyreType: "2",       // 1=winter, 2=summer, 3=allseason
  vehicleType: "alla",
  diameter: "",
  width: "",
  aspectRatio: "",
  speedIndex: "",
  isRunflat: false,
  isSilence: false,
  isElectricVehicle: false,
  minimumTestScore: "0",
  page: 1,
  limit: 24,
};

const useFilterStore = create((set, get) => ({
  ...DEFAULT_FILTERS,

  setFilter: (key, value) => set({ [key]: value, page: 1 }),
  setPage: (page) => set({ page }),
  clearSearchFields: () =>
    set({
      query: "",
      diameter: "",
      width: "",
      aspectRatio: "",
      speedIndex: "",
      page: 1,
    }),

  resetFilters: () => set({ ...DEFAULT_FILTERS }),

  // Build the query params object to pass to the API
  toParams: () => {
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
    };
    if (s.query) p.query = s.query;
    if (s.diameter) p.diameter = s.diameter;
    if (s.width) p.width = s.width;
    if (s.aspectRatio) p.aspectRatio = s.aspectRatio;
    if (s.speedIndex) p.speedIndex = s.speedIndex;
    return p;
  },
}));

export default useFilterStore;
