"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useMapStore } from "@/store/mapStore";
import { buildWallSet } from "@/lib/astar";
import type { FacilityWithRelations, DestinationPoint, WallDataJson } from "@/types";
import PathRenderer from "@/components/map/pathRenderer";

import {
  T1_WALL_DATA, DESTINATIONS as T1_DESTINATIONS,
  ROWS as T1_ROWS, COLS as T1_COLS,
  START_R as T1_START_R, START_C as T1_START_C,
  FLOOR1_ROW_MIN as T1_F1_MIN,
  FLOOR2_ROW_MIN as T1_F2_MIN, FLOOR2_ROW_MAX as T1_F2_MAX,
} from "@/data/walls/t1";

import {
  T2_WALL_DATA, DESTINATIONS as T2_DESTINATIONS,
  ROWS as T2_ROWS, COLS as T2_COLS,
  START_R as T2_START_R, START_C as T2_START_C,
  FLOOR1_ROW_MIN as T2_F1_MIN,
  FLOOR2_ROW_MIN as T2_F2_MIN, FLOOR2_ROW_MAX as T2_F2_MAX,
} from "@/data/walls/t2";

// =============================================================================
// CONSTANTS
// =============================================================================

const CELL    = 6;
const C_WALL  = "#1a4a5c" as const;
const C_FLOOR = "#e8f4f8" as const;
const C_GAP   = "#b8d4de" as const;
const C_KIOSK = "#00b4d8" as const;
const TOUCH_R = 30;

// Batas zoom: 0.5× sampai 4×
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

// =============================================================================
// TYPES
// =============================================================================

type RoomBox = { r1: number; c1: number; r2: number; c2: number };
type DestinationWithRoom = DestinationPoint & { room?: RoomBox };

// =============================================================================
// TERMINAL CONFIG
// =============================================================================

interface TerminalConfig {
  rows: number; cols: number;
  wallData: WallDataJson;
  destinations: DestinationPoint[];
  startR: number; startC: number;
  f1Min: number; f2Min: number; f2Max: number;
  gapMin: number; gapMax: number;
  labelL2Y: number; labelL1Y: number;
}

const T1_CFG: TerminalConfig = {
  rows: T1_ROWS, cols: T1_COLS,
  wallData: T1_WALL_DATA, destinations: T1_DESTINATIONS,
  startR: T1_START_R, startC: T1_START_C,
  f1Min: T1_F1_MIN, f2Min: T1_F2_MIN, f2Max: T1_F2_MAX,
  gapMin: T1_F2_MAX + 1, gapMax: T1_F1_MIN - 1,
  labelL2Y: Math.round((T1_F2_MIN + T1_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T1_F1_MIN + T1_ROWS - 1) / 2) * CELL + CELL / 2,
};

const T2_CFG: TerminalConfig = {
  rows: T2_ROWS, cols: T2_COLS,
  wallData: T2_WALL_DATA, destinations: T2_DESTINATIONS,
  startR: T2_START_R, startC: T2_START_C,
  f1Min: T2_F1_MIN, f2Min: T2_F2_MIN, f2Max: T2_F2_MAX,
  gapMin: -1, gapMax: -1,
  labelL2Y: Math.round((T2_F2_MIN + T2_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T2_F1_MIN + T2_ROWS - 1) / 2) * CELL + CELL / 2,
};

// =============================================================================
// HELPER — nearest walkable cell
// =============================================================================

function nearestWalkable(
  r: number,
  c: number,
  rows: number,
  cols: number,
  wallSet: Set<string>,
  maxDist = 6
): { r: number; c: number } {
  if (!wallSet.has(`${r},${c}`)) return { r, c };

  for (let d = 1; d <= maxDist; d++) {
    for (let dr = -d; dr <= d; dr++) {
      for (let dc = -d; dc <= d; dc++) {
        if (Math.abs(dr) !== d && Math.abs(dc) !== d) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (!wallSet.has(`${nr},${nc}`)) return { r: nr, c: nc };
      }
    }
  }
  return { r, c };
}

// =============================================================================
// HELPER — buat synthetic FacilityWithRelations dari DestinationPoint
// =============================================================================

let _syntheticIdCounter = -1;

function makeSyntheticFacility(
  dest: DestinationWithRoom,
  walkableR: number,
  walkableC: number,
  floorId: number,
  categoryId: number
): FacilityWithRelations {
  _syntheticIdCounter--;
  return {
    id: _syntheticIdCounter,
    name: dest.label,
    code: dest.id,
    description: null,
    categoryId,
    floorId,
    nodeId: null,
    isActive: true,
    gridRow: walkableR,
    gridCol: walkableC,
    photo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: categoryId,
      name: dest.id.includes("_tl") ? "Toilet & Nursery"
          : dest.id.includes("_fnb") ? "Food & Beverages"
          : dest.id.includes("_ret") ? "Retail"
          : dest.id.includes("_mus") ? "Musholla"
          : dest.id.includes("_gd") ? "Gate"
          : dest.id.includes("_lo") ? "Lounge"
          : dest.id.includes("_kan") ? "Services"
          : "Services",
      icon: null,
      color: dest.color,
      createdAt: new Date(),
    },
    floor: {
      id: floorId,
      terminal: dest.id.startsWith("l1_") || !dest.id.includes("_") ? "T1" : "T1",
      floorNumber: dest.id.startsWith("l2_") ? 2 : 1,
      label: dest.id.startsWith("l2_") ? "Lantai 2" : "Lantai 1",
      gridRows: null,
      gridCols: null,
      startRow: null,
      startCol: null,
      wallData: null,
    },
    node: null,
    operationalHours: [],
  } as FacilityWithRelations;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function MapCanvas({ children }: { children?: ReactNode }) {
  const activeTerminal           = useMapStore((s) => s.activeTerminal);
  const activeCategories         = useMapStore((s) => s.activeCategories);
  const selectedFacility         = useMapStore((s) => s.selectedFacility);
  const setSelectedFacility      = useMapStore((s) => s.setSelectedFacility);
  const setIsRouteOpen           = useMapStore((s) => s.setIsRouteOpen);
  const clearRoute               = useMapStore((s) => s.clearRoute);
  const mapMode                  = useMapStore((s) => s.mapMode);
  const adminSelectedFacility    = useMapStore((s) => s.adminSelectedFacility);
  const setAdminSelectedFacility = useMapStore((s) => s.setAdminSelectedFacility);
  const facilitiesVersion        = useMapStore((s) => s.facilitiesVersion);

  const [facilities, setFacilities] = useState<FacilityWithRelations[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outerRef  = useRef<HTMLDivElement>(null);

  // ── Pan & Zoom state ────────────────────────────────────────────────────────
  const [pan,   setPan]   = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Refs — tidak perlu trigger re-render
  const isDragging    = useRef(false);
  const lastPos       = useRef({ x: 0, y: 0 });
  const pinchDist     = useRef<number | null>(null);
  const lastTapTime   = useRef(0);
  const didDrag       = useRef(false); // membedakan drag vs tap

  // Reset ke posisi & zoom awal
  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setScale(1);
  }, []);

  // Reset view setiap ganti terminal
  useEffect(() => { resetView(); }, [activeTerminal, resetView]);

  // ── Prevent native scroll/zoom saat touch di dalam peta ────────────────────
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // ── Terminal config & wall set ──────────────────────────────────────────────
  const cfg = useMemo<TerminalConfig>(
    () => (activeTerminal === "T1" ? T1_CFG : T2_CFG),
    [activeTerminal]
  );

  const wallSet = useMemo(() => buildWallSet(cfg.wallData.walls), [cfg]);

  const facilityMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.gridRow != null && f.gridCol != null) {
        map.set(`${f.gridRow},${f.gridCol}`, f);
      }
    }
    return map;
  }, [facilities]);

  console.log(
    "Active terminal:",
    activeTerminal,
    "Room count:",
    (cfg.destinations as DestinationWithRoom[]).filter((d) => d.room).length
  );

  const activeCatSet = useMemo(() => new Set(activeCategories), [activeCategories]);

  // ── Fetch fasilitas dari DB ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function load() {
      try {
        const res  = await fetch(`/api/facilities?terminal=${activeTerminal}`);
        const body = (await res.json()) as {
          success: boolean;
          data: FacilityWithRelations[];
        };
        if (!cancelled && body.success) setFacilities(body.data);
      } catch {
        // Peta tetap tampil tanpa POI interaktif dari DB
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [activeTerminal, facilitiesVersion]);

  // ── Draw canvas ─────────────────────────────────────────────────────────────
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

  // ── Klik POI ────────────────────────────────────────────────────────────────
  const handleDestinationClick = useCallback(
    (dest: DestinationPoint) => {
      // Abaikan jika user sedang drag (bukan tap)
      if (didDrag.current) return;

      const walkable = nearestWalkable(
        dest.r, dest.c,
        cfg.rows, cfg.cols,
        wallSet
      );

      let facility =
        facilityMap.get(`${dest.r},${dest.c}`) ??
        facilityMap.get(`${walkable.r},${walkable.c}`);

      if (!facility) {
        const floorId  = dest.id.startsWith("l2_") ? 2 : 1;
        const catId    = 1;
        facility = makeSyntheticFacility(dest, walkable.r, walkable.c, floorId, catId);
      } else if (walkable.r !== dest.r || walkable.c !== dest.c) {
        facility = {
          ...facility,
          gridRow: walkable.r,
          gridCol: walkable.c,
        };
      }

      if (mapMode === "admin") {
        setAdminSelectedFacility(facility);
        return;
      }

      setIsRouteOpen(false);
      clearRoute();
      setSelectedFacility(facility);
    },
    [facilityMap, wallSet, cfg.rows, cfg.cols, mapMode,
     setAdminSelectedFacility, setSelectedFacility, setIsRouteOpen, clearRoute]
  );

  // ── Mouse event handlers (desktop / testing) ────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    didDrag.current    = false;
    lastPos.current    = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Scroll wheel zoom (desktop)
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, MIN_SCALE), MAX_SCALE));
  }, []);

  // ── Touch event handlers (kiosk touchscreen) ────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      didDrag.current    = false;
      lastPos.current    = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      // Double-tap → reset view
      const now = Date.now();
      if (now - lastTapTime.current < 300) resetView();
      lastTapTime.current = now;
    }

    if (e.touches.length === 2) {
      isDragging.current = false;
      pinchDist.current  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  }, [resetView]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    // 1 jari → pan
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }

    // 2 jari → pinch zoom
    if (e.touches.length === 2 && pinchDist.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = newDist / pinchDist.current;
      setScale(s => Math.min(Math.max(s * ratio, MIN_SCALE), MAX_SCALE));
      pinchDist.current = newDist;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    pinchDist.current  = null;
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const svgW = cfg.cols * CELL;
  const svgH = cfg.rows * CELL;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div
      ref={outerRef}
      className="relative h-full w-auto max-w-full rounded-2xl overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
      style={{
        aspectRatio: `${cfg.cols} / ${cfg.rows}`,
        cursor: isDragging.current ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none", // matikan gesture browser bawaan
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Transform layer — semua konten peta bergerak di sini ── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          aria-label={`Peta Terminal ${activeTerminal} Bandara Juanda`}
        >
          <FloorLabel x={12} y={cfg.labelL2Y} label="LANTAI 2" />
          <FloorLabel x={12} y={cfg.labelL1Y} label="LANTAI 1" />

          <line
            x1={0}
            y1={cfg.gapMin !== -1
              ? (cfg.gapMin + (cfg.gapMax - cfg.gapMin + 1) / 2) * CELL
              : cfg.f1Min * CELL}
            x2={svgW}
            y2={cfg.gapMin !== -1
              ? (cfg.gapMin + (cfg.gapMax - cfg.gapMin + 1) / 2) * CELL
              : cfg.f1Min * CELL}
            stroke="#1a4a5c" strokeWidth={1.5} strokeDasharray="8 5"
            opacity={0.3} pointerEvents="none"
          />

          {/* Room / tenant boxes */}
          {(cfg.destinations as DestinationWithRoom[]).map((dest) => {
            if (!dest.room) return null;
            const { r1, c1, r2, c2 } = dest.room;
            const x = c1 * CELL;
            const y = r1 * CELL;
            const w = (c2 - c1 + 1) * CELL;
            const h = (r2 - r1 + 1) * CELL;
            const showLabel = w >= 30 && h >= 14;

            return (
              <g
                key={`room-${dest.id}`}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick(dest);
                }}
              >
                <rect
                  x={x} y={y} width={w} height={h} rx={3}
                  fill={dest.color} fillOpacity={0.35}
                  stroke={dest.color} strokeWidth={1.4}
                />
                <rect
                  x={x + 1} y={y + 1}
                  width={Math.max(0, w - 2)} height={Math.max(0, h - 2)}
                  rx={2} fill="none"
                  stroke="white" strokeOpacity={0.45} strokeWidth={0.8}
                  pointerEvents="none"
                />
                {showLabel && (
                  <text
                    x={x + w / 2} y={y + h / 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(9, Math.max(5, h * 0.32))}
                    fontWeight={700} fill="#111827"
                    pointerEvents="none" className="select-none"
                  >
                    {dest.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Destination dot markers */}
          {(cfg.destinations as DestinationWithRoom[]).map((dest) => {
            const cx = dest.c * CELL + CELL / 2;
            const cy = dest.r * CELL + CELL / 2;
            const facility = facilityMap.get(`${dest.r},${dest.c}`);

            const isSelected = mapMode === "admin"
              ? adminSelectedFacility?.gridRow === dest.r &&
                adminSelectedFacility?.gridCol === dest.c
              : selectedFacility?.code === dest.id ||
                (selectedFacility?.gridRow === dest.r &&
                 selectedFacility?.gridCol === dest.c);

            const isDimmed =
              activeCatSet.size > 0 &&
              (!facility || !activeCatSet.has(facility.category.id));

            return (
              <DestMarker
                key={dest.id}
                cx={cx} cy={cy}
                color={dest.color}
                isSelected={isSelected}
                isDimmed={isDimmed}
                isInteractive={true}
                onClick={() => handleDestinationClick(dest)}
              />
            );
          })}

          <KioskMarker
            cx={cfg.startC * CELL + CELL / 2}
            cy={cfg.startR * CELL + CELL / 2}
            color={C_KIOSK}
          />

          <PathRenderer />
          {children}
        </svg>
      </div>

      {/* Loading overlay — di luar transform agar tidak ikut geser */}
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
    <text x={x} y={y} fontSize={14} fontWeight="700" fill="#1a4a5c" opacity={0.35}
      fontFamily="system-ui, sans-serif" letterSpacing={1.5}
      pointerEvents="none" dominantBaseline="middle">
      {label}
    </text>
  );
}

interface DestMarkerProps {
  cx: number; cy: number; color: string;
  isSelected: boolean; isDimmed: boolean;
  isInteractive: boolean; onClick: () => void;
}

function DestMarker({ cx, cy, color, isSelected, isDimmed, isInteractive, onClick }: DestMarkerProps) {
  const DOT_R  = isSelected ? 6 : 4;
  const GLOW_R = DOT_R + (isSelected ? 5 : 3);
  return (
    <g onClick={isInteractive ? onClick : undefined}
      style={{ cursor: isInteractive ? "pointer" : "default" }}
      opacity={isDimmed ? 0.12 : 1}>
      <circle cx={cx} cy={cy} r={TOUCH_R} fill="transparent"
        pointerEvents={isInteractive ? "all" : "none"} />
      <circle cx={cx} cy={cy} r={GLOW_R} fill={color}
        opacity={isSelected ? 0.35 : 0.18} pointerEvents="none" />
      <circle cx={cx} cy={cy} r={DOT_R} fill={color} pointerEvents="none" />
      {isSelected && (
        <circle cx={cx} cy={cy} r={DOT_R / 2.5} fill="#ffffff" pointerEvents="none" />
      )}
    </g>
  );
}

function KioskMarker({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g pointerEvents="none">
      <circle cx={cx} cy={cy} r={12} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={7}  fill={color} />
      <circle cx={cx} cy={cy} r={3}  fill="#ffffff" />
      <text x={cx + 12} y={cy + 4} fontSize={9} fontWeight="700"
        fill={color} fontFamily="system-ui, sans-serif" letterSpacing={0.5}>
        Anda di sini
      </text>
    </g>
  );
}