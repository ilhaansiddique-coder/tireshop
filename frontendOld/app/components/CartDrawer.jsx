"use client";
import { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "../store";
import { createOrder } from "../lib/api";
import Image from "next/image";

const initialCheckout = {
  name: "",
  phone: "",
  email: "",
  address1: "",
  address2: "",
  postal_code: "",
  city: "",
  country: "SE",
  reference: "",
  comment: "",
};

function normalizeOrderProduct(item) {
  const idFromComposite =
    typeof item.id === "string" && item.id.includes(":")
      ? Number(item.id.split(":")[0])
      : NaN;
  const supplierFromComposite =
    typeof item.id === "string" && item.id.includes(":")
      ? Number(item.id.split(":")[1])
      : NaN;
  const locationFromComposite =
    typeof item.id === "string" && item.id.includes(":")
      ? Number(item.id.split(":")[2])
      : NaN;

  const id = Number(
    item.orderProductId ??
      (Number.isFinite(idFromComposite) ? idFromComposite : NaN)
  );
  if (!Number.isFinite(id)) return null;

  const supplier = Number(
    item.orderSupplierId ??
      (Number.isFinite(supplierFromComposite) ? supplierFromComposite : NaN)
  );
  const location = Number(
    item.orderLocationId ??
      (Number.isFinite(locationFromComposite) ? locationFromComposite : NaN)
  );

  return {
    id,
    quantity: Number(item.qty || 1),
    ...(Number.isFinite(supplier) ? { supplier } : {}),
    ...(Number.isFinite(location) ? { location } : {}),
  };
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQty, removeItem, clearCart } = useCartStore();
  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
  const count = items.reduce((sum, i) => sum + (i.qty || 0), 0);
  const isEmpty = items.length === 0;

  const [mode, setMode] = useState("cart"); // cart | checkout | success
  const [checkout, setCheckout] = useState(initialCheckout);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const resetAndClose = () => {
    setMode("cart");
    setSubmitError("");
    setSubmitting(false);
    setCheckout(initialCheckout);
    setOrderResult(null);
    onClose();
  };

  const submitOrder = async () => {
    if (submitting) return;
    setSubmitError("");

    if (
      !checkout.name.trim() ||
      !checkout.phone.trim() ||
      !checkout.postal_code.trim() ||
      !checkout.city.trim() ||
      !checkout.country.trim()
    ) {
      setSubmitError("Please fill all required customer fields.");
      return;
    }

    const products = items
      .map((item) => normalizeOrderProduct(item))
      .filter(Boolean);

    if (!products.length) {
      setSubmitError("No valid products found in cart for order.");
      return;
    }

    const payload = {
      customer: {
        type: 2,
        name: checkout.name.trim(),
        phone: checkout.phone.trim(),
        email: checkout.email.trim() || undefined,
        address1: checkout.address1.trim() || undefined,
        address2: checkout.address2.trim() || undefined,
        postal_code: checkout.postal_code.trim(),
        city: checkout.city.trim(),
        country: checkout.country.trim().toUpperCase(),
      },
      products,
      delivery_option: 0,
      comments: checkout.comment.trim() ? [checkout.comment.trim()] : undefined,
      references: checkout.reference.trim()
        ? [{ label: "Reference", value: checkout.reference.trim() }]
        : undefined,
    };

    try {
      setSubmitting(true);
      const result = await createOrder(payload);
      const orderId = result?.data?.id || result?.id || null;
      const bookingUrl = result?.data?.booking_url || result?.booking_url || null;
      setOrderResult({ orderId, bookingUrl });
      clearCart();
      setMode("success");
    } catch (err) {
      setSubmitError(err.message || "Could not complete order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={resetAndClose}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-brand-surface border-l border-brand-border flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-yellow" />
            <h2 className="font-display text-xl font-bold tracking-wide uppercase">
              {mode === "checkout" ? "Checkout" : mode === "success" ? "Order" : "Cart"}
              {count > 0 && mode !== "success" && (
                <span className="ml-2 text-brand-yellow">({count})</span>
              )}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 text-brand-muted hover:text-brand-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {mode === "success" ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-brand-text">
                  Order created
                </p>
                {orderResult?.orderId && (
                  <p className="text-sm text-brand-muted mt-1">
                    Order ID: <span className="text-brand-text">{orderResult.orderId}</span>
                  </p>
                )}
                {orderResult?.bookingUrl && (
                  <a
                    href={orderResult.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm text-brand-yellow mt-2 underline"
                  >
                    Open booking link
                  </a>
                )}
              </div>
            </div>
          ) : mode === "checkout" ? (
            <div className="px-6 flex flex-col gap-3">
              <p className="text-sm text-brand-muted">
                Fill customer details to complete order.
              </p>
              <input
                value={checkout.name}
                onChange={(e) => setCheckout((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name *"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <input
                value={checkout.phone}
                onChange={(e) => setCheckout((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone *"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <input
                value={checkout.email}
                onChange={(e) => setCheckout((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <input
                value={checkout.address1}
                onChange={(e) => setCheckout((p) => ({ ...p, address1: e.target.value }))}
                placeholder="Address line 1"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <input
                value={checkout.address2}
                onChange={(e) => setCheckout((p) => ({ ...p, address2: e.target.value }))}
                placeholder="Address line 2"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={checkout.postal_code}
                  onChange={(e) => setCheckout((p) => ({ ...p, postal_code: e.target.value }))}
                  placeholder="Postal code *"
                  className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
                />
                <input
                  value={checkout.city}
                  onChange={(e) => setCheckout((p) => ({ ...p, city: e.target.value }))}
                  placeholder="City *"
                  className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
                />
              </div>
              <input
                value={checkout.country}
                onChange={(e) => setCheckout((p) => ({ ...p, country: e.target.value }))}
                placeholder="Country code (e.g. SE) *"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text uppercase"
              />
              <input
                value={checkout.reference}
                onChange={(e) => setCheckout((p) => ({ ...p, reference: e.target.value }))}
                placeholder="Reference"
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              <textarea
                value={checkout.comment}
                onChange={(e) => setCheckout((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Internal note / comment"
                rows={3}
                className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-brand-text"
              />
              {submitError && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded px-2 py-1">
                  {submitError}
                </p>
              )}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-brand-muted" />
              </div>
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-wide text-brand-text">
                  Your cart is empty
                </p>
                <p className="text-sm text-brand-muted mt-1">
                  Add tyres to get started
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="px-5 py-2.5 bg-brand-yellow text-brand-dark text-sm font-semibold rounded-lg hover:bg-brand-amber transition-colors"
              >
                Browse Tyres
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 px-6 py-4 border-b border-brand-border hover:bg-brand-card/30 transition-colors"
                >
                  <div className="w-16 h-16 bg-brand-card rounded-lg flex-shrink-0 relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-brand-border" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">{item.name}</p>
                    {item.spec && (
                      <p className="text-xs font-mono text-brand-muted mt-0.5">{item.spec}</p>
                    )}
                    <p className="text-sm font-bold text-brand-yellow mt-1">
                      {(item.price * item.qty).toLocaleString("sv-SE", {
                        minimumFractionDigits: 0,
                      })}{" "}
                      {item.currency}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-brand-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 bg-brand-card rounded-lg border border-brand-border">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-1.5 text-brand-muted hover:text-brand-text transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-mono text-brand-text">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-1.5 text-brand-muted hover:text-brand-text transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isEmpty && mode !== "success" && (
          <div className="border-t border-brand-border px-6 py-5 bg-brand-card/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-brand-muted">Subtotal ({count} items)</span>
              <span className="font-display text-2xl font-bold text-brand-text">
                {total.toLocaleString("sv-SE", { minimumFractionDigits: 0 })} SEK
              </span>
            </div>

            {mode === "checkout" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("cart")}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-brand-card border border-brand-border text-brand-text font-semibold text-sm rounded-xl hover:border-brand-yellow/50 transition-colors"
                  disabled={submitting}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={submitOrder}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? "Placing..." : "Place Order"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSubmitError("");
                    setMode("checkout");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-2 py-2 text-xs text-brand-muted hover:text-brand-text transition-colors"
                >
                  Clear Cart
                </button>
              </>
            )}
          </div>
        )}

        {mode === "success" && (
          <div className="border-t border-brand-border px-6 py-5 bg-brand-card/40">
            <button
              onClick={resetAndClose}
              className="w-full py-3.5 bg-brand-yellow text-brand-dark font-bold text-sm rounded-xl hover:bg-brand-amber transition-colors uppercase tracking-wide"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  );
}
