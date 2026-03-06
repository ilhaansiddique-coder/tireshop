"use client";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const THEMES = [
  { id: "dark",      label: "Dark",      dot: "#1d232a" },
  { id: "light",     label: "Light",     dot: "#ffffff" },
  { id: "luxury",    label: "Luxury",    dot: "#09090b" },
  { id: "night",     label: "Night",     dot: "#0f1729" },
  { id: "cyberpunk", label: "Cyberpunk", dot: "#ff7598" },
  { id: "synthwave", label: "Synthwave", dot: "#e779c1" },
  { id: "halloween", label: "Halloween", dot: "#f28c18" },
  { id: "forest",    label: "Forest",    dot: "#1eb854" },
  { id: "dracula",   label: "Dracula",   dot: "#ff79c6" },
  { id: "coffee",    label: "Coffee",    dot: "#c67b5c" },
  { id: "black",     label: "Black",     dot: "#000000" },
  { id: "business",  label: "Business",  dot: "#1c4f82" },
];

export default function ThemePicker() {
  const [current, setCurrent] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setCurrent(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function applyTheme(id) {
    setCurrent(id);
    localStorage.setItem("theme", id);
    document.documentElement.setAttribute("data-theme", id);
    // Close the dropdown
    document.activeElement?.blur();
  }

  const active = THEMES.find((t) => t.id === current) || THEMES[0];

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-sm gap-1.5 normal-case font-body text-xs"
        title="Change theme"
      >
        <Palette size={15} />
        <span className="hidden sm:inline">{active.label}</span>
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-[100] menu p-2 shadow-2xl bg-base-200 border border-base-300 rounded-box w-44 mt-2 max-h-80 overflow-y-auto"
      >
        {THEMES.map((theme) => (
          <li key={theme.id}>
            <button
              onClick={() => applyTheme(theme.id)}
              className={`flex items-center gap-2.5 text-sm py-1.5 rounded-lg ${
                current === theme.id ? "active font-semibold" : ""
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-base-content/20 flex-shrink-0"
                style={{ background: theme.dot }}
              />
              {theme.label}
              {current === theme.id && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
