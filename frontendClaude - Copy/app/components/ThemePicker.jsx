"use client";
import { useEffect, useState } from "react";
import { Check, Palette } from "lucide-react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tirestore-theme", theme);
}

export default function ThemePicker() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("tirestore-theme");
    const selected = saved && THEMES.includes(saved) ? saved : "dark";
    setTheme(selected);
    applyTheme(selected);
  }, []);

  const choose = (nextTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-xs border-white/20 bg-transparent text-[11px] font-semibold uppercase tracking-[0.1em] text-white hover:border-brand-yellow/60 hover:bg-white/5"
      >
        <Palette className="h-3.5 w-3.5" />
        Theme
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-[80] mt-2 max-h-80 w-64 overflow-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-2xl"
      >
        {THEMES.map((item) => (
          <li key={item}>
            <button
              onClick={() => choose(item)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs uppercase tracking-[0.1em] ${
                theme === item
                  ? "bg-primary/20 text-primary"
                  : "text-base-content/80 hover:bg-base-200"
              }`}
            >
              <span>{item}</span>
              {theme === item && <Check className="h-3.5 w-3.5" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
