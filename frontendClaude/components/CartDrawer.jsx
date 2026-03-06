"use client";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag } from "lucide-react";
import useCartStore from "@/store/cartStore";
import { formatPrice, productImageUrl } from "@/lib/api";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, itemCount, subtotal } =
    useCartStore();

  const count = itemCount();
  const total = subtotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-base-100 border-l border-base-300 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-yellow" />
            <span className="font-display text-lg font-bold uppercase tracking-wide">
              Cart
            </span>
            {count > 0 && (
              <span className="badge badge-sm" style={{ background: "#F5C518", color: "#000" }}>
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="btn btn-ghost btn-sm btn-circle">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <ShoppingBag size={48} className="text-base-content/20" />
              <p className="text-base-content/50 font-body">Your cart is empty</p>
              <button onClick={closeCart} className="btn btn-sm btn-outline">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const imgUrl = productImageUrl(item);
              return (
                <div key={item.id} className="flex gap-3 items-start">
                  {/* Image */}
                  <div className="w-16 h-16 bg-base-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.name || "Tyre"}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <TirePlaceholder />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-base-content/50 uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-base-content/50">
                      {item.width && item.aspectRatio && item.diameter
                        ? `${item.width}/${item.aspectRatio}R${item.diameter}`
                        : item.rawDimension || "-"}
                    </p>

                    {/* Qty + remove */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="join">
                        <button
                          className="join-item btn btn-xs btn-ghost border border-base-300"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="join-item btn btn-xs btn-ghost border-y border-base-300 pointer-events-none w-8">
                          {item.qty}
                        </span>
                        <button
                          className="join-item btn btn-xs btn-ghost border border-base-300"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-ghost btn-xs text-error ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-sm font-semibold text-gold">
                      {formatPrice(item.price * item.qty)}
                    </p>
                    {item.qty > 1 && (
                      <p className="text-xs text-base-content/40">
                        {formatPrice(item.price)} each
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-base-300 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Subtotal (excl. VAT)</span>
              <span className="font-display text-lg font-bold text-gold">
                {formatPrice(total)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-base-content/40">
              <span>Incl. VAT (25%)</span>
              <span>{formatPrice(total * 1.25)}</span>
            </div>
            <Link href="/cart" onClick={closeCart}>
              <button
                className="btn w-full font-display tracking-widest text-sm uppercase"
                style={{ background: "#F5C518", color: "#000", border: "none" }}
              >
                Proceed to Checkout →
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

function TirePlaceholder() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 opacity-20" fill="currentColor">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="24" cy="24" r="3" />
    </svg>
  );
}
