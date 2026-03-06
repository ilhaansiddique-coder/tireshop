"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  Zap,
  Wind,
  Droplets,
  Volume2,
  Check,
  Info,
} from "lucide-react";
import { useCartStore } from "../store";

function EuLabelBadge({ value, type }) {
  if (!value) return null;
  const colors = {
    A: "bg-green-500",
    B: "bg-lime-500",
    C: "bg-yellow-500",
    D: "bg-orange-400",
    E: "bg-orange-500",
    F: "bg-red-500",
    G: "bg-red-700",
  };
  const bg = colors[value?.toUpperCase()] || "bg-brand-muted";
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold text-white ${bg}`}
    >
      {value}
    </span>
  );
}

function StockBadge({ quantity }) {
  if (!quantity) return null;
  const isLow = quantity <= 4;
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        isLow
          ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
          : "bg-green-500/10 text-green-400 border-green-500/30"
      }`}
    >
      {isLow ? `Only ${quantity} left` : `${quantity} in stock`}
    </span>
  );
}

export default function ProductCard({ product, style }) {
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Normalise product fields — the API may vary
  const name = product?.brandName || product?.brand?.name || "—";
  const model = product?.productName || product?.name || product?.model || "";
  const price = product?.price || product?.priceIncVat || product?.priceExVat || null;
  const currency = product?.currency || "SEK";
  const firstImage = Array.isArray(product?.images) ? product.images[0] : null;
  const imageUrl =
    product?.imageUrl ||
    product?.image?.webshop_thumb ||
    (typeof product?.image === "string" ? product.image : product?.image?.url) ||
    (typeof firstImage === "string" ? firstImage : firstImage?.url) ||
    null;
  const diameter = product?.diameter || product?.dimension?.diameter || "";
  const width = product?.width || product?.dimension?.width || "";
  const aspectRatio = product?.aspectRatio || product?.dimension?.aspectRatio || "";
  const speedIndex = product?.speedIndex || "";
  const loadIndex = product?.loadIndex || "";
  const stock = product?.quantityInStock ?? product?.stockQuantity ?? null;

  // EU label data
  const rollingResistance = product?.rollingResistance || "";
  const wetGrip = product?.wetGrip || "";
  const noiseDb = product?.noiseEmissionDecibel || product?.noiseDecibel || "";

  const dimensionStr = [width, aspectRatio, diameter].filter(Boolean).join("/");
  const fullSpec = dimensionStr ? `${dimensionStr} ${speedIndex}${loadIndex}`.trim() : "";
  const idParts =
    typeof product?.id === "string" && product.id.includes(":")
      ? product.id.split(":")
      : [];
  const parsedProductId = idParts[0] ? Number(idParts[0]) : NaN;
  const parsedSupplierId = idParts[1] ? Number(idParts[1]) : NaN;
  const parsedLocationId = idParts[2] ? Number(idParts[2]) : NaN;
  const orderProductId = Number(
    product?.productId ??
      product?.articleNumber ??
      (Number.isFinite(parsedProductId) ? parsedProductId : NaN)
  );
  const orderSupplierId = Number(
    product?.supplier?.id ??
      (Number.isFinite(parsedSupplierId) ? parsedSupplierId : NaN)
  );
  const orderLocationId = Number(
    product?.location?.id ??
      (Number.isFinite(parsedLocationId) ? parsedLocationId : NaN)
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      id: product.id || product.articleNumber,
      name: `${name} ${model}`,
      price: parseFloat(price) || 0,
      currency,
      imageUrl,
      spec: fullSpec,
      orderProductId: Number.isFinite(orderProductId) ? orderProductId : null,
      orderSupplierId: Number.isFinite(orderSupplierId) ? orderSupplierId : null,
      orderLocationId: Number.isFinite(orderLocationId) ? orderLocationId : null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="card-lift bg-brand-card border border-brand-border rounded-xl overflow-hidden flex flex-col cursor-pointer group"
      style={style}
    >
      {/* Image area */}
      <div className="relative h-44 bg-brand-surface flex items-center justify-center overflow-hidden">
        {imageUrl && !imageFailed ? (
          <Image
            src={imageUrl}
            alt={`${name} ${model}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-border">
            <div className="w-20 h-20 rounded-full border-4 border-brand-border flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-border" />
            </div>
            <span className="text-xs text-brand-muted">No image</span>
          </div>
        )}

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-brand-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Brand + model */}
        <div>
          <p className="font-display text-xs font-600 tracking-[0.15em] uppercase text-brand-yellow">
            {name}
          </p>
          <h3 className="font-body text-sm font-medium text-brand-text mt-0.5 leading-snug line-clamp-2">
            {model}
          </h3>
        </div>

        {/* Spec */}
        {fullSpec && (
          <p className="font-mono text-xs text-brand-muted bg-brand-surface px-2 py-1 rounded inline-block self-start">
            {fullSpec}
          </p>
        )}

        {/* EU Labels */}
        {(rollingResistance || wetGrip || noiseDb) && (
          <div className="flex items-center gap-2 flex-wrap">
            {rollingResistance && (
              <div className="flex items-center gap-1 text-xs text-brand-muted">
                <Zap className="w-3 h-3" />
                <EuLabelBadge value={rollingResistance} />
              </div>
            )}
            {wetGrip && (
              <div className="flex items-center gap-1 text-xs text-brand-muted">
                <Droplets className="w-3 h-3" />
                <EuLabelBadge value={wetGrip} />
              </div>
            )}
            {noiseDb && (
              <div className="flex items-center gap-1 text-xs text-brand-muted">
                <Volume2 className="w-3 h-3" />
                <span className="font-mono text-brand-muted">{noiseDb}dB</span>
              </div>
            )}
          </div>
        )}

        {/* Stock */}
        {stock !== null && (
          <div>
            <StockBadge quantity={stock} />
          </div>
        )}

        {/* Footer: Price + CTA */}
        <div className="mt-auto pt-3 border-t border-brand-border flex items-center justify-between gap-2">
          <div>
            {price ? (
              <>
                <p className="font-display text-xl font-bold text-brand-text tracking-tight">
                  {parseFloat(price).toLocaleString("sv-SE", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-[10px] text-brand-muted uppercase tracking-wide">{currency} / each</p>
              </>
            ) : (
              <p className="text-sm text-brand-muted">Price on request</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white"
                : "bg-brand-yellow text-brand-dark hover:bg-brand-amber"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
