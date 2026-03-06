"use client";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import useFilterStore from "@/store/filterStore";
import { useState } from "react";

const DIAMETERS = ["14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const WIDTHS = ["155", "165", "175", "185", "195", "205", "215", "225", "235", "245", "255", "265", "275", "285", "295", "305", "315", "325"];
const ASPECT_RATIOS = ["25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75"];
const SPEED_INDEXES = ["H", "V", "W", "Y", "ZR"];
const VEHICLE_TYPES = [
  { value: "alla", label: "All Vehicles" },
  { value: "1",    label: "Passenger Car" },
  { value: "2",    label: "SUV / 4x4" },
  { value: "3",    label: "Van / Light Truck" },
  { value: "mc",   label: "Motorcycle" },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-base-300 py-3">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display text-xs font-bold uppercase tracking-widest text-base-content/60">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform text-base-content/40 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function ChipGroup({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const val = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        const active = selected === val;
        return (
          <button
            key={val}
            onClick={() => onChange(active ? "" : val)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-all ${
              active
                ? "border-brand-yellow text-black"
                : "border-base-300 text-base-content/60 hover:border-base-content/40"
            }`}
            style={active ? { background: "#F5C518" } : {}}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function FilterSidebar({ onFilter }) {
  const {
    tyreType, vehicleType, diameter, width, aspectRatio, speedIndex,
    isRunflat, isSilence, isElectricVehicle,
    setFilter, resetFilters,
  } = useFilterStore();

  function handle(key, value) {
    setFilter(key, value);
    onFilter?.();
  }

  const SEASONS = [
    { value: "2", label: "☀️ Summer" },
    { value: "1", label: "❄️ Winter" },
    { value: "3", label: "🌤 All Season" },
  ];

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-brand-yellow" />
          <span className="font-display text-sm font-bold uppercase tracking-widest">
            Filters
          </span>
        </div>
        <button
          onClick={() => { resetFilters(); onFilter?.(); }}
          className="btn btn-ghost btn-xs gap-1 text-base-content/50 normal-case font-body text-xs"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      {/* Season */}
      <Section title="Season">
        <div className="flex flex-col gap-1">
          {SEASONS.map((s) => (
            <label key={s.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="season"
                className="radio radio-xs"
                style={tyreType === s.value ? { accentColor: "#F5C518" } : {}}
                checked={tyreType === s.value}
                onChange={() => handle("tyreType", s.value)}
              />
              <span className="text-sm font-body group-hover:text-base-content transition-colors">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Vehicle Type */}
      <Section title="Vehicle Type">
        <select
          className="select select-bordered select-sm w-full font-body text-xs"
          value={vehicleType}
          onChange={(e) => handle("vehicleType", e.target.value)}
        >
          {VEHICLE_TYPES.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </Section>

      {/* Rim Diameter */}
      <Section title="Rim Diameter (inch)">
        <ChipGroup
          options={DIAMETERS}
          selected={diameter}
          onChange={(v) => handle("diameter", v)}
        />
      </Section>

      {/* Width */}
      <Section title="Tyre Width (mm)">
        <ChipGroup
          options={WIDTHS}
          selected={width}
          onChange={(v) => handle("width", v)}
        />
      </Section>

      {/* Aspect Ratio */}
      <Section title="Aspect Ratio" defaultOpen={false}>
        <ChipGroup
          options={ASPECT_RATIOS}
          selected={aspectRatio}
          onChange={(v) => handle("aspectRatio", v)}
        />
      </Section>

      {/* Speed Index */}
      <Section title="Speed Rating" defaultOpen={false}>
        <ChipGroup
          options={SPEED_INDEXES}
          selected={speedIndex}
          onChange={(v) => handle("speedIndex", v)}
        />
      </Section>

      {/* Special Features */}
      <Section title="Special Features" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {[
            { key: "isRunflat", label: "Run-Flat" },
            { key: "isSilence", label: "Silent / Acoustic" },
            { key: "isElectricVehicle", label: "EV Optimised" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                style={useFilterStore.getState()[key] ? { accentColor: "#F5C518" } : {}}
                checked={useFilterStore.getState()[key]}
                onChange={(e) => handle(key, e.target.checked)}
              />
              <span className="text-sm font-body">{label}</span>
            </label>
          ))}
        </div>
      </Section>
    </aside>
  );
}
