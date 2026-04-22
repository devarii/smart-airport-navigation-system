"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import type { FacilityWithRelations } from "@/types";

export default function SearchModal() {
  const isSearchOpen = useMapStore((s) => s.isSearchOpen);
  const setIsSearchOpen = useMapStore((s) => s.setIsSearchOpen);
  const setSelectedFacility = useMapStore((s) => s.setSelectedFacility);
  const activeTerminal = useMapStore((s) => s.activeTerminal);
  const activeFloor = useMapStore((s) => s.activeFloor);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FacilityWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset + auto focus saat modal terbuka
  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setResults([]);
      setHasFetched(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Debounce + fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults([]);
      setHasFetched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: query,
          terminal: activeTerminal,
          floor: String(activeFloor),
        });
        const res = await fetch(`/api/facilities?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data as FacilityWithRelations[]);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTerminal, activeFloor]);

  const handleSelectFacility = (facility: FacilityWithRelations) => {
    setSelectedFacility(facility);
    setIsSearchOpen(false);
  };

  const handleClose = () => {
    setIsSearchOpen(false);
  };

  const highlightMatch = (text: string, keyword: string): React.ReactNode => {
    if (!keyword.trim()) return text;
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedKeyword})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-sky-400/40 text-white rounded px-0.5 not-italic">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Cari fasilitas"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={[
          "relative z-10 w-[clamp(480px,90vw,720px)]",
          "bg-gray-900 rounded-2xl shadow-2xl",
          "flex flex-col overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-150",
        ].join(" ")}
      >
        {/* Input header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          {/* Icon search */}
          <svg
            className="shrink-0 w-6 h-6 text-white/50"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari fasilitas..."
            aria-label="Cari fasilitas"
            className={[
              "flex-1 bg-transparent outline-none",
              "text-white placeholder:text-white/40",
              "text-[clamp(16px,2vw,22px)]",
            ].join(" ")}
          />

          {/* Tombol tutup */}
          <button
            onClick={handleClose}
            aria-label="Tutup pencarian"
            className={[
              "shrink-0 flex items-center justify-center",
              "min-w-15 min-h-15 rounded-xl",
              "text-white/60 hover:text-white hover:bg-white/10",
              "transition-colors duration-150",
            ].join(" ")}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body hasil */}
        <div className="overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-col gap-2 px-5 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/10 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Hasil ditemukan */}
          {!isLoading && results.length > 0 && (
            <ul role="listbox" aria-label="Hasil pencarian">
              {results.map((facility) => (
                <li key={facility.id} role="option" aria-selected={false}>
                  <button
                    onClick={() => handleSelectFacility(facility)}
                    className={[
                      "w-full flex items-center gap-4 px-5 py-4",
                      "min-h-15 text-left",
                      "hover:bg-white/10 active:bg-white/20",
                      "transition-colors duration-100",
                      "border-b border-white/5 last:border-0",
                    ].join(" ")}
                  >
                    {/* Icon kategori */}
                    <span
                      className="shrink-0 text-[clamp(24px,3vw,32px)] leading-none"
                      aria-hidden="true"
                    >
                      {facility.category?.icon ?? "📍"}
                    </span>

                    {/* Info fasilitas */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-white font-medium text-[clamp(15px,1.8vw,20px)] truncate">
                        {highlightMatch(facility.name, query)}
                      </span>
                      <span className="text-white/50 text-[clamp(12px,1.3vw,15px)] truncate">
                        {facility.floor.label}
                        {facility.category?.name
                          ? ` · ${facility.category.name}`
                          : ""}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Tidak ditemukan */}
          {!isLoading && hasFetched && results.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-5 py-10 text-white/50">
              <span
                className="text-[clamp(28px,4vw,40px)]"
                aria-hidden="true"
              >
                🔍
              </span>
              <p className="text-[clamp(14px,1.6vw,18px)] text-center">
                Fasilitas tidak ditemukan
              </p>
            </div>
          )}

          {/* Prompt awal belum ketik */}
          {!isLoading && !hasFetched && query.length === 0 && (
            <div className="flex flex-col items-center gap-3 px-5 py-10 text-white/40">
              <span
                className="text-[clamp(28px,4vw,40px)]"
                aria-hidden="true"
              >
                ✈️
              </span>
              <p className="text-[clamp(14px,1.6vw,18px)] text-center">
                Ketik minimal 2 karakter untuk mencari
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}