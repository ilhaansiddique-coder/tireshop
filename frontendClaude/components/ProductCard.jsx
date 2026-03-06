"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { formatPrice, seasonLabel, seasonBadgeClass, productImageUrl } from "@/lib/api";
import useCartStore from "@/store/cartStore";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function ProductCard({ product, index = 0, linkToDetail = true }) {
  const { addItem, openCart } = useCartStore();

  if (!product) return null;

  const attrs = product?.attrs || {};
  const brand =
    typeof product?.brand === "string"
      ? product.brand
      : product?.brand?.name || product?.brandName || "-";
  const name =
    product?.name ||
    product?.productName ||
    product?.model?.name ||
    product?.model ||
    "Unnamed Tyre";

  const width = product?.width || attrs?.width;
  const aspectRatio = product?.aspectRatio || attrs?.aspectRatio;
  const diameter = product?.diameter || attrs?.diameter;
  const loadIndex = product?.loadIndex || attrs?.loadIndex;
  const speedIndex = product?.speedIndex || attrs?.speedIndex;

  const stock = product?.quantityInStock ?? product?.stock ?? product?.stockQuantity;
  const productId = product?.id || product?.productId;
  const orderProductId =
    toNumber(product?.orderProductId) ??
    toNumber(product?.product_id) ??
    toNumber(product?.productId);
  const orderSupplierId = toNumber(product?.orderSupplierId) ?? toNumber(product?.supplier_id);
  const orderLocationId = toNumber(product?.orderLocationId) ?? toNumber(product?.location_id);
  const cartItemId =
    orderProductId !== null
      ? `${orderProductId}:${orderLocationId ?? 0}:${orderSupplierId ?? 0}`
      : String(productId || `tmp-${index}`);

  const seasonType =
    product?.tyreType ||
    product?.season ||
    attrs?.tyreType?.id ||
    attrs?.compoundType?.id;

  const euLabel = product?.euLabel || {
    rollingResistance: product?.rollingResistance || attrs?.rollingResistance,
    wetGrip: product?.wetGrip || attrs?.wetGrip,
    noiseEmissionDecibel: product?.noiseEmissionDecibel || attrs?.noiseDecibel,
  };

  const imgUrl = productImageUrl(product);
  const price =
    product?.price ??
    product?.consumerPrice ??
    product?.priceExVat ??
    (typeof product?.priceIncVat === "number" ? product.priceIncVat / 1.25 : null);

  function handleAdd(e) {
    e.preventDefault();
    addItem({
      id: cartItemId,
      name,
      brand,
      price,
      imageUrl: imgUrl,
      width,
      aspectRatio,
      diameter,
      rawDimension: product?.dimension || attrs?.dimension || "",
      orderProductId,
      orderSupplierId,
      orderLocationId,
    });
    openCart();
  }

  const CardContent = (
    <div
      className="card bg-base-200 border border-base-300 card-hover group h-full cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <figure className="relative aspect-square overflow-hidden bg-base-300 rounded-t-2xl">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={name || "Tyre"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <TireSVG />
          </div>
        )}

        {seasonType && (
          <span
            className={`badge badge-sm absolute top-3 left-3 font-body font-semibold ${seasonBadgeClass(
              seasonType
            )}`}
          >
            {seasonLabel(seasonType)}
          </span>
        )}

        {stock !== undefined && stock <= 4 && stock > 0 && (
          <span className="badge badge-sm badge-error absolute top-3 right-3 font-body">
            Low stock
          </span>
        )}
      </figure>

      <div className="card-body p-4 gap-1">
        <p className="text-[11px] font-body font-semibold uppercase tracking-widest text-base-content/50">
          {brand}
        </p>

        <h3 className="font-display text-lg font-bold uppercase leading-tight line-clamp-2 group-hover:text-brand-yellow transition-colors">
          {name}
        </h3>

        <p className="font-mono text-xs text-base-content/50">
          {width && aspectRatio && diameter
            ? `${width}/${aspectRatio} R${diameter}`
            : product?.dimension || attrs?.dimension || "-"}
          {speedIndex ? ` ${loadIndex || ""}${speedIndex}` : ""}
        </p>

        {(product?.testScore || attrs?.testResult) > 0 && (
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < (product?.testScore || attrs?.testResult)
                    ? "fill-brand-yellow text-brand-yellow"
                    : "text-base-content/20"
                }
                fill={
                  i < (product?.testScore || attrs?.testResult) ? "#F5C518" : "none"
                }
              />
            ))}
          </div>
        )}

        {(euLabel?.rollingResistance || euLabel?.wetGrip || euLabel?.noiseEmissionDecibel) && (
          <div className="flex gap-2 text-[10px] text-base-content/50 font-mono mt-1">
            {euLabel?.rollingResistance && (
              <span title="Rolling Resistance">RR {euLabel.rollingResistance}</span>
            )}
            {euLabel?.wetGrip && <span title="Wet Grip">WG {euLabel.wetGrip}</span>}
            {euLabel?.noiseEmissionDecibel && (
              <span title="Noise">NO {euLabel.noiseEmissionDecibel}dB</span>
            )}
          </div>
        )}

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
  );

  if (!linkToDetail) {
    return CardContent;
  }

  return (
    <Link href={`/tyres/${productId}`}>
      {CardContent}
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
