"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Star, Check, AlertTriangle } from "lucide-react";
import { fetchProduct, formatPrice, seasonLabel, seasonBadgeClass, productImageUrl } from "@/lib/api";
import useCartStore from "@/store/cartStore";

function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <tr className="border-b border-base-300">
      <td className="py-2.5 pr-4 text-xs font-body uppercase tracking-wider text-base-content/50 whitespace-nowrap w-40">
        {label}
      </td>
      <td className="py-2.5 font-mono text-sm font-semibold">{value}</td>
    </tr>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(4); // Typically sold in sets of 4
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProduct(id);
        setProduct(
          data?.product ||
            data?.result?.product ||
            data?.data?.product ||
            data?.data ||
            data
        );
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
    const itemPriceOre = product.price || product.priceIncVat / 1.25;
    addItem(
      {
        id: cartItemId,
        name: product.name,
        brand: typeof product.brand === "string" ? product.brand : product?.brand?.name,
        price: itemPriceOre, // stored in öre
        imageUrl: productImageUrl(product),
        width: product.width,
        aspectRatio: product.aspectRatio,
        diameter: product.diameter,
        rawDimension: product.dimension,
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
            <div className="skeleton-shimmer h-12 w-full rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="font-display text-xl font-bold uppercase mb-2">Product Not Found</p>
        <p className="font-body text-base-content/50 mb-6">{error}</p>
        <Link href="/tyres">
          <button className="btn btn-outline font-body normal-case">← Back to Tyres</button>
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const imgUrl = productImageUrl(product);
  const priceOre = product.price || (product.priceIncVat ? product.priceIncVat / 1.25 : null);
  const seasonType = product.tyreType || product.season;
  const inStock = !product.quantityInStock || product.quantityInStock >= qty;

  return (
    <div className="bg-base-100 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-body text-base-content/40 mb-8">
          <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tyres" className="hover:text-brand-yellow transition-colors">Tyres</Link>
          <span>/</span>
          <span className="text-base-content/70">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image */}
          <div>
            <div className="relative aspect-square bg-base-200 rounded-2xl overflow-hidden border border-base-300">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-10"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg viewBox="0 0 200 200" className="w-48 h-48" fill="currentColor">
                    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="10" fill="none"/>
                    <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="6" fill="none"/>
                    <circle cx="100" cy="100" r="14" />
                  </svg>
                </div>
              )}
            </div>

            {/* EU Label */}
            {product.euLabel && (
              <div className="mt-4 p-4 bg-base-200 rounded-xl border border-base-300">
                <p className="text-xs font-body uppercase tracking-widest text-base-content/50 mb-3">
                  EU Label
                </p>
                <div className="flex gap-6">
                  {product.euLabel.rollingResistance && (
                    <div className="text-center">
                      <div className="text-2xl font-display font-black text-brand-yellow">
                        {product.euLabel.rollingResistance}
                      </div>
                      <p className="text-[10px] text-base-content/50">Rolling Resistance</p>
                    </div>
                  )}
                  {product.euLabel.wetGrip && (
                    <div className="text-center">
                      <div className="text-2xl font-display font-black text-brand-yellow">
                        {product.euLabel.wetGrip}
                      </div>
                      <p className="text-[10px] text-base-content/50">Wet Grip</p>
                    </div>
                  )}
                  {product.euLabel.noiseEmissionDecibel && (
                    <div className="text-center">
                      <div className="text-2xl font-display font-black text-brand-yellow">
                        {product.euLabel.noiseEmissionDecibel}
                        <span className="text-sm">dB</span>
                      </div>
                      <p className="text-[10px] text-base-content/50">Noise Level</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            {/* Brand + season */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-body font-semibold uppercase tracking-widest text-base-content/50">
                {product.brand}
              </span>
              {seasonType && (
                <span className={`badge badge-sm font-body font-semibold ${seasonBadgeClass(seasonType)}`}>
                  {seasonLabel(seasonType)}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="heading-display text-4xl md:text-5xl leading-none">
              {product.name}
            </h1>

            {/* Dimension */}
            <p className="font-mono text-base text-base-content/60">
              {product.width && product.aspectRatio && product.diameter
                ? `${product.width}/${product.aspectRatio} R${product.diameter}`
                : product.dimension}
              {product.speedIndex ? ` ${product.loadIndex || ""}${product.speedIndex}` : ""}
            </p>

            {/* Stars */}
            {product.testScore > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < product.testScore ? "fill-brand-yellow text-brand-yellow" : "text-base-content/20"}
                      fill={i < product.testScore ? "#F5C518" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm font-body text-base-content/50">
                  {product.testScore}/5 test score
                </span>
              </div>
            )}

            {/* Price */}
            {priceOre && (
              <div className="py-4 border-y border-base-300">
                <p className="heading-display text-5xl text-brand-yellow">
                  {formatPrice(priceOre)}
                </p>
                <p className="text-xs text-base-content/40 font-body mt-1">
                  excl. VAT · {formatPrice(priceOre, { inclVat: true })} incl. VAT
                </p>
              </div>
            )}

            {/* Stock */}
            <div className={`flex items-center gap-2 text-sm font-body ${inStock ? "text-success" : "text-error"}`}>
              {inStock ? <Check size={15} /> : <AlertTriangle size={15} />}
              {inStock
                ? `In stock${product.quantityInStock ? ` (${product.quantityInStock} available)` : ""}`
                : "Low stock — order soon"}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3">
              <div className="join">
                <button
                  className="join-item btn btn-outline btn-sm"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  −
                </button>
                <span className="join-item btn btn-outline btn-sm pointer-events-none w-12 font-mono">
                  {qty}
                </span>
                <button
                  className="join-item btn btn-outline btn-sm"
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="btn btn-lg flex-1 gap-2 font-display tracking-widest uppercase"
                style={{ background: "#F5C518", color: "#000", border: "none" }}
              >
                {added ? (
                  <><Check size={18} /> Added!</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </button>
            </div>

            {/* Specs table */}
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-base-content/50 mb-3 mt-2">
                Specifications
              </p>
              <table className="w-full">
                <tbody>
                  <SpecRow label="Article No." value={product.articleNo} />
                  <SpecRow label="Width" value={product.width ? `${product.width} mm` : null} />
                  <SpecRow label="Aspect Ratio" value={product.aspectRatio} />
                  <SpecRow label="Rim Diameter" value={product.diameter ? `${product.diameter}"` : null} />
                  <SpecRow label="Load Index" value={product.loadIndex} />
                  <SpecRow label="Speed Index" value={product.speedIndex} />
                  <SpecRow label="Run-Flat" value={product.isRunflat ? "Yes" : product.isRunflat === false ? "No" : null} />
                  <SpecRow label="Silent" value={product.isSilence ? "Yes" : null} />
                  <SpecRow label="EV Optimised" value={product.isElectricVehicle ? "Yes" : null} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-12 pt-8 border-t border-base-300">
          <Link href="/tyres">
            <button className="btn btn-ghost btn-sm gap-2 font-body normal-case text-base-content/50 hover:text-base-content">
              <ArrowLeft size={14} />
              Back to All Tyres
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
