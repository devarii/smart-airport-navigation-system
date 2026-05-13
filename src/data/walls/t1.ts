import type { DestinationPoint, WallDataJson } from "@/types";
import t1Json from "@/data/map/T1_gabungan.json";

export const COLS = 300;
export const ROWS = 100;
export const START_R = 77;
export const START_C = 10;

// Batas baris per lantai (untuk deteksi lintas lantai)
export const FLOOR1_ROW_MIN = 38;
export const FLOOR1_ROW_MAX = 90;
export const FLOOR2_ROW_MIN = 0;
export const FLOOR2_ROW_MAX = 32;

// Titik tangga penghubung lantai 1 ↔ lantai 2
export const STAIRCASE_L1: DestinationPoint = {
  id: "l1_ld1", label: "tangga1", r: 52, c: 114, color: "#B1B1B1",
};
export const STAIRCASE_L2: DestinationPoint = {
  id: "l2_ld3", label: "tangga3", r: 10, c: 129, color: "#B1B1B1",
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
  row(38, 6, 295);
  row(90, 6, 295);

  col(20, 39, 44);
  row(44, 21, 26);
  col(26, 45, 67);
  row(67, 6, 52);

  row(73, 27, 46);
  row(78, 27, 46);
  col(27, 74, 77);
  col(46, 74, 77);

  col(54, 63, 67);
  row(67, 55, 57);
  col(57, 63, 67);
  row(63, 55, 57);
  col(59, 55, 69);
  row(69, 55, 59);
  row(59, 54, 58);
  col(54, 55, 59);

  col(54, 69, 78);
  row(78, 53, 56);
  row(78, 59, 62);
  col(63, 67, 78);
  row(67, 64, 109);
  row(67, 111, 136);
  col(109, 63, 67);
  col(111, 63, 67);

  col(136, 68, 71);
  row(72, 136, 166);
  col(166, 58, 71);

  row(69, 100, 105);
  row(69, 107, 131);
  row(80, 100, 131);
  col(100, 70, 79);
  col(131, 70, 79);

  row(49, 26, 35);
  col(35, 48, 50);
  row(43, 26, 52);
  row(43, 59, 66);
  row(43, 73, 78);
  row(43, 89, 106);
  row(43, 124, 140);
  row(43, 154, 188);
  row(43, 192, 205);
  row(43, 207, 229);
  row(43, 238, 243);
  row(43, 245, 254);
  row(43, 257, 261);
  col(261, 44, 53);
  row(43, 263, 280);

  row(51, 47, 62);
  col(63, 48, 51);
  row(48, 47, 62);
  col(47, 48, 51);

  row(71, 68, 94);
  row(77, 68, 94);
  col(68, 72, 76);
  col(94, 72, 76);

  row(49, 64, 66);
  row(48, 89, 95);
  row(51, 89, 95);
  col(89, 49, 50);
  col(95, 49, 50);
  col(99, 48, 51);
  col(105, 52, 59);
  col(125, 52, 59);
  col(129, 48, 51);
  row(60, 94, 135);
  col(94, 52, 59);
  col(136, 48, 60);

  col(94, 63, 66);
  col(138, 63, 66);
  row(63, 95, 109);
  row(63, 111, 137);
  row(67, 137, 138);

  col(63, 57, 66);
  row(48, 137, 143);
  row(48, 156, 185);
  row(48, 195, 229);
  row(48, 241, 260);
  row(48, 266, 295);
  row(53, 106, 112);
  row(53, 118, 124);

  col(142, 49, 52);
  row(52, 137, 142);

  col(170, 58, 66);
  row(67, 170, 172);
  col(172, 68, 77);
  col(154, 73, 77);
  row(78, 154, 176);
  col(177, 58, 78);
  row(64, 171, 176);
  row(67, 138, 165);
  row(67, 178, 246);
  row(67, 249, 272);
  row(67, 284, 295);

  col(246, 55, 62);
  col(246, 64, 71);
  col(244, 71, 74);
  row(71, 244, 246);
  col(248, 67, 74);
  row(54, 246, 261);
  col(254, 49, 66);
  col(198, 48, 51);
  col(198, 61, 66);

  col(269, 58, 67);
  col(273, 58, 79);
  row(58, 270, 272);

  row(54, 266, 282);
  col(283, 54, 79);

  col(193, 71, 75);
  col(187, 71, 75);
  row(71, 187, 193);
  row(75, 187, 193);

  col(199, 72, 76);
  col(214, 72, 76);
  row(72, 199, 214);
  row(76, 199, 214);

  col(232, 72, 76);
  col(238, 72, 76);
  row(72, 232, 238);
  row(76, 232, 238);

  col(254, 72, 76);
  col(260, 72, 76);
  row(72, 254, 260);
  row(76, 254, 260);

  col(266, 48, 53);
  col(5, 38, 90);
  col(295, 38, 90);

  // ── LANTAI 2 ──
  row(0, 1, 300);
  row(32, 1, 300);

  row(20, 1, 47);
  col(47, 10, 20);
  row(10, 44, 47);
  col(44, 1, 10);

  col(6, 24, 29);
  col(13, 24, 29);
  row(24, 6, 13);
  row(29, 6, 13);

  col(15, 24, 29);
  col(22, 24, 29);
  row(24, 15, 22);
  row(29, 15, 22);

  col(29, 24, 29);
  col(36, 24, 29);
  row(24, 29, 36);
  row(29, 29, 36);

  col(38, 24, 29);
  col(45, 24, 29);
  row(24, 38, 45);
  row(29, 38, 45);

  col(52, 24, 29);
  col(59, 24, 29);
  row(24, 52, 59);
  row(29, 52, 59);

  col(61, 24, 29);
  col(68, 24, 29);
  row(24, 61, 68);
  row(29, 61, 68);

  col(77, 24, 29);
  col(84, 24, 29);
  row(24, 77, 84);
  row(29, 77, 84);

  col(86, 24, 29);
  col(93, 24, 29);
  row(24, 86, 93);
  row(29, 86, 93);

  col(98, 24, 29);
  col(104, 24, 29);
  row(24, 98, 104);
  row(29, 98, 104);

  col(107, 24, 29);
  col(116, 24, 29);
  row(24, 107, 116);
  row(29, 107, 116);

  col(123, 24, 29);
  col(141, 24, 29);
  row(24, 123, 141);
  row(29, 123, 141);

  col(153, 24, 29);
  col(160, 24, 29);
  row(24, 153, 160);
  row(29, 153, 160);

  col(162, 24, 29);
  col(169, 24, 29);
  row(24, 162, 169);
  row(29, 162, 169);

  col(176, 24, 29);
  col(183, 24, 29);
  row(24, 176, 183);
  row(29, 176, 183);

  col(185, 24, 29);
  col(192, 24, 29);
  row(24, 185, 192);
  row(29, 185, 192);

  col(197, 24, 29);
  col(219, 27, 29);
  row(29, 197, 219);

  col(224, 24, 29);
  col(231, 24, 29);
  row(24, 224, 231);
  row(29, 224, 231);

  col(233, 24, 29);
  col(240, 24, 29);
  row(24, 233, 240);
  row(29, 233, 240);

  col(247, 24, 29);
  col(262, 24, 29);
  row(24, 247, 262);
  row(29, 247, 262);

  col(269, 24, 29);
  col(276, 24, 26);
  row(24, 269, 276);
  row(29, 269, 273);
  col(273, 27, 29);
  row(27, 273, 276);

  col(280, 24, 27);
  col(290, 24, 29);
  row(24, 280, 290);
  row(29, 283, 290);
  col(282, 27, 29);
  row(27, 280, 282);

  col(49, 17, 20);
  col(77, 16, 20);
  row(20, 49, 77);
  row(17, 49, 70);
  col(70, 17, 18);
  row(18, 70, 74);
  col(74, 16, 18);
  row(16, 74, 77);

  col(79, 13, 20);
  col(107, 17, 20);
  row(20, 79, 107);
  row(17, 82, 107);
  col(82, 13, 16);
  row(13, 79, 82);

  col(120, 11, 20);
  col(138, 11, 20);
  row(11, 120, 138);
  row(20, 120, 138);

  col(147, 11, 20);
  col(150, 11, 20);
  row(11, 147, 150);
  row(20, 147, 150);

  col(152, 11, 20);
  col(170, 17, 20);
  row(20, 153, 170);
  row(17, 155, 170);
  col(155, 11, 17);

  col(170, 11, 20);
  col(180, 13, 20);
  row(13, 170, 180);
  row(20, 170, 180);

  row(11, 152, 170);

  col(183, 17, 20);
  col(201, 17, 20);
  row(17, 183, 201);
  row(20, 183, 201);

  row(20, 204, 208);
  col(208, 20, 23);
  row(20, 217, 271);

  col(228, 17, 20);
  row(17, 228, 243);
  col(243, 11, 17);
  row(11, 243, 252);
  col(252, 11, 16);
  row(16, 252, 267);
  col(267, 9, 16);
  row(9, 267, 271);

  row(20, 279, 300);
  col(271, 9, 20);

  col(279, 7, 20);

  col(217, 20, 23);
  col(204, 7, 20);

  row(10, 47, 75);
  row(10, 77, 107);
  row(10, 109, 112);

  col(72, 10, 16);
  col(77, 10, 13);
  col(79, 10, 13);
  row(16, 70, 71);
  col(112, 7, 10);
  row(7, 44, 112);
  col(99, 7, 10);

  col(49, 10, 20);
  col(109, 10, 20);
  col(107, 10, 20);

  col(147, 7, 10);
  row(7, 147, 300);
  col(167, 7, 10);
  col(201, 7, 16);
  col(183, 10, 16);
  row(10, 183, 201);

  col(228, 7, 16);
  col(210, 12, 16);
  row(12, 210, 218);
  row(16, 208, 210);
  col(250, 7, 10);

  row(24, 1, 5);

  col(20, 30, 31);
  col(44, 30, 31);
  col(68, 30, 31);
  col(92, 30, 31);
  col(116, 30, 31);
  col(140, 30, 31);
  col(164, 30, 31);
  col(188, 30, 31);
  col(212, 30, 31);
  col(236, 30, 31);
  col(260, 30, 31);
  col(284, 30, 31);

  return Array.from(wallSet);
}

export const T1_WALL_DATA: WallDataJson = {
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

type T1MapJson = {
  destinations: DestinationWithRoom[];
};

const t1MapData = t1Json as T1MapJson;

export const DESTINATIONS: DestinationWithRoom[] = t1MapData.destinations;