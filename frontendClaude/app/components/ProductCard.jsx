"use client";
import { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Zap,
  Droplets,
  Volume2,
  Check,
} from "lucide-react";
import { useCartStore } from "../store";
import { productImageUrl, formatPrice } from "@/lib/api";

function EuLabelBadge({ value }) {
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
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold text-white ${bg}`}>
      {value}
    </span>
  );
}

function StockBadge({ quantity }) {
  if (quantity === null || quantity === undefined) return null;
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

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function ProductCard({ product, style }) {
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // ── Brand: search API (brand.name) + export API (brand_name) ──
  const name =
    product?.brandName ||
    product?.brand?.name ||
    product?.brand_name ||
    product?.tyre_brand_name ||
    product?.rim_brand_name ||
    (typeof product?.brand === "string" ? product.brand : null) ||
    "—";

  // ── Model/Product name ──
  const model =
    product?.productName ||
    product?.name ||
    product?.description ||
    product?.model_name ||
    product?.tyre_model_name ||
    product?.rim_model_name ||
    (typeof product?.model === "string" ? product.model : product?.model?.name) ||
    "";

  // ── Price (in öre from API) ──
  const priceOre =
    product?.price ?? product?.priceIncVat ?? product?.priceExVat ?? null;

  // ── Image ──
  const imageUrl = productImageUrl(product);

  // ── Dimensions ──
  const diameter = product?.diameter || product?.dimension?.diameter || "";
  const width = product?.width || product?.dimension?.width || "";
  const aspectRatio = product?.aspectRatio || product?.aspect_ratio || product?.dimension?.aspectRatio || "";
  const speedIndex = product?.speedIndex || product?.tyre_speed_index || "";
  const loadIndex = product?.loadIndex || product?.tyre_load_index || "";
  const stock = product?.quantityInStock ?? product?.stockQuantity ?? product?.stock ?? null;

  // ── EU label data ──
  const rollingResistance = product?.rollingResistance || product?.tyre_rolling_resistance || "";
  const wetGrip = product?.wetGrip || product?.tyre_wet_grip || "";
  const noiseDb = product?.noiseEmissionDecibel || product?.noiseDecibel || product?.tyre_noise_emission_decibel || "";

  const dimensionStr = [width, aspectRatio, diameter].filter(Boolean).join("/");
  const fullSpec = dimensionStr ? `${dimensionStr} ${speedIndex}${loadIndex}`.trim() : "";

  // ── Cart IDs ──
  const orderProductId =
    toNumber(product?.orderProductId) ??
    toNumber(product?.product_id) ??
    toNumber(product?.productId);
  const orderSupplierId =
    toNumber(product?.orderSupplierId) ??
    toNumber(product?.supplier?.id) ??
    toNumber(product?.supplier_id);
  const orderLocationId =
    toNumber(product?.orderLocationId) ??
    toNumber(product?.location?.id) ??
    toNumber(product?.location_id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const cartItemId =
      orderProductId !== null
        ? `${orderProductId}:${orderLocationId ?? 0}:${orderSupplierId ?? 0}`
        : String(product.id || product.articleNumber);
    addItem({
      id: cartItemId,
      name: `${name} ${model}`,
      price: priceOre,
      imageUrl,
      spec: fullSpec,
      orderProductId,
      orderSupplierId,
      orderLocationId,
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
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-border">
            <div className="w-20 h-20 rounded-full border-4 border-brand-border flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-border" />
            </div>
            <span className="text-xs text-brand-muted">No image</span>
          </div>
        )}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-brand-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="font-display text-xs font-600 tracking-[0.15em] uppercase text-brand-yellow">
            {name}
          </p>
          <h3 className="font-body text-sm font-medium text-brand-text mt-0.5 leading-snug line-clamp-2">
            {model}
          </h3>
        </div>

        {fullSpec && (
          <p className="font-mono text-xs text-brand-muted bg-brand-surface px-2 py-1 rounded inline-block self-start">
            {fullSpec}
          </p>
        )}

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

        {stock !== null && (
          <div>
            <StockBadge quantity={stock} />
          </div>
        )}

        {/* Footer: Price + CTA */}
        <div className="mt-auto pt-3 border-t border-brand-border flex items-center justify-between gap-2">
          <div>
            {priceOre ? (
              <>
                <p className="font-display text-xl font-bold text-brand-text tracking-tight">
                  {formatPrice(priceOre)}
                </p>
                <p className="text-[10px] text-brand-muted uppercase tracking-wide">SEK / each</p>
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
