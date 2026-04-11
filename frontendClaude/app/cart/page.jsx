"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { formatPrice, productImageUrl, createOrder } from "@/lib/api";

function FormField({ label, name, type = "text", required, value, onChange, placeholder }) {
  return (
    <div className="form-control">
      <label className="label py-1">
        <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered input-sm font-body text-sm"
      />
    </div>
  );
}

const INITIAL_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", postalCode: "", country: "SE",
  notes: "",
};

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeOrderProduct(item) {
  const parts =
    typeof item?.id === "string" && item.id.includes(":")
      ? item.id.split(":")
      : [];

  const id =
    toNumber(item?.orderProductId) ??
    toNumber(parts[0]) ??
    toNumber(item?.productId) ??
    toNumber(item?.id);

  if (!id) return null;

  const supplier = toNumber(item?.orderSupplierId) ?? toNumber(parts[2]);
  const location = toNumber(item?.orderLocationId) ?? toNumber(parts[1]);

  return {
    id,
    quantity: Math.max(1, Number(item?.qty) || 1),
    ...(supplier ? { supplier } : {}),
    ...(location ? { location } : {}),
  };
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, itemCount, subtotal } = useCartStore();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const count = itemCount();
  const sub = subtotal();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);

    try {
      const products = items.map((item) => normalizeOrderProduct(item)).filter(Boolean);
      if (!products.length) {
        throw new Error("No valid products found in cart.");
      }

      const payload = {
        customer: {
          type: 2,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address1: form.address || undefined,
          postal_code: form.postalCode,
          city: form.city,
          country: (form.country || "SE").toUpperCase(),
        },
        products,
        delivery_option: 0,
        comments: form.notes ? [form.notes] : undefined,
      };

      const result = await createOrder(payload);
      if (result?.err) {
        throw new Error(result.err);
      }
      setOrderSuccess(result?.data?.id || result?.orderId || result?.id || "Confirmed");
      clearCart();
    } catch (err) {
      setOrderError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err.message ||
        "Could not place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#F5C518" }}
          >
            <Check size={36} color="#000" />
          </div>
          <h1 className="heading-display text-4xl mb-3">Order Confirmed!</h1>
          <p className="font-body text-base-content/60 mb-2">
            Your order <strong className="text-brand-yellow">#{orderSuccess}</strong> has been placed.
          </p>
          <p className="font-body text-base-content/50 text-sm mb-8">
            We&apos;ll send a confirmation to your email address shortly.
          </p>
          <Link href="/">
            <button className="btn font-display tracking-widest uppercase" style={{ background: "#F5C518", color: "#000", border: "none" }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (count === 0) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag size={56} className="mx-auto mb-4 text-base-content/20" />
          <h1 className="heading-display text-4xl mb-3">Your Cart is Empty</h1>
          <p className="font-body text-base-content/50 mb-8">Add some tyres and come back!</p>
          <Link href="/">
            <button className="btn font-display tracking-widest uppercase" style={{ background: "#F5C518", color: "#000", border: "none" }}>
              Browse Tyres
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
        {/* Breadcrumb */}
        <Link href="/">
          <button className="btn btn-ghost btn-sm gap-2 font-body normal-case text-base-content/50 mb-8">
            <ArrowLeft size={14} />
            Continue Shopping
          </button>
        </Link>

        <h1 className="heading-display text-4xl md:text-5xl mb-8">
          Your <span style={{ color: "#F5C518" }}>Cart</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const imgUrl = productImageUrl(item);
              return (
                <div key={item.id} className="card bg-base-200 border border-base-300">
                  <div className="card-body p-4 flex-row gap-4 items-center">
                    {/* Image */}
                    <div className="w-20 h-20 bg-base-300 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={item.name} width={80} height={80} className="object-contain" />
                      ) : (
                        <svg viewBox="0 0 48 48" className="w-10 h-10 opacity-20" fill="currentColor">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
                          <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-body uppercase tracking-widest text-base-content/40">{item.brand}</p>
                      <p className="font-display font-bold text-base truncate">{item.name}</p>
                      <p className="font-mono text-xs text-base-content/50">
                        {item.width && item.aspectRatio && item.diameter
                          ? `${item.width}/${item.aspectRatio} R${item.diameter}`
                          : item.rawDimension || "-"}
                      </p>
                    </div>

                    {/* Qty */}
                    <div className="join flex-shrink-0">
                      <button className="join-item btn btn-xs btn-ghost border border-base-300" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span className="join-item btn btn-xs btn-ghost border-y border-base-300 pointer-events-none w-10 font-mono">{item.qty}</span>
                      <button className="join-item btn btn-xs btn-ghost border border-base-300" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>

                    {/* Price + delete */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-display font-black text-lg text-brand-yellow">{formatPrice(item.price * item.qty)}</p>
                      <p className="text-[10px] text-base-content/30">{formatPrice(item.price)} / each</p>
                    </div>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => removeItem(item.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary + form */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="card bg-base-200 border border-base-300">
              <div className="card-body p-5 gap-3">
                <h2 className="font-display font-bold uppercase tracking-widest text-sm">Order Summary</h2>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-base-content/60">Subtotal (excl. VAT)</span>
                  <span className="font-semibold">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-base-content/60">VAT (25%)</span>
                  <span className="font-semibold">{formatPrice(Math.round(sub * 0.25))}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-base-content/60">Shipping</span>
                  <span className="text-success font-semibold">Free</span>
                </div>
                <div className="divider my-1" />
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-sm text-base-content/60">Total incl. VAT</span>
                  <span className="heading-display text-2xl text-brand-yellow">{formatPrice(Math.round(sub * 1.25))}</span>
                </div>
              </div>
            </div>

            {/* Checkout form */}
            <form onSubmit={handleSubmit} className="card bg-base-200 border border-base-300">
              <div className="card-body p-5 gap-4">
                <h2 className="font-display font-bold uppercase tracking-widest text-sm">Delivery Details</h2>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="First Name" name="firstName" required value={form.firstName} onChange={handleChange} />
                  <FormField label="Last Name" name="lastName" required value={form.lastName} onChange={handleChange} />
                </div>
                <FormField label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                <FormField label="Phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+46 70 000 00 00" />
                <FormField label="Address" name="address" required value={form.address} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="City" name="city" required value={form.city} onChange={handleChange} />
                  <FormField label="Postal Code" name="postalCode" required value={form.postalCode} onChange={handleChange} />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-body uppercase tracking-wider text-base-content/50">Notes (optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    className="textarea textarea-bordered textarea-sm font-body text-sm h-20"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions…"
                  />
                </div>

                {orderError && (
                  <div className="alert alert-error text-sm font-body">
                    <span>{orderError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn w-full font-display tracking-widest uppercase"
                  style={{ background: "#F5C518", color: "#000", border: "none" }}
                >
                  {submitting ? <span className="loading loading-spinner loading-sm" /> : "Place Order →"}
                </button>

                <p className="text-[10px] font-body text-base-content/30 text-center">
                  By placing an order you agree to our Terms & Conditions.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
