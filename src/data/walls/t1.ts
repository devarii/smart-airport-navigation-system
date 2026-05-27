import type { DestinationPoint, WallDataJson } from "@/types";
import t1Json from "@/data/map/T1_gabungan.json";

export const COLS = 300;
export const ROWS = 100;
export const START_R = 80;
export const START_C = 13;

export const FLOOR1_ROW_MIN = 38;
export const FLOOR1_ROW_MAX = 90;
export const FLOOR2_ROW_MIN = 0;
export const FLOOR2_ROW_MAX = 32;

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

  // ─────────────────────────────────────────────────────────────────────────
  // BATAS GRID (jangan diubah)
  // ─────────────────────────────────────────────────────────────────────────
  row(0, 0, COLS - 1);
  row(ROWS - 1, 0, COLS - 1);
  col(0, 0, ROWS - 1);
  col(COLS - 1, 0, ROWS - 1);

  // =========================================================================
  // LANTAI 1
  // =========================================================================

  // ── Batas atas & bawah lantai 1 + sisi kiri & kanan ─────────────────────
  row(38, 6, 295);   // dinding atas lantai 1
  row(90, 6, 295);   // dinding bawah lantai 1
  col(5, 38, 90);    // dinding kiri lantai 1
  col(295, 38, 90);  // dinding kanan lantai 1

  // ── Area pojok kiri atas L1: selasar & dinding pembatas kiri ─────────────
  // Membentuk koridor kiri (c6–c20) dan dinding c26 menuju r67
  col(20, 39, 37);   // dinding kanan area kiri atas
  row(44, 21, 26);   // dinding bawah area kiri atas
  col(26, 45, 70);   // dinding kanan koridor kiri (retail_new, food1, food2)
  row(70, 6, 54);    // dinding bawah koridor kiri — batas atas area toilet/kantor bawah

  // ── Kotak tengah bawah kiri: area nolabel/kantor r73–r78 c27–c46 ─────────
  // (Mechanical Room l1_nl1 ada di c44–c49 — lihat di bawah)
  row(73, 27, 46);   // dinding atas kotak
  row(81, 27, 46);   // dinding bawah kotak
  col(27, 74, 81);   // dinding kiri kotak
  col(46, 74, 81);   // dinding kanan kotak

  // ── Kompleks toilet/kantor area c54–c63, r55–r78 ─────────────────────────
  // toilet2 (l1_tl2): r71–r75 c57–c63
  // kan_new (l1_tl2_2): r64–r70 c57–c60


  col(59, 63, 67);
  row(64, 56, 58);
  col(59, 56, 69);
  row(69, 56, 59);
  row(61, 56, 58);
  col(56, 56, 61);

  col(56, 64, 80);
  row(81, 56, 58);
  row(81, 61, 63);
  col(64, 67, 81);

  // ── Koridor tengah L1: r67 c64–c136 (batas atas zona tengah) ─────────────
  // Di atas batas ini: food/retail (r43–r48)
  // Di bawah batas ini: nolabel, toilet, kantor (r68–r84)
  row(70, 64, 109);
  row(70, 111, 136);
  col(109, 66, 69);  // sisi kiri gap tangga1
  col(111, 66, 69);  // sisi kanan gap tangga1

  // ── Area lounge/koridor tengah: r68–r77 c136–c166 ────────────────────────
  col(136, 68, 71);
  row(72, 136, 166);
  col(166, 58, 71);

  // ── Kotak parkir/kantor area: r69–r80 c100–c131 ──────────────────────────
  // nolabel18 (l1_nl18): r72–r84 c117–c128
  row(72, 100, 105);
  row(72, 107, 131);
  row(84, 100, 131);
  col(100, 73, 84);
  col(131, 73, 84);

  // ── Dinding atas zona food/retail L1 (r43–r48) ───────────────────────────
  // Baris r43 = dinding atas semua toko di koridor utama L1
  row(49, 26, 36);
  col(37, 48, 50);
  row(43, 26, 54);   // dinding atas: food1 (c31–38), food2 (c39–42), lain2 (c43–47), lain3 (c48–51) promo1
  row(43, 59, 66);   // dinding atas: food3 (c62–65), nolabel7 (c66–69)
  row(43, 73, 78);   // dinding atas: promo2 (c75–76), food4 (c77–80)
  row(43, 89, 106);  // dinding atas: nolabel8 (c91), retail2 (c93–97), food5–7 (c98–107)
  row(43, 124, 140); // dinding atas: food8 (c124–129), food9 (c130–135), retail3 (c136–140)
  row(43, 154, 188); // dinding atas: food10–14 (c154–178), lain4 (c183–187), tl21 (c180–182)
  row(43, 192, 205); // dinding atas: food15 (c195–197), retail4 (c191–194), ret5 (c198–203)
  row(43, 207, 229); // dinding atas: nolabel9 (c206–208), food16–17 (c209–215), lain5 (c217–221), ret6 (c222–227)
  row(43, 233, 243); // dinding atas: food18 (c235–240)
  row(43, 244, 257); // dinding atas: tl7 (c241–247), tl8 (c248–251), lain6 (c253–256)
  row(43, 254, 252); // dinding atas: food19 (c258–259)
   // dinding kanan area food19/20 — sisi kiri kolom c261
  row(43, 263, 275); // dinding atas: food20–22 (c260–271), lain8–9 (c272–275), nolabel10 (c276)

  // ── Blok toilet5 (l1_tl5): r48–r51 c31–c38 ──────────────────────────────
  // + nolabel6 di bawahnya: r52–r54 c31–c38
  row(53, 47, 64);
  col(63, 48, 51);
  row(48, 47, 62);
  col(47, 48, 51);

  // ── Kotak area r71–r77 c68–c94 (kantor13–20, toilet2 bawah) ─────────────
  row(74, 68, 76);
  row(77, 77, 93);
  row(81, 68, 94);
  col(68, 74, 81);
  col(77, 74, 77);
  col(94, 74, 81);

  // ── Area kecil r48–r51 c89–c95 (toilet22, toilet23, nolabel37) ───────────
  row(49, 64, 66);
  row(48, 89, 95);
  row(51, 89, 98);
  col(89, 49, 50);
  col(95, 49, 50);

  // ── Sekat area food/nolabel c94–c136 r48–r60 ─────────────────────────────
  // food24 (c105–110), food25 (c123–127), food30 (c110–113)
  // musholla1 (c114–116), musholla2 (c117–119), tangga1 (c115–118)
  col(99, 48, 51);
  col(108, 53, 61);
  col(122, 50, 61);
  col(127,  50, 52);
  col(103,  50, 53);
  col(109,  50, 53);
  row(61, 94, 135);  // dinding bawah area food tengah
  col(94, 52, 60);
  col(135, 48, 60);

  col(94, 66, 66);
  col(138, 66, 66);
  row(66, 95, 109);
  row(66, 111, 137);
  row(68, 137, 138);
  col(94, 66, 69);

  col(64, 57, 66);

  // ── Dinding atas r48 zona kanan (setelah tangga) ─────────────────────────
  row(48, 137, 143); // nolabel23 (c136–139), nolabel24 (c140–143)
  row(48, 156, 185); // food27 (c159–163), food28 (c164–169), toilet9 (c170–172), toilet10 (c173–175), toilet11 (c173–175), tl6 (c168–170)
  row(48, 195, 229); // toilet12 (c195–200), food15, ret4, ret5, ret6, dll
  row(48, 241, 257); // toilet7 (c241–247), toilet8 (c248–251), lain6 (c253–256)
  row(48, 266, 279); // lift1 (c275–278), food29 (c279–284), retail15 (c285–288), nolabel10 (c276) fikri
  row(48, 285, 295);
  row(53, 106, 112); // sekat atas musholla1/2 bagian tengah
  row(53, 118, 124); // sekat atas tangga1 bagian tengah

  // ── nolabel25 (l1_nl25): r53–r54 c136–c142 ──────────────────────────────
  col(142, 49, 52);
  row(52, 137, 142);

  // ── Area lain11/lain12/toilet13/14 c165–c177 r58–r78 ────────────────────
  col(170, 58, 66);
  row(67, 170, 172);
  col(172, 68, 82);
  col(152, 73, 82);
  row(82, 153, 176);
  col(177, 58, 82);
  row(66, 171, 176);

  // ── Koridor tengah lanjutan r67 c138–c246 ────────────────────────────────
  row(67, 138, 165);
  row(70, 178, 243);

  // ── Koridor r67 c249–c263 (setelah gap musholla3) ────────────────────────
  // GAP di c264–c265 = pintu masuk musholla3 dari bawah (dibuka saat debug)
  row(70, 246, 267); // dinding c249–c263 (ada gap c264–c265 ke musholla3)
  row(69, 276, 295); // dinding c284–c295

  // ── Area toilet16 (l1_tl16): r56–r62 c242–c250 ──────────────────────────
  col(241, 55, 62);
  col(243, 64, 70);
  col(242, 71, 74);
  col(240, 75, 78);
  row(75, 240, 242);
  col(245, 70, 78);

  // ── Area toilet15 (l1_tl15): r49–r56 c250–c257 ──────────────────────────
  row(55, 241, 257);
  col(249, 49, 70);
  col(257, 43, 56);

  // ── Sekat internal area c198 (food/retail) ───────────────────────────────
  col(198, 48, 51);
  col(195, 62, 70);
  col(200, 65, 70);

  // ── Area musholla3 (l1_mus3): r49–r56 c262–c271 ─────────────────────────
  // Dinding kanan: col(269) dan col(273)
  // Dinding dalam: row(54, 266–282) — wall internal dalam room
  // Akses masuk: dari atas via gap r48 c262–c265
  col(261, 58, 84);  // dinding kanan dalam musholla3
  col(270, 65, 84);  // dinding kanan luar (lorong sempit c274–c282)
  row(58, 262, 268); // sekat bawah dalam musholla3
  row(84, 262, 270);


  row(54, 266, 270); // wall internal musholla3 — membagi ruang atas/bawah
  col(276, 54, 84);  // dinding kanan lorong c274–c282 toilet17
  row(84, 277, 279); 

  // ── Kotak-kotak kantor bawah L1 (r71–r79): ───────────────────────────────
  // kan41/42 area c187–c193 (musholla4 l1_mus4 ada di c189–c190)
  col(191, 74, 79);
  col(184, 74, 79);
  row(74, 186, 191);
  row(79, 184, 191);

  // kan43/46 area c199–c214
  col(199, 76, 79);
  col(214, 76, 79);
  row(76, 199, 214);
  row(79, 201, 214);

  // kan41/42 area c232–c238
  col(228, 76, 79);
  col(235, 76, 79);

  row(80, 228, 235);

  // nolabel32/33 area c254–c260
  col(249, 75, 80);
  col(255, 75, 80);
  row(75, 249, 255);
  row(80, 249, 255);

  // ── Sekat col c266 area r48–r53 (sisi kiri lift/musholla3) ──────────────
  col(266, 48, 53);

  // =========================================================================
  // LANTAI 2
  // =========================================================================

  // ── Batas atas & bawah lantai 2 ──────────────────────────────────────────
  row(0, 1, 300);    // dinding atas lantai 2
 // dinding bawah lantai 2 (batas gate)
  row(32, 1, 6);   // dinding bawah lantai 2 (batas gate)
  row(32, 8, 27)
  row(32, 29, 50)
  row(32, 52, 75)
  row(32, 77, 95)
  row(32, 97, 118)
  row(32, 120, 144)
  row(32, 146, 167)
  row(32, 169, 192)
  row(32, 194, 215)
  row(32, 217, 239)
  row(32, 241, 261)
  row(32, 263, 288)
  row(32, 290, 300)

  col(270, 32, 38)
  col(250, 32, 38)
  col(230, 32, 38)
  col(200, 32, 38)
  col(190, 32, 38)
  col(160, 32, 38)
  col(140, 32, 38)
  col(110, 32, 38)
  col(80, 32, 38)
  col(70, 32, 38)
  col(40, 32, 38)
  col(15, 32, 38)

  // ── Area pojok kiri atas L2: r10–r20 c1–c47 ─────────────────────────────
  // musholla1 L2 (l2_mus1): r23–r24 c9–c11
  // toilet1 L2 (l2_tl1): r23–r24 c12–c14
  row(20, 1, 47);
  col(47, 10, 20);
  row(10, 44, 47);
  col(44, 1, 10);

  // ── Lounge3 (l2_lo3): r26–r29 c11–c17 ───────────────────────────────────
  col(9, 24, 29);
  col(16, 24, 29);
  row(24, 6, 15);
  row(29, 6, 15);

  // ── Lounge4 (l2_lo4): r24–r29 c19–c26 ───────────────────────────────────
  col(18, 24, 29);
  col(25, 24, 29);
  row(24, 18, 24);
  row(29, 18, 24);

  // ── Lounge5 (l2_lo5): r24–r29 c33–c39 ───────────────────────────────────
  col(31, 24, 29);
  col(38, 24, 29);
  row(24, 32, 38);
  row(29, 31, 38);

  // ── Lounge6 (l2_lo6): r24–r29 c42–c48 ───────────────────────────────────
  col(40, 24, 29);
  col(47, 24, 29);
  row(24, 40, 46);
  row(29, 40, 46);

  // ── Lounge7 (l2_lo7): r24–r29 c55–c61 ───────────────────────────────────
  col(54, 24, 29);
  col(60, 24, 29);
  row(24, 54, 59);
  row(29, 54, 59);

  // ── Lounge8 (l2_lo8): r24–r29 c64–c70 ───────────────────────────────────
  col(62, 24, 29);
  col(68, 24, 29);
  row(24, 63, 68);
  row(29, 63, 68);

  // ── Lounge9 (l2_lo9): r24–r29 c79–c85 ───────────────────────────────────
  col(77, 24, 29);
  col(84, 24, 29);
  row(24, 77, 84);
  row(29, 77, 84);

  // ── Lounge10 (l2_lo10): r24–r29 c88–c94 ─────────────────────────────────
  col(86, 24, 29);
  col(93, 24, 29);
  row(24, 86, 93);
  row(29, 86, 93);

  // ── Lounge11 (l2_lo11): r24–r29 c100–c104 ───────────────────────────────
  col(98, 24, 29);
  col(104, 24, 29);
  row(24, 98, 104);
  row(29, 98, 104);

  // ── Lounge12 (l2_lo12): r24–r29 c108–c116 ───────────────────────────────
  col(107, 24, 29);
  col(116, 24, 29);
  row(24, 107, 116);
  row(29, 107, 116);

  // ── Lounge13 (l2_lo13): r24–r29 c124–c141 ───────────────────────────────
  col(123, 24, 29);
  col(141, 24, 29);
  row(24, 123, 141);
  row(29, 123, 141);

  // ── Lounge14 (l2_lo14): r24–r29 c153–c159 ───────────────────────────────
  col(153, 24, 29);
  col(160, 24, 29);
  row(24, 153, 160);
  row(29, 153, 160);

  // ── Lounge15 (l2_lo15): r24–r29 c162–c168 ───────────────────────────────
  col(162, 24, 29);
  col(169, 24, 29);
  row(24, 162, 169);
  row(29, 162, 169);

  // ── Lounge16 (l2_lo16): r24–r29 c176–c183 ───────────────────────────────
  col(176, 24, 29);
  col(183, 24, 29);
  row(24, 176, 183);
  row(29, 176, 183);

  // ── Lounge17 (l2_lo17): r24–r29 c184–c190 ───────────────────────────────
  col(185, 24, 29);
  col(192, 24, 29);
  row(24, 185, 192);
  row(29, 185, 192);

  // ── Retail12 (l2_ret12): r27–r30 c197–c216 ───────────────────────────────
  col(197, 24, 29);
  col(219, 27, 29);
  row(29, 197, 219);

  // ── Lounge18 (l2_lo18): r24–r29 c224–c230 ───────────────────────────────
  col(224, 24, 29);
  col(231, 24, 29);
  row(24, 224, 231);
  row(29, 224, 231);

  // ── Lounge19 (l2_lo19): r24–r29 c233–c239 ───────────────────────────────
  col(233, 24, 29);
  col(240, 24, 29);
  row(24, 233, 240);
  row(29, 233, 240);

  // ── Lounge20 (l2_lo20): r24–r29 c248–c257 ───────────────────────────────
  col(247, 24, 29);
  col(262, 24, 29);
  row(24, 247, 262);
  row(29, 247, 262);

  // ── Lounge21 (l2_lo21): r24–r29 c265–c271 ───────────────────────────────
  col(269, 24, 29);
  col(276, 24, 26);
  row(24, 269, 276);
  row(29, 269, 273);
  col(273, 27, 29);
  row(27, 273, 276);

  // ── Lounge22 (l2_lo22): r24–r29 c280–c284 ───────────────────────────────
  col(280, 24, 27);
  col(290, 24, 29);
  row(24, 280, 290);
  row(29, 283, 290);
  col(282, 27, 29);
  row(27, 280, 282);

  // ── Area tengah L2: r13–r20 c49–c107 ─────────────────────────────────────
  // food4–9 (l2_fnb4–9), retail1 (l2_ret1), nolabel1 (l2_nl1)
  // musholla5 (l2_mus5): r5–r7 c73–c76
  // toilet6 (l2_tl6): r5–r7 c77–c81
  // lounge1 (l2_lo1): r5–r8 c49–c64
  col(49, 17, 20);
  col(77, 16, 20);
  row(20, 49, 77);
  row(17, 49, 70);
  col(70, 17, 18);
  row(18, 70, 74);
  col(74, 16, 18);
  row(16, 74, 77);

  // ── Area r13–r20 c79–c107 ─────────────────────────────────────────────────
  // food8–9 (l2_fnb8–9), retail2–3 (l2_ret2–3)
  col(79, 13, 20);
  col(107, 17, 20);
  row(20, 80, 107);
  row(17, 82, 107);
  col(82, 13, 16);
  row(13, 79, 82);

  // ── Area r11–r20 c120–c138 (tangga3 l2_ld3) ─────────────────────────────
  col(120, 11, 20);
  col(138, 11, 20);
  row(11, 120, 125);
  row(11, 130, 138);
  row(20, 120, 138);

  // ── Area r11–r20 c147–c150 ───────────────────────────────────────────────
  col(147, 11, 20);
  col(150, 11, 20);
  row(11, 147, 150);
  row(20, 147, 150);

  // ── Area r11–r20 c152–c170 ───────────────────────────────────────────────
  // lounge2 (l2_lo2): r6–r9 c147–c164
  // musholla4 (l2_mus4): r6–r7 c167–c169
  // toilet8 (l2_tl8): r6–r7 c170–c172
  col(152, 11, 20);
  col(170, 17, 20);
  row(20, 153, 170);
  row(17, 155, 170);
  col(155, 11, 17);

  // ── Area r13–r20 c170–c180 ───────────────────────────────────────────────
  // kan8–10, kan14–15 (kantor L2 area kiri)
  col(170, 11, 20);
  col(180, 13, 20);
  row(13, 170, 180);
  row(20, 170, 176);
  row(11, 152, 170);

  // ── Area r17–r20 c183–c201 ───────────────────────────────────────────────
  // retail7–9 (l2_ret7–9), lain1 (l2_ll1)
  col(183, 17, 20);
  col(201, 17, 20);
  row(17, 183, 201);
  row(20, 183, 201);

  // ── Area r20–r23 c204–c217 ───────────────────────────────────────────────
  // tangga4 (l2_ld4), lain2–3 (l2_ll2–3)
  row(20, 204, 208);
  col(208, 20, 23);
  row(20, 217, 271);  // dinding bawah area tengah L2 c217–c271

  // ── Area r17–r20 c228–c267 ───────────────────────────────────────────────
  // toilet4 (l2_tl4): r17–r20 c239–c242
  // food18–21 (l2_fnb18–21)
  // lain4 (l2_ll4): r17–r20 c254–c255
  // musholla2 (l2_mus2): r8–r20 c264–c266
  col(228, 17, 20);
  row(17, 228, 243);
  col(243, 11, 17);
  row(11, 243, 252);
  col(252, 11, 16);
  row(16, 252, 267);
  col(267, 9, 16);
  row(9, 267, 271);

  // ── Area kanan atas L2: r7–r20 c271–c300 ────────────────────────────────
  // toilet5 (l2_tl5): r15–r20 c282–c285
  // nolabel3 (l2_nl3): r15–r20 c278–c281
  // food22 (l2_fnb22): r21–r25 c289–c293
  row(20, 279, 300);
  col(271, 9, 20);
  col(279, 7, 20);

  // ── Sekat vertikal area tengah L2 c204 dan c217 ──────────────────────────
  col(217, 20, 23);
  col(204, 7, 20);

  // ── Dinding horizontal area atas L2 (r7–r10) ─────────────────────────────
  // kan1–7 (kantor L2 area c100–c113)
  // musholla3 L2 (l2_mus3): r5–r7 c84–c99
  // toilet7 (l2_tl7): r5–r7 c109–c110
  row(10, 47, 75);
  row(10, 77, 107);
  row(10, 109, 112);

  // ── Sekat internal area L2 c72–c79 ───────────────────────────────────────
  col(72, 10, 16);
  col(77, 10, 13);
  col(79, 10, 13);
  row(16, 70, 71);
  col(112, 7, 10);
  row(7, 44, 112);   // dinding atas area kantor/musholla L2 c44–c112
  col(99, 7, 10);

  // ── Sekat vertikal area kantor L2 c49 dan c107–c109 ──────────────────────
  col(49, 10, 20);
  col(109, 10, 20);
  col(107, 10, 20);

  // ── Dinding area kantor L2 kanan (c147–c228) ─────────────────────────────
  // kan8–16 (kantor L2 area c167–c205)
  // LoungeVVIP (l2_df1): r6–r10 c194–c199
  // tangga5–7 (l2_ld5–7)
  col(147, 7, 10);
  row(7, 147, 300);  // dinding atas area kantor kanan L2
  col(167, 7, 10);
  col(201, 7, 16);
  col(183, 10, 16);
  row(10, 183, 201);

  // ── Area tangga5–6 dan sekat L2 c210–c228 ────────────────────────────────
  col(228, 7, 16);
  col(210, 12, 16);
  row(12, 210, 218);
  row(16, 208, 210);
  col(250, 7, 10);

  // ── Dinding kiri L2 area bawah (r24–r25 c1–c5) ───────────────────────────
  row(24, 1, 5);

  // ── Separator vertikal antar lounge L2 (col pendek r30–r31) ─────────────
  // Sekat kecil antara lounge3–22, satu per pasang lounge
  col(20, 30, 31);   // antara lounge3 dan lounge4
  col(44, 30, 31);   // antara lounge4 dan lounge5
  col(68, 30, 31);   // antara lounge5/6 dan lounge7
  col(92, 30, 31);   // antara lounge7/8 dan lounge9
  col(116, 30, 31);  // antara lounge9/10 dan lounge11
  col(140, 30, 31);  // antara lounge11/12 dan lounge13
  col(164, 30, 31);  // antara lounge13 dan lounge14
  col(188, 30, 31);  // antara lounge14/15 dan lounge16
  col(212, 30, 31);  // antara lounge16/17 dan retail12
  col(236, 30, 31);  // antara retail12 dan lounge18
  col(260, 30, 31);  // antara lounge18/19 dan lounge20
  col(284, 30, 31);  // antara lounge20/21 dan lounge22

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