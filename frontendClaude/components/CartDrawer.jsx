"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import useCartStore from "@/store/cartStore";
import { formatPrice, productImageUrl, createOrder } from "@/lib/api";

const INITIAL_CHECKOUT = {
  name: "",
  phone: "",
  email: "",
  address1: "",
  postal_code: "",
  city: "",
  country: "SE",
  notes: "",
};

function normalizeOrderProduct(item) {
  const parts =
    typeof item.id === "string" && item.id.includes(":")
      ? item.id.split(":")
      : [];

  const id = toNum(item.orderProductId) ?? toNum(parts[0]) ?? toNum(item.productId) ?? toNum(item.id);
  if (!id) return null;

  const supplier = toNum(item.orderSupplierId) ?? toNum(parts[2]);
  const location = toNum(item.orderLocationId) ?? toNum(parts[1]);

  return {
    id,
    quantity: Math.max(1, Number(item.qty) || 1),
    ...(supplier ? { supplier } : {}),
    ...(location ? { location } : {}),
  };
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, itemCount, subtotal } =
    useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Defer localStorage-derived values to after hydration
  const count = mounted ? itemCount() : 0;
  const totalOre = mounted ? subtotal() : 0;
  const hydrated = mounted && items.length > 0;

  const [mode, setMode] = useState("cart"); // cart | checkout | success
  const [form, setForm] = useState(INITIAL_CHECKOUT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const resetAndClose = () => {
    setMode("cart");
    setSubmitError("");
    setSubmitting(false);
    setForm(INITIAL_CHECKOUT);
    setOrderResult(null);
    closeCart();
  };

  const submitOrder = async () => {
    if (submitting) return;
    setSubmitError("");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.postal_code.trim() || !form.city.trim()) {
      setSubmitError("Please fill all required fields (name, phone, email, postal code, city).");
      return;
    }

    const products = items.map(normalizeOrderProduct).filter(Boolean);
    if (!products.length) {
      setSubmitError("No valid products found in cart.");
      return;
    }

    const payload = {
      customer: {
        type: 2,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address1: form.address1.trim() || undefined,
        postal_code: form.postal_code.trim(),
        city: form.city.trim(),
        country: (form.country || "SE").toUpperCase(),
      },
      products,
      delivery_option: 0,
      comments: form.notes.trim() ? [form.notes.trim()] : undefined,
    };

    try {
      setSubmitting(true);
      const result = await createOrder(payload);

      if (result?.err) throw new Error(result.err);

      const orderId = result?.data?.id || result?.id || null;
      const bookingUrl = result?.data?.booking_url || null;
      setOrderResult({ orderId, bookingUrl });
      clearCart();
      setMode("success");
    } catch (err) {
      const apiErr =
        err?.response?.data?.detail?.err ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not place order.";
      const msg = typeof apiErr === "string" ? apiErr : JSON.stringify(apiErr);
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-base-200 border border-base-300 rounded-lg text-sm focus:border-brand-yellow outline-none transition-colors";

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={resetAndClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-base-100 border-l border-base-300 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-yellow" />
            <span className="font-display text-lg font-bold uppercase tracking-wide">
              {mode === "checkout" ? "Checkout" : mode === "success" ? "Confirmed" : "Cart"}
            </span>
            {count > 0 && mode === "cart" && (
              <span className="badge badge-sm" style={{ background: "#F5C518", color: "#000" }}>
                {count}
              </span>
            )}
          </div>
          <button onClick={resetAndClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ─── SUCCESS ─── */}
          {mode === "success" && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <CheckCircle2 className="w-16 h-16 text-green-400" />
              <div>
                <p className="font-display text-xl font-bold uppercase tracking-wide">
                  Order Placed!
                </p>
                {orderResult?.orderId && (
                  <p className="text-sm text-base-content/60 mt-1">
                    Order ID: <span className="font-mono font-bold text-brand-yellow">#{orderResult.orderId}</span>
                  </p>
                )}
                <p className="text-sm text-base-content/50 mt-2">
                  Your order has been submitted to our system. We&apos;ll be in touch soon.
                </p>
                {orderResult?.bookingUrl && (
                  <a
                    href={orderResult.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm text-brand-yellow mt-3 underline underline-offset-2"
                  >
                    Book fitting appointment →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ─── CHECKOUT FORM ─── */}
          {mode === "checkout" && (
            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-sm text-base-content/60 mb-1">Fill your details to complete the order.</p>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full Name *" className={inputClass} />
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone *" type="tel" className={inputClass} />
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email *" type="email" className={inputClass} required />
              <input value={form.address1} onChange={(e) => setForm((p) => ({ ...p, address1: e.target.value }))} placeholder="Address" className={inputClass} />
              <div className="grid grid-cols-2 gap-2">
                <input value={form.postal_code} onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))} placeholder="Postal Code *" className={inputClass} />
                <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="City *" className={inputClass} />
              </div>
              <input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} placeholder="Country (SE)" className={`${inputClass} uppercase`} maxLength={2} />
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes (optional)" rows={2} className={inputClass} />
              {submitError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
                  {submitError}
                </p>
              )}
            </div>
          )}

          {/* ─── CART ITEMS ─── */}
          {mode === "cart" && mounted && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12 px-6">
              <ShoppingBag size={48} className="text-base-content/20" />
              <p className="text-base-content/50 font-body">Your cart is empty</p>
              <button onClick={resetAndClose} className="btn btn-sm btn-outline">
                Continue Shopping
              </button>
            </div>
          )}

          {mode === "cart" && mounted && items.length > 0 && (
            <div className="divide-y divide-base-300">
              {items.map((item) => {
                const imgUrl = productImageUrl(item);
                return (
                  <div key={item.id} className="flex gap-3 px-5 py-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-base-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={item.name || "Product"} width={64} height={64} className="object-contain" />
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-base-300" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      {item.brand && (
                        <p className="text-xs text-base-content/40 uppercase tracking-wider">{item.brand}</p>
                      )}
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      {(item.spec || item.rawDimension) && (
                        <p className="text-xs font-mono text-base-content/50">
                          {item.spec || (item.width && item.aspectRatio && item.diameter
                            ? `${item.width}/${item.aspectRatio}R${item.diameter}`
                            : item.rawDimension || "")}
                        </p>
                      )}
                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="join">
                          <button className="join-item btn btn-xs btn-ghost border border-base-300" onClick={() => updateQty(item.id, item.qty - 1)}>
                            <Minus size={10} />
                          </button>
                          <span className="join-item btn btn-xs btn-ghost border-y border-base-300 pointer-events-none w-8 font-mono">
                            {item.qty}
                          </span>
                          <button className="join-item btn btn-xs btn-ghost border border-base-300" onClick={() => updateQty(item.id, item.qty + 1)}>
                            <Plus size={10} />
                          </button>
                        </div>
                        <button className="btn btn-ghost btn-xs text-error ml-auto" onClick={() => removeItem(item.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-sm font-semibold text-brand-yellow">
                        {formatPrice(item.price * item.qty)}
                      </p>
                      {item.qty > 1 && (
                        <p className="text-xs text-base-content/40">
                          {formatPrice(item.price)} / ea
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {mounted && items.length > 0 && mode !== "success" && (
          <div className="px-5 py-4 border-t border-base-300 space-y-3 bg-base-200/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Subtotal (excl. VAT)</span>
              <span className="font-display text-lg font-bold">
                {formatPrice(totalOre)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-base-content/40">
              <span>Incl. VAT (25%)</span>
              <span>{formatPrice(Math.round(totalOre * 1.25))}</span>
            </div>

            {mode === "checkout" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode("cart"); setSubmitError(""); }}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-base-300 text-base-content text-sm font-semibold rounded-xl hover:bg-base-content/10 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={submitOrder}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>Place Order <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setSubmitError(""); setMode("checkout"); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
                <div className="flex justify-between">
                  <Link href="/cart" onClick={resetAndClose} className="text-xs text-base-content/50 hover:text-brand-yellow transition-colors">
                    Full cart page →
                  </Link>
                  <button onClick={clearCart} className="text-xs text-base-content/50 hover:text-error transition-colors">
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {mode === "success" && (
          <div className="px-5 py-4 border-t border-base-300">
            <button
              onClick={resetAndClose}
              className="w-full py-3.5 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
