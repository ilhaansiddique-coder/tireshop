"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import ThemePicker from "./ThemePicker";

const NAV_LINKS = [
  { href: "/tyres",              label: "Tyres" },
  { href: "/tyres?type=rims",    label: "Rims" },
  { href: "/tyres?type=complete",label: "Complete Wheels" },
  { href: "/tyres?hotel=1",      label: "Deck Hotel" },
  { href: "/book?service=alignment", label: "Wheel Alignment" },
  { href: "/book?service=rim",   label: "Rim Renovation" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const count = itemCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-base-100/95 backdrop-blur-md shadow-lg" : "bg-base-100"
      } border-b border-base-300`}
    >
      <div className="navbar px-4 md:px-6 max-w-[1440px] mx-auto min-h-[60px]">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm border-2 transition-colors"
              style={{ borderColor: "#F5C518", color: "#F5C518" }}
            >
              DC
            </div>
            <span className="font-display text-base font-bold uppercase tracking-widest hidden sm:block">
              Däckcentrum
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-0.5 text-xs font-body">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-lg px-3 py-2 font-medium uppercase tracking-wider text-[11px] transition-colors ${
                    pathname === link.href
                      ? "text-brand-yellow bg-base-200"
                      : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className="navbar-end gap-1">
          <Link
            href="/book"
            className="btn btn-sm btn-ghost hidden md:flex gap-1.5 text-xs font-body normal-case text-base-content/60 hover:text-base-content"
          >
            <Wrench size={14} />
            Book Appointment
          </Link>

          <ThemePicker />

          {/* Cart */}
          <button
            onClick={openCart}
            className="btn btn-ghost btn-sm btn-circle relative"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center leading-none px-1"
                style={{ background: "#F5C518", color: "#000" }}
              >
                {count}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost btn-sm btn-circle lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-base-100 border-t border-base-300 px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? "bg-base-200 text-brand-yellow"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider text-base-content/70 hover:bg-base-200"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </header>
  );
}
