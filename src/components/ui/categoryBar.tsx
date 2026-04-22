"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import type { Category } from "@/types";

export default function CategoryBar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCategories = useMapStore((s) => s.activeCategories);
  const toggleCategory = useMapStore((s) => s.toggleCategory);
  const clearCategories = useMapStore((s) => s.clearCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success) {
          setCategories(json.data as Category[]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const isAllActive = activeCategories.length === 0;

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-18 h-18 rounded-2xl bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden">
      {/* Tombol "Semua" */}
      <button
        onClick={clearCategories}
        aria-label="Tampilkan semua kategori"
        aria-pressed={isAllActive}
        className={[
          "shrink-0 flex flex-col items-center justify-center gap-1",
          "min-w-18 min-h-15 px-3 py-2 rounded-2xl",
          "transition-colors duration-150",
          "text-[clamp(11px,1.2vw,14px)] font-medium",
          isAllActive
            ? "bg-sky-500 text-white shadow-md"
            : "bg-white/10 text-white/80 border border-white/20",
        ].join(" ")}
      >
        <span className="text-[clamp(20px,2.5vw,28px)] leading-none">🗺️</span>
        <span className="leading-tight text-center whitespace-nowrap">Semua</span>
      </button>

      {/* Tombol tiap kategori */}
      {categories.map((category) => {
        const isActive = activeCategories.includes(category.id);

        return (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            aria-label={`Filter kategori ${category.name}`}
            aria-pressed={isActive}
            className={[
              "shrink-0 flex flex-col items-center justify-center gap-1",
              "min-w-18 min-h-15 px-3 py-2 rounded-2xl",
              "transition-colors duration-150",
              "text-[clamp(11px,1.2vw,14px)] font-medium",
              isActive
                ? "bg-sky-500 text-white shadow-md"
                : "bg-white/10 text-white/80 border border-white/20",
            ].join(" ")}
            style={isActive ? { backgroundColor: category.color } : undefined}
          >
            <span className="text-[clamp(20px,2.5vw,28px)] leading-none">
              {category.icon}
            </span>
            <span className="leading-tight text-center whitespace-nowrap">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}