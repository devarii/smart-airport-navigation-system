// ============================================================================
// PATCH 3 — GridWallLayer
// File target: src/components/map/gridWallLayer.tsx  (file baru)
//
// Komponen ini dirender HANYA saat mapMode === "grid".
// Berada di dalam SVG yang sama dengan layer lain — koordinat otomatis align.
// Pathfinding tetap aktif di kedua mode.
// ============================================================================

"use client";

import { useMemo } from "react";
import { buildWallSet } from "@/lib/astar";
import type { WallDataJson } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────

const CELL = 6; // harus sama dengan CELL di mapCanvas.tsx

interface GridWallLayerProps {
  wallData: WallDataJson;
  rows: number;
  cols: number;
  /** Row minimum lantai 1 (untuk coloring zone) */
  f1Min: number;
  /** Row minimum lantai 2 */
  f2Min: number;
  /** Row maksimum lantai 2 */
  f2Max: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GridWallLayer({
  wallData,
  rows,
  cols,
  f1Min,
  f2Min,
  f2Max,
}: GridWallLayerProps) {
  const wallSet = useMemo(() => buildWallSet(wallData.walls), [wallData]);

  // Render semua cell — wall = gelap, walkable = terang
  // Kita TIDAK render satu rect per cell (terlalu berat untuk grid 300x100).
  // Sebagai gantinya, render hanya wall cells sebagai rect kecil.
  // Walkable area ditampilkan via background fill zone.

  const wallRects = useMemo(() => {
    const rects: { key: string; x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (wallSet.has(`${r},${c}`)) {
          rects.push({ key: `${r},${c}`, x: c * CELL, y: r * CELL });
        }
      }
    }
    return rects;
  }, [wallSet, rows, cols]);

  const svgW = cols * CELL;
  const svgH = rows * CELL;

  // Zone boundaries untuk coloring
  const f2ZoneY    = f2Min * CELL;
  const f2ZoneH    = (f2Max - f2Min + 1) * CELL;
  const f1ZoneY    = f1Min * CELL;
  const f1ZoneH    = (rows - f1Min) * CELL;
  const gapZoneY   = (f2Max + 1) * CELL;
  const gapZoneH   = Math.max(0, (f1Min - f2Max - 1) * CELL);

  return (
    <g id="grid-wall-layer" pointerEvents="none">
      {/* ── Walkable zone fills ── */}

      {/* Lantai 2 zone */}
      <rect
        x={0} y={f2ZoneY}
        width={svgW} height={f2ZoneH}
        fill="#dbeafe" fillOpacity={0.45}
      />
      {/* Gap / connector zone */}
      {gapZoneH > 0 && (
        <rect
          x={0} y={gapZoneY}
          width={svgW} height={gapZoneH}
          fill="#f3f4f6" fillOpacity={0.3}
        />
      )}
      {/* Lantai 1 zone */}
      <rect
        x={0} y={f1ZoneY}
        width={svgW} height={f1ZoneH}
        fill="#dcfce7" fillOpacity={0.45}
      />

      {/* ── Grid lines (setiap 10 cells untuk readability) ── */}
      {Array.from({ length: Math.floor(cols / 10) + 1 }, (_, i) => i * 10).map(c => (
        <line
          key={`vg-${c}`}
          x1={c * CELL} y1={0}
          x2={c * CELL} y2={svgH}
          stroke="#94a3b8" strokeWidth={0.3} strokeOpacity={0.4}
        />
      ))}
      {Array.from({ length: Math.floor(rows / 10) + 1 }, (_, i) => i * 10).map(r => (
        <line
          key={`hg-${r}`}
          x1={0} y1={r * CELL}
          x2={svgW} y2={r * CELL}
          stroke="#94a3b8" strokeWidth={0.3} strokeOpacity={0.4}
        />
      ))}

      {/* ── Wall cells ── */}
      {wallRects.map(({ key, x, y }) => (
        <rect
          key={key}
          x={x} y={y}
          width={CELL} height={CELL}
          fill="#1e293b"
          fillOpacity={0.75}
        />
      ))}

      {/* ── Row labels (setiap 10 rows) ── */}
      {Array.from({ length: Math.floor(rows / 10) + 1 }, (_, i) => i * 10).map(r => (
        <text
          key={`rl-${r}`}
          x={3} y={r * CELL + 5}
          fontSize={4} fill="#475569" fillOpacity={0.7}
          fontFamily="monospace"
          pointerEvents="none"
        >
          {r}
        </text>
      ))}

      {/* ── Col labels (setiap 20 cols) ── */}
      {Array.from({ length: Math.floor(cols / 20) + 1 }, (_, i) => i * 20).map(c => (
        <text
          key={`cl-${c}`}
          x={c * CELL + 1} y={8}
          fontSize={4} fill="#475569" fillOpacity={0.7}
          fontFamily="monospace"
          pointerEvents="none"
        >
          {c}
        </text>
      ))}

      {/* ── Zone labels ── */}
      <text
        x={svgW - 60} y={f2ZoneY + f2ZoneH / 2}
        fontSize={8} fontWeight="700"
        fill="#1d4ed8" fillOpacity={0.5}
        fontFamily="system-ui"
        pointerEvents="none"
        dominantBaseline="middle"
      >
        LANTAI 2
      </text>
      <text
        x={svgW - 60} y={f1ZoneY + f1ZoneH / 2}
        fontSize={8} fontWeight="700"
        fill="#15803d" fillOpacity={0.5}
        fontFamily="system-ui"
        pointerEvents="none"
        dominantBaseline="middle"
      >
        LANTAI 1
      </text>
    </g>
  );
}


// ============================================================================
// INTEGRASI KE mapCanvas.tsx
// ============================================================================
//
// 1. Import di atas mapCanvas.tsx:
//    import GridWallLayer from "@/components/map/gridWallLayer";
//
// 2. Di dalam <svg>, setelah LAYER 1 (background image), tambahkan:
//
//    {/* ── LAYER 0: Grid / Wall debug layer ── */}
//    {mapMode === "grid" && (
//      <GridWallLayer
//        wallData={cfg.wallData}
//        rows={cfg.rows}
//        cols={cfg.cols}
//        f1Min={cfg.f1Min}
//        f2Min={cfg.f2Min}
//        f2Max={cfg.f2Max}
//      />
//    )}
//
// 3. Sembunyikan background image saat grid mode:
//    Ubah LAYER 1 dari:
//      <image href={cfg.bgSvg} ... />
//    Menjadi:
//      {mapMode !== "grid" && (
//        <image href={cfg.bgSvg} ... />
//      )}
//
// 4. RoomLayer, PathRenderer, dan children tetap dirender di kedua mode.
//    Pathfinding aktif di kedua mode — tidak ada perubahan.
//
// ============================================================================


// ============================================================================
// TOGGLE UI (opsional — tambahkan di luar MapCanvas, di layout/page parent)
// ============================================================================
//
// Contoh minimal toggle button yang bisa ditambahkan di page yang me-render MapCanvas:
//
//   import { useMapStore } from "@/store/mapStore";
//
//   function MapModeToggle() {
//     const mapMode    = useMapStore(s => s.mapMode);
//     const setMapMode = useMapStore(s => s.setMapMode);
//
//     // Hanya tampil jika bukan admin mode
//     if (mapMode === "admin") return null;
//
//     return (
//       <button
//         onClick={() => setMapMode(mapMode === "svg" ? "grid" : "svg")}
//         className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300
//                    bg-white/80 backdrop-blur text-slate-600 hover:bg-slate-50 transition"
//       >
//         {mapMode === "svg" ? "🔲 Grid Mode" : "🗺️ SVG Mode"}
//       </button>
//     );
//   }
//
// ============================================================================