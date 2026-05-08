"use client";

// RoutePanel — panel bawah layar saat isRouteOpen === true.
// Titik asal = posisi kiosk (hardcoded START_R/START_C per terminal).
// User tidak perlu pilih asal — langsung hitung dan tampilkan hasil.

import { useEffect, useCallback, useState } from "react";
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
  const activeTerminal        = useMapStore((s) => s.activeTerminal);
  const selectedFacility      = useMapStore((s) => s.selectedFacility);
  const routeResult           = useMapStore((s) => s.routeResult);
  const setIsRouteOpen        = useMapStore((s) => s.setIsRouteOpen);
  const setRouteResult        = useMapStore((s) => s.setRouteResult);
  const clearSelectedFacility = useMapStore((s) => s.clearSelectedFacility);

  const [panelPos, setPanelPos]     = useState({ x: 24, y: 420 });
  const [dragging, setDragging]     = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - panelPos.x,
      y: e.clientY - panelPos.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPanelPos({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // ─── Hitung rute otomatis saat panel dibuka ────────────────────────────────
  const calculate = useCallback(async () => {
    if (!selectedFacility) return;
    if (selectedFacility.gridRow == null || selectedFacility.gridCol == null) return;

    const td = TERMINAL_DATA[activeTerminal];

    await new Promise<void>((r) => setTimeout(r, 30));

    // PENTING:
    // selectedFacility.id dari database biasanya angka/UUID,
    // jadi tidak bisa dipakai untuk deteksi l1_ / l2_.
    // Maka kita buat destId virtual berdasarkan posisi row.
    const destFloorPrefix =
      selectedFacility.gridRow >= td.floor1RowMin ? "l1" : "l2";

    const virtualDestId = `${destFloorPrefix}_${selectedFacility.id}`;

    const multiPath = astarWithStairs(
      td.startR,
      td.startC,
      selectedFacility.gridRow,
      selectedFacility.gridCol,
      virtualDestId,
      td.wallSet,
      td.rows,
      td.cols,
      td.staircaseL1,
      td.staircaseL2,
      td.floor1RowMin,
    );

    if (!multiPath) {
      setRouteResult(null);
      return;
    }

    setRouteResult({
      multiPath,
      destId: virtualDestId,
      destLabel: selectedFacility.name,
    });
  }, [selectedFacility, activeTerminal, setRouteResult]);

  useEffect(() => {
    void calculate();
  // Hanya hitung ulang saat selectedFacility atau terminal berubah
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFacility?.id, activeTerminal]);

  // ─── Tutup panel ──────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setIsRouteOpen(false);
    setRouteResult(null);
    clearSelectedFacility();
  }, [setIsRouteOpen, setRouteResult, clearSelectedFacility]);

  const totalSteps = routeResult?.multiPath?.totalSteps ?? 0;

  return (
    <div
      className="fixed z-50 w-95 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
      style={{
        left: panelPos.x,
        top:  panelPos.y,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* HEADER */}
      <div
        className="flex cursor-move items-center justify-between px-4 py-3 border-b select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span>🗺️</span>
          <span className="text-sm font-semibold">Petunjuk Arah</span>
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-black cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3 max-h-65 overflow-y-auto">
        <div>
          <p className="text-xs text-gray-400">DARI</p>
          <p className="font-medium text-sm">Kiosk Informasi</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">KE</p>
          <p className="font-medium text-sm">{routeResult?.destLabel}</p>
        </div>

        <div className="bg-blue-50 rounded-xl px-3 py-2 text-sm">
          <span className="font-semibold">
            {totalSteps} langkah
          </span>
          <span className="text-gray-500 ml-2">
            ±{Math.ceil(totalSteps / 60)} menit
          </span>
        </div>

        <div className="space-y-2">
          {routeResult?.multiPath?.segments.map((seg, i) => (
            // seg.path selalu ada — lihat return type MultiPathResult di astar.ts
            // path.length - 1 karena steps = jumlah perpindahan antar node
            <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
              Segmen {i + 1} — {seg.path.length - 1} langkah
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}