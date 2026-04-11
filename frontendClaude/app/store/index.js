"use client";

// Re-export the canonical stores so components importing from "../store"
// use the same Zustand instances as those importing from "@/store/cartStore".
export { default as useCartStore } from "@/store/cartStore";
export { default as useFilterStore } from "@/store/filterStore";
