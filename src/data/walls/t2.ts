import type { DestinationPoint, WallDataJson } from "@/types";

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

export const DESTINATIONS: DestinationPoint[] = [
  // ── LANTAI 1 ──
  { id: "l1_ser1",  label: "server1",   r: 69,  c: 98,  color: "#e74c3c" },
  { id: "l1_ser2",  label: "server2",   r: 69,  c: 105, color: "#e74c3c" },
  { id: "l1_ser3",  label: "server3",   r: 81,  c: 92,  color: "#e74c3c" },
  { id: "l1_ser4",  label: "server4",   r: 81,  c: 82,  color: "#e74c3c" },
  { id: "l1_kan1",  label: "kantor1",   r: 81,  c: 76,  color: "#3282D1" },
  { id: "l1_kan2",  label: "kantor2",   r: 81,  c: 72,  color: "#3282D1" },
  { id: "l1_kan3",  label: "kantor3",   r: 81,  c: 68,  color: "#3282D1" },
  { id: "l1_kan4",  label: "kantor4",   r: 81,  c: 64,  color: "#3282D1" },
  { id: "l1_kan5",  label: "kantor5",   r: 87,  c: 81,  color: "#3282D1" },
  { id: "l1_kan6",  label: "kantor6",   r: 81,  c: 96,  color: "#3282D1" },
  { id: "l1_kan7",  label: "kantor7",   r: 73,  c: 121, color: "#3282D1" },
  { id: "l1_kan8",  label: "kantor8",   r: 73,  c: 123, color: "#3282D1" },
  { id: "l1_kan9",  label: "kantor9",   r: 73,  c: 125, color: "#3282D1" },
  { id: "l1_kan10", label: "kantor10",  r: 73,  c: 133, color: "#3282D1" },
  { id: "l1_kan11", label: "kantor11",  r: 73,  c: 136, color: "#3282D1" },
  { id: "l1_kan12", label: "kantor12",  r: 73,  c: 139, color: "#3282D1" },
  { id: "l1_kan13", label: "kantor13",  r: 73,  c: 142, color: "#3282D1" },
  { id: "l1_kan14", label: "kantor14",  r: 73,  c: 145, color: "#3282D1" },
  { id: "l1_kan15", label: "kantor15",  r: 73,  c: 148, color: "#3282D1" },
  { id: "l1_kan16", label: "kantor16",  r: 73,  c: 151, color: "#3282D1" },
  { id: "l1_kan17", label: "kantor17",  r: 73,  c: 154, color: "#3282D1" },
  { id: "l1_kan18", label: "kantor18",  r: 94,  c: 1,   color: "#3282D1" },
  { id: "l1_kan19", label: "kantor19",  r: 90,  c: 125, color: "#3282D1" },
  { id: "l1_kan20", label: "kantor20",  r: 110, c: 214, color: "#3282D1" },
  { id: "l1_kan21", label: "kantor21",  r: 110, c: 237, color: "#3282D1" },
  { id: "l1_kan22", label: "kantor22",  r: 110, c: 240, color: "#3282D1" },
  { id: "l1_kan23", label: "kantor23",  r: 110, c: 243, color: "#3282D1" },
  { id: "l1_kan24", label: "kantor24",  r: 110, c: 246, color: "#3282D1" },
  { id: "l1_kan25", label: "kantor25",  r: 110, c: 249, color: "#3282D1" },
  { id: "l1_kan26", label: "kantor26",  r: 110, c: 252, color: "#3282D1" },
  { id: "l1_kan27", label: "kantor27",  r: 110, c: 255, color: "#3282D1" },
  { id: "l1_kan28", label: "kantor28",  r: 110, c: 258, color: "#3282D1" },
  { id: "l1_kan29", label: "kantor29",  r: 110, c: 261, color: "#3282D1" },
  { id: "l1_kan30", label: "kantor30",  r: 110, c: 279, color: "#3282D1" },
  { id: "l1_kan31", label: "kantor31",  r: 110, c: 282, color: "#3282D1" },
  { id: "l1_kan32", label: "kantor32",  r: 110, c: 285, color: "#3282D1" },
  { id: "l1_kan33", label: "kantor33",  r: 110, c: 288, color: "#3282D1" },
  { id: "l1_kan34", label: "kantor34",  r: 110, c: 291, color: "#3282D1" },
  { id: "l1_kan35", label: "kantor35",  r: 110, c: 294, color: "#3282D1" },
  { id: "l1_kan36", label: "kantor36",  r: 110, c: 297, color: "#3282D1" },
  { id: "l1_kan37", label: "kantor37",  r: 110, c: 300, color: "#3282D1" },
  { id: "l1_kan38", label: "kantor38",  r: 110, c: 303, color: "#3282D1" },
  { id: "l1_kan39", label: "kantor39",  r: 70,  c: 169, color: "#3282D1" },
  { id: "l1_kan40", label: "kantor40",  r: 66,  c: 165, color: "#3282D1" },
  { id: "l1_kan41", label: "kantor41",  r: 70,  c: 12,  color: "#3282D1" },
  { id: "l1_kan42", label: "kantor42",  r: 70,  c: 16,  color: "#3282D1" },
  { id: "l1_kan43", label: "kantor43",  r: 70,  c: 20,  color: "#3282D1" },
  { id: "l1_kan44", label: "kantor44",  r: 70,  c: 24,  color: "#3282D1" },
  { id: "l1_kan45", label: "kantor45",  r: 70,  c: 35,  color: "#3282D1" },
  { id: "l1_kan46", label: "kantor46",  r: 70,  c: 39,  color: "#3282D1" },
  { id: "l1_kan47", label: "kantor47",  r: 70,  c: 43,  color: "#3282D1" },
  { id: "l1_tl1",  label: "toilet1",   r: 84,  c: 62,  color: "#4FC1D3" },
  { id: "l1_tl2",  label: "toilet2",   r: 84,  c: 118, color: "#4FC1D3" },
  { id: "l1_tl3",  label: "toilet3",   r: 76,  c: 120, color: "#4FC1D3" },
  { id: "l1_tl4",  label: "toilet4",   r: 110, c: 14,  color: "#4FC1D3" },
  { id: "l1_tl5",  label: "toilet5",   r: 111, c: 20,  color: "#4FC1D3" },
  { id: "l1_tl6",  label: "toilet6",   r: 74,  c: 3,   color: "#4FC1D3" },
  { id: "l1_tl7",  label: "toilet7",   r: 109, c: 156, color: "#4FC1D3" },
  { id: "l1_tl8",  label: "toilet8",   r: 109, c: 163, color: "#4FC1D3" },
  { id: "l1_tl9",  label: "toilet9",   r: 106, c: 195, color: "#4FC1D3" },
  { id: "l1_tl10", label: "toilet10",  r: 110, c: 204, color: "#4FC1D3" },
  { id: "l1_tl11", label: "toilet11",  r: 106, c: 229, color: "#4FC1D3" },
  { id: "l1_tl12", label: "toilet12",  r: 110, c: 234, color: "#4FC1D3" },
  { id: "l1_tl13", label: "toilet13",  r: 106, c: 271, color: "#4FC1D3" },
  { id: "l1_tl14", label: "toilet14",  r: 110, c: 276, color: "#4FC1D3" },
  { id: "l1_mus1", label: "musholla1", r: 75,  c: 105, color: "#EED832" },
  { id: "l1_mus2", label: "musholla2", r: 111, c: 15,  color: "#EED832" },
  { id: "l1_mus3", label: "musholla3", r: 109, c: 20,  color: "#EED832" },
  { id: "l1_mus4", label: "musholla4", r: 107, c: 156, color: "#EED832" },
  { id: "l1_mus5", label: "musholla5", r: 109, c: 159, color: "#EED832" },
  { id: "l1_mus6", label: "musholla6", r: 106, c: 200, color: "#EED832" },
  { id: "l1_mus7", label: "musholla7", r: 106, c: 224, color: "#EED832" },
  { id: "l1_mus8", label: "musholla8", r: 106, c: 266, color: "#EED832" },
  { id: "l1_gd1",  label: "gate1",     r: 96,  c: 231, color: "#FF0000" },
  { id: "l1_gd2",  label: "gate2",     r: 96,  c: 273, color: "#FF0000" },
  { id: "l1_gd3",  label: "gate3",     r: 96,  c: 315, color: "#FF0000" },
  { id: "l1_ret1", label: "retail1",   r: 87,  c: 75,  color: "#36A732" },
  { id: "l1_ret2", label: "retail2",   r: 87,  c: 68,  color: "#36A732" },
  { id: "l1_ret3", label: "retail3",   r: 87,  c: 95,  color: "#36A732" },
  { id: "l1_ret4", label: "retail4",   r: 105, c: 55,  color: "#36A732" },
  { id: "l1_fnb1", label: "food1",     r: 84,  c: 107, color: "#A7329F" },
  { id: "l1_fnb2", label: "food2",     r: 107, c: 49,  color: "#A7329F" },
  { id: "l1_fnb3", label: "food3",     r: 103, c: 70,  color: "#A7329F" },
  { id: "l1_fnb4", label: "food4",     r: 103, c: 113, color: "#A7329F" },
  { id: "l1_df1",  label: "dfree1",    r: 83,  c: 157, color: "#A1752F" },
  { id: "l1_nl1",  label: "nolabel1",  r: 67,  c: 105, color: "#B1B1B1" },
  { id: "l1_nl2",  label: "nolabel2",  r: 67,  c: 100, color: "#B1B1B1" },
  { id: "l1_nl3",  label: "nolabel3",  r: 73,  c: 157, color: "#B1B1B1" },
  { id: "l1_nl4",  label: "nolabel4",  r: 73,  c: 160, color: "#B1B1B1" },
  { id: "l1_nl5",  label: "nolabel5",  r: 81,  c: 163, color: "#B1B1B1" },
  { id: "l1_nl6",  label: "nolabel6",  r: 81,  c: 166, color: "#B1B1B1" },
  { id: "l1_nl7",  label: "nolabel7",  r: 81,  c: 169, color: "#B1B1B1" },
  { id: "l1_nl8",  label: "nolabel8",  r: 81,  c: 172, color: "#B1B1B1" },
  { id: "l1_nl9",  label: "nolabel9",  r: 81,  c: 175, color: "#B1B1B1" },
  { id: "l1_nl10", label: "nolabel10", r: 81,  c: 178, color: "#B1B1B1" },
  { id: "l1_nl11", label: "nolabel11", r: 79,  c: 166, color: "#B1B1B1" },
  { id: "l1_nl12", label: "nolabel12", r: 74,  c: 171, color: "#B1B1B1" },
  { id: "l1_nl13", label: "nolabel13", r: 74,  c: 175, color: "#B1B1B1" },
  { id: "l1_nl14", label: "nolabel14", r: 74,  c: 179, color: "#B1B1B1" },
  { id: "l1_nl15", label: "nolabel15", r: 102, c: 3,   color: "#B1B1B1" },
  { id: "l1_nl16", label: "nolabel16", r: 81,  c: 1,   color: "#B1B1B1" },
  { id: "l1_nl17", label: "nolabel17", r: 107, c: 25,  color: "#B1B1B1" },
  { id: "l1_nl18", label: "nolabel18", r: 107, c: 30,  color: "#B1B1B1" },
  { id: "l1_nl19", label: "nolabel19", r: 109, c: 40,  color: "#B1B1B1" },
  { id: "l1_nl20", label: "nolabel20", r: 95,  c: 120, color: "#B1B1B1" },
  { id: "l1_nl21", label: "nolabel21", r: 100, c: 125, color: "#B1B1B1" },
  { id: "l1_nl22", label: "nolabel22", r: 97,  c: 132, color: "#B1B1B1" },
  { id: "l1_nl23", label: "nolabel23", r: 104, c: 132, color: "#B1B1B1" },
  { id: "l1_nl24", label: "nolabel24", r: 109, c: 140, color: "#B1B1B1" },
  { id: "l1_nl25", label: "nolabel25", r: 104, c: 150, color: "#B1B1B1" },
  { id: "l1_nl26", label: "nolabel26", r: 104, c: 146, color: "#B1B1B1" },
  { id: "l1_nl27", label: "nolabel27", r: 98,  c: 161, color: "#B1B1B1" },
  { id: "l1_nl28", label: "nolabel28", r: 98,  c: 167, color: "#B1B1B1" },
  { id: "l1_nl29", label: "nolabel29", r: 108, c: 178, color: "#B1B1B1" },
  { id: "l1_nl30", label: "nolabel30", r: 110, c: 178, color: "#B1B1B1" },
  { id: "l1_nl31", label: "nolabel31", r: 107, c: 176, color: "#B1B1B1" },
  { id: "l1_nl32", label: "nolabel32", r: 109, c: 176, color: "#B1B1B1" },
  { id: "l1_nl33", label: "nolabel33", r: 110, c: 187, color: "#B1B1B1" },
  { id: "l1_nl34", label: "nolabel34", r: 108, c: 184, color: "#B1B1B1" },
  { id: "l1_nl35", label: "nolabel35", r: 104, c: 186, color: "#B1B1B1" },
  { id: "l1_ld1",  label: "tangga1",   r: 97,  c: 16,  color: "#B1B1B1" },
  { id: "l1_ld2",  label: "tangga2",   r: 97,  c: 19,  color: "#B1B1B1" },
  { id: "l1_ld3",  label: "tangga3",   r: 98,  c: 163, color: "#B1B1B1" },

  // ── LANTAI 2 ──
  { id: "l2_ser1", label: "server1",      r: 46, c: 95,  color: "#e74c3c" },
  { id: "l2_ser2", label: "server2",      r: 43, c: 100, color: "#e74c3c" },
  { id: "l2_ser3", label: "server3",      r: 41, c: 100, color: "#e74c3c" },
  { id: "l2_ser4", label: "server4",      r: 39, c: 100, color: "#e74c3c" },
  { id: "l2_kan1", label: "kantor1",      r: 42, c: 11,  color: "#3282D1" },
  { id: "l2_kan2", label: "kantor2",      r: 46, c: 16,  color: "#3282D1" },
  { id: "l2_tl1",  label: "toilet1",      r: 46, c: 14,  color: "#4FC1D3" },
  { id: "l2_tl2",  label: "toilet2",      r: 12, c: 52,  color: "#4FC1D3" },
  { id: "l2_tl3",  label: "toilet3",      r: 16, c: 116, color: "#4FC1D3" },
  { id: "l2_tl4",  label: "toilet4",      r: 11, c: 116, color: "#4FC1D3" },
  { id: "l2_tl5",  label: "toilet5",      r: 35, c: 201, color: "#4FC1D3" },
  { id: "l2_tl6",  label: "toilet6",      r: 35, c: 241, color: "#4FC1D3" },
  { id: "l2_tl7",  label: "toilet7",      r: 35, c: 281, color: "#4FC1D3" },
  { id: "l2_mus1", label: "musholla1",    r: 43, c: 14,  color: "#EED832" },
  { id: "l2_mus2", label: "musholla2",    r: 10, c: 52,  color: "#EED832" },
  { id: "l2_mus3", label: "musholla3",    r: 16, c: 112, color: "#EED832" },
  { id: "l2_mus4", label: "musholla4",    r: 9,  c: 116, color: "#EED832" },
  { id: "l2_mus5", label: "musholla5",    r: 34, c: 170, color: "#EED832" },
  { id: "l2_mus6", label: "musholla6",    r: 35, c: 207, color: "#EED832" },
  { id: "l2_mus7", label: "musholla7",    r: 35, c: 247, color: "#EED832" },
  { id: "l2_mus8", label: "musholla8",    r: 35, c: 287, color: "#EED832" },
  { id: "l2_gd1",  label: "gate1",        r: 7,  c: 58,  color: "#FF0000" },
  { id: "l2_gd2",  label: "gate2",        r: 7,  c: 74,  color: "#FF0000" },
  { id: "l2_gd3",  label: "gate3",        r: 7,  c: 81,  color: "#FF0000" },
  { id: "l2_gd4",  label: "gate4",        r: 34, c: 216, color: "#FF0000" },
  { id: "l2_gd5",  label: "gate5",        r: 34, c: 256, color: "#FF0000" },
  { id: "l2_gd6",  label: "gate6",        r: 34, c: 296, color: "#FF0000" },
  { id: "l2_gd7",  label: "gate7",        r: 1,  c: 56,  color: "#FF0000" },
  { id: "l2_gd8",  label: "gate8",        r: 1,  c: 78,  color: "#FF0000" },
  { id: "l2_gd9",  label: "gate9",        r: 1,  c: 110, color: "#FF0000" },
  { id: "l2_gd10", label: "gate10",       r: 1,  c: 139, color: "#FF0000" },
  { id: "l2_gd11", label: "gate11",       r: 1,  c: 168, color: "#FF0000" },
  { id: "l2_ret1", label: "retail1",      r: 31, c: 52,  color: "#36A732" },
  { id: "l2_ret2", label: "retail2",      r: 23, c: 52,  color: "#36A732" },
  { id: "l2_ret3", label: "retail3",      r: 25, c: 62,  color: "#36A732" },
  { id: "l2_ret4", label: "retail4",      r: 25, c: 72,  color: "#36A732" },
  { id: "l2_ret5", label: "retail5",      r: 25, c: 80,  color: "#36A732" },
  { id: "l2_ret6", label: "retail6",      r: 25, c: 88,  color: "#36A732" },
  { id: "l2_ret7", label: "retail7",      r: 25, c: 96,  color: "#36A732" },
  { id: "l2_ret8", label: "retail8",      r: 19, c: 105, color: "#36A732" },
  { id: "l2_ret9", label: "retail9",      r: 45, c: 243, color: "#36A732" },
  { id: "l2_fnb1", label: "food1",        r: 17, c: 52,  color: "#A7329F" },
  { id: "l2_fnb2", label: "food2",        r: 32, c: 116, color: "#A7329F" },
  { id: "l2_fnb3", label: "food3",        r: 25, c: 116, color: "#A7329F" },
  { id: "l2_fnb4", label: "food4",        r: 21, c: 116, color: "#A7329F" },
  { id: "l2_fnb5", label: "food5",        r: 32, c: 107, color: "#A7329F" },
  { id: "l2_fnb6", label: "food6",        r: 42, c: 107, color: "#A7329F" },
  { id: "l2_fnb7", label: "food7",        r: 45, c: 300, color: "#A7329F" },
  { id: "l2_fnb8", label: "food8",        r: 45, c: 203, color: "#A7329F" },
  { id: "l2_df1",  label: "dfree1",       r: 30, c: 70,  color: "#A1752F" },
  { id: "l2_df2",  label: "dfree2",       r: 31, c: 65,  color: "#A1752F" },
  { id: "l2_df3",  label: "dfree3",       r: 32, c: 60,  color: "#A1752F" },
  { id: "l2_nl1",  label: "nolabel1",     r: 37, c: 6,   color: "#B1B1B1" },
  { id: "l2_nl2",  label: "nolabel2",     r: 12, c: 55,  color: "#B1B1B1" },
  { id: "l2_nl3",  label: "nolabel3",     r: 16, c: 107, color: "#B1B1B1" },
  { id: "l2_ld1",  label: "tangga1",      r: 33, c: 16,  color: "#B1B1B1" },
  { id: "l2_ld2",  label: "tangga2",      r: 33, c: 19,  color: "#B1B1B1" },
  { id: "l2_ld3",  label: "tangga3",      r: 37, c: 12,  color: "#B1B1B1" },
  { id: "l2_ori1", label: "orientation1", r: 32, c: 100, color: "#FD9AE1" },
  { id: "l2_lo1",  label: "lounge1",      r: 35, c: 120, color: "#A77432" },
];