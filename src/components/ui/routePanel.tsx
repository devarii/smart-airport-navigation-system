"use client";

// RoutePanel — panel bawah layar saat isRouteOpen === true.
// Titik asal = posisi kiosk (hardcoded START_R/START_C per terminal).
// User tidak perlu pilih asal — langsung hitung dan tampilkan hasil.

import { useEffect, useCallback } from "react";
import { useMapStore } from "@/store/mapStore";
import { astarWithStairs, buildWallSet } from "@/lib/astar";

// ─── T1 ───────────────────────────────────────────────────────────────────────
import {
  T1_WALL_DATA,
  ROWS as T1_ROWS,
  COLS as T1_COLS,
  START_R as T1_START_R,
  START_C as T1_START_C,
  STAIRCASE_L1 as T1_STAIRCASE_L1,
  STAIRCASE_L2 as T1_STAIRCASE_L2,
  FLOOR1_ROW_MIN as T1_FLOOR1_ROW_MIN,
} from "@/data/walls/t1";

// ─── T2 ───────────────────────────────────────────────────────────────────────
import {
  T2_WALL_DATA,
  ROWS as T2_ROWS,
  COLS as T2_COLS,
  START_R as T2_START_R,
  START_C as T2_START_C,
  STAIRCASE_L1 as T2_STAIRCASE_L1,
  STAIRCASE_L2 as T2_STAIRCASE_L2,
  FLOOR1_ROW_MIN as T2_FLOOR1_ROW_MIN,
} from "@/data/walls/t2";

// =============================================================================
// TERMINAL DATA MAP
// =============================================================================

const TERMINAL_DATA = {
  T1: {
    wallSet:      buildWallSet(T1_WALL_DATA.walls),
    rows:         T1_ROWS,
    cols:         T1_COLS,
    startR:       T1_START_R,
    startC:       T1_START_C,
    staircaseL1:  T1_STAIRCASE_L1,
    staircaseL2:  T1_STAIRCASE_L2,
    floor1RowMin: T1_FLOOR1_ROW_MIN,
  },
  T2: {
    wallSet:      buildWallSet(T2_WALL_DATA.walls),
    rows:         T2_ROWS,
    cols:         T2_COLS,
    startR:       T2_START_R,
    startC:       T2_START_C,
    staircaseL1:  T2_STAIRCASE_L1,
    staircaseL2:  T2_STAIRCASE_L2,
    floor1RowMin: T2_FLOOR1_ROW_MIN,
  },
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export default function RoutePanel() {
  const activeTerminal   = useMapStore((s) => s.activeTerminal);
  const selectedFacility = useMapStore((s) => s.selectedFacility);
  const routeResult      = useMapStore((s) => s.routeResult);
  const setIsRouteOpen   = useMapStore((s) => s.setIsRouteOpen);
  const setRouteResult   = useMapStore((s) => s.setRouteResult);
  const clearRoute       = useMapStore((s) => s.clearRoute);

  // ─── Hitung rute otomatis saat panel dibuka ──────────────────────────────
  const calculate = useCallback(async () => {
    if (!selectedFacility) return;
    if (selectedFacility.gridRow == null || selectedFacility.gridCol == null) return;

    const td = TERMINAL_DATA[activeTerminal];

    // Yield ke render sebelum kalkulasi berat
    await new Promise<void>((r) => setTimeout(r, 30));

    const multiPath = astarWithStairs(
      td.startR,
      td.startC,
      selectedFacility.gridRow,
      selectedFacility.gridCol,
      selectedFacility.id.toString(),  // destId — prefix l1_/l2_ dari DESTINATIONS
      td.wallSet,
      td.rows,
      td.cols,
      td.staircaseL1,
      td.staircaseL2,
      td.floor1RowMin,
    );

    if (!multiPath) {
      // Rute tidak ditemukan — simpan null supaya UI tampilkan pesan error
      setRouteResult(null);
      return;
    }

    setRouteResult({
      multiPath,
      destId:    selectedFacility.id.toString(),
      destLabel: selectedFacility.name,
    });
  }, [selectedFacility, activeTerminal, setRouteResult]);

  useEffect(() => {
    void calculate();
  // Hanya hitung ulang saat selectedFacility atau terminal berubah
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility?.id, activeTerminal]);

  // ─── Tutup panel ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsRouteOpen(false);
    clearRoute();
  }, [setIsRouteOpen, clearRoute]);

  if (!selectedFacility) return null;

  const multiPath    = routeResult?.multiPath ?? null;
  const totalSteps   = multiPath?.totalSteps ?? 0;
  const usedStairs   = multiPath?.usedStairs ?? false;
  const stairsLabel  = multiPath?.stairsLabel;
  const isCalculating = routeResult === undefined;

  // Estimasi waktu jalan: ~1 langkah = 0.5 meter, kecepatan 1 m/s
  const estimasiMenit = totalSteps > 0
    ? Math.ceil((totalSteps * 0.5) / 60)
    : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className={[
          "pointer-events-auto w-full",
          "bg-white rounded-t-2xl",
          "shadow-[0_-4px_32px_rgba(0,0,0,0.12)]",
          "border-t border-gray-200",
          "flex flex-col",
          "animate-in slide-in-from-bottom duration-300",
        ].join(" ")}
        style={{ maxHeight: "50vh" }}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Icon peta */}
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"
                  stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 4v13M15 7v13" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-[clamp(14px,1.3vw,16px)] font-bold text-gray-800">
              Petunjuk Arah
            </h2>
          </div>

          <button
            onClick={handleClose}
            aria-label="Tutup petunjuk arah"
            className={[
              "w-10 h-10 flex items-center justify-center",
              "rounded-full bg-gray-100",
              "hover:bg-gray-200 active:bg-gray-300",
              "transition-colors",
            ].join(" ")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13"
                stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">

          {/* ─ Baris asal → tujuan ─ */}
          <div className="flex items-stretch gap-3">

            {/* Kiri: icon + garis vertikal */}
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
              <div className="flex-1 w-px bg-gray-200 min-h-5" />
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: selectedFacility.category.color }}
              />
            </div>

            {/* Kanan: teks */}
            <div className="flex flex-col justify-between gap-3 flex-1 min-w-0">
              {/* Asal */}
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
                  Dari
                </p>
                <p className="text-[clamp(13px,1.2vw,15px)] font-semibold text-gray-700">
                  Kiosk Informasi
                </p>
              </div>
              {/* Tujuan */}
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
                  Ke
                </p>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg leading-none shrink-0">
                    {selectedFacility.category.icon}
                  </span>
                  <p className="text-[clamp(13px,1.2vw,15px)] font-bold text-gray-800 truncate">
                    {selectedFacility.name}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {selectedFacility.floor.label}
                </p>
              </div>
            </div>
          </div>

          {/* ─ Kalkulasi sedang berjalan ─ */}
          {isCalculating && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <svg className="animate-spin w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <p className="text-sm text-gray-500">Menghitung rute…</p>
            </div>
          )}

          {/* ─ Rute tidak ditemukan ─ */}
          {!isCalculating && !multiPath && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                className="text-red-400 shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-sm text-red-600">
                Rute tidak ditemukan. Pastikan fasilitas berada di area yang terhubung.
              </p>
            </div>
          )}

          {/* ─ Hasil rute ─ */}
          {!isCalculating && multiPath && (
            <div className="flex flex-col gap-3">

              {/* Summary card */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-4">
                {/* Steps */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-2xl font-bold text-blue-700 tabular-nums leading-none">
                    {totalSteps}
                  </span>
                  <span className="text-[10px] text-blue-400 font-medium mt-0.5">
                    langkah
                  </span>
                </div>

                <div className="w-px h-10 bg-blue-200 shrink-0" />

                <div className="flex flex-col gap-1 min-w-0">
                  {estimasiMenit !== null && (
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        className="text-blue-400 shrink-0" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7v5l3 3"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="text-sm text-blue-600 font-semibold">
                        ±{estimasiMenit} menit berjalan
                      </span>
                    </div>
                  )}

                  {/* Badge tangga */}
                  {usedStairs && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 w-fit">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        aria-hidden="true">
                        <path d="M3 21h4v-4h4v-4h4v-4h4V3"
                          stroke="currentColor" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[11px] font-semibold">
                        Lewat tangga
                        {stairsLabel ? ` — ${stairsLabel}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Segment breakdown */}
              {multiPath.segments.map((seg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <p className="text-[clamp(12px,1.1vw,13px)] text-gray-600">
                    <span className="font-semibold text-gray-800">
                      Segmen {i + 1}
                    </span>
                    {" — "}
                    {seg.path.length - 1} langkah
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}