"use client";

import { useMemo } from "react";
import { buildWallSet } from "@/lib/astar";
import type { WallDataJson } from "@/types";

const CELL = 6;

interface GridWallLayerProps {
  wallData: WallDataJson;
  rows: number;
  cols: number;
  f1Min: number;
  f2Min: number;
  f2Max: number;
  offsetX?: number;
  offsetY?: number;
  offsetXF1?: number;
  offsetXF2?: number;
  offsetYF1?: number;
  offsetYF2?: number;
}

export default function GridWallLayer({
  wallData,
  rows,
  cols,
  f1Min,
  f2Min,
  f2Max,
  offsetX = 7,
  offsetY = 23,
  offsetXF1,
  offsetXF2,
  offsetYF1,
  offsetYF2,
}: GridWallLayerProps) {
  const wallSet = useMemo(() => buildWallSet(wallData.walls), [wallData]);

  const { wallF2, wallF1, wallGap } = useMemo(() => {
    const f2: { key: string; x: number; y: number }[] = [];
    const f1: { key: string; x: number; y: number }[] = [];
    const gap: { key: string; x: number; y: number }[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!wallSet.has(`${r},${c}`)) continue;
        const rect = { key: `${r},${c}`, x: c * CELL, y: r * CELL };
        if (r <= f2Max)      f2.push(rect);
        else if (r >= f1Min) f1.push(rect);
        else                 gap.push(rect);
      }
    }
    return { wallF2: f2, wallF1: f1, wallGap: gap };
  }, [wallSet, rows, cols, f2Max, f1Min]);

  const svgW = cols * CELL;
  const svgH = rows * CELL;

  const f2ZoneY  = f2Min * CELL;
  const f2ZoneH  = (f2Max - f2Min + 1) * CELL;
  const f1ZoneY  = f1Min * CELL;
  const f1ZoneH  = (rows - f1Min) * CELL;
  const gapZoneY = (f2Max + 1) * CELL;
  const gapZoneH = Math.max(0, (f1Min - f2Max - 1) * CELL);

  const vLines = Array.from({ length: Math.floor(cols / 10) + 1 }, (_, i) => i * 10);
  const hLines = Array.from({ length: Math.floor(rows / 10) + 1 }, (_, i) => i * 10);

  const offXF2 = offsetXF2 ?? offsetX;
  const offXF1 = offsetXF1 ?? offsetX;
  const offYF2 = offsetYF2 ?? offsetY;
  const offYF1 = offsetYF1 ?? offsetY;

  return (
    <g id="grid-wall-layer" pointerEvents="none">

      {/* Zone fills + grid lines + labels */}
      <g transform={`translate(${offsetX}, ${offsetY})`}>
        <rect x={0} y={f2ZoneY} width={svgW} height={f2ZoneH}
          fill="#dbeafe" fillOpacity={0.5} />
        {gapZoneH > 0 && (
          <rect x={0} y={gapZoneY} width={svgW} height={gapZoneH}
            fill="#f3f4f6" fillOpacity={0.3} />
        )}
        <rect x={0} y={f1ZoneY} width={svgW} height={f1ZoneH}
          fill="#dcfce7" fillOpacity={0.5} />

        {vLines.map(c => (
          <line key={`vg-${c}`}
            x1={c * CELL} y1={0} x2={c * CELL} y2={svgH}
            stroke="#94a3b8" strokeWidth={0.3} strokeOpacity={0.5} />
        ))}
        {hLines.map(r => (
          <line key={`hg-${r}`}
            x1={0} y1={r * CELL} x2={svgW} y2={r * CELL}
            stroke="#94a3b8" strokeWidth={0.3} strokeOpacity={0.5} />
        ))}

        {wallGap.map(({ key, x, y }) => (
          <rect key={key} x={x} y={y} width={CELL} height={CELL}
            fill="#1e293b" fillOpacity={0.8} />
        ))}

        {Array.from({ length: Math.floor(rows / 5) + 1 }, (_, i) => i * 5).map(r => (
          <text key={`rl-${r}`} x={2} y={r * CELL + 4}
            fontSize={3.5} fill="#334155" fillOpacity={0.8} fontFamily="monospace">
            {r}
          </text>
        ))}
        {vLines.map(c => (
          <text key={`cl-${c}`} x={c * CELL + 1} y={7}
            fontSize={3.5} fill="#334155" fillOpacity={0.8} fontFamily="monospace">
            {c}
          </text>
        ))}

        <text x={svgW - 50} y={f2ZoneY + f2ZoneH / 2}
          fontSize={7} fontWeight="700" fill="#1d4ed8" fillOpacity={0.6}
          fontFamily="system-ui" dominantBaseline="middle">
          LANTAI 2
        </text>
        <text x={svgW - 50} y={f1ZoneY + f1ZoneH / 2}
          fontSize={7} fontWeight="700" fill="#15803d" fillOpacity={0.6}
          fontFamily="system-ui" dominantBaseline="middle">
          LANTAI 1
        </text>
      </g>

      {/* Wall F2 — offset independen */}
      <g transform={`translate(${offXF2}, ${offYF2})`}>
        {wallF2.map(({ key, x, y }) => (
          <rect key={key} x={x} y={y} width={CELL} height={CELL}
            fill="#1e293b" fillOpacity={0.8} />
        ))}
      </g>

      {/* Wall F1 — offset independen */}
      <g transform={`translate(${offXF1}, ${offYF1})`}>
        {wallF1.map(({ key, x, y }) => (
          <rect key={key} x={x} y={y} width={CELL} height={CELL}
            fill="#1e293b" fillOpacity={0.8} />
        ))}
      </g>

    </g>
  );
}