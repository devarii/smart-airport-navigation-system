// ============================================================================
// PATCH 2 + 3 — roomAnchor.ts  (rev 3: fix desimal koordinat)
// File target: src/utils/roomAnchor.ts
//
// Bug rev2: koordinat room bisa desimal (r1:23.5, r2:29.5, c1:123.5).
// Math.round pada desimal tidak konsisten (22.5→23 bisa kena wall).
// wallSet.has("26.5,131") selalu false → wall check bypass.
//
// Fix:
//   - Semua koordinat di-floor/ceil sebelum kalkulasi:
//       r1 → Math.ceil(r1)   (batas atas room, ambil integer lebih dalam)
//       r2 → Math.floor(r2)  (batas bawah room, ambil integer lebih dalam)
//       c1 → Math.ceil(c1)
//       c2 → Math.floor(c2)
//   - dest.r / dest.c di-round sebelum wallSet lookup
//   - Arah anchor per lantai tetap: l2_ → r1-1, l1_ → r2+1
// ============================================================================

type RoomBox = { r1: number; c1: number; r2: number; c2: number };

interface DestinationLike {
  id: string;
  r: number;
  c: number;
  room?: RoomBox;
}

/**
 * Hitung navigation anchor dari room box.
 *
 * Koordinat desimal di-snap ke integer terlebih dahulu:
 *   r1/c1 → ceil  (interior room mulai di sini)
 *   r2/c2 → floor (interior room berakhir di sini)
 *
 * Arah anchor:
 *   Lantai 2 (l2_): koridor di ATAS room → anchorR = ceil(r1) - 1
 *   Lantai 1 (l1_): koridor di BAWAH room → anchorR = floor(r2) + 1
 */
export function getRoomAnchor(
  dest: DestinationLike,
  rows: number,
  cols: number
): { r: number; c: number } {
  if (!dest.room) {
    return { r: Math.round(dest.r), c: Math.round(dest.c) };
  }

  const { r1, c1, r2, c2 } = dest.room;

  // Snap desimal ke integer
  const iR1 = Math.ceil(r1);
  const iR2 = Math.floor(r2);
  const iC1 = Math.ceil(c1);
  const iC2 = Math.floor(c2);

  // Guard batas grid
  const safeC1 = Math.max(0, iC1);
  const safeC2 = Math.min(cols - 1, iC2);

  // Anchor kolom: tengah horizontal room
  const anchorC = Math.round((safeC1 + safeC2) / 2);

  // Anchor baris: arah sesuai lantai
  const isFloor2 = dest.id.startsWith("l2_");
  const anchorR = isFloor2
    ? Math.max(0, iR1 - 1)            // lantai 2: koridor di ATAS room
    : Math.min(rows - 1, iR2 + 1);    // lantai 1: koridor di BAWAH room

  return { r: anchorR, c: anchorC };
}

/**
 * Scan radial dari titik awal, bias arah sesuai lantai.
 * Lantai 2: bias ke atas (r-d). Lantai 1: bias ke bawah (r+d).
 */
function scanRadialWalkable(
  startR: number,
  startC: number,
  rows: number,
  cols: number,
  wallSet: Set<string>,
  isFloor2: boolean,
  maxDist = 8
): { r: number; c: number } | null {
  const inBounds = (r: number, c: number): boolean =>
    r >= 0 && r < rows && c >= 0 && c < cols;
  const walkable = (r: number, c: number): boolean =>
    inBounds(r, c) && !wallSet.has(`${r},${c}`);

  for (let d = 1; d <= maxDist; d++) {
    // Arah primer
    const rPrimary = isFloor2 ? startR - d : startR + d;
    for (let dc = 0; dc <= d; dc++) {
      if (dc === 0) {
        if (walkable(rPrimary, startC)) return { r: rPrimary, c: startC };
      } else {
        if (walkable(rPrimary, startC + dc)) return { r: rPrimary, c: startC + dc };
        if (walkable(rPrimary, startC - dc)) return { r: rPrimary, c: startC - dc };
      }
    }
    // Samping
    if (walkable(startR, startC + d)) return { r: startR, c: startC + d };
    if (walkable(startR, startC - d)) return { r: startR, c: startC - d };
    // Arah sekunder
    const rSecondary = isFloor2 ? startR + d : startR - d;
    for (let dc = 0; dc <= d; dc++) {
      if (dc === 0) {
        if (walkable(rSecondary, startC)) return { r: rSecondary, c: startC };
      } else {
        if (walkable(rSecondary, startC + dc)) return { r: rSecondary, c: startC + dc };
        if (walkable(rSecondary, startC - dc)) return { r: rSecondary, c: startC - dc };
      }
    }
  }
  return null;
}

/**
 * Entry point utama dari handleDestinationClick.
 *
 * Urutan resolusi:
 *   1. anchor (integer, arah per lantai) walkable → return
 *   2. scanRadialWalkable dari anchor, bias sesuai lantai → return jika ketemu
 *   3. dest.r/c di-round → walkable → return
 *   4. return anchor → nearestWalkable di mapCanvas handle sisanya (Opsi A)
 */
export function resolveNavigationAnchor(
  dest: DestinationLike,
  rows: number,
  cols: number,
  wallSet: Set<string>
): { r: number; c: number } {
  const anchor = getRoomAnchor(dest, rows, cols);
  const isFloor2 = dest.id.startsWith("l2_");

  // 1. Anchor walkable langsung
  if (!wallSet.has(`${anchor.r},${anchor.c}`)) {
    return anchor;
  }

  // 2. Scan radial dengan bias arah sesuai lantai
  const radial = scanRadialWalkable(
    anchor.r, anchor.c, rows, cols, wallSet, isFloor2
  );
  if (radial) return radial;

  // 3. Fallback ke dest.r/c — WAJIB round dulu, desimal tidak cocok dengan wallSet
  const dr = Math.round(dest.r);
  const dc = Math.round(dest.c);
  if (!wallSet.has(`${dr},${dc}`)) {
    return { r: dr, c: dc };
  }

  // 4. Serahkan ke nearestWalkable di mapCanvas
  return anchor;
}