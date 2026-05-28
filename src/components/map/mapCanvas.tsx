// mapcanvas — merged (punyaku + temanku)
"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useMapStore } from "@/store/mapStore";
import { buildWallSet } from "@/lib/astar";
import type { FacilityWithRelations, DestinationPoint, WallDataJson } from "@/types";
import PathRenderer from "@/components/map/pathRenderer";
import { resolveNavigationAnchor } from "@/utils/roomAnchor";
import GridWallLayer from "@/components/map/gridWallLayer";

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
const C_KIOSK = "#00b4d8" as const;
const TOUCH_R = 10;
const MIN_HIT = 18;

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

// =============================================================================
// BACKGROUND & ROOM CALIBRATION
// =============================================================================

// =============================================================================
// CALIBRATION — Prinsip: room box + path KEDUANYA pakai raw grid coordinate.
//
// Room calibration sebelumnya (offsetX/offsetY) menggeser room box MENJAUHI
// raw grid, sehingga path (yang sudah raw grid) terlihat berhenti sebelum
// sampai ke room secara visual.
//
// Fix:
//  1. Room calibration di-nol-kan → room box kembali ke raw grid.
//  2. Background SVG digeser SESUAI offset lama agar alignment latar tetap terjaga.
//     Formula: BG_CALIBRATION = { x: -offsetX, y: -offsetY }
//
// T1 : offset seragam (7, 23) di kedua lantai → BG shift tunggal (-7, -23).
// T2 : offset berbeda per lantai (floor2: 5,4 / floor1: 0,10) → pakai midpoint
//      (-3, -7). Residual visual per lantai ≤ 3 px — dapat fine-tune di sini.
// =============================================================================



const BG_CALIBRATION = {
  T1: { x: -7,  y: -23, widthScale: 1.0, heightScale: 1.0 },
  // T2 midpoint dari floor1(0,10) dan floor2(5,4). Fine-tune jika perlu:
  T2: { x: -3,  y:  -7, widthScale: 1.0, heightScale: 1.0 },
} as const;

// Room box → raw grid coordinate (0 offset). Path sudah raw grid → keduanya aligned.
const T1_ROOM_CALIBRATION = {
  floor2: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
  floor1: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
} as const;

const T2_ROOM_CALIBRATION = {
  floor2: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
  floor1: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
} as const;

// =============================================================================
// CATEGORY MAPPING
// =============================================================================

const PREFIX_TO_CATEGORY: Record<string, string> = {
  fnb: "Food & Beverages",
  gd:  "Gate",
  lo:  "Lounge",
  pr:  "Lounge",
  tl:  "Toilet & Nursery",
  ret: "Retail",
  ser: "Services",
  kan: "Services",
  mus: "Musholla",
  df:  "Duty Free",
  arr: "Arrival",
};

function getCategoryName(destId: string): string | null {
  const clean  = destId.replace(/^l[12]_/, "");
  const prefix = clean.match(/^([a-z]+)/)?.[1] ?? "";
  return PREFIX_TO_CATEGORY[prefix] ?? null;
}

// =============================================================================
// TYPES
// =============================================================================

type RoomBox = { r1: number; c1: number; r2: number; c2: number };
type DestinationWithRoom = DestinationPoint & { room?: RoomBox };

interface Category {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
}

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
  bgSvg: string;
  calibKey: "T1" | "T2";
  labelL2Y: number;
  labelL1Y: number;
}

const T1_CFG: TerminalConfig = {
  rows: T1_ROWS, cols: T1_COLS,
  wallData: T1_WALL_DATA, destinations: T1_DESTINATIONS,
  startR: T1_START_R, startC: T1_START_C,
  f1Min: T1_F1_MIN, f2Min: T1_F2_MIN, f2Max: T1_F2_MAX,
  gapMin: T1_F2_MAX + 1, gapMax: T1_F1_MIN - 1,
  bgSvg: "/map/t1_gabungan.svg",
  calibKey: "T1",
  labelL2Y: Math.round((T1_F2_MIN + T1_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T1_F1_MIN + T1_ROWS - 1) / 2) * CELL + CELL / 2,
};

const T2_CFG: TerminalConfig = {
  rows: T2_ROWS, cols: T2_COLS,
  wallData: T2_WALL_DATA, destinations: T2_DESTINATIONS,
  startR: T2_START_R, startC: T2_START_C,
  f1Min: T2_F1_MIN, f2Min: T2_F2_MIN, f2Max: T2_F2_MAX,
  gapMin: -1, gapMax: -1,
  bgSvg: "/map/t2_gabungan.svg",
  calibKey: "T2",
  labelL2Y: Math.round((T2_F2_MIN + T2_F2_MAX) / 2) * CELL + CELL / 2,
  labelL1Y: Math.round((T2_F1_MIN + T2_ROWS - 1) / 2) * CELL + CELL / 2,
};

// =============================================================================
// HELPER — nearest walkable cell
// =============================================================================

function nearestWalkable(
  r: number, c: number,
  rows: number, cols: number,
  wallSet: Set<string>,
  maxDist = 6
): { r: number; c: number } {
  if (!wallSet.has(`${r},${c}`)) return { r, c };
  for (let d = 1; d <= maxDist; d++) {
    for (let dr = -d; dr <= d; dr++) {
      for (let dc = -d; dc <= d; dc++) {
        if (Math.abs(dr) !== d && Math.abs(dc) !== d) continue;
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (!wallSet.has(`${nr},${nc}`)) return { r: nr, c: nc };
      }
    }
  }
  return { r, c };
}

// =============================================================================
// HELPER — room calibration transform
// =============================================================================

function getRoomTransform(terminal: "T1" | "T2", dest: DestinationWithRoom) {
  const isFloor2 = dest.id.startsWith("l2_");
  if (terminal === "T1") {
    return isFloor2 ? T1_ROOM_CALIBRATION.floor2 : T1_ROOM_CALIBRATION.floor1;
  }
  return isFloor2 ? T2_ROOM_CALIBRATION.floor2 : T2_ROOM_CALIBRATION.floor1;
}

// =============================================================================
// HELPER — synthetic facility
// =============================================================================

let _syntheticIdCounter = -1;

function makeSyntheticFacility(
  dest: DestinationWithRoom,
  walkableR: number,
  walkableC: number,
  floorId: number,
  categoryId: number,
  categoryName: string
): FacilityWithRelations {
  _syntheticIdCounter--;
  return {
    id: _syntheticIdCounter,
    name: dest.label,
    code: dest.id,
    destId: dest.id,
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
      name: categoryName,
      icon: null,
      color: dest.color,
      terminals: [],
      sortOrder: 0,
      createdAt: new Date(),
    },
    floor: {
      id: floorId,
      terminal: "T1",
      floorNumber: dest.id.startsWith("l2_") ? 2 : 1,
      label: dest.id.startsWith("l2_") ? "Lantai 2" : "Lantai 1",
      gridRows: null, gridCols: null,
      startRow: null, startCol: null,
      wallData: null,
    },
    node: null,
    operationalHours: [],
  } as FacilityWithRelations;
}

// =============================================================================
// HELPER — template ADD mode admin
// =============================================================================

function makeAddFacilityTemplate(
  dest: DestinationWithRoom,
  walkableR: number,
  walkableC: number,
  terminal: string
): FacilityWithRelations {
  const isL2 = dest.id.startsWith("l2_");
  return {
    id: 0,
    name: dest.label,
    code: dest.id,
    destId: dest.id,
    description: null,
    categoryId: 0,
    floorId: 0,
    isActive: true,
    gridRow: walkableR,
    gridCol: walkableC,
    photo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: 0, name: "", icon: null,
      color: "#3B82F6", terminals: [], sortOrder: 0, createdAt: new Date(),
    },
    floor: {
      id: 0,
      terminal,
      floorNumber: isL2 ? 2 : 1,
      label: isL2 ? "Lantai 2" : "Lantai 1",
      gridRows: null, gridCols: null,
      startRow: null, startCol: null,
      wallData: null,
    },
    operationalHours: [],
  };
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
  const adminSelectedFacility    = useMapStore((s) => s.adminSelectedFacility);
  const setAdminSelectedFacility = useMapStore((s) => s.setAdminSelectedFacility);
  const facilitiesVersion        = useMapStore((s) => s.facilitiesVersion);

  const mapMode = useMapStore((s) => s.mapMode);

  const [facilities, setFacilities] = useState<FacilityWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);

  const outerRef = useRef<HTMLDivElement>(null);

  // ── Pan & Zoom ───────────────────────────────────────────────────────────────
  const [pan,   setPan]   = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const isDragging  = useRef(false);
  const lastPos     = useRef({ x: 0, y: 0 });
  const pinchDist   = useRef<number | null>(null);
  const lastTapTime = useRef(0);
  const didDrag     = useRef(false);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setScale(1);
  }, []);

  useEffect(() => { resetView(); }, [activeTerminal, resetView]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // ── Terminal config & wall set ───────────────────────────────────────────────
  const cfg = useMemo<TerminalConfig>(
    () => (activeTerminal === "T1" ? T1_CFG : T2_CFG),
    [activeTerminal]
  );

  const wallSet = useMemo(() => buildWallSet(cfg.wallData.walls), [cfg]);

  const facilityMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.gridRow != null && f.gridCol != null)
        map.set(`${f.gridRow},${f.gridCol}`, f);
    }
    return map;
  }, [facilities]);

  const facilityCodeMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.code) map.set(f.code, f);
    }
    return map;
  }, [facilities]);

  // Primary link: dest.id (JSON) → destId (DB)
  const facilityDestMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.destId) map.set(f.destId, f);
    }
    return map;
  }, [facilities]);

  // Map destId → category.color dari DB (override warna statis)
  const destColorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of facilities) {
      if (f.destId && f.category?.color) {
        map.set(f.destId, f.category.color);
      }
      // fallback via code
      if (f.code && f.category?.color) {
        map.set(f.code, f.category.color);
      }
    }
    return map;
  }, [facilities]);

  const getDestColor = useCallback(
  (dest: DestinationPoint): string =>
    destColorMap.get(dest.id) ?? dest.color,
  [destColorMap]
);

  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of categories) map.set(c.id, c.name);
    return map;
  }, [categories]);

  const activeCategoryNames = useMemo(() => {
    if (activeCategories.length === 0) return null;
    const names = new Set<string>();
    for (const id of activeCategories) {
      const name = categoryNameMap.get(id);
      if (name) names.add(name);
    }
    return names;
  }, [activeCategories, categoryNameMap]);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function load() {
      try {
        const [facRes, catRes] = await Promise.all([
          fetch(`/api/facilities?terminal=${activeTerminal}`),
          fetch("/api/categories"),
        ]);
        const facBody = (await facRes.json()) as { success: boolean; data: FacilityWithRelations[] };
        const catBody = (await catRes.json()) as { success: boolean; data: Category[] };
        if (!cancelled) {
          if (facBody.success) setFacilities(facBody.data);
          if (catBody.success) setCategories(catBody.data);
        }
      } catch { /* peta tetap tampil */ }
      finally   { if (!cancelled) setIsLoading(false); }
    }

    void load();
    return () => { cancelled = true; };
  }, [activeTerminal, facilitiesVersion]);

  // ── Visibility filter ────────────────────────────────────────────────────────
  const isVisible = useCallback((dest: DestinationPoint): boolean => {
    if (!activeCategoryNames) return true;
    const facility = facilityMap.get(`${dest.r},${dest.c}`);
    if (facility) {
      const catName = categoryNameMap.get(facility.categoryId) ?? "";
      return activeCategoryNames.has(catName);
    }
    const catName = getCategoryName(dest.id);
    if (!catName) return true;
    return activeCategoryNames.has(catName);
  }, [activeCategoryNames, facilityMap, categoryNameMap]);

  // ── Klik POI ─────────────────────────────────────────────────────────────────
  const handleDestinationClick = useCallback(
    (dest: DestinationPoint) => {
      if (didDrag.current) return;

      // PATCH: room sebagai source of truth → anchor → nearestWalkable → A*
      const anchor   = resolveNavigationAnchor(dest, cfg.rows, cfg.cols, wallSet);
      const walkable = nearestWalkable(anchor.r, anchor.c, cfg.rows, cfg.cols, wallSet);

      // DB lookup tetap pakai dest.r/c (gridRow/Col di DB masih koordinat lama)
      const dbFacility =
        facilityDestMap.get(dest.id)                      // 1. destId — paling reliable
        ?? facilityMap.get(`${dest.r},${dest.c}`)         // 2. koordinat dest
        ?? facilityMap.get(`${walkable.r},${walkable.c}`) // 3. koordinat walkable
        ?? facilityCodeMap.get(dest.id);                  // 4. code fallback

      

      // ── Admin mode ──────────────────────────────────────────────────────────
      if (mapMode === "admin") {
        if (dbFacility && dbFacility.id > 0) {
          const facilityWithCoords =
            (dbFacility.gridRow == null || dbFacility.gridCol == null)
              ? { ...dbFacility, gridRow: walkable.r, gridCol: walkable.c }
              : dbFacility;
          setAdminSelectedFacility(facilityWithCoords);
        } else {
          const template = makeAddFacilityTemplate(
            dest as DestinationWithRoom,
            walkable.r, walkable.c,
            activeTerminal
          );
          setAdminSelectedFacility(template);
        }
        return;
      }

      // ── User mode (svg & grid) ───────────────────────────────────────────────
      let facility: FacilityWithRelations;

      if (!dbFacility) {
        const floorId  = dest.id.startsWith("l2_") ? 2 : 1;
        const catName  = getCategoryName(dest.id) ?? "Services";
        const catEntry = categories.find(c => c.name === catName);
        const catId    = catEntry?.id ?? 1;
        facility = makeSyntheticFacility(
          dest as DestinationWithRoom,
          walkable.r, walkable.c,
          floorId, catId, catName
        );
      } else if (walkable.r !== dest.r || walkable.c !== dest.c) {
        facility = { ...dbFacility, gridRow: walkable.r, gridCol: walkable.c };
      } else {
        facility = dbFacility;
      }

      setIsRouteOpen(false);
      clearRoute();
      setSelectedFacility(facility);
    },
    
    [
      facilityMap, facilityDestMap, facilityCodeMap, wallSet, cfg.rows, cfg.cols,
      mapMode, activeTerminal, categories,
      setAdminSelectedFacility, setSelectedFacility,
      setIsRouteOpen, clearRoute,
    ]
  );

  // ── Mouse handlers ───────────────────────────────────────────────────────────
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

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.min(Math.max(s - e.deltaY * 0.001, MIN_SCALE), MAX_SCALE));
  }, []);

  // ── Touch handlers ───────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      didDrag.current    = false;
      lastPos.current    = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
    }
    if (e.touches.length === 2 && pinchDist.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      setScale(s => Math.min(Math.max(s * (newDist / pinchDist.current!), MIN_SCALE), MAX_SCALE));
      pinchDist.current = newDist;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    pinchDist.current  = null;
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const svgW  = cfg.cols * CELL;
  const svgH  = cfg.rows * CELL;
  const calib = BG_CALIBRATION[cfg.calibKey];

  // Shorthand untuk readability di JSX
  const isGridMode  = mapMode === "grid";
  const isAdminMode = mapMode === "admin";

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
        touchAction: "none",
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
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          aria-label={`Peta Terminal ${activeTerminal} Bandara Juanda`}
        >
          {/* ── LAYER 1: Background SVG — disembunyikan di grid mode ── */}
          {!isGridMode && (
            <image
              href={cfg.bgSvg}
              x={calib.x}
              y={calib.y}
              width={svgW * calib.widthScale}
              height={svgH * calib.heightScale}
              preserveAspectRatio="none"
            />
          )}

          {/* ── LAYER 1b: Grid/Wall debug layer — hanya di grid mode ── */}
          {isGridMode && (
            <GridWallLayer
              wallData={cfg.wallData}
              rows={cfg.rows}
              cols={cfg.cols}
              f1Min={cfg.f1Min}
              f2Min={cfg.f2Min}
              f2Max={cfg.f2Max}
              offsetX={calib.x * -1}
              offsetY={calib.y * 0}
            />
          )}

          {/* ── LAYER 2: Room / tenant boxes ── */}
          {(cfg.destinations as DestinationWithRoom[]).map((dest, i) => {
            if (!dest.room)       return null;
            if (!isVisible(dest)) return null;

            const { r1, c1, r2, c2 } = dest.room;
            const roomCal = getRoomTransform(activeTerminal, dest);

            const x = c1 * CELL * roomCal.scaleX + roomCal.offsetX;
            const y = r1 * CELL * roomCal.scaleY + roomCal.offsetY;
            const w = (c2 - c1 + 1) * CELL * roomCal.scaleX;
            const h = (r2 - r1 + 1) * CELL * roomCal.scaleY;

            const hitPadX   = Math.max(0, (MIN_HIT - w) / 2);
            const hitPadY   = Math.max(0, (MIN_HIT - h) / 2);
            const showLabel = w >= 36 && h >= 18;

            const isSelected = isAdminMode
              ? adminSelectedFacility?.gridRow === dest.r &&
                adminSelectedFacility?.gridCol === dest.c
              : selectedFacility?.code === dest.id ||
                (selectedFacility?.gridRow === dest.r &&
                 selectedFacility?.gridCol === dest.c);

            return (
              <g
                key={`room-${dest.id}-${i}`}
                style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); handleDestinationClick(dest); }}
              >
                {(hitPadX > 0 || hitPadY > 0) && (
                  <rect
                    x={x - hitPadX} y={y - hitPadY}
                    width={w + hitPadX * 2} height={h + hitPadY * 2}
                    rx={3} fill="transparent" stroke="none"
                  />
                )}
                <rect
                  x={x} y={y} width={w} height={h} rx={3}
                  fill={getDestColor(dest)}
                  stroke={isSelected ? "#f39c12" : getDestColor(dest)}
                  fillOpacity={isSelected ? 0.55 : 0.28}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeOpacity={isSelected ? 1 : 0.75}
                />
                <rect
                  x={x + 1} y={y + 1}
                  width={Math.max(0, w - 2)} height={Math.max(0, h - 2)}
                  rx={2} fill="none"
                  stroke="white" strokeOpacity={0.3} strokeWidth={0.7}
                  pointerEvents="none"
                />
                {showLabel && (
                  <text
                    x={x + w / 2} y={y + h / 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(8, Math.max(5, h * 0.3))}
                    fontWeight={700}
                    fill={isSelected ? "#111827" : "#1a1a2e"}
                    fillOpacity={0.85}
                    pointerEvents="none"
                    className="select-none"
                  >
                    {dest.label}
                  </text>
                )}
                {isSelected && (
                  <rect
                    x={x - 1} y={y - 1}
                    width={w + 2} height={h + 2}
                    rx={4} fill="none"
                    stroke="#f39c12" strokeWidth={2}
                    strokeDasharray="4 2"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* ── LAYER 3: Dot markers ── */}
          {(cfg.destinations as DestinationWithRoom[]).map((dest) => {
            if (dest.room)        return null;
            if (!isVisible(dest)) return null;

            const cx = dest.c * CELL + CELL / 2;
            const cy = dest.r * CELL + CELL / 2;

            const isSelected = isAdminMode
              ? adminSelectedFacility?.gridRow === dest.r &&
                adminSelectedFacility?.gridCol === dest.c
              : selectedFacility?.code === dest.id ||
                (selectedFacility?.gridRow === dest.r &&
                 selectedFacility?.gridCol === dest.c);

            return (
              <DestMarker
                key={dest.id}
                cx={cx} cy={cy}
                color={getDestColor(dest)}
                isSelected={isSelected}
                onClick={() => handleDestinationClick(dest)}
              />
            );
          })}

          {/* ── LAYER 4: Floor labels ── */}
          <FloorLabel x={12} y={cfg.labelL2Y} label="LANTAI 2" />
          <FloorLabel x={12} y={cfg.labelL1Y} label="LANTAI 1" />

          {/* ── LAYER 5: Kiosk marker ── */}
          <KioskMarker
            cx={cfg.startC * CELL + CELL / 2}
            cy={cfg.startR * CELL + CELL / 2}
            color={C_KIOSK}
          />

          {/* ── LAYER 6: Route path + children ── */}
          <PathRenderer />
          {children}
        </svg>
      </div>

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
      x={x} y={y} fontSize={14} fontWeight="700" fill="#1a4a5c" opacity={0.35}
      fontFamily="system-ui, sans-serif" letterSpacing={1.5}
      pointerEvents="none" dominantBaseline="middle"
    >
      {label}
    </text>
  );
}

interface DestMarkerProps {
  cx: number; cy: number; color: string;
  isSelected: boolean; onClick: () => void;
}

function DestMarker({ cx, cy, color, isSelected, onClick }: DestMarkerProps) {
  const DOT_R  = isSelected ? 6 : 4;
  const GLOW_R = DOT_R + (isSelected ? 5 : 3);
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <circle cx={cx} cy={cy} r={TOUCH_R} fill="transparent" />
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
      <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={8}  fill={color} />
      <circle cx={cx} cy={cy} r={3}  fill="#ffffff" />
      <text
        x={cx + 13} y={cy + 4}
        fontSize={8} fontWeight="700"
        fill={color} fontFamily="system-ui, sans-serif" letterSpacing={0.3}
      >
        Anda di sini
      </text>
    </g>
  );
}