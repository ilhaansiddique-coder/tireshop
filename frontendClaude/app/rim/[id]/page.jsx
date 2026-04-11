"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { fetchProduct, formatPrice, productImageUrl } from "@/lib/api";
import useCartStore from "@/store/cartStore";

function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <tr className="border-b border-base-300">
      <td className="py-2.5 pr-4 text-xs font-body uppercase tracking-wider text-base-content/50 whitespace-nowrap w-40">{label}</td>
      <td className="py-2.5 font-mono text-sm font-semibold">{value}</td>
    </tr>
  );
}

export default function RimDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(4);
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(id);
        setProduct(data?.product || data?.result?.product || data?.data?.product || data?.data || data);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  function handleAdd() {
    if (!product) return;
    const supplierId = Number(product?.supplier?.id ?? product?.supplier_id);
    const locationId = Number(product?.location?.id ?? product?.location_id);
    const productNumericId = Number(product?.productId ?? product?.product_id ?? product?.id);
    const orderProductId = Number.isFinite(productNumericId) ? productNumericId : null;
    const orderSupplierId = Number.isFinite(supplierId) ? supplierId : null;
    const orderLocationId = Number.isFinite(locationId) ? locationId : null;
    const cartItemId = orderProductId
      ? `${orderProductId}:${orderLocationId ?? 0}:${orderSupplierId ?? 0}`
      : String(product?.id || id);
    const price = product.price || product.priceIncVat / 1.25;
    addItem(
      {
        id: cartItemId,
        name: product.name || product.description,
        brand: typeof product.brand === "string" ? product.brand : product?.brand?.name,
        price,
        imageUrl: productImageUrl(product),
        orderProductId,
        orderSupplierId,
        orderLocationId,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  }

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton-shimmer aspect-square rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="skeleton-shimmer h-4 w-24 rounded" />
            <div className="skeleton-shimmer h-10 w-3/4 rounded" />
            <div className="skeleton-shimmer h-6 w-1/3 rounded" />
            <div className="skeleton-shimmer h-32 w-full rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 text-center">
        <p className="font-display text-xl font-bold uppercase mb-2">Product Not Found</p>
        <p className="font-body text-base-content/50 mb-6">{error}</p>
        <Link href="/rim"><button className="btn btn-outline font-body normal-case">Back to Rims</button></Link>
      </div>
    );
  }

  if (!product) return null;

  const imgUrl = productImageUrl(product);
  const price = product.price || (product.priceIncVat ? product.priceIncVat / 1.25 : null);
  const inStock = !product.quantityInStock || product.quantityInStock >= qty;

  const attrs = product.attrs || {};
  const rimWidth = attrs.width || product.width || product.rim_width;
  const rimDiameter = attrs.diameter || product.diameter;
  const etOffset = attrs.etOffset || product.rim_et || product.etOffset;
  const centreBore = attrs.centerBore || product.rim_centre_bore || product.centreBore;
  const boltPatterns = attrs.boltPatterns || product.rim_pcds || product.boltPatterns || [];
  const rimType = attrs.rimType?.name || product.rimType || product.rim_type_name;

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center gap-2 text-xs font-body text-base-content/40 mb-8">
          <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
          <span>/</span>
          <Link href="/rim" className="hover:text-brand-yellow transition-colors">Rims</Link>
          <span>/</span>
          <span className="text-base-content/70">{product.name || product.description}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="relative aspect-square bg-base-200 rounded-2xl overflow-hidden border border-base-300">
              {imgUrl ? (
                <Image src={imgUrl} alt={product.name || "Rim"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-10" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg viewBox="0 0 200 200" className="w-48 h-48" fill="currentColor">
                    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="10" fill="none" />
                    <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="6" fill="none" />
                    <circle cx="100" cy="100" r="14" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-body font-semibold uppercase tracking-widest text-base-content/50">
                {typeof product.brand === "string" ? product.brand : product?.brand?.name || "Rim"}
              </span>
              {rimType && <span className="badge badge-sm badge-outline font-body">{rimType}</span>}
            </div>

            <h1 className="heading-display text-4xl md:text-5xl leading-none">
              {product.name || product.description}
            </h1>

            <p className="font-mono text-base text-base-content/60">
              {rimWidth && rimDiameter ? `${rimWidth}x${rimDiameter}` : ""}
              {etOffset ? ` ET${etOffset}` : ""}
              {boltPatterns.length > 0 ? ` ${boltPatterns.join(", ")}` : ""}
            </p>

            {price && (
              <div className="py-4 border-y border-base-300">
                <p className="heading-display text-5xl text-brand-yellow">{formatPrice(price)}</p>
                <p className="text-xs text-base-content/40 font-body mt-1">excl. VAT · {formatPrice(price, { inclVat: true })} incl. VAT</p>
              </div>
            )}

            <div className={`flex items-center gap-2 text-sm font-body ${inStock ? "text-success" : "text-error"}`}>
              {inStock ? <Check size={15} /> : <AlertTriangle size={15} />}
              {inStock
                ? `In stock${product.quantityInStock ? ` (${product.quantityInStock} available)` : ""}`
                : "Low stock — order soon"}
            </div>

            <div className="flex items-center gap-3">
              <div className="join">
                <button className="join-item btn btn-outline btn-sm" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="join-item btn btn-outline btn-sm pointer-events-none w-12 font-mono">{qty}</span>
                <button className="join-item btn btn-outline btn-sm" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button onClick={handleAdd} className="btn btn-lg flex-1 gap-2 font-display tracking-widest uppercase" style={{ background: "#F5C518", color: "#000", border: "none" }}>
                {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
            </div>

            <div>
              <p className="text-xs font-body uppercase tracking-widest text-base-content/50 mb-3 mt-2">Specifications</p>
              <table className="w-full">
                <tbody>
                  <SpecRow label="Width" value={rimWidth ? `${rimWidth}"` : null} />
                  <SpecRow label="Diameter" value={rimDiameter ? `${rimDiameter}"` : null} />
                  <SpecRow label="Type" value={rimType} />
                  <SpecRow label="ET Offset" value={etOffset} />
                  <SpecRow label="Centre Bore" value={centreBore ? `${centreBore} mm` : null} />
                  <SpecRow label="Bolt Pattern" value={boltPatterns.length > 0 ? boltPatterns.join(", ") : null} />
                  <SpecRow label="Article No." value={product.articleNo || product.productId || product.product_id} />
                  <SpecRow label="EAN" value={product.ean} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-base-300">
          <Link href="/rim">
            <button className="btn btn-ghost btn-sm gap-2 font-body normal-case text-base-content/50 hover:text-base-content">
              <ArrowLeft size={14} /> Back to All Rims
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
