"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Cart Store ───────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, qty }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) return get().removeItem(id);
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)) });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    { name: "tirestore-cart" }
  )
);

// ─── Filter Store ─────────────────────────────────────────────────────────────
export const useFilterStore = create((set) => ({
  filters: {
    query: "",
    brand: "",
    diameter: "",
    width: "",
    aspectRatio: "",
    speedIndex: "",
    vehicleType: "alla",
    minimumTestScore: 0,
    isRunflat: false,
    isElectricVehicle: false,
    isSilence: false,
    isStaggeredFitment: false,
    tyreType: "2",
    page: 1,
    limit: 24,
    sortBy: "default",
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key === "page" ? value : 1 },
    })),

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial, page: 1 },
    })),

  resetFilters: () =>
    set({
      filters: {
        query: "",
        brand: "",
        diameter: "",
        width: "",
        aspectRatio: "",
        speedIndex: "",
        vehicleType: "alla",
        minimumTestScore: 0,
        isRunflat: false,
        isElectricVehicle: false,
        isSilence: false,
        isStaggeredFitment: false,
        tyreType: "2",
        page: 1,
        limit: 24,
        sortBy: "default",
      },
    }),
}));
