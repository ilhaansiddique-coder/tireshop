"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Car, Snowflake, Sun, ArrowRight, AlertCircle } from "lucide-react";
import { fetchTyrehotelsByPlate, fetchTyrehotelDetail } from "@/lib/api";

const BENEFITS = [
  "Tires last longer with proper storage",
  "You get instant feedback on the condition of your tires",
  "We can wash your tires so they are clean and fresh before installation",
  "You do not have to carry dirty wheels or dirty your car",
  "Fast and easy",
];

const PACKAGES = [
  { name: "Economy", details: "Shifting and storage" },
  { name: "Standard", details: "Shift, storage with wheel wash", featured: true },
  { name: "Luxury", details: "Shifting, storage, wheel washing and balancing" },
];

function WheelCard({ wheel }) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4 gap-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-display text-sm font-bold uppercase">{wheel.brand} {wheel.model}</p>
            <p className="font-mono text-xs text-base-content/50">{wheel.dimension}</p>
          </div>
          <span className="badge badge-sm badge-outline font-mono">{wheel.placement}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-body text-base-content/60 mt-2">
          {wheel.tread_depth > 0 && <span>Tread: {wheel.tread_depth} mm</span>}
          {wheel.dot && <span>DOT: {wheel.dot}</span>}
          {wheel.pressure > 0 && <span>Pressure: {wheel.pressure} bar</span>}
          {wheel.rim_brand && <span>Rim: {wheel.rim_brand}</span>}
          {wheel.rim_type && <span>Rim type: {wheel.rim_type}</span>}
          {wheel.damages && <span className="text-warning">Damages: {wheel.damages}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {wheel.is_runflat === 1 && <span className="badge badge-xs badge-info">Runflat</span>}
          {wheel.has_tpms === 1 && <span className="badge badge-xs badge-success">TPMS</span>}
          {wheel.is_stubbed === 1 && <span className="badge badge-xs badge-warning">Studded</span>}
          {wheel.has_nitrogen === 1 && <span className="badge badge-xs">N2</span>}
        </div>
      </div>
    </div>
  );
}

function TyreHotelResult({ hotel }) {
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function loadDetail() {
    if (detail) return;
    setLoadingDetail(true);
    try {
      const data = await fetchTyrehotelDetail(hotel.tyrehotel_id);
      setDetail(data?.data || data);
    } catch {
      // silently fail
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body p-5 gap-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-lg font-bold uppercase">{hotel.brand} {hotel.model} ({hotel.year})</p>
            <p className="font-mono text-sm text-base-content/50">{hotel.licenseplate}</p>
          </div>
          <div className="text-right text-xs font-body text-base-content/50">
            <p>{hotel.customer_name}</p>
            {hotel.customer_phone && <p>{hotel.customer_phone}</p>}
            {hotel.mileage > 0 && <p>{hotel.mileage.toLocaleString()} km</p>}
          </div>
        </div>

        {!detail && (
          <button
            onClick={loadDetail}
            disabled={loadingDetail}
            className="btn btn-sm btn-ghost gap-2 self-start font-body normal-case"
          >
            {loadingDetail ? <span className="loading loading-spinner loading-xs" /> : <ArrowRight size={14} />}
            View stored wheels
          </button>
        )}

        {detail && (
          <div className="space-y-4 mt-2">
            {detail.in_stock && (
              <p className="text-xs font-body text-base-content/50">
                Currently in storage: <span className="font-semibold text-brand-yellow uppercase">{detail.in_stock}</span> set
              </p>
            )}

            {detail.summer?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sun size={14} className="text-amber-400" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider">Summer Wheels</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detail.summer.map((w, i) => <WheelCard key={w.id || i} wheel={w} />)}
                </div>
              </div>
            )}

            {detail.winter?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake size={14} className="text-blue-400" />
                  <span className="text-xs font-display font-bold uppercase tracking-wider">Winter Wheels</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detail.winter.map((w, i) => <WheelCard key={w.id || i} wheel={w} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeckHotelPage() {
  const [plate, setPlate] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    const trimmed = plate.trim().replace(/\s+/g, "");
    if (!trimmed) return;

    setSearching(true);
    setSearchError(null);
    setResults(null);
    try {
      const data = await fetchTyrehotelsByPlate(trimmed);
      const hotels = data?.data || data;
      setResults(Array.isArray(hotels) ? hotels : hotels ? [hotels] : []);
    } catch (err) {
      setSearchError(err?.response?.data?.error || err?.message || "Lookup failed.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[56vh] flex flex-col justify-center overflow-hidden bg-base-100 border-b border-base-300">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="8" fill="none" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="5" fill="none" />
            <circle cx="100" cy="100" r="18" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line key={i} x1="100" y1="40" x2="100" y2="62" stroke="currentColor" strokeWidth="5" transform={`rotate(${deg} 100 100)`} />
            ))}
          </svg>
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Tire Storage</span>
            </div>
            <h1 className="heading-display text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-base-content mb-4">
              Deck Hotel<br /><span style={{ color: "#F5C518" }}>Helsingborg.</span>
            </h1>
            <p className="font-body text-base-content/60 text-lg max-w-2xl leading-relaxed mb-8">
              Professional seasonal wheel storage with condition checks, cleaning, and balancing. Keep your wheel
              sets protected and ready before every tire change.
            </p>
            <Link href="/book-appointment" className="btn font-display tracking-widest uppercase text-sm px-8" style={{ background: "#F5C518", color: "#000", border: "none" }}>
              Click Here For A Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Lookup Section */}
      <section className="bg-base-200 border-b border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Your Stored Wheels</span>
          </div>
          <h2 className="heading-display text-3xl md:text-4xl mb-6">
            Lookup by <span className="text-brand-yellow">License Plate</span>
          </h2>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mb-8">
            <div className="relative flex-1">
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="ABC 123"
                className="w-full pl-10 pr-4 py-3 bg-brand-card border border-brand-border rounded-xl text-sm font-mono text-brand-text placeholder-brand-muted focus:border-brand-yellow outline-none transition-colors tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={searching || !plate.trim()}
              className="btn gap-2 font-display tracking-widest uppercase text-sm px-6"
              style={{ background: "#F5C518", color: "#000", border: "none" }}
            >
              {searching ? <span className="loading loading-spinner loading-sm" /> : <Search size={16} />}
              Lookup
            </button>
          </form>

          {searchError && (
            <div className="alert alert-error mb-6 max-w-lg">
              <AlertCircle size={16} />
              <span className="font-body text-sm">{searchError}</span>
            </div>
          )}

          {results && results.length === 0 && (
            <div className="text-center py-12 max-w-lg">
              <p className="font-display text-lg font-bold uppercase mb-2">No tyre hotel found</p>
              <p className="font-body text-base-content/50 text-sm">No stored wheels found for this license plate. Contact us to set up tyre storage.</p>
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-4 max-w-3xl">
              {results.map((hotel, i) => (
                <TyreHotelResult key={hotel.tyrehotel_id || i} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info section */}
      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: "#F5C518" }} />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Before Changing Tires</span>
            </div>
            <h2 className="heading-display text-4xl md:text-5xl mb-6">Store Tires The Right Way</h2>
            <div className="space-y-5 text-base-content/70 font-body leading-relaxed">
              <p>There are many things to consider when looking after your tires correctly. Storing tires in the best possible way helps prevent the rubber from drying out and cracking. Tires should be stored indoors in a cool, dry place to extend service life.</p>
              <p>Prepare the storage area with moisture protection and avoid leaving tires directly on dirty or damp surfaces. Taking the time to store them correctly protects your investment and reduces avoidable damage.</p>
              <p>Clean wheel bolts, add a little extra air pressure to preserve tire shape, wash the tire before storage, and label each wheel position clearly so reinstallation is easier in the next season.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-base-200 border-y border-base-300">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Why Store With Us</span>
          </div>
          <h2 className="heading-display text-4xl md:text-5xl mb-8">Less Worry, <span style={{ color: "#F5C518" }}>More Control</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
            {BENEFITS.map((item) => (
              <div key={item} className="card bg-base-100 border border-base-300 hover:border-brand-yellow/60 transition-colors">
                <div className="card-body p-5"><p className="font-body text-sm text-base-content/70">{item}</p></div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 md:p-8">
            <h3 className="font-display text-2xl uppercase mb-3">Less worries</h3>
            <p className="font-body text-base-content/70 leading-relaxed">
              With a tire hotel package, you save time on changeovers and storage while improving tire lifespan with proper handling. We can also balance your tires to reduce wear and improve comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-base-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: "#F5C518" }} />
            <span className="text-xs font-body font-semibold uppercase tracking-[0.22em] text-brand-yellow">Three-Step Packages</span>
          </div>
          <h2 className="heading-display text-4xl md:text-5xl mb-8">Choose Your Service Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className={`card border ${pkg.featured ? "border-brand-yellow bg-base-200" : "border-base-300 bg-base-100"}`}>
                <div className="card-body p-6">
                  {pkg.featured && <span className="badge badge-sm font-body mb-3" style={{ background: "#F5C518", color: "#000" }}>Most Popular</span>}
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/45 font-body">{pkg.name}</p>
                  <p className="font-body text-base-content/80 mt-3">{pkg.details}</p>
                  <div className="mt-6">
                    <Link href="/book-appointment" className="btn btn-sm font-display tracking-widest uppercase" style={{ background: "#F5C518", color: "#000", border: "none" }}>Select</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-body text-base-content/55">
            Need help choosing?{" "}
            <Link href="/contact" className="text-brand-yellow hover:underline underline-offset-2">Contact us</Link>{" "}
            and we will recommend the right package.
          </p>
        </div>
      </section>
    </>
  );
}
