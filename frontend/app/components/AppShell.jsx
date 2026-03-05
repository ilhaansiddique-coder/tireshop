"use client";
import { useState } from "react";
import Header from "./Header";
import CartDrawer from "./CartDrawer";

export default function AppShell({ children }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header onCartOpen={() => setCartOpen(true)} />

      <main className="pt-16 lg:pt-[110px]">{children}</main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <footer className="border-t border-brand-border bg-brand-surface">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-sm text-brand-muted">
            Copyright 2026 TireStore. All prices include VAT.
          </p>
          <p className="text-xs text-brand-border">Powered by EON Tyre API</p>
        </div>
      </footer>
    </div>
  );
}
