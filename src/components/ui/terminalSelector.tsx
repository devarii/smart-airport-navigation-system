"use client";

// Komponen ini HANYA menampilkan pilihan terminal (T1 / T2).
// activeFloor dihapus dari store — kedua lantai tampil sekaligus dalam 1 grid.

import { useMapStore } from "@/store/mapStore";
import type { TerminalId } from "@/types";

const TERMINALS: { value: TerminalId; label: string }[] = [
  { value: "T1", label: "Terminal 1" },
  { value: "T2", label: "Terminal 2" },
];

export default function TerminalSelector() {
  const activeTerminal = useMapStore((s) => s.activeTerminal);
  const setActiveTerminal = useMapStore((s) => s.setActiveTerminal);

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-[clamp(13px,1.2vw,15px)] font-medium text-gray-500 whitespace-nowrap">
        Terminal
      </span>

      {/* Dropdown terminal */}
      <div className="relative">
        <select
          value={activeTerminal}
          onChange={(e) => setActiveTerminal(e.target.value as TerminalId)}
          className={[
            "appearance-none",
            "h-[clamp(40px,4.5vw,52px)] pl-4 pr-10",
            "rounded-xl border border-gray-200",
            "bg-white text-gray-800",
            "text-[clamp(14px,1.3vw,16px)] font-semibold",
            "shadow-sm cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1",
            "transition-shadow duration-150",
            "min-w-[clamp(130px,14vw,160px)]",
          ].join(" ")}
          aria-label="Pilih terminal"
        >
          {TERMINALS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 5L7 9.5L11.5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}