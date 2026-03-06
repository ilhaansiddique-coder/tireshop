"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "../store";
import ThemePicker from "./ThemePicker";
import {
  MAIN_NAV_ITEMS,
  UTILITY_NAV_ITEMS,
  isNavItemActive,
} from "../config/navigation";

function NavLink({ href, label, pathname, onClick }) {
  const active = isNavItemActive(pathname, href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative block py-3 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
        active ? "text-white" : "text-white/70 hover:text-white"
      }`}
    >
      {label}
      {active && <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-brand-yellow" />}
    </Link>
  );
}

export default function Header({ onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-brand-yellow/80 to-transparent" />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="hidden lg:flex items-center justify-between border-b border-white/10 py-2">
          <Link href="/" className="shrink-0">
            <div className="text-white">
              <p className="font-display text-2xl font-bold uppercase tracking-[0.08em]">
                DACKCENTRUM
              </p>
              <p className="-mt-1 text-[10px] uppercase tracking-[0.3em] text-brand-yellow/90">
                Premium Tyre Store
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            {MAIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemePicker />
            <button
              onClick={onCartOpen}
              className="relative inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:border-brand-yellow/60"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
              {count > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#f5c518] px-1 text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end">
          <nav className="flex items-center gap-8">
            {UTILITY_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div className="flex h-16 items-center justify-between lg:hidden">
          <Link href="/" className="text-sm font-semibold tracking-[0.16em] text-white">
            DACKCENTRUM
          </Link>
          <div className="flex items-center gap-2">
            <ThemePicker />
            <button
              onClick={onCartOpen}
              className="relative rounded-md border border-white/20 p-2 text-white transition-colors hover:border-brand-yellow/60"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f5c518] px-1 text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-md border border-white/20 p-2 text-white transition-colors hover:border-brand-yellow/60"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="space-y-3 border-t border-white/15 py-4 lg:hidden">
            <div className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </div>
            <div className="space-y-1 border-t border-white/10 pt-2">
              {UTILITY_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
