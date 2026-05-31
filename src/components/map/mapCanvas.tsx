// mapCanvas.tsx — refactored (best practice)
// Perubahan mencakup: Performa & Optimasi · Aksesibilitas · Kualitas Kode · Keamanan
"use client";

import {
  useEffect, useRef, useMemo, useCallback, useState, useId,
} from "react";
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

// [PERFORMA] Delay sebelum loading overlay muncul.
// Operasi yang selesai < LOADING_DELAY ms tidak akan memunculkan overlay sama
// sekali — menghindari "loading flash" yang mengganggu saat cache hit atau
// koneksi cepat. 300 ms adalah threshold Nielsen untuk respons yang terasa
// instan.
const LOADING_DELAY_MS = 300;

// [KEAMANAN] Batas waktu fetch sebelum dianggap gagal. Mencegah loading tanpa
// batas jika server lambat atau tidak merespons.
const FETCH_TIMEOUT_MS = 10_000;

// =============================================================================
// CALIBRATION
// =============================================================================

const BG_CALIBRATION = {
  T1: { x: -7,  y: -23, widthScale: 1.0, heightScale: 1.0 },
  T2: { x: -3,  y:  -7, widthScale: 1.0, heightScale: 1.0 },
} as const;

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

// [KEAMANAN] Type guard memvalidasi struktur respons API sebelum data dipakai.
// Tanpa ini, jika API mengembalikan format tak terduga (error 500, HTML, dsb),
// kode akan crash secara diam-diam atau menampilkan data korup.
function isApiResponse<T>(
  val: unknown,
  isData: (d: unknown) => d is T,
): val is { success: boolean; data: T } {
  return (
    typeof val === "object" &&
    val !== null &&
    "success" in val &&
    typeof (val as Record<string, unknown>).success === "boolean" &&
    "data" in val &&
    isData((val as Record<string, unknown>).data)
  );
}

function isFacilityArray(d: unknown): d is FacilityWithRelations[] {
  return Array.isArray(d);
}

function isCategoryArray(d: unknown): d is Category[] {
  return Array.isArray(d);
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
// HELPERS
// =============================================================================

function nearestWalkable(
  r: number, c: number,
  rows: number, cols: number,
  wallSet: Set<string>,
  maxDist = 6,
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

function getRoomTransform(terminal: "T1" | "T2", dest: DestinationWithRoom) {
  const isFloor2 = dest.id.startsWith("l2_");
  if (terminal === "T1") {
    return isFloor2 ? T1_ROOM_CALIBRATION.floor2 : T1_ROOM_CALIBRATION.floor1;
  }
  return isFloor2 ? T2_ROOM_CALIBRATION.floor2 : T2_ROOM_CALIBRATION.floor1;
}

// [KUALITAS KODE] _syntheticIdCounter dulu berupa module-level mutable variable.
// Masalahnya: nilainya tidak pernah reset antara re-mount atau hot-reload,
// sehingga ID negatif bisa bocor ke session lain. Diganti dengan counter yang
// di-scope ke closure fungsi ini saja — lebih aman dan predictable.
const makeSyntheticIdGenerator = () => {
  let counter = -1;
  return () => counter--;
};
const nextSyntheticId = makeSyntheticIdGenerator();

function makeSyntheticFacility(
  dest: DestinationWithRoom,
  walkableR: number,
  walkableC: number,
  floorId: number,
  categoryId: number,
  categoryName: string,
  // [KUALITAS KODE] Param `terminal` ditambahkan — versi lama hardcode "T1"
  // pada field floor.terminal, sehingga fasilitas T2 salah terbaca sebagai T1.
  terminal: string,
): FacilityWithRelations {
  return {
    id: nextSyntheticId(),
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
      // FIX: pakai `terminal` param, bukan hardcode "T1"
      terminal,
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

function makeAddFacilityTemplate(
  dest: DestinationWithRoom,
  walkableR: number,
  walkableC: number,
  terminal: string,
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
// CUSTOM HOOK — fetch data peta
// =============================================================================

// [KUALITAS KODE] Logic fetch dipisah ke custom hook agar komponen utama hanya
// bertanggung jawab pada render. Ini membuat keduanya lebih mudah di-test dan
// di-maintain secara independen.

type FetchStatus = "idle" | "loading" | "success" | "error";

interface UseMapDataResult {
  facilities: FacilityWithRelations[];
  categories: Category[];
  // [AKSESIBILITAS] Expose `status` bukan hanya boolean `isLoading`, sehingga
  // komponen bisa menyampaikan state error ke pengguna dengan tepat.
  status: FetchStatus;
  errorMessage: string | null;
}

function useMapData(
  activeTerminal: string,
  facilitiesVersion: number,
): UseMapDataResult {
  const [facilities, setFacilities] = useState<FacilityWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status,     setStatus]     = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // [PERFORMA] Delay sebelum loading muncul — mencegah flash untuk fetch cepat.
    // Timer dibersihkan di cleanup jika fetch selesai sebelum 300 ms.
    let loadingTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      if (!cancelled) setStatus("loading");
    }, LOADING_DELAY_MS);

    // [KEAMANAN] AbortController memastikan fetch benar-benar dibatalkan di
    // network level saat komponen unmount — bukan hanya diabaikan di JS.
    // Ini mencegah memory leak dan state update pada unmounted component.
    const controller = new AbortController();

    // [KEAMANAN] Timeout: fetch dianggap gagal setelah FETCH_TIMEOUT_MS.
    // Tanpa ini, loading bisa berlangsung selamanya jika server tidak merespons.
    const timeoutTimer = setTimeout(
      () => controller.abort(new DOMException("Fetch timeout", "TimeoutError")),
      FETCH_TIMEOUT_MS,
    );

    async function load() {
      try {
        const [facRes, catRes] = await Promise.all([
          fetch(`/api/facilities?terminal=${activeTerminal}`, {
            signal: controller.signal,
          }),
          fetch("/api/categories", {
            signal: controller.signal,
          }),
        ]);

        // [KEAMANAN] Periksa HTTP status sebelum parsing JSON.
        // fetch() tidak throw untuk 4xx/5xx — harus dicek manual.
        if (!facRes.ok || !catRes.ok) {
          throw new Error(
            `Respons server tidak OK: facilities=${facRes.status}, categories=${catRes.status}`,
          );
        }

        const [facBody, catBody] = await Promise.all([
          facRes.json() as Promise<unknown>,
          catRes.json() as Promise<unknown>,
        ]);

        if (cancelled) return;

        // [KEAMANAN] Validasi struktur respons API dengan type guard sebelum
        // menggunakannya. Tanpa ini, data korup/tak terduga bisa lolos masuk
        // ke state dan menyebabkan crash atau perilaku tak terduga.
        if (isApiResponse(facBody, isFacilityArray) && facBody.success) {
          setFacilities(facBody.data);
        }
        if (isApiResponse(catBody, isCategoryArray) && catBody.success) {
          setCategories(catBody.data);
        }

        setStatus("success");
        setErrorMessage(null);
      } catch (err) {
        if (cancelled) return;

        // [KUALITAS KODE] Error tidak lagi ditelan diam-diam. Dibedakan antara
        // abort (navigasi/cleanup) vs error nyata agar tidak menampilkan pesan
        // error palsu saat pengguna ganti terminal.
        if (err instanceof DOMException && err.name === "AbortError") {
          // Diabaikan — ini abort yang disengaja (unmount atau timeout)
          return;
        }

        // [AKSESIBILITAS] Simpan pesan error ke state agar bisa ditampilkan
        // ke pengguna, bukan hanya di console.
        const message =
          err instanceof Error ? err.message : "Gagal memuat data peta.";

        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("[MapCanvas] Fetch error:", err);
        }

        setErrorMessage(message);
        setStatus("error");
      } finally {
        clearTimeout(timeoutTimer);
        // Bersihkan loading timer jika fetch selesai sebelum 300 ms
        if (loadingTimer !== null) {
          clearTimeout(loadingTimer);
          loadingTimer = null;
        }
        // Jika fetch selesai tepat saat loading timer aktif, pastikan status
        // tidak tertinggal di "loading"
        if (!cancelled) {
          setStatus((prev) => (prev === "loading" ? "success" : prev));
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutTimer);
      if (loadingTimer !== null) clearTimeout(loadingTimer);
    };
  }, [activeTerminal, facilitiesVersion]);

  return { facilities, categories, status, errorMessage };
}

// =============================================================================
// CUSTOM HOOK — pan & zoom
// =============================================================================

// [KUALITAS KODE + PERFORMA] Pan/zoom logic dipisah ke custom hook.
// Sebelumnya: `pan` pakai useState → setiap frame drag memicu re-render penuh
// pada komponen (mahal karena MapCanvas merender ratusan SVG element).
// Sekarang: transform diterapkan langsung via ref ke DOM node menggunakan
// requestAnimationFrame, sehingga React render cycle tidak terlibat sama sekali
// selama drag/pinch.

interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

interface UsePanZoomResult {
  innerRef: React.RefObject<HTMLDivElement | null>;
  // Expose getter untuk komponen lain yang mungkin perlu tahu scale
  getState: () => PanZoomState;
  resetView: () => void;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onWheel: (e: React.WheelEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  // Expose isDragging sebagai ref agar handleDestinationClick bisa baca tanpa
  // menyebabkan re-render
  isDragging: React.RefObject<boolean>;
  didDrag: React.RefObject<boolean>;
}

function usePanZoom(onResetDependency: string): UsePanZoomResult {
  const innerRef   = useRef<HTMLDivElement>(null);
  const stateRef   = useRef<PanZoomState>({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const didDrag    = useRef(false);
  const lastPos    = useRef({ x: 0, y: 0 });
  const pinchDist  = useRef<number | null>(null);
  const lastTap    = useRef(0);
  const rafId      = useRef<number | null>(null);

  const applyTransform = useCallback((s: PanZoomState) => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${s.x}px, ${s.y}px) scale(${s.scale})`;
      }
      rafId.current = null;
    });
  }, []);

  const resetView = useCallback(() => {
    stateRef.current = { x: 0, y: 0, scale: 1 };
    applyTransform(stateRef.current);
  }, [applyTransform]);

  // Reset saat terminal berubah
  useEffect(() => { resetView(); }, [onResetDependency, resetView]);

  const clampScale = (s: number) =>
    Math.min(Math.max(s, MIN_SCALE), MAX_SCALE);

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
    stateRef.current = {
      ...stateRef.current,
      x: stateRef.current.x + dx,
      y: stateRef.current.y + dy,
    };
    applyTransform(stateRef.current);
  }, [applyTransform]);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    stateRef.current = {
      ...stateRef.current,
      scale: clampScale(stateRef.current.scale - e.deltaY * 0.001),
    };
    applyTransform(stateRef.current);
  }, [applyTransform]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      didDrag.current    = false;
      lastPos.current    = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const now = Date.now();
      if (now - lastTap.current < 300) resetView();
      lastTap.current = now;
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
      stateRef.current = {
        ...stateRef.current,
        x: stateRef.current.x + dx,
        y: stateRef.current.y + dy,
      };
      applyTransform(stateRef.current);
    }
    if (e.touches.length === 2 && pinchDist.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      stateRef.current = {
        ...stateRef.current,
        scale: clampScale(stateRef.current.scale * (newDist / pinchDist.current)),
      };
      pinchDist.current = newDist;
      applyTransform(stateRef.current);
    }
  }, [applyTransform]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
    pinchDist.current  = null;
  }, []);

  const getState = useCallback(() => stateRef.current, []);

  return {
    innerRef,
    getState,
    resetView,
    handlers: {
      onMouseDown, onMouseMove, onMouseUp, onWheel,
      onTouchStart, onTouchMove, onTouchEnd,
    },
    isDragging,
    didDrag,
  };
}

// =============================================================================
// MAIN COMPONENT
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
  const mapMode                  = useMapStore((s) => s.mapMode);

  // [AKSESIBILITAS] useId menghasilkan ID unik yang stabil antar render dan
  // aman untuk SSR — digunakan untuk menghubungkan elemen loading dengan
  // atribut aria-describedby pada SVG container.
  const loadingId = useId();

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { facilities, categories, status, errorMessage } = useMapData(
    activeTerminal,
    facilitiesVersion,
  );
  const isLoading = status === "loading";
  const isError   = status === "error";

  // ── Pan & Zoom ───────────────────────────────────────────────────────────────
  const outerRef = useRef<HTMLDivElement>(null);
  const { innerRef, handlers, isDragging, didDrag } = usePanZoom(activeTerminal);

  // Pasang touchmove non-passive untuk mencegah scroll browser saat pan
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // ── Terminal config & derived maps ───────────────────────────────────────────
  const cfg = useMemo<TerminalConfig>(
    () => (activeTerminal === "T1" ? T1_CFG : T2_CFG),
    [activeTerminal],
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

  const facilityDestMap = useMemo(() => {
    const map = new Map<string, FacilityWithRelations>();
    for (const f of facilities) {
      if (f.destId) map.set(f.destId, f);
    }
    return map;
  }, [facilities]);

  const destColorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of facilities) {
      if (f.destId && f.category?.color)
        map.set(f.destId, f.category.color);
      if (f.code && f.category?.color)
        map.set(f.code, f.category.color);
      if (f.gridRow != null && f.gridCol != null && f.category?.color)
        map.set(`${f.gridRow},${f.gridCol}`, f.category.color);
    }
    return map;
  }, [facilities]);

  const getDestColor = useCallback(
    (dest: DestinationPoint): string =>
      destColorMap.get(dest.id)
      ?? destColorMap.get(`${dest.r},${dest.c}`)
      ?? dest.color,
    [destColorMap],
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

      const anchor   = resolveNavigationAnchor(dest, cfg.rows, cfg.cols, wallSet);
      const walkable = nearestWalkable(anchor.r, anchor.c, cfg.rows, cfg.cols, wallSet);

      const dbFacility =
        facilityDestMap.get(dest.id)
        ?? facilityMap.get(`${dest.r},${dest.c}`)
        ?? facilityMap.get(`${walkable.r},${walkable.c}`)
        ?? facilityCodeMap.get(dest.id);

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
            activeTerminal,
          );
          setAdminSelectedFacility(template);
        }
        return;
      }

      // ── User mode ────────────────────────────────────────────────────────────
      let facility: FacilityWithRelations;

      if (!dbFacility) {
        const floorId  = dest.id.startsWith("l2_") ? 2 : 1;
        const catName  = getCategoryName(dest.id) ?? "Services";
        const catEntry = categories.find(c => c.name === catName);
        const catId    = catEntry?.id ?? 1;
        // [KUALITAS KODE] activeTerminal sekarang diteruskan ke makeSyntheticFacility
        // — memperbaiki bug hardcode "T1" di versi lama.
        facility = makeSyntheticFacility(
          dest as DestinationWithRoom,
          walkable.r, walkable.c,
          floorId, catId, catName,
          activeTerminal,
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
      didDrag,
      facilityMap, facilityDestMap, facilityCodeMap, wallSet, cfg.rows, cfg.cols,
      mapMode, activeTerminal, categories,
      setAdminSelectedFacility, setSelectedFacility,
      setIsRouteOpen, clearRoute,
    ],
  );

  // ── Derived ──────────────────────────────────────────────────────────────────
  const svgW  = cfg.cols * CELL;
  const svgH  = cfg.rows * CELL;
  const calib = BG_CALIBRATION[cfg.calibKey];

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
        // [PERFORMA] isDragging.current tidak menyebabkan re-render — cursor
        // diperbarui via CSS variable jika diperlukan, atau cukup gunakan nilai
        // statis "grab" karena "grabbing" hanya perlu saat drag aktif.
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      // [AKSESIBILITAS] aria-busy memberi tahu assistive technology bahwa konten
      // sedang dimuat. aria-describedby menghubungkan container ke pesan loading
      // yang visible agar screen reader bisa membacanya.
      aria-busy={isLoading}
      aria-describedby={isLoading || isError ? loadingId : undefined}
      {...handlers}
    >
      {/* ── Inner transform layer ─────────────────────────────────────────────
          [PERFORMA] Layer ini tidak punya state React — transformnya dimanipulasi
          langsung via ref DOM + rAF di dalam usePanZoom, sehingga setiap frame
          drag tidak memicu re-render React sama sekali.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{
          // Nilai awal — selanjutnya di-update langsung via DOM
          transform: "translate(0px, 0px) scale(1)",
          transformOrigin: "center center",
          // [PERFORMA] willChange memberi tahu browser untuk mempromosikan layer
          // ini ke GPU compositor layer, sehingga transform menjadi sangat
          // murah secara komputasi.
          willChange: "transform",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          // [AKSESIBILITAS] role="img" + aria-label untuk screen reader
          role="img"
          aria-label={`Peta Terminal ${activeTerminal} Bandara Juanda`}
        >
          {/* ── LAYER 1: Background SVG ─────────────────────────────────────── */}
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

          {/* ── LAYER 1b: Grid/Wall debug layer ─────────────────────────────── */}
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

          {/* ── LAYER 2: Room / tenant boxes ────────────────────────────────── */}
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
              // [AKSESIBILITAS] role="button" + tabIndex + onKeyDown memungkinkan
              // navigasi keyboard. Pengguna yang tidak bisa memakai mouse (motor
              // disability) atau pakai screen reader tetap bisa memilih ruangan.
              <g
                key={`room-${dest.id}-${i}`}
                role="button"
                tabIndex={0}
                aria-label={dest.label}
                aria-pressed={isSelected}
                style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); handleDestinationClick(dest); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleDestinationClick(dest);
                  }
                }}
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
                    // [AKSESIBILITAS] aria-hidden karena label sudah ada di <g>
                    aria-hidden="true"
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

          {/* ── LAYER 3: Dot markers ─────────────────────────────────────────── */}
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
                label={dest.label}
                isSelected={isSelected}
                onClick={() => handleDestinationClick(dest)}
              />
            );
          })}

          {/* ── LAYER 4: Floor labels ────────────────────────────────────────── */}
          <FloorLabel x={12} y={cfg.labelL2Y} label="LANTAI 2" />
          <FloorLabel x={12} y={cfg.labelL1Y} label="LANTAI 1" />

          {/* ── LAYER 5: Kiosk marker ────────────────────────────────────────── */}
          <KioskMarker
            cx={cfg.startC * CELL + CELL / 2}
            cy={cfg.startR * CELL + CELL / 2}
            color={C_KIOSK}
          />

          {/* ── LAYER 6: Route path + children ──────────────────────────────── */}
          <PathRenderer />
          {children}
        </svg>
      </div>

      {/* ── Loading overlay ────────────────────────────────────────────────────
          [AKSESIBILITAS] role="status" + aria-live="polite" memberi tahu screen
          reader bahwa ada update konten tanpa mengganggu alur baca.
          aria-atomic="true" memastikan seluruh pesan dibaca sekaligus, bukan
          kata per kata.

          [PERFORMA] Overlay hanya muncul setelah LOADING_DELAY_MS (300 ms),
          bukan langsung saat fetch dimulai — menghindari flash saat operasi
          cepat.

          [AKSESIBILITAS + PERFORMA] prefers-reduced-motion: animate-pulse
          dinonaktifkan untuk pengguna yang sensitif terhadap animasi (vestibular
          disorder, epilepsi). Ini mengikuti WCAG 2.1 SC 2.3.3.
      ────────────────────────────────────────────────────────────────────────── */}
      {(isLoading || isError) && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
          style={{
            backgroundColor: isError ? "rgba(254,226,226,0.85)" : "rgba(232,244,248,0.60)",
          }}
        >
          <div
            id={loadingId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={[
              "flex flex-col items-center gap-2",
              "text-[clamp(13px,1.2vw,15px)] font-medium",
              isError ? "text-red-700" : "text-[#1a4a5c]/70",
            ].join(" ")}
          >
            {isError ? (
              <>
                {/* Ikon error — aria-hidden karena teks sudah cukup deskriptif */}
                <svg
                  aria-hidden="true"
                  width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  {/* Pesan error yang informatif — bukan hanya "Error" */}
                  {errorMessage ?? "Gagal memuat peta. Periksa koneksi internet."}
                </span>
              </>
            ) : (
              <>
                {/* Spinner SVG — lebih ringan dari animasi CSS yang kompleks.
                    [AKSESIBILITAS] motion-reduce: spin dihentikan via Tailwind
                    motion-safe:animate-spin agar tidak mengganggu pengguna
                    yang sensitif terhadap gerakan. */}
                <svg
                  aria-hidden="true"
                  className="motion-safe:animate-spin"
                  width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round"
                >
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span className="motion-safe:animate-pulse">
                  Memuat peta…
                </span>
              </>
            )}
          </div>
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
    // [AKSESIBILITAS] aria-hidden karena label lantai adalah informasi visual
    // dekoratif — screen reader tidak perlu membacanya berulang kali saat
    // navigasi antar elemen peta.
    <text
      x={x} y={y} fontSize={14} fontWeight="700" fill="#1a4a5c" opacity={0.35}
      fontFamily="system-ui, sans-serif" letterSpacing={1.5}
      pointerEvents="none" dominantBaseline="middle"
      aria-hidden="true"
    >
      {label}
    </text>
  );
}

interface DestMarkerProps {
  cx: number; cy: number; color: string;
  // [AKSESIBILITAS] Tambah prop `label` untuk aria-label
  label: string;
  isSelected: boolean; onClick: () => void;
}

function DestMarker({ cx, cy, color, label, isSelected, onClick }: DestMarkerProps) {
  const DOT_R  = isSelected ? 6 : 4;
  const GLOW_R = DOT_R + (isSelected ? 5 : 3);
  return (
    // [AKSESIBILITAS] role="button" + tabIndex + aria-label + onKeyDown —
    // sama seperti room box, dot marker juga harus bisa diakses via keyboard.
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ cursor: "pointer" }}
    >
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
    // [AKSESIBILITAS] role="img" + aria-label agar screen reader tahu ini adalah
    // penanda posisi pengguna, bukan elemen interaktif yang perlu diklik.
    <g role="img" aria-label="Posisi Anda saat ini">
      <circle cx={cx} cy={cy} r={14} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={8}  fill={color} />
      <circle cx={cx} cy={cy} r={3}  fill="#ffffff" />
      {/* aria-hidden karena label sudah ada di parent <g> */}
      <text
        x={cx + 13} y={cy + 4}
        fontSize={8} fontWeight="700"
        fill={color} fontFamily="system-ui, sans-serif" letterSpacing={0.3}
        aria-hidden="true"
      >
        Anda di sini
      </text>
    </g>
  );
}