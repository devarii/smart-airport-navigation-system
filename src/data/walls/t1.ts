import type { DestinationPoint, WallDataJson } from "@/types";

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

export const DESTINATIONS: DestinationPoint[] = [
  // ── LANTAI 1 ──
  { id: "l1_kan1",  label: "kantor1",  r: 72, c: 29,  color: "#3282D1" },
  { id: "l1_kan2",  label: "kantor2",  r: 72, c: 33,  color: "#3282D1" },
  { id: "l1_kan3",  label: "kantor3",  r: 72, c: 36,  color: "#3282D1" },
  { id: "l1_kan4",  label: "kantor4",  r: 72, c: 39,  color: "#3282D1" },
  { id: "l1_kan5",  label: "kantor5",  r: 66, c: 57,  color: "#3282D1" },
  { id: "l1_kan6",  label: "kantor6",  r: 52, c: 58,  color: "#3282D1" },
  { id: "l1_kan7",  label: "kantor7",  r: 52, c: 56,  color: "#3282D1" },
  { id: "l1_kan8",  label: "kantor8",  r: 52, c: 54,  color: "#3282D1" },
  { id: "l1_kan9",  label: "kantor9",  r: 52, c: 52,  color: "#3282D1" },
  { id: "l1_kan10", label: "kantor10", r: 52, c: 50,  color: "#3282D1" },
  { id: "l1_kan11", label: "kantor11", r: 52, c: 48,  color: "#3282D1" },
  { id: "l1_kan12", label: "kantor12", r: 47, c: 52,  color: "#3282D1" },
  { id: "l1_kan13", label: "kantor13", r: 70, c: 68,  color: "#3282D1" },
  { id: "l1_kan14", label: "kantor14", r: 70, c: 71,  color: "#3282D1" },
  { id: "l1_kan15", label: "kantor15", r: 70, c: 74,  color: "#3282D1" },
  { id: "l1_kan16", label: "kantor16", r: 70, c: 77,  color: "#3282D1" },
  { id: "l1_kan17", label: "kantor17", r: 70, c: 80,  color: "#3282D1" },
  { id: "l1_kan18", label: "kantor18", r: 70, c: 83,  color: "#3282D1" },
  { id: "l1_kan19", label: "kantor19", r: 70, c: 86,  color: "#3282D1" },
  { id: "l1_kan20", label: "kantor20", r: 70, c: 89,  color: "#3282D1" },
  { id: "l1_kan21", label: "kantor21", r: 74, c: 158, color: "#3282D1" },
  { id: "l1_kan22", label: "kantor22", r: 74, c: 160, color: "#3282D1" },
  { id: "l1_kan23", label: "kantor23", r: 70, c: 286, color: "#3282D1" },
  { id: "l1_kan24", label: "kantor24", r: 70, c: 289, color: "#3282D1" },
  { id: "l1_kan25", label: "kantor25", r: 72, c: 290, color: "#3282D1" },
  { id: "l1_kan26", label: "kantor26", r: 74, c: 290, color: "#3282D1" },
  { id: "l1_kan27", label: "kantor27", r: 76, c: 290, color: "#3282D1" },
  { id: "l1_kan28", label: "kantor28", r: 74, c: 107, color: "#3282D1" },
  { id: "l1_kan29", label: "kantor29", r: 68, c: 108, color: "#3282D1" },
  { id: "l1_kan30", label: "kantor30", r: 68, c: 110, color: "#3282D1" },
  { id: "l1_kan31", label: "kantor31", r: 73, c: 105, color: "#3282D1" },
  { id: "l1_kan32", label: "kantor32", r: 70, c: 105, color: "#3282D1" },
  { id: "l1_kan33", label: "kantor33", r: 76, c: 105, color: "#3282D1" },
  { id: "l1_kan34", label: "kantor34", r: 72, c: 99,  color: "#3282D1" },
  { id: "l1_kan35", label: "kantor35", r: 75, c: 99,  color: "#3282D1" },
  { id: "l1_kan36", label: "kantor36", r: 78, c: 99,  color: "#3282D1" },
  { id: "l1_kan37", label: "kantor37", r: 81, c: 113, color: "#3282D1" },
  { id: "l1_kan38", label: "kantor38", r: 72, c: 132, color: "#3282D1" },
  { id: "l1_kan39", label: "kantor39", r: 75, c: 132, color: "#3282D1" },
  { id: "l1_kan40", label: "kantor40", r: 78, c: 132, color: "#3282D1" },
  { id: "l1_kan41", label: "kantor41", r: 71, c: 236, color: "#3282D1" },
  { id: "l1_kan42", label: "kantor42", r: 71, c: 234, color: "#3282D1" },
  { id: "l1_kan43", label: "kantor43", r: 71, c: 211, color: "#3282D1" },
  { id: "l1_kan44", label: "kantor44", r: 71, c: 209, color: "#3282D1" },
  { id: "l1_kan45", label: "kantor45", r: 71, c: 202, color: "#3282D1" },
  { id: "l1_kan46", label: "kantor46", r: 71, c: 204, color: "#3282D1" },
  { id: "l1_ll1",  label: "lain1",    r: 47, c: 52,  color: "#6DE3F5" },
  { id: "l1_ll2",  label: "lain2",    r: 45, c: 43,  color: "#6DE3F5" },
  { id: "l1_ll3",  label: "lain3",    r: 45, c: 49,  color: "#6DE3F5" },
  { id: "l1_ll4",  label: "lain4",    r: 45, c: 185, color: "#6DE3F5" },
  { id: "l1_ll5",  label: "lain5",    r: 45, c: 223, color: "#6DE3F5" },
  { id: "l1_ll6",  label: "lain6",    r: 45, c: 254, color: "#6DE3F5" },
  { id: "l1_ll7",  label: "lain7",    r: 45, c: 257, color: "#6DE3F5" },
  { id: "l1_ll8",  label: "lain8",    r: 45, c: 277, color: "#6DE3F5" },
  { id: "l1_ll9",  label: "lain9",    r: 45, c: 279, color: "#6DE3F5" },
  { id: "l1_ll10", label: "lain10",   r: 52, c: 120, color: "#6DE3F5" },
  { id: "l1_ll11", label: "lain11",   r: 60, c: 171, color: "#6DE3F5" },
  { id: "l1_ll12", label: "lain12",   r: 62, c: 174, color: "#6DE3F5" },
  { id: "l1_ll13", label: "lain13",   r: 50, c: 222, color: "#6DE3F5" },
  { id: "l1_tl1",  label: "toilet1",  r: 72, c: 31,  color: "#4FC1D3" },
  { id: "l1_tl2",  label: "toilet2",  r: 68, c: 60,  color: "#4FC1D3" },
  { id: "l1_tl3",  label: "toilet3",  r: 55, c: 58,  color: "#4FC1D3" },
  { id: "l1_tl4",  label: "toilet4",  r: 47, c: 56,  color: "#4FC1D3" },
  { id: "l1_tl5",  label: "toilet5",  r: 47, c: 30,  color: "#4FC1D3" },
  { id: "l1_tl6",  label: "toilet6",  r: 45, c: 171, color: "#4FC1D3" },
  { id: "l1_tl7",  label: "toilet7",  r: 43, c: 245, color: "#4FC1D3" },
  { id: "l1_tl8",  label: "toilet8",  r: 45, c: 248, color: "#4FC1D3" },
  { id: "l1_tl9",  label: "toilet9",  r: 47, c: 173, color: "#4FC1D3" },
  { id: "l1_tl10", label: "toilet10", r: 47, c: 176, color: "#4FC1D3" },
  { id: "l1_tl11", label: "toilet11", r: 50, c: 175, color: "#4FC1D3" },
  { id: "l1_tl12", label: "toilet12", r: 47, c: 198, color: "#4FC1D3" },
  { id: "l1_tl13", label: "toilet13", r: 60, c: 168, color: "#4FC1D3" },
  { id: "l1_tl14", label: "toilet14", r: 64, c: 165, color: "#4FC1D3" },
  { id: "l1_tl15", label: "toilet15", r: 55, c: 257, color: "#4FC1D3" },
  { id: "l1_tl16", label: "toilet16", r: 56, c: 245, color: "#4FC1D3" },
  { id: "l1_tl17", label: "toilet17", r: 70, c: 282, color: "#4FC1D3" },
  { id: "l1_tl18", label: "toilet18", r: 68, c: 102, color: "#4FC1D3" },
  { id: "l1_tl19", label: "toilet19", r: 68, c: 130, color: "#4FC1D3" },
  { id: "l1_tl20", label: "toilet20", r: 70, c: 193, color: "#4FC1D3" },
  { id: "l1_mus1", label: "musholla1", r: 54, c: 113, color: "#EED832" },
  { id: "l1_mus2", label: "musholla2", r: 54, c: 117, color: "#EED832" },
  { id: "l1_mus3", label: "musholla3", r: 55, c: 272, color: "#EED832" },
  { id: "l1_mus4", label: "musholla4", r: 70, c: 191, color: "#EED832" },
  { id: "l1_lf1",  label: "lift1",     r: 55, c: 282, color: "#B1B1B1" },
  { id: "l1_ret1", label: "retail1",   r: 47, c: 48,  color: "#36A732" },
  { id: "l1_ret2", label: "retail2",   r: 45, c: 93,  color: "#36A732" },
  { id: "l1_ret3", label: "retail3",   r: 45, c: 140, color: "#36A732" },
  { id: "l1_ret4", label: "retail4",   r: 45, c: 193, color: "#36A732" },
  { id: "l1_ret5", label: "retail5",   r: 45, c: 203, color: "#36A732" },
  { id: "l1_ret6", label: "retail6",   r: 45, c: 229, color: "#36A732" },
  { id: "l1_fnb1",  label: "food1",  r: 45, c: 35,  color: "#A7329F" },
  { id: "l1_fnb2",  label: "food2",  r: 45, c: 39,  color: "#A7329F" },
  { id: "l1_fnb3",  label: "food3",  r: 45, c: 59,  color: "#A7329F" },
  { id: "l1_fnb4",  label: "food4",  r: 45, c: 78,  color: "#A7329F" },
  { id: "l1_fnb5",  label: "food5",  r: 45, c: 97,  color: "#A7329F" },
  { id: "l1_fnb6",  label: "food6",  r: 45, c: 101, color: "#A7329F" },
  { id: "l1_fnb7",  label: "food7",  r: 45, c: 106, color: "#A7329F" },
  { id: "l1_fnb8",  label: "food8",  r: 45, c: 124, color: "#A7329F" },
  { id: "l1_fnb9",  label: "food9",  r: 45, c: 131, color: "#A7329F" },
  { id: "l1_fnb10", label: "food10", r: 45, c: 154, color: "#A7329F" },
  { id: "l1_fnb11", label: "food11", r: 45, c: 161, color: "#A7329F" },
  { id: "l1_fnb12", label: "food12", r: 45, c: 164, color: "#A7329F" },
  { id: "l1_fnb13", label: "food13", r: 45, c: 167, color: "#A7329F" },
  { id: "l1_fnb14", label: "food14", r: 45, c: 176, color: "#A7329F" },
  { id: "l1_fnb15", label: "food15", r: 45, c: 198, color: "#A7329F" },
  { id: "l1_fnb16", label: "food16", r: 45, c: 212, color: "#A7329F" },
  { id: "l1_fnb17", label: "food17", r: 45, c: 218, color: "#A7329F" },
  { id: "l1_fnb18", label: "food18", r: 45, c: 241, color: "#A7329F" },
  { id: "l1_fnb19", label: "food19", r: 45, c: 263, color: "#A7329F" },
  { id: "l1_fnb20", label: "food20", r: 45, c: 267, color: "#A7329F" },
  { id: "l1_fnb21", label: "food21", r: 45, c: 271, color: "#A7329F" },
  { id: "l1_fnb22", label: "food22", r: 45, c: 275, color: "#A7329F" },
  { id: "l1_fnb23", label: "food23", r: 50, c: 64,  color: "#A7329F" },
  { id: "l1_fnb24", label: "food24", r: 49, c: 109, color: "#A7329F" },
  { id: "l1_fnb25", label: "food25", r: 49, c: 122, color: "#A7329F" },
  { id: "l1_fnb26", label: "food26", r: 52, c: 121, color: "#A7329F" },
  { id: "l1_fnb27", label: "food27", r: 50, c: 161, color: "#A7329F" },
  { id: "l1_fnb28", label: "food28", r: 50, c: 165, color: "#A7329F" },
  { id: "l1_nl1",  label: "nolabel1",  r: 76, c: 47,  color: "#B1B1B1" },
  { id: "l1_nl2",  label: "nolabel2",  r: 61, c: 58,  color: "#B1B1B1" },
  { id: "l1_nl3",  label: "nolabel3",  r: 60, c: 55,  color: "#B1B1B1" },
  { id: "l1_nl4",  label: "nolabel4",  r: 52, c: 60,  color: "#B1B1B1" },
  { id: "l1_nl5",  label: "nolabel5",  r: 52, c: 62,  color: "#B1B1B1" },
  { id: "l1_nl6",  label: "nolabel6",  r: 50, c: 30,  color: "#B1B1B1" },
  { id: "l1_nl7",  label: "nolabel7",  r: 45, c: 66,  color: "#B1B1B1" },
  { id: "l1_nl8",  label: "nolabel8",  r: 45, c: 89,  color: "#B1B1B1" },
  { id: "l1_nl9",  label: "nolabel9",  r: 45, c: 207, color: "#B1B1B1" },
  { id: "l1_nl10", label: "nolabel10", r: 46, c: 280, color: "#B1B1B1" },
  { id: "l1_nl11", label: "nolabel11", r: 74, c: 95,  color: "#B1B1B1" },
  { id: "l1_nl12", label: "nolabel12", r: 78, c: 75,  color: "#B1B1B1" },
  { id: "l1_nl13", label: "nolabel13", r: 52, c: 111, color: "#B1B1B1" },
  { id: "l1_nl14", label: "nolabel14", r: 63, c: 111, color: "#B1B1B1" },
  { id: "l1_nl15", label: "nolabel15", r: 66, c: 109, color: "#B1B1B1" },
  { id: "l1_nl16", label: "nolabel16", r: 63, c: 122, color: "#B1B1B1" },
  { id: "l1_nl17", label: "nolabel17", r: 63, c: 120, color: "#B1B1B1" },
  { id: "l1_nl18", label: "nolabel18", r: 68, c: 124, color: "#B1B1B1" },
  { id: "l1_nl19", label: "nolabel19", r: 63, c: 130, color: "#B1B1B1" },
  { id: "l1_nl20", label: "nolabel20", r: 63, c: 132, color: "#B1B1B1" },
  { id: "l1_nl21", label: "nolabel21", r: 63, c: 138, color: "#B1B1B1" },
  { id: "l1_nl22", label: "nolabel22", r: 60, c: 138, color: "#B1B1B1" },
  { id: "l1_nl23", label: "nolabel23", r: 50, c: 136, color: "#B1B1B1" },
  { id: "l1_nl24", label: "nolabel24", r: 50, c: 142, color: "#B1B1B1" },
  { id: "l1_nl25", label: "nolabel25", r: 52, c: 139, color: "#B1B1B1" },
  { id: "l1_nl27", label: "nolabel27", r: 63, c: 203, color: "#B1B1B1" },
  { id: "l1_nl28", label: "nolabel28", r: 63, c: 200, color: "#B1B1B1" },
  { id: "l1_nl29", label: "nolabel29", r: 64, c: 245, color: "#B1B1B1" },
  { id: "l1_nl30", label: "nolabel30", r: 63, c: 249, color: "#B1B1B1" },
  { id: "l1_nl31", label: "nolabel31", r: 72, c: 246, color: "#B1B1B1" },
  { id: "l1_nl32", label: "nolabel32", r: 74, c: 253, color: "#B1B1B1" },
  { id: "l1_nl33", label: "nolabel33", r: 72, c: 257, color: "#B1B1B1" },
  { id: "l1_nl34", label: "nolabel34", r: 75, c: 107, color: "#B1B1B1" },
  { id: "l1_nl35", label: "nolabel35", r: 70, c: 189, color: "#B1B1B1" },
  { id: "l1_ld1",  label: "tangga1",   r: 52, c: 114, color: "#B1B1B1" },
  { id: "l1_arr1", label: "arrival1",  r: 77, c: 13,  color: "#FD9AE1" },
  { id: "l1_pr1",  label: "promo1",    r: 45, c: 52,  color: "#A77432" },
  { id: "l1_pr2",  label: "promo2",    r: 45, c: 73,  color: "#A77432" },
  { id: "l1_pr3",  label: "promo3",    r: 47, c: 111, color: "#A77432" },
  { id: "l1_pr4",  label: "promo4",    r: 47, c: 120, color: "#A77432" },

  // ── LANTAI 2 ──
  { id: "l2_kan1",  label: "kantor1",  r: 8,  c: 101, color: "#3282D1" },
  { id: "l2_kan2",  label: "kantor2",  r: 8,  c: 104, color: "#3282D1" },
  { id: "l2_kan3",  label: "kantor3",  r: 8,  c: 111, color: "#3282D1" },
  { id: "l2_kan4",  label: "kantor4",  r: 9,  c: 101, color: "#3282D1" },
  { id: "l2_kan5",  label: "kantor5",  r: 9,  c: 104, color: "#3282D1" },
  { id: "l2_kan6",  label: "kantor6",  r: 9,  c: 107, color: "#3282D1" },
  { id: "l2_kan7",  label: "kantor7",  r: 9,  c: 109, color: "#3282D1" },
  { id: "l2_kan8",  label: "kantor8",  r: 8,  c: 176, color: "#3282D1" },
  { id: "l2_kan9",  label: "kantor9",  r: 8,  c: 179, color: "#3282D1" },
  { id: "l2_kan10", label: "kantor10", r: 8,  c: 182, color: "#3282D1" },
  { id: "l2_kan11", label: "kantor11", r: 8,  c: 192, color: "#3282D1" },
  { id: "l2_kan12", label: "kantor12", r: 9,  c: 189, color: "#3282D1" },
  { id: "l2_kan13", label: "kantor13", r: 9,  c: 187, color: "#3282D1" },
  { id: "l2_kan14", label: "kantor14", r: 9,  c: 176, color: "#3282D1" },
  { id: "l2_kan15", label: "kantor15", r: 9,  c: 170, color: "#3282D1" },
  { id: "l2_kan16", label: "kantor16", r: 8,  c: 203, color: "#3282D1" },
  { id: "l2_ll1",  label: "lain1",    r: 21, c: 183, color: "#6DE3F5" },
  { id: "l2_ll2",  label: "lain2",    r: 21, c: 207, color: "#6DE3F5" },
  { id: "l2_ll3",  label: "lain3",    r: 21, c: 218, color: "#6DE3F5" },
  { id: "l2_ll4",  label: "lain4",    r: 21, c: 259, color: "#6DE3F5" },
  { id: "l2_tl1",  label: "toilet1",  r: 23, c: 8,   color: "#4FC1D3" },
  { id: "l2_tl2",  label: "toilet2",  r: 21, c: 107, color: "#4FC1D3" },
  { id: "l2_tl3",  label: "toilet3",  r: 21, c: 201, color: "#4FC1D3" },
  { id: "l2_tl4",  label: "toilet4",  r: 21, c: 244, color: "#4FC1D3" },
  { id: "l2_tl5",  label: "toilet5",  r: 21, c: 288, color: "#4FC1D3" },
  { id: "l2_tl6",  label: "toilet6",  r: 6,  c: 76,  color: "#4FC1D3" },
  { id: "l2_tl7",  label: "toilet7",  r: 8,  c: 108, color: "#4FC1D3" },
  { id: "l2_tl8",  label: "toilet8",  r: 8,  c: 173, color: "#4FC1D3" },
  { id: "l2_tl9",  label: "toilet9",  r: 8,  c: 202, color: "#4FC1D3" },
  { id: "l2_mus1", label: "musholla1", r: 23, c: 6,   color: "#EED832" },
  { id: "l2_mus2", label: "musholla2", r: 21, c: 270, color: "#EED832" },
  { id: "l2_mus3", label: "musholla3", r: 6,  c: 87,  color: "#EED832" },
  { id: "l2_mus4", label: "musholla4", r: 8,  c: 170, color: "#EED832" },
  { id: "l2_gd1",  label: "gate1",    r: 31, c: 2,   color: "#FF0000" },
  { id: "l2_gd2",  label: "gate2",    r: 31, c: 26,  color: "#FF0000" },
  { id: "l2_gd3",  label: "gate3",    r: 31, c: 49,  color: "#FF0000" },
  { id: "l2_gd4",  label: "gate4",    r: 31, c: 73,  color: "#FF0000" },
  { id: "l2_gd5",  label: "gate5",    r: 31, c: 96,  color: "#FF0000" },
  { id: "l2_gd6",  label: "gate6",    r: 31, c: 120, color: "#FF0000" },
  { id: "l2_gd7",  label: "gate7",    r: 31, c: 146, color: "#FF0000" },
  { id: "l2_gd8",  label: "gate8",    r: 31, c: 170, color: "#FF0000" },
  { id: "l2_gd9",  label: "gate9",    r: 31, c: 195, color: "#FF0000" },
  { id: "l2_gd10", label: "gate10",   r: 31, c: 220, color: "#FF0000" },
  { id: "l2_gd11", label: "gate11",   r: 31, c: 244, color: "#FF0000" },
  { id: "l2_gd12", label: "gate12",   r: 31, c: 268, color: "#FF0000" },
  { id: "l2_gd13", label: "gate13",   r: 31, c: 296, color: "#FF0000" },
  { id: "l2_ret1",  label: "retail1",  r: 21, c: 56,  color: "#36A732" },
  { id: "l2_ret2",  label: "retail2",  r: 21, c: 89,  color: "#36A732" },
  { id: "l2_ret3",  label: "retail3",  r: 21, c: 98,  color: "#36A732" },
  { id: "l2_ret4",  label: "retail4",  r: 21, c: 102, color: "#36A732" },
  { id: "l2_ret5",  label: "retail5",  r: 21, c: 121, color: "#36A732" },
  { id: "l2_ret6",  label: "retail6",  r: 21, c: 148, color: "#36A732" },
  { id: "l2_ret7",  label: "retail7",  r: 21, c: 188, color: "#36A732" },
  { id: "l2_ret8",  label: "retail8",  r: 21, c: 192, color: "#36A732" },
  { id: "l2_ret9",  label: "retail9",  r: 21, c: 197, color: "#36A732" },
  { id: "l2_ret10", label: "retail10", r: 24, c: 209, color: "#36A732" },
  { id: "l2_ret11", label: "retail11", r: 24, c: 216, color: "#36A732" },
  { id: "l2_ret12", label: "retail12", r: 26, c: 212, color: "#36A732" },
  { id: "l2_ret13", label: "retail13", r: 21, c: 226, color: "#36A732" },
  { id: "l2_ret14", label: "retail14", r: 21, c: 235, color: "#36A732" },
  { id: "l2_fnb1",  label: "food1",  r: 21, c: 1,   color: "#A7329F" },
  { id: "l2_fnb2",  label: "food2",  r: 24, c: 26,  color: "#A7329F" },
  { id: "l2_fnb3",  label: "food3",  r: 24, c: 49,  color: "#A7329F" },
  { id: "l2_fnb4",  label: "food4",  r: 21, c: 60,  color: "#A7329F" },
  { id: "l2_fnb5",  label: "food5",  r: 21, c: 64,  color: "#A7329F" },
  { id: "l2_fnb6",  label: "food6",  r: 21, c: 68,  color: "#A7329F" },
  { id: "l2_fnb7",  label: "food7",  r: 21, c: 73,  color: "#A7329F" },
  { id: "l2_fnb8",  label: "food8",  r: 21, c: 80,  color: "#A7329F" },
  { id: "l2_fnb9",  label: "food9",  r: 21, c: 83,  color: "#A7329F" },
  { id: "l2_fnb10", label: "food10", r: 21, c: 95,  color: "#A7329F" },
  { id: "l2_fnb11", label: "food11", r: 21, c: 96,  color: "#A7329F" },
  { id: "l2_fnb12", label: "food12", r: 21, c: 126, color: "#A7329F" },
  { id: "l2_fnb13", label: "food13", r: 21, c: 160, color: "#A7329F" },
  { id: "l2_fnb14", label: "food14", r: 21, c: 162, color: "#A7329F" },
  { id: "l2_fnb15", label: "food15", r: 21, c: 166, color: "#A7329F" },
  { id: "l2_fnb16", label: "food16", r: 21, c: 170, color: "#A7329F" },
  { id: "l2_fnb17", label: "food17", r: 21, c: 178, color: "#A7329F" },
  { id: "l2_fnb18", label: "food18", r: 21, c: 231, color: "#A7329F" },
  { id: "l2_fnb19", label: "food19", r: 21, c: 239, color: "#A7329F" },
  { id: "l2_fnb20", label: "food20", r: 21, c: 250, color: "#A7329F" },
  { id: "l2_fnb21", label: "food21", r: 21, c: 255, color: "#A7329F" },
  { id: "l2_fnb22", label: "food22", r: 21, c: 298, color: "#A7329F" },
  { id: "l2_df1",  label: "LoungeVVIP", r: 9,  c: 202, color: "#A1752F" },
  { id: "l2_nl1",  label: "nolabel1",   r: 21, c: 51,  color: "#B1B1B1" },
  { id: "l2_nl2",  label: "nolabel2",   r: 21, c: 153, color: "#B1B1B1" },
  { id: "l2_nl3",  label: "nolabel3",   r: 20, c: 284, color: "#B1B1B1" },
  { id: "l2_nl4",  label: "nolabel4",   r: 11, c: 48,  color: "#B1B1B1" },
  { id: "l2_nl5",  label: "nolabel5",   r: 21, c: 133, color: "#B1B1B1" },
  { id: "l2_nl6",  label: "nolabel6",   r: 9,  c: 185, color: "#B1B1B1" },
  { id: "l2_nl7",  label: "nolabel7",   r: 9,  c: 183, color: "#B1B1B1" },
  { id: "l2_nl8",  label: "nolabel8",   r: 9,  c: 180, color: "#B1B1B1" },
  { id: "l2_nl9",  label: "nolabel9",   r: 9,  c: 179, color: "#B1B1B1" },
  { id: "l2_nl10", label: "nolabel10",  r: 9,  c: 168, color: "#B1B1B1" },
  { id: "l2_ld1",  label: "tangga1",    r: 21, c: 267, color: "#B1B1B1" },
  { id: "l2_ld2",  label: "tangga2",    r: 9,  c: 111, color: "#B1B1B1" },
  { id: "l2_ld3",  label: "tangga3",    r: 10, c: 129, color: "#B1B1B1" },
  { id: "l2_ld4",  label: "tangga4",    r: 9,  c: 203, color: "#B1B1B1" },
  { id: "l2_ld5",  label: "tangga5",    r: 8,  c: 211, color: "#B1B1B1" },
  { id: "l2_ld6",  label: "tangga6",    r: 8,  c: 223, color: "#B1B1B1" },
  { id: "l2_ld7",  label: "tangga7",    r: 8,  c: 251, color: "#B1B1B1" },
  { id: "l2_lo1",  label: "lounge1",    r: 6,  c: 55,  color: "#A77432" },
  { id: "l2_lo2",  label: "lounge2",    r: 6,  c: 153, color: "#A77432" },
  { id: "l2_lo3",  label: "lounge3",    r: 24, c: 10,  color: "#A77432" },
  { id: "l2_lo4",  label: "lounge4",    r: 24, c: 19,  color: "#A77432" },
  { id: "l2_lo5",  label: "lounge5",    r: 24, c: 33,  color: "#A77432" },
  { id: "l2_lo6",  label: "lounge6",    r: 24, c: 42,  color: "#A77432" },
  { id: "l2_lo7",  label: "lounge7",    r: 24, c: 56,  color: "#A77432" },
  { id: "l2_lo8",  label: "lounge8",    r: 24, c: 65,  color: "#A77432" },
  { id: "l2_lo9",  label: "lounge9",    r: 24, c: 79,  color: "#A77432" },
  { id: "l2_lo10", label: "lounge10",   r: 24, c: 90,  color: "#A77432" },
  { id: "l2_lo11", label: "lounge11",   r: 24, c: 101, color: "#A77432" },
  { id: "l2_lo12", label: "lounge12",   r: 24, c: 112, color: "#A77432" },
  { id: "l2_lo13", label: "lounge13",   r: 24, c: 133, color: "#A77432" },
  { id: "l2_lo14", label: "lounge14",   r: 24, c: 157, color: "#A77432" },
  { id: "l2_lo15", label: "lounge15",   r: 24, c: 165, color: "#A77432" },
  { id: "l2_lo16", label: "lounge16",   r: 24, c: 179, color: "#A77432" },
  { id: "l2_lo17", label: "lounge17",   r: 24, c: 189, color: "#A77432" },
  { id: "l2_lo18", label: "lounge18",   r: 24, c: 227, color: "#A77432" },
  { id: "l2_lo19", label: "lounge19",   r: 24, c: 237, color: "#A77432" },
  { id: "l2_lo20", label: "lounge20",   r: 24, c: 255, color: "#A77432" },
  { id: "l2_lo21", label: "lounge21",   r: 24, c: 272, color: "#A77432" },
  { id: "l2_lo22", label: "lounge22",   r: 24, c: 285, color: "#A77432" },
  { id: "l2_pr1",  label: "promo1",     r: 24, c: 95,  color: "#A77432" },
  { id: "l2_pr2",  label: "promo2",     r: 24, c: 120, color: "#A77432" },
  { id: "l2_pr3",  label: "promo3",     r: 24, c: 198, color: "#A77432" },
  { id: "l2_pr4",  label: "promo4",     r: 25, c: 219, color: "#A77432" },
];