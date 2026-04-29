"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useMapStore } from "@/store/mapStore";
import { buildWallSet } from "@/lib/astar";
import type { FacilityWithRelations, DestinationPoint, WallDataJson } from "@/types";
import PathRenderer from "@/components/map/pathRenderer";

// ─── Terminal data imports ────────────────────────────────────────────────────
import {
  T1_WALL_DATA,
  DESTINATIONS as T1_DESTINATIONS,
  ROWS as T1_ROWS,
  COLS as T1_COLS,
  START_R as T1_START_R,
  START_C as T1_START_C,
  FLOOR1_ROW_MIN as T1_F1_MIN,
  FLOOR2_ROW_MIN as T1_F2_MIN,
  FLOOR2_ROW_MAX as T1_F2_MAX,
} from "@/data/walls/t1";

import {
  T2_WALL_DATA,
  DESTINATIONS as T2_DESTINATIONS,
  ROWS as T2_ROWS,
  COLS as T2_COLS,
  START_R as T2_START_R,
  START_C as T2_START_C,
  FLOOR1_ROW_MIN as T2_F1_MIN,
  FLOOR2_ROW_MIN as T2_F2_MIN,
  FLOOR2_ROW_MAX as T2_F2_MAX,
} from "@/data/walls/t2";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Pixel per grid cell — harus sinkron dengan gridToSvg di astar.ts */
const CELL = 6;

const C_WALL  = "#1a4a5c" as const;
const C_FLOOR = "#e8f4f8" as const;
const C_GAP   = "#b8d4de" as const;
const C_KIOSK = "#00b4d8" as const;

/** Touch target radius di SVG coords — min 30 untuk kiosk touchscreen */
const TOUCH_R = 30;

// =============================================================================
// TERMINAL CONFIG
// =============================================================================

interface TerminalConfig {
  rows: number;
  cols: number;
  wallData: WallDataJson;
  destinations: DestinationPoint[];
  startR: number;
  startC: number;
  f1Min: number;
  f2Min: number;
  f2Max: number;
  /** Baris pertama gap (-1 jika tidak ada gap) */
  gapMin: number;
  /** Baris terakhir gap (-1 jika tidak ada gap) */
  gapMax: number;
  labelL2Y: number;
  labelL1Y: number;
}

const T1_CFG: TerminalConfig = {
  rows: T1_ROWS,
  cols: T1_COLS,
  wallData: T1_WALL_DATA,
  destinations: T1_DESTINATIONS,
  startR: T1_START_R,
  startC: T1_START_C,
  f1Min: T1_F1_MIN,
  f2Min: T1_F2_MIN,
  f2Max: T1_F2_MAX,
  gapMin: T1_F2_MAX + 1,  // row 33
  gapMax: T1_F1_MIN - 1,  // row 37
  labelL2Y: Math.round((T1_F2_MIN + T1_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T1_F1_MIN + T1_ROWS - 1) / 2) * CELL + CELL / 2,
};

const T2_CFG: TerminalConfig = {
  rows: T2_ROWS,
  cols: T2_COLS,
  wallData: T2_WALL_DATA,
  destinations: T2_DESTINATIONS,
  startR: T2_START_R,
  startC: T2_START_C,
  f1Min: T2_F1_MIN,
  f2Min: T2_F2_MIN,
  f2Max: T2_F2_MAX,
  gapMin: -1,
  gapMax: -1,
  labelL2Y: Math.round((T2_F2_MIN + T2_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T2_F1_MIN + T2_ROWS - 1) / 2) * CELL + CELL / 2,
};

// =============================================================================
// PROPS
// =============================================================================

interface MapCanvasProps {
  /** Slot opsional untuk extend di masa depan */
  children?: ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MapCanvas({ children }: MapCanvasProps) {
  const activeTerminal      = useMapStore((s) => s.activeTerminal);
  const activeCategories    = useMapStore((s) => s.activeCategories);
  const selectedFacility    = useMapStore((s) => s.selectedFacility);
  const setSelectedFacility = useMapStore((s) => s.setSelectedFacility);

  // FIX: tambah setIsRouteOpen + clearRoute untuk reset state rute saat POI baru diklik
  const setIsRouteOpen      = useMapStore((s) => s.setIsRouteOpen);
  const clearRoute          = useMapStore((s) => s.clearRoute);

  const [facilities, setFacilities] = useState<FacilityWithRelations[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── Config terminal aktif ─────────────────────────────────────────────────
  const cfg = useMemo<TerminalConfig>(
    () => (activeTerminal === "T1" ? T1_CFG : T2_CFG),
    [activeTerminal]
  );

  // ─── Wall set O(1) ─────────────────────────────────────────────────────────
  const wallSet = useMemo(
    () => buildWallSet(cfg.wallData.walls),
    [cfg]
  );

  // ─── Facility map: "r,c" → FacilityWithRelations ──────────────────────────
  const facilityMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.gridRow != null && f.gridCol != null) {
        map.set(`${f.gridRow},${f.gridCol}`, f);
      }
    }
    return map;
  }, [facilities]);

  // ─── Category set O(1) ─────────────────────────────────────────────────────
  const activeCatSet = useMemo(
    () => new Set(activeCategories),
    [activeCategories]
  );

  // ─── Fetch fasilitas saat terminal berganti ────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setFacilities([]);
    setIsLoading(true);

    const load = async () => {
      try {
        const res  = await fetch(`/api/facilities?terminal=${activeTerminal}`);
        const body = (await res.json()) as {
          success: boolean;
          data: FacilityWithRelations[];
        };
        if (!cancelled && body.success) setFacilities(body.data);
      } catch {
        // Peta tetap tampil tanpa POI interaktif
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [activeTerminal]);

  // ─── Draw canvas — layer statik: wall + floor + gap ───────────────────────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { rows, cols, gapMin, gapMax } = cfg;
    canvas.width  = cols * CELL;
    canvas.height = rows * CELL;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (wallSet.has(`${r},${c}`)) {
          ctx.fillStyle = C_WALL;
        } else if (gapMin !== -1 && r >= gapMin && r <= gapMax) {
          ctx.fillStyle = C_GAP;
        } else {
          ctx.fillStyle = C_FLOOR;
        }
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }
  }, [cfg, wallSet]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  // ─── Klik destination marker ───────────────────────────────────────────────
  // FIX: Reset rute + tutup RoutePanel saat user pilih POI baru.
  // Urutan yang benar: klik POI → POIDetailPopup → klik "Tunjukkan Arah" → RoutePanel
  const handleDestinationClick = useCallback(
    (dest: DestinationPoint) => {
      const facility = facilityMap.get(`${dest.r},${dest.c}`);
      if (!facility) return;

      // Reset state rute terlebih dahulu agar RoutePanel tidak langsung muncul
      setIsRouteOpen(false);
      clearRoute();

      // Baru set fasilitas baru → POIDetailPopup yang akan tampil
      setSelectedFacility(facility);
    },
    [facilityMap, setSelectedFacility, setIsRouteOpen, clearRoute]
  );

  const svgW = cfg.cols * CELL;
  const svgH = cfg.rows * CELL;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
      style={{ aspectRatio: `${cfg.cols} / ${cfg.rows}` }}
    >
      {/* ── Layer 1: Canvas — dinding + lantai (statik) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* ── Layer 2: SVG overlay — marker + label + path ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="none"
        aria-label={`Peta Terminal ${activeTerminal} Bandara Juanda`}
      >
        {/* Label lantai */}
        <FloorLabel x={12} y={cfg.labelL2Y} label="LANTAI 2" />
        <FloorLabel x={12} y={cfg.labelL1Y} label="LANTAI 1" />

        {/* Garis pemisah lantai */}
        <line
          x1={0}
          y1={cfg.gapMin !== -1
            ? (cfg.gapMin + (cfg.gapMax - cfg.gapMin + 1) / 2) * CELL
            : cfg.f1Min * CELL}
          x2={svgW}
          y2={cfg.gapMin !== -1
            ? (cfg.gapMin + (cfg.gapMax - cfg.gapMin + 1) / 2) * CELL
            : cfg.f1Min * CELL}
          stroke="#1a4a5c"
          strokeWidth={1.5}
          strokeDasharray="8 5"
          opacity={0.3}
          pointerEvents="none"
        />

        {/* Destination markers */}
        {cfg.destinations.map((dest) => {
          const cx = dest.c * CELL + CELL / 2;
          const cy = dest.r * CELL + CELL / 2;
          const facility = facilityMap.get(`${dest.r},${dest.c}`);

          const isSelected =
            selectedFacility?.gridRow === dest.r &&
            selectedFacility?.gridCol === dest.c;

          const isDimmed =
            activeCatSet.size > 0 &&
            (!facility || !activeCatSet.has(facility.category.id));

          return (
            <DestMarker
              key={dest.id}
              cx={cx}
              cy={cy}
              color={dest.color}
              isSelected={isSelected}
              isDimmed={isDimmed}
              isInteractive={facility != null}
              onClick={() => handleDestinationClick(dest)}
            />
          );
        })}

        {/* Kiosk "Anda di sini" */}
        <KioskMarker
          cx={cfg.startC * CELL + CELL / 2}
          cy={cfg.startR * CELL + CELL / 2}
          color={C_KIOSK}
        />

        {/* PathRenderer — baca routeResult langsung dari store */}
        <PathRenderer />

        {/* Slot opsional */}
        {children}
      </svg>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e8f4f8]/60 rounded-2xl">
          <span className="text-[#1a4a5c]/70 text-[clamp(13px,1.2vw,15px)] font-medium animate-pulse">
            Memuat peta…
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function FloorLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x} y={y}
      fontSize={14} fontWeight="700"
      fill="#1a4a5c" opacity={0.35}
      fontFamily="system-ui, sans-serif"
      letterSpacing={1.5}
      pointerEvents="none"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
}

interface DestMarkerProps {
  cx: number;
  cy: number;
  color: string;
  isSelected: boolean;
  isDimmed: boolean;
  isInteractive: boolean;
  onClick: () => void;
}

function DestMarker({
  cx, cy, color,
  isSelected, isDimmed, isInteractive,
  onClick,
}: DestMarkerProps) {
  const DOT_R  = isSelected ? 6 : 4;
  const GLOW_R = DOT_R + (isSelected ? 5 : 3);

  return (
    <g
      onClick={isInteractive ? onClick : undefined}
      style={{ cursor: isInteractive ? "pointer" : "default" }}
      opacity={isDimmed ? 0.12 : 1}
    >
      {/* Touch target besar untuk kiosk */}
      <circle
        cx={cx} cy={cy} r={TOUCH_R}
        fill="transparent"
        pointerEvents={isInteractive ? "all" : "none"}
      />
      {/* Glow */}
      <circle
        cx={cx} cy={cy} r={GLOW_R}
        fill={color}
        opacity={isSelected ? 0.35 : 0.18}
        pointerEvents="none"
      />
      {/* Dot */}
      <circle
        cx={cx} cy={cy} r={DOT_R}
        fill={color}
        pointerEvents="none"
      />
      {/* White center saat selected */}
      {isSelected && (
        <circle
          cx={cx} cy={cy} r={DOT_R / 2.5}
          fill="#ffffff"
          pointerEvents="none"
        />
      )}
    </g>
  );
}

function KioskMarker({
  cx, cy, color,
}: {
  cx: number;
  cy: number;
  color: string;
}) {
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={12} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={7}  fill={color} />
      <circle cx={cx} cy={cy} r={3}  fill="#ffffff" />
      <text
        x={cx + 12} y={cy + 4}
        fontSize={9} fontWeight="700"
        fill={color} fontFamily="system-ui, sans-serif"
        letterSpacing={0.5}
      >
        Anda di sini
      </text>
    </g>
  );
}