import type { DestinationPoint, WallDataJson } from "@/types";
import t1Json from "@/data/map/T1_gabungan.json";

export const COLS = 300;
export const ROWS = 100;
export const START_R = 90;
export const START_C = 183;

export const FLOOR1_ROW_MIN = 38;
export const FLOOR1_ROW_MAX = 90;
export const FLOOR2_ROW_MIN = 0;
export const FLOOR2_ROW_MAX = 32;

export const STAIRCASE_L1: DestinationPoint = {
  id: "l1_ld1", label: "tangga1", r: 84, c: 185, color: "#B1B1B1",
};
export const STAIRCASE_L2: DestinationPoint = {
  id: "l2_ld3", label: "tangga3", r: 26, c: 172, color: "#B1B1B1",
};

function buildWalls(): string[] {
  const wallSet = new Set<string>();

  const W = (r: number, c: number): void => {
    if (r >= 36) c += 1; // Lantai 1: geser kanan 4 poin, lalu kiri 3 poin (net +1)
    c -= 1; // geser semua walls (semua lantai) ke kiri 1 poin
    wallSet.add(`${r + 1},${c}`); // geser semua walls ke bawah 1 poin
  };
  const row = (r: number, c1: number, c2: number): void => { for (let c = c1; c <= c2; c++) W(r, c); };
  const col = (c: number, r1: number, r2: number): void => { for (let r = r1; r <= r2; r++) W(r, c); };
  const box = (r1: number, c1: number, r2: number, c2: number): void => {
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) W(r, c);
  };
  void box;

  row(0, 0, COLS - 1);
  row(ROWS - 1, 0, COLS - 1);
  col(0, 0, ROWS - 1);
  col(COLS - 1, 0, ROWS - 1);

  row(98, 4, 293);  // tenant: retail_new
  row(45, 4, 293);
  col(294, 45, 97);  // tenant: arrival1
  col(4, 45, 97);

  col(279, 96, 98);  // tenant: retail_new
  row(91, 273, 278);  // tenant: food1, retail_new
  col(273, 67, 90);  // tenant: toilet5, food1
  row(67, 245, 293);

  row(62, 249, 267);
  row(54, 249, 265);  // tenant: kantor2, kantor3
  col(267, 54, 61);  // tenant: kantor2, toilet1
  col(249, 54, 61);

  col(240, 70, 72);  // tenant: toilet3, nolabel2
  row(71, 241, 243);  // tenant: kan_new, toilet3
  col(240, 68, 79);  // tenant: toilet2, toilet3
  row(68, 240, 243);  // tenant: toilet2, nolabel2
  row(74, 241, 243);
  col(243, 74, 79);  // tenant: toilet3, nolabel3

  col(243, 55, 71);  // tenant: toilet2, kan_new
  row(54, 241, 243);
  row(54, 236, 238);
  col(235, 54, 70);

  row(67, 190, 235);  // tenant: nolabel14
  row(67, 163, 188);
  col(190, 68, 71);  // tenant: nolabel14
  col(188, 68, 71);

  col(163, 64, 69);  // tenant: nolabel21
  row(64, 133, 163);
  col(133, 64, 77);  // tenant: lain11

  row(64, 194, 199);  // tenant: kantor29, kantor32
  row(64, 168, 192);  // tenant: kantor29, kantor30
  row(51, 168, 199);  // tenant: kantor33, kantor36
  col(199, 51, 63);
  col(168, 51, 63);

  row(86, 263, 273);  // tenant: toilet5
  col(262, 85, 87);
  row(92, 245, 273);  // tenant: lain2, lain3
  row(92, 233, 240);  // tenant: food3, nolabel7
  row(92, 221, 226);  // tenant: food4, promo2
  row(92, 193, 210);  // tenant: retail2, food5
  row(92, 159, 175);  // tenant: retail3, food8
  row(92, 111, 145);  // tenant: lain4, toilet6
  row(92, 94, 107);  // tenant: retail4, retail5
  row(92, 70, 92);  // tenant: lain5, retail6
  row(92, 56, 66);  // tenant: toilet7, toilet8
  row(92, 42, 55);  // tenant: lain6, toilet7
  row(92, 24, 36);  // tenant: lain8, lain9

  row(82, 236, 250);  // tenant: kantor5, kantor6
  col(234, 82, 87);
  row(87, 234, 250);  // tenant: lain1, toilet4
  col(250, 84, 87);  // tenant: kantor8, kantor10

  row(61, 222, 230);  // tenant: kantor13, kantor14
  row(58, 206, 221);  // tenant: kantor16, kanto17
  row(54, 204, 230);  // tenant: kantor13, kantor14
  col(230, 54, 61);  // tenant: kantor13, kantor14
  col(221, 58, 61);  // tenant: kantor16, kanto17
  col(203, 54, 61);

  row(86, 230, 233);
  row(87, 204, 210);  // tenant: toilet22, nolabel37
  row(84, 201, 210);  // tenant: toilet22, toilet23
  col(210, 85, 86);  // tenant: toilet22, toilet23
  col(204, 85, 86);

  col(200, 84, 87);
  col(191, 75, 82);  // tenant: food30
  col(177, 75, 86);
  col(172, 83, 86);
  col(196, 82, 86);  // tenant: food24
  col(190, 82, 86);  // tenant: food30, promo3
  row(75, 164, 205);  // tenant: lain10, musholla1
  col(205, 75, 83);
  col(164, 75, 87);  // tenant: nolabel22, nolabel23

  col(205, 71, 71);
  col(161, 71, 71);
  row(71, 190, 204);  // tenant: nolabel14, nolabel15
  row(71, 162, 188);  // tenant: nolabel16, nolabel17
  row(69, 161, 162);
  col(205, 68, 71);

  col(235, 71, 78);

  row(87, 156, 164);  // tenant: nolabel23, nolabel24
  row(87, 114, 143);  // tenant: toilet9, toilet10
  row(87, 70, 104);  // tenant: toilet12
  row(87, 42, 58);  // tenant: toilet15, musholla3
  row(87, 20, 33);  // tenant: musholla3, food29
  row(87, 4, 20);  // tenant: food29, retail15
  row(82, 187, 193);  // tenant: food30, tangga1
  row(82, 175, 181);  // tenant: lain10, food26

  col(157, 83, 86);
  row(83, 157, 162);  // tenant: nolabel24, nolabel25

  col(129, 71, 77);  // tenant: lain12
  row(70, 127, 129);  // tenant: lain12
  col(127, 53, 69);  // tenant: lain12
  col(147, 53, 63);
  row(53, 123, 146);  // tenant: kantor21, kantor22
  col(122, 53, 77);
  row(71, 123, 128);  // tenant: lain12

  row(70, 134, 161);  // tenant: lain11, toilet13
  row(67, 56, 121);  // tenant: nolabel27, nolabel28

  row(67, 32, 53);
  row(68, 4, 23);

  col(58, 73, 80);
  col(56, 67, 71);
  col(57, 61, 66);  // tenant: nolabel30
  col(59, 57, 60);  // tenant: nolabel31
  row(60, 57, 59);
  col(54, 57, 67);  // tenant: nolabel30, nolabel32

  row(80, 42, 58);  // tenant: toilet15, toilet16
  col(50, 67, 86);
  col(42, 79, 92);  // tenant: musholla3, food19

  col(101, 84, 87);
  col(104, 67, 73);  // tenant: nolabel28
  col(99, 67, 72);

  col(38, 51, 77);  // tenant: nolabel36
  col(29, 51, 72);
  row(77, 31, 37);
  row(51, 29, 37);
  row(81, 24, 36);
  col(23, 51, 86);  // tenant: toilet17
  row(51, 20, 22);  // tenant: toilet17

  col(108, 56, 61);
  col(115, 56, 61);  // tenant: musholla4, nolabel35
  row(61, 108, 113);  // tenant: toilet20, musholla4
  row(56, 108, 115);  // tenant: toilet20, musholla4

  col(100, 56, 59);  // tenant: kantor46
  col(85, 56, 59);
  row(59, 85, 100);  // tenant: kantor43, kantor44
  row(56, 85, 98);

  col(71, 56, 59);  // tenant: kantor41, kantor42
  col(64, 56, 59);
  row(55, 64, 71);  // tenant: kantor41, kantor42

  col(50, 55, 60);  // tenant: nolabel32, nolabel33
  col(44, 55, 60);
  row(60, 44, 50);  // tenant: nolabel32, nolabel33
  row(55, 44, 50);  // tenant: nolabel32, nolabel33

  col(38, 82, 87);
  row(87, 30, 38);  // tenant: musholla3

  row(35, 0, 298);
  row(3, 293, 298);  // tenant: gate1
  row(3, 272, 291);  // tenant: gate2
  row(3, 249, 270);  // tenant: gate2, gate3
  row(3, 224, 247);  // tenant: gate3, gate4
  row(3, 204, 222);  // tenant: gate5
  row(3, 181, 202);  // tenant: gate5, gate6
  row(3, 155, 179);  // tenant: gate6, gate7
  row(3, 132, 153);  // tenant: gate7, gate8
  row(3, 107, 130);  // tenant: gate8, gate9
  row(3, 84, 105);  // tenant: gate9, gate10
  row(3, 60, 82);  // tenant: gate10, gate11
  row(3, 38, 58);  // tenant: gate11, gate12
  row(3, 11, 36);  // tenant: gate12, gate13
  row(3, 0, 9);  // tenant: gate13

  col(29, 0, 3);
  col(29, 97, 99);
  col(49, 0, 3);
  col(49, 97, 99);
  col(69, 0, 3);
  col(69, 97, 99);
  col(99, 0, 3);
  col(99, 97, 99);
  col(109, 0, 3);  // tenant: gate9
  col(109, 97, 99);
  col(139, 0, 3);
  col(139, 97, 99);
  col(159, 0, 3);  // tenant: gate7
  col(159, 97, 99);
  col(189, 0, 3);
  col(189, 97, 99);
  col(219, 0, 3);
  col(219, 97, 99);
  col(229, 0, 3);  // tenant: gate4
  col(229, 97, 99);
  col(259, 0, 3);
  col(259, 97, 99);
  col(284, 0, 3);
  col(284, 97, 99);

  row(15, 252, 298);  // tenant: food1
  col(252, 15, 23);  // tenant: nolabel4
  row(25, 252, 255);  // tenant: nolabel4
  col(255, 25, 34);  // tenant: nolabel4

  col(290, 6, 11);  // tenant: toilet1
  col(283, 6, 11);  // tenant: lounge4
  row(11, 284, 293);  // tenant: toilet1, musholla1
  row(6, 284, 293);  // tenant: lounge3

  col(281, 6, 11);
  col(274, 6, 11);  // tenant: food2
  row(11, 275, 281);  // tenant: food2, lounge4
  row(6, 275, 281);  // tenant: lounge4

  col(268, 6, 11);
  col(261, 6, 11);  // tenant: lounge6
  row(11, 261, 267);  // tenant: lounge5, lounge6
  row(6, 261, 268);  // tenant: lounge5, lounge6

  col(259, 6, 11);
  col(252, 6, 11);  // tenant: food3
  row(11, 253, 259);  // tenant: food3, lounge6
  row(6, 253, 259);  // tenant: lounge6

  col(245, 6, 11);
  col(239, 6, 11);  // tenant: lounge8
  row(11, 240, 245);  // tenant: lounge7
  row(6, 240, 245);  // tenant: lounge7

  col(237, 6, 11);
  col(231, 6, 11);  // tenant: lounge8
  row(11, 231, 236);  // tenant: lounge8
  row(6, 231, 236);  // tenant: lounge8

  col(222, 6, 11);  // tenant: lounge9
  col(215, 6, 11);  // tenant: lounge9, lounge10
  row(11, 215, 222);  // tenant: lounge9, lounge10
  row(6, 215, 222);  // tenant: lounge9, lounge10

  col(213, 6, 11);
  col(206, 6, 11);  // tenant: promo1
  row(11, 206, 213);  // tenant: lounge10, promo1
  row(6, 206, 213);  // tenant: lounge10

  col(201, 6, 11);
  col(195, 6, 11);  // tenant: lounge12
  row(11, 195, 201);  // tenant: lounge11, lounge12
  row(6, 195, 201);  // tenant: lounge11, lounge12

  col(192, 6, 11);
  col(183, 6, 11);  // tenant: promo2
  row(11, 183, 192);  // tenant: lounge12, promo2
  row(6, 183, 192);  // tenant: lounge12

  col(176, 6, 11);
  col(158, 6, 11);
  row(11, 158, 176);  // tenant: lounge13
  row(6, 158, 176);  // tenant: lounge13

  col(146, 6, 11);
  col(139, 6, 11);  // tenant: lounge15
  row(11, 139, 146);  // tenant: lounge14, lounge15
  row(6, 139, 146);  // tenant: lounge14, lounge15

  col(137, 6, 11);
  col(130, 6, 11);
  row(11, 130, 137);  // tenant: lounge15
  row(6, 130, 137);  // tenant: lounge15

  col(123, 6, 11);
  col(116, 6, 11);  // tenant: lounge17
  row(11, 116, 123);  // tenant: lounge16, lounge17
  row(6, 116, 123);  // tenant: lounge16, lounge17

  col(114, 6, 11);
  col(107, 6, 11);
  row(11, 107, 114);  // tenant: lounge17
  row(6, 107, 114);  // tenant: lounge17

  col(102, 6, 11);  // tenant: promo3
  col(80, 6, 8);
  row(6, 80, 102);  // tenant: retail12

  col(75, 6, 11);
  col(68, 6, 11);  // tenant: lounge19
  row(11, 68, 75);  // tenant: lounge18, lounge19
  row(6, 68, 75);  // tenant: lounge18, lounge19

  col(66, 6, 11);
  col(59, 6, 11);
  row(11, 59, 66);  // tenant: lounge19
  row(6, 59, 66);  // tenant: lounge19

  col(52, 6, 11);
  col(37, 6, 11);
  row(11, 37, 52);  // tenant: lounge20
  row(6, 37, 52);  // tenant: lounge20

  col(30, 6, 11);
  col(23, 9, 11);  // tenant: lounge22
  row(11, 23, 30);  // tenant: lounge21, lounge22
  row(6, 26, 30);  // tenant: lounge21
  col(26, 6, 8);  // tenant: lounge21
  row(8, 23, 26);

  col(19, 8, 11);
  col(9, 6, 11);  // tenant: food22
  row(11, 9, 19);  // tenant: food22, lounge22
  row(6, 9, 16);  // tenant: lounge22
  col(17, 6, 8);
  row(8, 17, 19);

  col(250, 15, 18);  // tenant: nolabel1
  col(222, 15, 19);  // tenant: food7, food8
  row(15, 222, 223);  // tenant: food7, food8
  row(15, 225, 229);  // tenant: food6, food7
  row(15, 231, 232);  // tenant: food6
  row(15, 234, 237);  // tenant: food4, food5
  row(15, 239, 241);  // tenant: food4
  row(15, 243, 245);  // tenant: retail1, food4
  row(15, 247, 250);  // tenant: nolabel1

  col(225, 15, 18);  // tenant: food7
  col(231, 15, 18);  // tenant: food6
  col(234, 15, 18);  // tenant: food5, food6
  col(239, 15, 18);  // tenant: food4
  col(243, 15, 18);  // tenant: retail1, food4

  row(19, 229, 250);  // tenant: retail1, food4
  col(229, 17, 18);  // tenant: food6, food7
  row(17, 225, 229);  // tenant: food6, food7
  col(225, 17, 19);  // tenant: food7
  row(19, 222, 225);  // tenant: food7, food8

  col(220, 15, 22);  // tenant: food8
  col(192, 15, 18);
  row(15, 192, 193);  // tenant: toilet2
  row(15, 195, 196);  // tenant: toilet2
  row(15, 198, 200);  // tenant: toilet2, retail4
  row(15, 202, 202);  // tenant: retail3
  row(15, 205, 207);  // tenant: retail2, food10
  row(15, 209, 215);  // tenant: retail2, food9
  row(15, 217, 217);  // tenant: food9
  row(15, 219, 219);  // tenant: food8, food9

  col(195, 15, 18);
  col(198, 15, 18);  // tenant: toilet2, retail4
  col(202, 15, 18);  // tenant: retail3
  col(205, 15, 18);  // tenant: food10, food11
  col(209, 15, 18);
  col(217, 15, 18);

  row(19, 192, 217);  // tenant: toilet2, retail2
  col(217, 19, 22);
  row(22, 217, 220);

  col(179, 15, 24);  // tenant: retail5, food12
  col(161, 15, 24);
  row(24, 174, 179);
  row(24, 161, 169);
  row(15, 161, 164);  // tenant: nolabel5
  row(15, 166, 171);  // tenant: food12, nolabel5
  row(15, 173, 177);  // tenant: food12
  row(15, 179, 179);  // tenant: retail5, food12

  col(169, 15, 24);  // tenant: nolabel5, tangga3
  col(174, 15, 24);
  row(19, 169, 174);  // tenant: tangga3

  col(152, 15, 24);  // tenant: retail6
  col(149, 15, 24);  // tenant: retail6, nolabel2
  row(24, 149, 152);
  row(15, 149, 150);  // tenant: retail6, nolabel2
  row(15, 152, 152);  // tenant: retail6

  col(147, 15, 24);
  col(129, 15, 18);  // tenant: food17
  row(15, 129, 130);  // tenant: food16, food17
  row(15, 132, 134);  // tenant: food16
  row(15, 136, 137);  // tenant: food15
  row(15, 139, 141);  // tenant: food13, food14
  row(15, 143, 144);  // tenant: food13, nolabel2
  row(15, 146, 146);  // tenant: nolabel2

  col(132, 15, 18);  // tenant: food16
  col(136, 15, 18);  // tenant: food15
  col(139, 15, 18);  // tenant: food14, food15
  col(143, 15, 18);  // tenant: food13

  row(19, 129, 144);  // tenant: food13, food14
  col(144, 18, 24);  // tenant: food13, nolabel2

  col(129, 15, 24);  // tenant: food17
  col(119, 15, 22);  // tenant: lain1
  row(22, 119, 129);
  row(15, 123, 129);  // tenant: food17
  row(24, 129, 147);  // tenant: food17

  col(116, 15, 18);  // tenant: retail7
  col(98, 15, 18);  // tenant: lain2, retail10
  row(19, 98, 116);  // tenant: toilet3, retail7
  row(15, 98, 100);  // tenant: lain2, toilet3
  row(15, 102, 104);  // tenant: toilet3, retail9
  row(15, 106, 108);  // tenant: retail8, retail9
  row(15, 110, 112);  // tenant: retail8
  row(15, 114, 114);  // tenant: retail7
  row(15, 116, 116);  // tenant: retail7

  col(102, 15, 18);  // tenant: toilet3
  col(107, 15, 18);  // tenant: retail9
  col(110, 15, 18);  // tenant: retail8
  col(114, 15, 18);  // tenant: retail7

  row(15, 91, 95);  // tenant: retail10
  col(91, 12, 15);
  row(15, 28, 31);  // tenant: musholla2
  row(15, 33, 36);  // tenant: musholla2, nolabel11
  row(15, 38, 41);  // tenant: nolabel11
  row(15, 43, 44);  // tenant: lain4, nolabel11
  row(15, 46, 50);  // tenant: food20, food21
  row(15, 52, 59);  // tenant: toilet4, food19
  row(15, 61, 63);  // tenant: food19
  row(15, 65, 68);  // tenant: retail14, food18
  row(15, 70, 75);  // tenant: retail13, food18
  row(15, 77, 78);  // tenant: retail13
  row(15, 80, 82);  // tenant: lain3, retail11
  row(18, 72, 80);  // tenant: retail13, food18

  col(33, 15, 18);  // tenant: musholla2
  col(39, 15, 18);
  col(44, 15, 18);  // tenant: lain4
  col(47, 15, 18);
  col(53, 15, 24);
  col(58, 15, 18);  // tenant: toilet4
  col(62, 15, 18);
  col(65, 15, 18);  // tenant: retail14, food19
  col(78, 15, 18);  // tenant: retail13
  col(80, 15, 18);  // tenant: lain3, retail13

  col(71, 15, 18);
  row(19, 56, 71);  // tenant: toilet4, retail14
  col(56, 18, 24);  // tenant: toilet4, food20
  row(24, 47, 56);
  col(47, 19, 24);
  row(19, 32, 47);  // tenant: lain4, food21
  col(32, 19, 26);  // tenant: musholla2
  row(26, 28, 32);  // tenant: musholla2

  row(15, 0, 13);  // tenant: toilet5, food22
  row(15, 15, 16);  // tenant: toilet5, nolabel3
  row(15, 18, 20);  // tenant: nolabel3
  col(16, 15, 31);  // tenant: toilet5, nolabel3
  col(28, 15, 26);
  col(20, 15, 31);  // tenant: nolabel3

  col(82, 12, 15);  // tenant: lain3, retail11
  col(95, 15, 31);  // tenant: kantor16, retail10

  row(25, 224, 252);  // tenant: nolabel4, nolabel12
  row(25, 192, 222);  // tenant: kantor4, kantor5
  row(25, 187, 190);  // tenant: kantor7, tangga2

  col(227, 19, 25);
  col(222, 22, 25);  // tenant: nolabel12
  col(220, 22, 25);
  row(19, 228, 229);  // tenant: food6
  col(187, 25, 31);
  row(31, 187, 255);  // tenant: kantor1, kantor2
  col(200, 25, 31);  // tenant: kantor1, kantor4

  col(250, 15, 25);  // tenant: nolabel1, nolabel4
  col(190, 15, 25);  // tenant: kantor7, tangga2
  col(192, 15, 25);  // tenant: kantor7

  col(152, 25, 31);  // tenant: lounge2
  row(31, 0, 152);
  col(132, 25, 31);  // tenant: kantor15, musholla4
  col(98, 19, 31);  // tenant: kantor16, toilet9
  col(116, 19, 25);  // tenant: kantor13, retail7
  row(25, 98, 116);  // tenant: kantor11, kantor12

  col(71, 19, 31);
  col(89, 19, 23);
  row(23, 81, 89);
  row(19, 89, 91);
  col(49, 25, 29);  // tenant: tangga7

  row(11, 294, 298);  // tenant: musholla1

  col(279, 4, 5);
  col(255, 4, 5);
  col(231, 4, 5);  // tenant: lounge8
  col(207, 4, 5);  // tenant: gate5, lounge10
  col(183, 4, 5);  // tenant: gate6
  col(159, 4, 5);  // tenant: gate7
  col(135, 4, 5);
  col(111, 4, 5);
  col(87, 4, 5);
  col(63, 4, 5);
  col(39, 4, 5);
  col(15, 4, 5);

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