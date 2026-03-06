"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { formatPrice, seasonLabel, seasonBadgeClass, productImageUrl } from "@/lib/api";
import useCartStore from "@/store/cartStore";

export default function ProductCard({ product, index = 0 }) {
  const { addItem, openCart } = useCartStore();

  if (!product) return null;

  const imgUrl = productImageUrl(product);
  const price = product.price || product.priceIncVat / 1.25;
  const seasonType = product.tyreType || product.season;

  function handleAdd(e) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price,
      imageUrl: imgUrl,
      width: product.width,
      aspectRatio: product.aspectRatio,
      diameter: product.diameter,
    });
    openCart();
  }

  return (
    <Link href={`/tyres/${product.id}`}>
      <div
        className="card bg-base-200 border border-base-300 card-hover group h-full cursor-pointer animate-fade-in"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      >
        {/* Image area */}
        <figure className="relative aspect-square overflow-hidden bg-base-300 rounded-t-2xl">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={product.name || "Tyre"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <TireSVG />
            </div>
          )}

          {/* Season badge */}
          {seasonType && (
            <span
              className={`badge badge-sm absolute top-3 left-3 font-body font-semibold ${seasonBadgeClass(
                seasonType
              )}`}
            >
              {seasonLabel(seasonType)}
            </span>
          )}

          {/* Stock warning */}
          {product.quantityInStock !== undefined && product.quantityInStock <= 4 && product.quantityInStock > 0 && (
            <span className="badge badge-sm badge-error absolute top-3 right-3 font-body">
              Low stock
            </span>
          )}
        </figure>

        <div className="card-body p-4 gap-1">
          {/* Brand */}
          <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-base-content/50">
            {product.brand || "—"}
          </p>

          {/* Name */}
          <h3 className="font-display text-lg font-bold uppercase leading-tight line-clamp-2 group-hover:text-brand-yellow transition-colors">
            {product.name || "Unnamed Tyre"}
          </h3>

          {/* Dimension */}
          <p className="font-mono text-xs text-base-content/50">
            {product.width && product.aspectRatio && product.diameter
              ? `${product.width}/${product.aspectRatio} R${product.diameter}`
              : product.dimension || "—"}
            {product.speedIndex ? ` ${product.loadIndex}${product.speedIndex}` : ""}
          </p>

          {/* Test rating stars */}
          {product.testScore > 0 && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < product.testScore ? "fill-brand-yellow text-brand-yellow" : "text-base-content/20"}
                  fill={i < product.testScore ? "#F5C518" : "none"}
                />
              ))}
            </div>
          )}

          {/* EU label */}
          {product.euLabel && (
            <div className="flex gap-2 text-[10px] text-base-content/50 font-mono mt-1">
              {product.euLabel.rollingResistance && (
                <span title="Rolling Resistance">⚙ {product.euLabel.rollingResistance}</span>
              )}
              {product.euLabel.wetGrip && (
                <span title="Wet Grip">💧 {product.euLabel.wetGrip}</span>
              )}
              {product.euLabel.noiseEmissionDecibel && (
                <span title="Noise">🔊 {product.euLabel.noiseEmissionDecibel}dB</span>
              )}
            </div>
          )}

          {/* Footer: price + add */}
          <div className="card-actions justify-between items-center mt-3 pt-3 border-t border-base-300">
            <div>
              <p className="font-display text-xl font-black text-gold leading-none">
                {formatPrice(price)}
              </p>
              <p className="text-[10px] text-base-content/40">excl. VAT</p>
            </div>
            <button
              onClick={handleAdd}
              className="btn btn-sm gap-1 font-body normal-case text-xs"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
              aria-label="Add to cart"
            >
              <ShoppingCart size={13} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TireSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-24 h-24 opacity-10" fill="currentColor">
      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" />
      <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="40" cy="40" r="5" />
      <line x1="40" y1="4" x2="40" y2="20" stroke="currentColor" strokeWidth="3" />
      <line x1="40" y1="60" x2="40" y2="76" stroke="currentColor" strokeWidth="3" />
      <line x1="4" y1="40" x2="20" y2="40" stroke="currentColor" strokeWidth="3" />
      <line x1="60" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
