import type { DestinationPoint, WallDataJson } from "@/types";
import t2Json from "@/data/map/T2_gabungan.json";



export const COLS = 321;
export const ROWS = 118;
export const START_R = 100;
export const START_C = 50;

export const FLOOR1_ROW_MIN = 55;
export const FLOOR1_ROW_MAX = 117;
export const FLOOR2_ROW_MIN = 0;
export const FLOOR2_ROW_MAX = 54;

export const STAIRCASE_L1: DestinationPoint = {
  id: "l1_ld1", label: "tangga1", r: 97, c: 16, color: "#B1B1B1",
};
export const STAIRCASE_L2: DestinationPoint = {
  id: "l2_ld1", label: "tangga1", r: 33, c: 16, color: "#B1B1B1",
};

function buildWalls(): string[] {
  const wallSet = new Set<string>();

  const W = (r: number, c: number): void => { wallSet.add(`${r},${c}`); };
  const row = (r: number, c1: number, c2: number): void => { for (let c = c1; c <= c2; c++) W(r, c); };
  const col = (c: number, r1: number, r2: number): void => { for (let r = r1; r <= r2; r++) W(r, c); };
  const box = (r1: number, c1: number, r2: number, c2: number): void => {
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) W(r, c);
  };
  void box;

  // ── Batas grid ──
  row(0, 0, COLS - 1);
  row(ROWS - 1, 0, COLS - 1);
  col(0, 0, ROWS - 1);
  col(COLS - 1, 0, ROWS - 1);

  // ── LANTAI 1 ──
  row(55, 1, 321);
  row(118, 1, 321);

  row(80, 1, 13);
  row(80, 15, 26);
  row(80, 28, 39);
  row(80, 41, 53);

  col(54, 63, 80);

  row(63, 55, 109);
  row(68, 59, 109);

  col(65, 69, 72);
  col(65, 76, 80);

  row(80, 55, 84);
  row(80, 91, 109);

  col(110, 68, 87);
  col(113, 67, 74);

  row(67, 114, 119);
  row(66, 119, 123);
  row(66, 126, 127);

  col(127, 66, 80);
  row(80, 128, 154);
  row(80, 159, 180);

  col(180, 68, 79);
  row(67, 169, 180);
  col(169, 63, 67);
  row(63, 150, 168);

  row(81, 156, 157);
  row(82, 156, 157);

  row(70, 117, 126);
  col(117, 70, 81);
  col(116, 81, 85);

  row(63, 113, 140);
  col(56, 81, 87);
  row(88, 56, 84);
  col(84, 81, 82);
  col(84, 85, 88);

  col(91, 81, 82);
  col(91, 85, 88);
  row(88, 92, 110);

  row(81, 117, 121);
  col(121, 81, 95);

  col(167, 74, 79);
  row(96, 119, 132);
  row(100, 121, 127);
  row(106, 121, 127);
  col(121, 101, 105);
  col(127, 101, 105);
  row(104, 106, 120);

  row(104, 56, 84);
  row(108, 18, 49);
  col(17, 104, 112);
  row(113, 1, 50);
  row(113, 55, 75);
  row(113, 80, 100);
  row(113, 105, 125);
  row(113, 130, 190);

  col(190, 110, 112);
  row(109, 188, 320);
  row(108, 1, 13);
  row(101, 1, 13);
  col(14, 98, 103);
  col(14, 106, 108);

  row(103, 132, 137);
  col(137, 104, 105);
  row(105, 137, 140);
  row(105, 142, 158);
  col(132, 104, 109);
  row(109, 133, 144);
  col(158, 104, 110);
  row(111, 155, 169);
  col(169, 98, 112);
  row(104, 160, 180);
  row(97, 160, 169);
  col(181, 104, 109);

  col(188, 103, 109);
  col(190, 73, 96);
  row(96, 190, 320);
  col(185, 73, 78);
  col(169, 83, 84);
  col(169, 86, 88);
  col(169, 90, 96);

  row(108, 139, 141);
  col(173, 105, 112);

  // ── LANTAI 2 ──
  row(7, 50, 175);
  col(49, 7, 16);
  row(16, 1, 55);
  row(44, 1, 10);
  col(15, 33, 39);
  col(15, 42, 48);

  row(36, 1, 15);
  row(32, 15, 20);
  row(34, 20, 75);
  row(33, 20, 20);

  col(31, 35, 37);
  col(31, 46, 48);
  col(61, 35, 37);
  col(61, 46, 48);

  col(49, 17, 33);
  col(103, 28, 32);
  col(103, 35, 48);
  row(28, 58, 102);

  row(49, 1, 320);
  row(34, 175, 320);
  col(175, 8, 33);
  row(14, 111, 118);

  col(55, 13, 16);
  col(118, 8, 9);
  col(118, 11, 34);
  row(34, 118, 160);
  col(160, 14, 34);
  col(106, 26, 35);
  row(35, 104, 105);

  col(57, 4, 6);
  col(59, 4, 6);
  col(73, 4, 6);
  col(75, 4, 6);
  col(80, 4, 6);
  col(82, 4, 6);

  row(4, 53, 56);
  row(4, 60, 72);
  row(4, 76, 79);
  row(4, 83, 172);
  row(1, 53, 172);
  col(172, 2, 3);
  col(53, 2, 3);

  return Array.from(wallSet);
}

export const T2_WALL_DATA: WallDataJson = {
  rows: ROWS,
  cols: COLS,
  startRow: START_R,
  startCol: START_C,
  walls: buildWalls(),
};

type RoomBox = {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
};

type DestinationWithRoom = DestinationPoint & {
  room?: RoomBox;
};

type T2MapJson = {
  destinations: DestinationWithRoom[];
};

const t2MapData = t2Json as T2MapJson;

export const DESTINATIONS: DestinationWithRoom[] = t2MapData.destinations;