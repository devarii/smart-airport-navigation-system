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

  // ── Sekat horizontal bawah kiri L1: r80 c1–c53 ───────────────────────────
  // Membatasi: kan1 (c74–77), kan2 (c70–73), kan3 (c66–69), kan4 (c63–65)
  // toilet1 (c56–62), retail1 (c71–79), retail2 (c63–70)
  // Setiap gap = pintu masuk per blok kantor
  row(80, 1, 13);  // tenant: nolabel16
  row(80, 15, 26);
  row(80, 28, 39);
  row(80, 41, 53);

  // ── Dinding kiri zona tengah L1: col c54 r63–r80 ─────────────────────────
  // Sisi kiri toilet1 (l1_tl1): r80–r89 c56–c62
  
  col(54, 63, 80);
  // ── Batas atas zona tengah L1: r63 dan r68 c55–c109 ─────────────────────
  // r63 = dinding atas food1 (c103–111), musholla1 (c105–111), nolabel1/2
  // r68 = dinding bawah area atas, atas kantor7–17 (c122–163)

  row(63, 55, 109);
  row(68, 59, 109);  // tenant: server1, server2
  // ── Sekat vertikal c65 area r69–r80 ──────────────────────────────────────
  // Membagi kan3 (c66–69) dan kan4 (c63–65)

  col(65, 69, 72);
  col(65, 76, 80);  // tenant: kantor3, kantor4
  // ── Batas bawah zona tengah L1: r80 c55–c109 ─────────────────────────────
  // Bawah toilet1, retail2, kan3/4
  row(80, 55, 84);  // tenant: server4, kantor1
  row(80, 91, 109);  // tenant: server3, service2

  // ── Sekat vertikal c110 dan c113 area r68–r87 ────────────────────────────
  // Membagi area tengah dari area toilet2/3 (c118–121)
  col(110, 68, 89);  // tenant: musholla1, food1
  col(113, 67, 74);

  // ── Area kantor7–17 (l1_kan7–17): r70–r74 c122–c163 ─────────────────────
  row(67, 114, 119);
  row(66, 119, 123);
  row(66, 126, 127);

  // ── Dinding kanan area kan7–17 dan batas bawah: c127 r66–r80 ─────────────  
  col(127, 66, 80);  // tenant: kantor9
  row(80, 128, 154);
  row(80, 159, 183);  // tenant: dfree1, nolabel5

  // ── Area nolabel3/4 dan dfree1 (l1_df1): r68–r83 c156–c180 ──────────────
  col(180, 68, 79);  // tenant: nolabel9, nolabel10
  row(67, 169, 180);  // tenant: service3, service4
  col(169, 63, 67);  // tenant: service3
  row(63, 150, 168);  // tenant: service4

  // ── Sekat internal dfree1 (l1_df1): r81–r82 c156–c157 ───────────────────
  // ⚠ anchor dfree1 anchor=(84,158) — cek apakah clear setelah r83+1=84
  row(81, 156, 157);  // tenant: dfree1
  row(82, 156, 157);  // tenant: dfree1

  // ── Area toilet3 (l1_tl3): r70–r78 c118–c121 ────────────────────────────
  // + toilet2 (l1_tl2): r79–r85 c118–c122
  row(70, 117, 126);  // tenant: kantor7, kantor8
  col(117, 70, 81);  // tenant: toilet2, toilet3
  col(116, 81, 85);

  // ── Area food1 (l1_fnb1): r81–r89 c103–c111 ─────────────────────────────
  // + musholla1 (l1_mus1): r67–r79 c105–c111
  // ⚠ CONFLICT: musholla1 anchor=(80,108) kena row(80,55,84) → r79+1=80 = WALL
  // Fix: ubah r2 musholla1 dari 79 ke 78 di JSON → anchor=(79,108) clear
  row(63, 113, 140);

  // ── Area toilet1 (l1_tl1): r80–r89 c56–c62 ──────────────────────────────
  col(56, 81, 89);  // tenant: toilet1
  row(89, 56, 84);  // tenant: service1, toilet1
  col(84, 81, 82);  // tenant: server4
  col(84, 85, 89);  // tenant: service1
  // ── Area service1 (l1_sv1): r86–r89 c80–c85 ─────────────────────────────
  // + retail1 (l1_ret1): r86–r89 c71–c79
  // + retail2 (l1_ret2): r86–r89 c63–c70
  col(91, 81, 82);  // tenant: server3
  col(91, 85, 89);  // tenant: retail3
  row(89, 91, 110);  // tenant: retail3, food1

  // ── Area toilet2 (l1_tl2): r79–r85 c118–c122 ────────────────────────────
  // + kantor19 (l1_kan19): r88–r92 c122–c128
  row(81, 117, 121);
  col(121, 81, 90);  // tenant: kantor19, toilet2
  row(79, 168, 170)

  // ── Area nolabel12–14 (l1_nl12–14): r74–r78 c169–c192 ───────────────────
  col(167, 74, 79);  // tenant: nolabel5, nolabel6
  // ── Area tangga1/2 (l1_ld1/2) + nolabel20/21: r92–r107 c122–c128 ────────
  row(96, 119, 132);  // tenant: nolabel20, nolabel22
  row(100, 121, 124);  // tenant: nolabel21
  row(100, 126, 129);  // tenant: nolabel21
  row(108, 121, 129);  // tenant: nolabel21
  col(121, 101, 107);  // tenant: nolabel21
  col(129, 101, 107);  // tenant: nolabel21
  // ── Area besar bawah L1: r104–r113 c56–c84 ───────────────────────────────
  // food3 (l1_fnb3): r103–r106 c66–c75
  row(104, 106, 120);  // tenant: food4
  // ── Sekat r108 area c18–c49 + dinding batas bawah lantai 1 kiri ──────────
  // toilet4 (l1_tl4): r109–r114 c1–c13
  // toilet5 (l1_tl5): r111–r114 c17–c20
  // musholla2 (l1_mus2): r109–r114 c14–c16
  // musholla3 (l1_mus3): r108–r110 c17–c20
  // nolabel17–19 (c21–c40): r107–r110
  // food2 (l1_fnb2): r107–r110 c41–c49

  row(104, 56, 84);  // tenant: retail4, food3
  row(108, 18, 49);  // tenant: musholla3, food2
  col(17, 104, 112);  // tenant: toilet5, musholla2
  row(113, 1, 50);  // tenant: toilet4, toilet5
  row(113, 55, 75);
  row(113, 80, 100);
  row(113, 105, 125);
  row(113, 130, 193);  // tenant: toilet7, toilet8
  col(62, 80, 89)
  // ── Sekat col c190 r110–r112 ─────────────────────────────────────────────
  col(193, 110, 112);  // tenant: nolabel33

  // ── Dinding bawah area kanan L1: r109 c188–c320, r96 c190–c320 ───────────
  // kan20–38 (c209–c305): r106–r109
  // tl9 (c191–199), tl10 (c205–208), mus6 (c200–204), mus7 (c224–229)
  // tl11 (c230–233), tl12 (c233–236), kan21–29 (c237–263)
  // tl13 (c269–272), mus8 (c264–268), tl14 (c273–278)
  // kan30–38 (c279–305)
  // gate1 (c231–235), gate2 (c270–275), gate3 (c313–317)
  row(109, 188, 320);  // tenant: kantor20, kantor21
  row(108, 1, 13);  // tenant: toilet4, musholla2
  row(101, 1, 13);  // tenant: nolabel15
  // ── Sekat col c14 area r98–r108 ──────────────────────────────────────────
  // Membatasi tangga1 (c14–c17) kiri
  col(14, 98, 103);  // tenant: nolabel15, tangga1
  col(14, 106, 108);  // tenant: toilet4, musholla2

  // ── Area nolabel22–26 + tangga3 (l1_ld3): r98–r113 c132–c158 ────────────
  row(103, 134, 137);  // tenant: nolabel23
  col(137, 104, 105);
  row(105, 137, 140);
  row(105, 142, 158);  // tenant: musholla4, nolabel25
  col(134, 104, 109);  // tenant: nolabel23
  row(109, 134, 144);  // tenant: nolabel23, nolabel24
  col(158, 104, 110);

  // ── Area toilet7 (l1_tl7): r109–r112 c156–c160 ──────────────────────────
  // ⚠ CONFLICT: tl7 anchor=(113,158) kena row(113,130,190)
  // Fix: ubah r2 toilet7 dari 112 ke 112 (r2+1=113=wall) → scanRadial ambil r108 atau ubah r2=111
  // ── Area toilet8 (l1_tl8): r104–r112 c164–c171 ──────────────────────────
  // ⚠ CONFLICT: tl8 anchor=(113,168) kena row(113,130,190)
  // Fix: sama dengan tl7 — r2 terlalu besar, anchor r2+1=113=wall
  // Ubah r2 toilet8 dari 112 ke 111 di JSON → anchor=(112,168) clear
  col(169, 98, 112);  // tenant: nolabel28
  row(104, 160, 180);  // tenant: toilet8, musholla4
  row(97, 160, 169);  // tenant: nolabel27, nolabel28
  col(181, 104, 109);  // tenant: nolabel29

  // ── Area nolabel29–35 + service5 (l1_sv5): r104–r113 c175–c192 ──────────
  // ⚠ CONFLICT: sv5 anchor=(83,190) — room r79–r82, r2+1=83, c190=wall (col(190,73,96))
  // Fix: ubah c2 service5 dari 192 ke 189 di JSON → anchorC=(188+189)/2=189, r83 clear
  col(188, 103, 109);
  col(190, 73, 96);
  row(96, 190, 320);  // tenant: gate1, gate2
  col(186, 73, 78);  // tenant: nolabel36
  col(169, 83, 84);  // tenant: nolabel6
  col(169, 86, 88);
  col(169, 90, 96);

  // ── Sekat internal area c139–c141 r108 ───────────────────────────────────
  row(108, 139, 141);  // tenant: nolabel24

  // ── Area nolabel36 (l1_nl36): r74–r78 c187–c192 ─────────────────────────
  col(173, 105, 112);
  col(158, 111, 112)

  // =========================================================================
  // LANTAI 2  (r0–r54)
  // =========================================================================

  // ── Batas atas area gate L2: r7 c50–c175 ─────────────────────────────────
  // gate7 (c54–58), gate8 (c76–80), gate9 (c108–112), gate10 (c137–141), gate11 (c166–170)
  // musholla2 L2 (l2_mus2): r7–r9 c50–c56  
  // row(7, 50, 177);
  row(7, 50, 57)
  row(7, 59, 73)
  row(7, 75, 80)
  row(7, 82, 177)
  // ── Area toilet1 L2 (l2_tl1): r45–r49 c3–c14 ────────────────────────────
  // + musholla1 L2 (l2_mus1): r42–r44 c10–c14
  // + service1 L2 (l2_ser1_2): r47–r49 c15–c17
  // + kan1 L2 (l2_kan1): r42–r44 c(-1)–c9
  // ⚠ CONFLICT: tl1 L2 anchor=(44,9) kena row(44,1,10)
  // Fix: lantai 2 anchor = r1-1. r1=45 → anchor=r44. row(44,1,10) ada di r44 c1–c10.
  // anchorC=(3+14)/2=9 kena wall. Perbaiki: scanRadial akan cari r43,c9 atau ubah c1/c2

  col(49, 7, 16);  // tenant: toilet2, musholla2
  row(16, 1, 55);  // tenant: toilet2, food1
  // ── Area nolabel1 L2 (l2_nl1): r33–r38 c(-1)–c3 ─────────────────────────
  // + tangga1/2 L2 (l2_ld1/2): r29–r33 c13–c20
  // + tangga3 L2 (l2_ld3): r34–r38 c4–c13

  row(44, 1, 10);  // tenant: kantor1, toilet1
  col(15, 33, 39);  // tenant: tangga1
  col(15, 42, 48);  // tenant: service1, toilet1
  // ── Batas area kiri bawah L2: r32–r36 c1–c20 ────────────────────────────
  row(36, 1, 15);
  row(32, 15, 20);  // tenant: tangga1, tangga2
  row(34, 20, 75);  // tenant: retail1, dfree3
  row(33, 20, 20);  // tenant: tangga2
  // ── Sekat vertikal kecil L2 area c31 dan c61 r35–r48 ────────────────────
  col(31, 35, 37);
  col(31, 46, 48);
  col(61, 35, 37);
  col(61, 46, 48);
  // ── Sekat vertikal c49 r17–r48 ───────────────────────────────────────────
  // Membatasi sisi kanan toilet1 L2 dan sisi kiri retail1/food1 L2

  col(49, 17, 33);  // tenant: toilet2, retail1
  // ── Sekat vertikal c103 r28–r48 ──────────────────────────────────────────
  // Sisi kanan retail7 (c95–103) dan food6 (c104–107)

  col(103, 28, 32);  // tenant: retail7, orientation1
  col(103, 35, 48);  // tenant: server1, server2
  // ── Dinding atas area food/retail L2: r28 c58–c102 ───────────────────────
  // dfree1/2/3 (l2_df1/2/3): r28–r33 c54–c75
  // retail3–7 (l2_ret3–7): r25–r27 c58–c103

  row(28, 58, 102);  // tenant: retail3, retail4
  // ── Batas bawah lantai 2: r49 c1–c320 ───────────────────────────────────

  row(49, 1, 320);  // tenant: server1, service1
  // ── Batas bawah kanan L2: r34 c175–c320 ─────────────────────────────────
  // tl5 L2 (l2_tl5): r29–r34 c199–c205
  // tl6 L2 (l2_tl6): r29–r34 c239–c243
  // tl7 L2 (l2_tl7): r29–r34 c278–c284
  // mus5 L2 (l2_mus5): r21–r34 c167–c177
  // mus6 L2 (l2_mus6): r29–r34 c206–c210
  // mus8 L2 (l2_mus8): r29–r34 c285–c288
  // gate4 (c216–220), gate5 (c254–258), gate6 (c294–298)
  // kan2 L2 (l2_kan2): r29–r34 c244–c247
  // nl4 L2 (l2_nl4): r29–r34 c235–c238
  // ret9 L2 (l2_ret9): r46–r48 c236–c250

  row(34, 177, 320);  // tenant: kantor2, toilet5
  // ── Dinding kanan area tengah L2: col c175 r8–r33 ────────────────────────

  col(177, 8, 33);  // tenant: musholla5
  // ── Area toilet3/4 L2 (l2_tl3/4) + musholla3/4 L2 (l2_mus3/4) ──────────
  // tl3 (r14–r18 c115–c118), tl4 (r11–r13 c115–c118)
  // mus3 (r14–r16 c111–c114), mus4 (r7–r9 c116–c118)
  // food2/3/4 L2 (l2_fnb2/3/4): r14–r34 c115–c118

  row(14, 111, 118);  // tenant: toilet3, toilet4
  // ── Sekat col c55 r13–r16 ────────────────────────────────────────────────

  col(56, 13, 16);  // tenant: nolabel2
  // ── Dinding kanan area L2 kanan: col c118 r8–r34 ─────────────────────────
  // + lounge1 L2 (l2_lo1): r35–r40 c117–c160
  // ⚠ CONFLICT: lounge1 L2 anchor=(34,139) kena row(34,118,160)
  // Fix: lantai 2, anchor = r1-1. r1=35 → r34. row(34,118,160) ada di r34.
  // anchorC=(117+160)/2=139 kena wall. Ubah r1 lounge1 dari 35 ke 36 di JSON
  // → anchor = r35, clear

  col(118, 8, 9);  // tenant: musholla4
  col(118, 11, 34);  // tenant: toilet3, toilet4
  row(34, 118, 160);  // tenant: food2, lounge1
  col(160, 14, 34);  // tenant: lounge1
  // ── Sekat col c106 area r26–r35 ──────────────────────────────────────────
  // Membatasi food6 L2 (l2_fnb6): r26–r34 c106–c107

  col(106, 26, 35);  // tenant: food6
  row(35, 104, 105);  // tenant: food6
  // ── Sekat vertikal gate area L2 (r4–r6) ──────────────────────────────────
  // gate1 (c57–59), gate2 (c73–75), gate3 (c80–82)
  // Sekat antar gate

  col(57, 4, 6);  // tenant: musholla2, gate1
  col(59, 4, 6);  // tenant: gate1
  col(73, 4, 6);  // tenant: gate2
  col(75, 4, 6);  // tenant: gate2
  col(80, 4, 6);  // tenant: gate3
  col(82, 4, 6);  // tenant: gate3
  // ── Dinding atas gate area L2: r4 ────────────────────────────────────────
  // gate7 (r0–r2 c54–c58), gate8 (c76–80), gate9 (c108–112)
  // gate10 (c137–141), gate11 (c166–170)

  row(4, 53, 56);  // tenant: gate1
  row(4, 60, 72);  // tenant: gate1, gate2
  row(4, 76, 79);  // tenant: gate2, gate3
  row(4, 83, 172);  // tenant: gate3
  // ── Batas atas grid L2: r1 c53–c172 ─────────────────────────────────────
  // + gate7/8/9/10/11 (r0–r2)

  row(1, 53, 172);  // tenant: gate7, gate8
  col(172, 2, 3);
  col(53, 2, 3);  // tenant: gate7
  // ── food1 L2 (l2_fnb1): r17–r21 c50–c53 ─────────────────────────────────
  // ⚠ CONFLICT: food1 L2 anchor=(16,52) kena row(16,1,55)
  // Fix: lantai 2, anchor = r1-1. r1=17 → r16. row(16,1,55) ada di r16 c1–c55.
  // anchorC=(50+53)/2=52 kena wall. Ubah r1 food1 L2 dari 17 ke 18 di JSON
  // → anchor = r17, clear (antara r16 wall dan r17 walkable)


  row(79, 186, 189)
  col(128, 88, 96)
  row(87, 120, 128)

  col(118, 35, 40)
  col(160, 35, 40)

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