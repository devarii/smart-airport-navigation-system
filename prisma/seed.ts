// Script untuk isi data awal
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";
import { T1_WALL_DATA, ROWS as T1_ROWS, COLS as T1_COLS, START_R as T1_START_R, START_C as T1_START_C } from "@/data/walls/t1";
import { T2_WALL_DATA, ROWS as T2_ROWS, COLS as T2_COLS, START_R as T2_START_R, START_C as T2_START_C } from "@/data/walls/t2";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// =============================================================================
// CATEGORIES
// =============================================================================

const CATEGORIES = [
  { name: "Food & Beverages", icon: "🍽",  color: "#E8913B" },
  { name: "Retail",           icon: "🛍",  color: "#72A86A" },
  { name: "Services",         icon: "🔧",  color: "#6A86A8" },
  { name: "Check-in",         icon: "✅",  color: "#9070C0" },
  { name: "Musholla",         icon: "🕌",  color: "#3A8E62" },
  { name: "Toilet & Nursery", icon: "🚻",  color: "#4A72A0" },
  { name: "Medical",          icon: "🏥",  color: "#A05050" },
  { name: "Gate",             icon: "🛫",  color: "#3B6FE8" },
  { name: "Informasi",        icon: "ℹ️",  color: "#A8823B" },
  { name: "Lounge",           icon: "🛋️",  color: "#A77432" },
] as const;

// =============================================================================
// FLOORS
// =============================================================================

const FLOORS = [
  {
    terminal: "T1", floorNumber: 1, label: "Terminal 1 - Lantai 1",
    gridRows: T1_ROWS, gridCols: T1_COLS,
    startRow: T1_START_R, startCol: T1_START_C,
    wallData: T1_WALL_DATA as unknown as Prisma.InputJsonValue,
  },
  {
    terminal: "T1", floorNumber: 2, label: "Terminal 1 - Lantai 2",
    gridRows: T1_ROWS, gridCols: T1_COLS,
    startRow: T1_START_R, startCol: T1_START_C,
    wallData: T1_WALL_DATA as unknown as Prisma.InputJsonValue,
  },
  {
    terminal: "T2", floorNumber: 1, label: "Terminal 2 - Lantai 1",
    gridRows: T2_ROWS, gridCols: T2_COLS,
    startRow: T2_START_R, startCol: T2_START_C,
    wallData: T2_WALL_DATA as unknown as Prisma.InputJsonValue,
  },
  {
    terminal: "T2", floorNumber: 2, label: "Terminal 2 - Lantai 2",
    gridRows: T2_ROWS, gridCols: T2_COLS,
    startRow: T2_START_R, startCol: T2_START_C,
    wallData: T2_WALL_DATA as unknown as Prisma.InputJsonValue,
  },
] as const;

// =============================================================================
// FACILITIES
// Semua fasilitas dipetakan langsung dari DESTINATIONS di t1.ts dan t2.ts.
// Nama masih generic (Food & Bev 1, Toilet 1, dst) — ganti dengan nama real
// setelah survei lapangan selesai. gridRow/gridCol sudah sesuai koordinat grid.
// =============================================================================

type FloorKey = "T1-L1" | "T1-L2" | "T2-L1" | "T2-L2";
type CategoryName = (typeof CATEGORIES)[number]["name"];

interface FacilitySeedData {
  name: string;
  code: string;
  description: string | null;
  categoryName: CategoryName;
  floorKey: FloorKey;
  isActive: boolean;
  gridRow: number | null;
  gridCol: number | null;
}

const FACILITIES: FacilitySeedData[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // TERMINAL 1 — LANTAI 1
  // ══════════════════════════════════════════════════════════════════════════

  // ── Food & Beverages ──────────────────────────────────────────────────────
  { name: "Food & Bev T1-L1 #1",  code: "T1L1-FB-01", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 35  },
  { name: "Food & Bev T1-L1 #2",  code: "T1L1-FB-02", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 39  },
  { name: "Food & Bev T1-L1 #3",  code: "T1L1-FB-03", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 59  },
  { name: "Food & Bev T1-L1 #4",  code: "T1L1-FB-04", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 78  },
  { name: "Food & Bev T1-L1 #5",  code: "T1L1-FB-05", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 97  },
  { name: "Food & Bev T1-L1 #6",  code: "T1L1-FB-06", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 101 },
  { name: "Food & Bev T1-L1 #7",  code: "T1L1-FB-07", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 106 },
  { name: "Food & Bev T1-L1 #8",  code: "T1L1-FB-08", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 124 },
  { name: "Food & Bev T1-L1 #9",  code: "T1L1-FB-09", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 131 },
  { name: "Food & Bev T1-L1 #10", code: "T1L1-FB-10", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 154 },
  { name: "Food & Bev T1-L1 #11", code: "T1L1-FB-11", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 161 },
  { name: "Food & Bev T1-L1 #12", code: "T1L1-FB-12", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 164 },
  { name: "Food & Bev T1-L1 #13", code: "T1L1-FB-13", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 167 },
  { name: "Food & Bev T1-L1 #14", code: "T1L1-FB-14", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 176 },
  { name: "Food & Bev T1-L1 #15", code: "T1L1-FB-15", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 198 },
  { name: "Food & Bev T1-L1 #16", code: "T1L1-FB-16", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 212 },
  { name: "Food & Bev T1-L1 #17", code: "T1L1-FB-17", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 218 },
  { name: "Food & Bev T1-L1 #18", code: "T1L1-FB-18", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 241 },
  { name: "Food & Bev T1-L1 #19", code: "T1L1-FB-19", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 263 },
  { name: "Food & Bev T1-L1 #20", code: "T1L1-FB-20", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 267 },
  { name: "Food & Bev T1-L1 #21", code: "T1L1-FB-21", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 271 },
  { name: "Food & Bev T1-L1 #22", code: "T1L1-FB-22", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 275 },
  { name: "Food & Bev T1-L1 #23", code: "T1L1-FB-23", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 50, gridCol: 64  },
  { name: "Food & Bev T1-L1 #24", code: "T1L1-FB-24", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 49, gridCol: 109 },
  { name: "Food & Bev T1-L1 #25", code: "T1L1-FB-25", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 49, gridCol: 122 },
  { name: "Food & Bev T1-L1 #26", code: "T1L1-FB-26", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 52, gridCol: 121 },
  { name: "Food & Bev T1-L1 #27", code: "T1L1-FB-27", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 50, gridCol: 161 },
  { name: "Food & Bev T1-L1 #28", code: "T1L1-FB-28", description: null, categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true, gridRow: 50, gridCol: 165 },

  // ── Retail ────────────────────────────────────────────────────────────────
  { name: "Retail T1-L1 #1", code: "T1L1-RT-01", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 48  },
  { name: "Retail T1-L1 #2", code: "T1L1-RT-02", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 93  },
  { name: "Retail T1-L1 #3", code: "T1L1-RT-03", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 140 },
  { name: "Retail T1-L1 #4", code: "T1L1-RT-04", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 193 },
  { name: "Retail T1-L1 #5", code: "T1L1-RT-05", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 203 },
  { name: "Retail T1-L1 #6", code: "T1L1-RT-06", description: null, categoryName: "Retail", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 229 },

  // ── Toilet & Nursery ──────────────────────────────────────────────────────
  { name: "Toilet T1-L1 #1",  code: "T1L1-TL-01", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 72, gridCol: 31  },
  { name: "Toilet T1-L1 #2",  code: "T1L1-TL-02", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 68, gridCol: 60  },
  { name: "Toilet T1-L1 #3",  code: "T1L1-TL-03", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 55, gridCol: 58  },
  { name: "Toilet T1-L1 #4",  code: "T1L1-TL-04", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 56  },
  { name: "Toilet T1-L1 #5",  code: "T1L1-TL-05", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 30  },
  { name: "Toilet T1-L1 #6",  code: "T1L1-TL-06", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 171 },
  { name: "Toilet T1-L1 #7",  code: "T1L1-TL-07", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 43, gridCol: 245 },
  { name: "Toilet T1-L1 #8",  code: "T1L1-TL-08", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 45, gridCol: 248 },
  { name: "Toilet T1-L1 #9",  code: "T1L1-TL-09", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 173 },
  { name: "Toilet T1-L1 #10", code: "T1L1-TL-10", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 176 },
  { name: "Toilet T1-L1 #11", code: "T1L1-TL-11", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 50, gridCol: 175 },
  { name: "Toilet T1-L1 #12", code: "T1L1-TL-12", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 47, gridCol: 198 },
  { name: "Toilet T1-L1 #13", code: "T1L1-TL-13", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 60, gridCol: 168 },
  { name: "Toilet T1-L1 #14", code: "T1L1-TL-14", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 64, gridCol: 165 },
  { name: "Toilet T1-L1 #15", code: "T1L1-TL-15", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 55, gridCol: 257 },
  { name: "Toilet T1-L1 #16", code: "T1L1-TL-16", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 56, gridCol: 245 },
  { name: "Toilet T1-L1 #17", code: "T1L1-TL-17", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 70, gridCol: 282 },
  { name: "Toilet T1-L1 #18", code: "T1L1-TL-18", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 68, gridCol: 102 },
  { name: "Toilet T1-L1 #19", code: "T1L1-TL-19", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 68, gridCol: 130 },
  { name: "Toilet T1-L1 #20", code: "T1L1-TL-20", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true, gridRow: 70, gridCol: 193 },

  // ── Musholla ──────────────────────────────────────────────────────────────
  { name: "Musholla T1-L1 #1", code: "T1L1-MS-01", description: null, categoryName: "Musholla", floorKey: "T1-L1", isActive: true, gridRow: 54, gridCol: 113 },
  { name: "Musholla T1-L1 #2", code: "T1L1-MS-02", description: null, categoryName: "Musholla", floorKey: "T1-L1", isActive: true, gridRow: 54, gridCol: 117 },
  { name: "Musholla T1-L1 #3", code: "T1L1-MS-03", description: null, categoryName: "Musholla", floorKey: "T1-L1", isActive: true, gridRow: 55, gridCol: 272 },
  { name: "Musholla T1-L1 #4", code: "T1L1-MS-04", description: null, categoryName: "Musholla", floorKey: "T1-L1", isActive: true, gridRow: 70, gridCol: 191 },

  // ── Informasi / Services ──────────────────────────────────────────────────
  { name: "Arrival Hall T1",  code: "T1L1-IF-01", description: "Area kedatangan Terminal 1", categoryName: "Informasi", floorKey: "T1-L1", isActive: true, gridRow: 77, gridCol: 13  },
  { name: "Lift T1-L1",       code: "T1L1-SV-01", description: "Lift menuju lantai 2",        categoryName: "Services",  floorKey: "T1-L1", isActive: true, gridRow: 55, gridCol: 282 },

  // ══════════════════════════════════════════════════════════════════════════
  // TERMINAL 1 — LANTAI 2
  // ══════════════════════════════════════════════════════════════════════════

  // ── Food & Beverages ──────────────────────────────────────────────────────
  { name: "Food & Bev T1-L2 #1",  code: "T1L2-FB-01", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 1   },
  { name: "Food & Bev T1-L2 #2",  code: "T1L2-FB-02", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 26  },
  { name: "Food & Bev T1-L2 #3",  code: "T1L2-FB-03", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 49  },
  { name: "Food & Bev T1-L2 #4",  code: "T1L2-FB-04", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 60  },
  { name: "Food & Bev T1-L2 #5",  code: "T1L2-FB-05", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 64  },
  { name: "Food & Bev T1-L2 #6",  code: "T1L2-FB-06", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 68  },
  { name: "Food & Bev T1-L2 #7",  code: "T1L2-FB-07", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 73  },
  { name: "Food & Bev T1-L2 #8",  code: "T1L2-FB-08", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 80  },
  { name: "Food & Bev T1-L2 #9",  code: "T1L2-FB-09", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 83  },
  { name: "Food & Bev T1-L2 #10", code: "T1L2-FB-10", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 95  },
  { name: "Food & Bev T1-L2 #11", code: "T1L2-FB-11", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 96  },
  { name: "Food & Bev T1-L2 #12", code: "T1L2-FB-12", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 126 },
  { name: "Food & Bev T1-L2 #13", code: "T1L2-FB-13", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 160 },
  { name: "Food & Bev T1-L2 #14", code: "T1L2-FB-14", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 162 },
  { name: "Food & Bev T1-L2 #15", code: "T1L2-FB-15", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 166 },
  { name: "Food & Bev T1-L2 #16", code: "T1L2-FB-16", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 170 },
  { name: "Food & Bev T1-L2 #17", code: "T1L2-FB-17", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 178 },
  { name: "Food & Bev T1-L2 #18", code: "T1L2-FB-18", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 231 },
  { name: "Food & Bev T1-L2 #19", code: "T1L2-FB-19", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 239 },
  { name: "Food & Bev T1-L2 #20", code: "T1L2-FB-20", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 250 },
  { name: "Food & Bev T1-L2 #21", code: "T1L2-FB-21", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 255 },
  { name: "Food & Bev T1-L2 #22", code: "T1L2-FB-22", description: null, categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 298 },

  // ── Retail ────────────────────────────────────────────────────────────────
  { name: "Retail T1-L2 #1",  code: "T1L2-RT-01", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 56  },
  { name: "Retail T1-L2 #2",  code: "T1L2-RT-02", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 89  },
  { name: "Retail T1-L2 #3",  code: "T1L2-RT-03", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 98  },
  { name: "Retail T1-L2 #4",  code: "T1L2-RT-04", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 102 },
  { name: "Retail T1-L2 #5",  code: "T1L2-RT-05", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 121 },
  { name: "Retail T1-L2 #6",  code: "T1L2-RT-06", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 148 },
  { name: "Retail T1-L2 #7",  code: "T1L2-RT-07", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 188 },
  { name: "Retail T1-L2 #8",  code: "T1L2-RT-08", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 192 },
  { name: "Retail T1-L2 #9",  code: "T1L2-RT-09", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 197 },
  { name: "Retail T1-L2 #10", code: "T1L2-RT-10", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 209 },
  { name: "Retail T1-L2 #11", code: "T1L2-RT-11", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 216 },
  { name: "Retail T1-L2 #12", code: "T1L2-RT-12", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 26, gridCol: 212 },
  { name: "Retail T1-L2 #13", code: "T1L2-RT-13", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 226 },
  { name: "Retail T1-L2 #14", code: "T1L2-RT-14", description: null, categoryName: "Retail", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 235 },

  // ── Toilet & Nursery ──────────────────────────────────────────────────────
  { name: "Toilet T1-L2 #1", code: "T1L2-TL-01", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 23, gridCol: 8   },
  { name: "Toilet T1-L2 #2", code: "T1L2-TL-02", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 107 },
  { name: "Toilet T1-L2 #3", code: "T1L2-TL-03", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 201 },
  { name: "Toilet T1-L2 #4", code: "T1L2-TL-04", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 244 },
  { name: "Toilet T1-L2 #5", code: "T1L2-TL-05", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 288 },
  { name: "Toilet T1-L2 #6", code: "T1L2-TL-06", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 6,  gridCol: 76  },
  { name: "Toilet T1-L2 #7", code: "T1L2-TL-07", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 8,  gridCol: 108 },
  { name: "Toilet T1-L2 #8", code: "T1L2-TL-08", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 8,  gridCol: 173 },
  { name: "Toilet T1-L2 #9", code: "T1L2-TL-09", description: null, categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true, gridRow: 8,  gridCol: 202 },

  // ── Musholla ──────────────────────────────────────────────────────────────
  { name: "Musholla T1-L2 #1", code: "T1L2-MS-01", description: null, categoryName: "Musholla", floorKey: "T1-L2", isActive: true, gridRow: 23, gridCol: 6   },
  { name: "Musholla T1-L2 #2", code: "T1L2-MS-02", description: null, categoryName: "Musholla", floorKey: "T1-L2", isActive: true, gridRow: 21, gridCol: 270 },
  { name: "Musholla T1-L2 #3", code: "T1L2-MS-03", description: null, categoryName: "Musholla", floorKey: "T1-L2", isActive: true, gridRow: 6,  gridCol: 87  },
  { name: "Musholla T1-L2 #4", code: "T1L2-MS-04", description: null, categoryName: "Musholla", floorKey: "T1-L2", isActive: true, gridRow: 8,  gridCol: 170 },

  // ── Gate ──────────────────────────────────────────────────────────────────
  { name: "Gate 1",  code: "T1L2-GT-01", description: "Gate keberangkatan 1",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 2   },
  { name: "Gate 2",  code: "T1L2-GT-02", description: "Gate keberangkatan 2",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 26  },
  { name: "Gate 3",  code: "T1L2-GT-03", description: "Gate keberangkatan 3",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 49  },
  { name: "Gate 4",  code: "T1L2-GT-04", description: "Gate keberangkatan 4",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 73  },
  { name: "Gate 5",  code: "T1L2-GT-05", description: "Gate keberangkatan 5",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 96  },
  { name: "Gate 6",  code: "T1L2-GT-06", description: "Gate keberangkatan 6",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 120 },
  { name: "Gate 7",  code: "T1L2-GT-07", description: "Gate keberangkatan 7",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 146 },
  { name: "Gate 8",  code: "T1L2-GT-08", description: "Gate keberangkatan 8",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 170 },
  { name: "Gate 9",  code: "T1L2-GT-09", description: "Gate keberangkatan 9",  categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 195 },
  { name: "Gate 10", code: "T1L2-GT-10", description: "Gate keberangkatan 10", categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 220 },
  { name: "Gate 11", code: "T1L2-GT-11", description: "Gate keberangkatan 11", categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 244 },
  { name: "Gate 12", code: "T1L2-GT-12", description: "Gate keberangkatan 12", categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 268 },
  { name: "Gate 13", code: "T1L2-GT-13", description: "Gate keberangkatan 13", categoryName: "Gate", floorKey: "T1-L2", isActive: true, gridRow: 31, gridCol: 296 },

  // ── Lounge ────────────────────────────────────────────────────────────────
  { name: "Lounge T1-L2 #1",  code: "T1L2-LO-01", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 6,  gridCol: 55  },
  { name: "Lounge T1-L2 #2",  code: "T1L2-LO-02", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 6,  gridCol: 153 },
  { name: "Lounge T1-L2 #3",  code: "T1L2-LO-03", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 10  },
  { name: "Lounge T1-L2 #4",  code: "T1L2-LO-04", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 19  },
  { name: "Lounge T1-L2 #5",  code: "T1L2-LO-05", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 33  },
  { name: "Lounge T1-L2 #6",  code: "T1L2-LO-06", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 42  },
  { name: "Lounge T1-L2 #7",  code: "T1L2-LO-07", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 56  },
  { name: "Lounge T1-L2 #8",  code: "T1L2-LO-08", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 65  },
  { name: "Lounge T1-L2 #9",  code: "T1L2-LO-09", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 79  },
  { name: "Lounge T1-L2 #10", code: "T1L2-LO-10", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 90  },
  { name: "Lounge T1-L2 #11", code: "T1L2-LO-11", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 101 },
  { name: "Lounge T1-L2 #12", code: "T1L2-LO-12", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 112 },
  { name: "Lounge T1-L2 #13", code: "T1L2-LO-13", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 133 },
  { name: "Lounge T1-L2 #14", code: "T1L2-LO-14", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 157 },
  { name: "Lounge T1-L2 #15", code: "T1L2-LO-15", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 165 },
  { name: "Lounge T1-L2 #16", code: "T1L2-LO-16", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 179 },
  { name: "Lounge T1-L2 #17", code: "T1L2-LO-17", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 189 },
  { name: "Lounge T1-L2 #18", code: "T1L2-LO-18", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 227 },
  { name: "Lounge T1-L2 #19", code: "T1L2-LO-19", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 237 },
  { name: "Lounge T1-L2 #20", code: "T1L2-LO-20", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 255 },
  { name: "Lounge T1-L2 #21", code: "T1L2-LO-21", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 272 },
  { name: "Lounge T1-L2 #22", code: "T1L2-LO-22", description: null, categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 24, gridCol: 285 },
  { name: "Lounge VVIP T1",   code: "T1L2-LO-23", description: "Lounge VVIP Terminal 1", categoryName: "Lounge", floorKey: "T1-L2", isActive: true, gridRow: 9,  gridCol: 202 },

  // ══════════════════════════════════════════════════════════════════════════
  // TERMINAL 2 — LANTAI 1
  // ══════════════════════════════════════════════════════════════════════════

  // ── Food & Beverages ──────────────────────────────────────────────────────
  { name: "Food & Bev T2-L1 #1", code: "T2L1-FB-01", description: null, categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true, gridRow: 84,  gridCol: 107 },
  { name: "Food & Bev T2-L1 #2", code: "T2L1-FB-02", description: null, categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true, gridRow: 107, gridCol: 49  },
  { name: "Food & Bev T2-L1 #3", code: "T2L1-FB-03", description: null, categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true, gridRow: 103, gridCol: 70  },
  { name: "Food & Bev T2-L1 #4", code: "T2L1-FB-04", description: null, categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true, gridRow: 103, gridCol: 113 },

  // ── Retail ────────────────────────────────────────────────────────────────
  { name: "Retail T2-L1 #1", code: "T2L1-RT-01", description: null, categoryName: "Retail", floorKey: "T2-L1", isActive: true, gridRow: 87,  gridCol: 75  },
  { name: "Retail T2-L1 #2", code: "T2L1-RT-02", description: null, categoryName: "Retail", floorKey: "T2-L1", isActive: true, gridRow: 87,  gridCol: 68  },
  { name: "Retail T2-L1 #3", code: "T2L1-RT-03", description: null, categoryName: "Retail", floorKey: "T2-L1", isActive: true, gridRow: 87,  gridCol: 95  },
  { name: "Retail T2-L1 #4", code: "T2L1-RT-04", description: null, categoryName: "Retail", floorKey: "T2-L1", isActive: true, gridRow: 105, gridCol: 55  },
  { name: "Duty Free T2-L1", code: "T2L1-RT-05", description: "Toko duty free Terminal 2", categoryName: "Retail", floorKey: "T2-L1", isActive: true, gridRow: 83,  gridCol: 157 },

  // ── Toilet & Nursery ──────────────────────────────────────────────────────
  { name: "Toilet T2-L1 #1",  code: "T2L1-TL-01", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 84,  gridCol: 62  },
  { name: "Toilet T2-L1 #2",  code: "T2L1-TL-02", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 84,  gridCol: 118 },
  { name: "Toilet T2-L1 #3",  code: "T2L1-TL-03", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 76,  gridCol: 120 },
  { name: "Toilet T2-L1 #4",  code: "T2L1-TL-04", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 110, gridCol: 14  },
  { name: "Toilet T2-L1 #5",  code: "T2L1-TL-05", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 111, gridCol: 20  },
  { name: "Toilet T2-L1 #6",  code: "T2L1-TL-06", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 74,  gridCol: 3   },
  { name: "Toilet T2-L1 #7",  code: "T2L1-TL-07", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 109, gridCol: 156 },
  { name: "Toilet T2-L1 #8",  code: "T2L1-TL-08", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 109, gridCol: 163 },
  { name: "Toilet T2-L1 #9",  code: "T2L1-TL-09", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 195 },
  { name: "Toilet T2-L1 #10", code: "T2L1-TL-10", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 110, gridCol: 204 },
  { name: "Toilet T2-L1 #11", code: "T2L1-TL-11", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 229 },
  { name: "Toilet T2-L1 #12", code: "T2L1-TL-12", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 110, gridCol: 234 },
  { name: "Toilet T2-L1 #13", code: "T2L1-TL-13", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 271 },
  { name: "Toilet T2-L1 #14", code: "T2L1-TL-14", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true, gridRow: 110, gridCol: 276 },

  // ── Musholla ──────────────────────────────────────────────────────────────
  { name: "Musholla T2-L1 #1", code: "T2L1-MS-01", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 75,  gridCol: 105 },
  { name: "Musholla T2-L1 #2", code: "T2L1-MS-02", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 111, gridCol: 15  },
  { name: "Musholla T2-L1 #3", code: "T2L1-MS-03", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 109, gridCol: 20  },
  { name: "Musholla T2-L1 #4", code: "T2L1-MS-04", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 107, gridCol: 156 },
  { name: "Musholla T2-L1 #5", code: "T2L1-MS-05", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 109, gridCol: 159 },
  { name: "Musholla T2-L1 #6", code: "T2L1-MS-06", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 200 },
  { name: "Musholla T2-L1 #7", code: "T2L1-MS-07", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 224 },
  { name: "Musholla T2-L1 #8", code: "T2L1-MS-08", description: null, categoryName: "Musholla", floorKey: "T2-L1", isActive: true, gridRow: 106, gridCol: 266 },

  // ── Gate ──────────────────────────────────────────────────────────────────
  { name: "Gate T2 A1", code: "T2L1-GT-01", description: "Gate keberangkatan A1", categoryName: "Gate", floorKey: "T2-L1", isActive: true, gridRow: 96, gridCol: 231 },
  { name: "Gate T2 A2", code: "T2L1-GT-02", description: "Gate keberangkatan A2", categoryName: "Gate", floorKey: "T2-L1", isActive: true, gridRow: 96, gridCol: 273 },
  { name: "Gate T2 A3", code: "T2L1-GT-03", description: "Gate keberangkatan A3", categoryName: "Gate", floorKey: "T2-L1", isActive: true, gridRow: 96, gridCol: 315 },

  // ══════════════════════════════════════════════════════════════════════════
  // TERMINAL 2 — LANTAI 2
  // ══════════════════════════════════════════════════════════════════════════

  // ── Food & Beverages ──────────────────────────────────────────────────────
  { name: "Food & Bev T2-L2 #1", code: "T2L2-FB-01", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 17, gridCol: 52  },
  { name: "Food & Bev T2-L2 #2", code: "T2L2-FB-02", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 32, gridCol: 116 },
  { name: "Food & Bev T2-L2 #3", code: "T2L2-FB-03", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 116 },
  { name: "Food & Bev T2-L2 #4", code: "T2L2-FB-04", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 21, gridCol: 116 },
  { name: "Food & Bev T2-L2 #5", code: "T2L2-FB-05", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 32, gridCol: 107 },
  { name: "Food & Bev T2-L2 #6", code: "T2L2-FB-06", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 42, gridCol: 107 },
  { name: "Food & Bev T2-L2 #7", code: "T2L2-FB-07", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 45, gridCol: 300 },
  { name: "Food & Bev T2-L2 #8", code: "T2L2-FB-08", description: null, categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true, gridRow: 45, gridCol: 203 },

  // ── Retail & Duty Free ────────────────────────────────────────────────────
  { name: "Retail T2-L2 #1",   code: "T2L2-RT-01", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 31, gridCol: 52  },
  { name: "Retail T2-L2 #2",   code: "T2L2-RT-02", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 23, gridCol: 52  },
  { name: "Retail T2-L2 #3",   code: "T2L2-RT-03", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 62  },
  { name: "Retail T2-L2 #4",   code: "T2L2-RT-04", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 72  },
  { name: "Retail T2-L2 #5",   code: "T2L2-RT-05", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 80  },
  { name: "Retail T2-L2 #6",   code: "T2L2-RT-06", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 88  },
  { name: "Retail T2-L2 #7",   code: "T2L2-RT-07", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 25, gridCol: 96  },
  { name: "Retail T2-L2 #8",   code: "T2L2-RT-08", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 19, gridCol: 105 },
  { name: "Retail T2-L2 #9",   code: "T2L2-RT-09", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 45, gridCol: 243 },
  { name: "Duty Free T2-L2 #1", code: "T2L2-RT-10", description: "Toko duty free Terminal 2 Lantai 2", categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 30, gridCol: 70  },
  { name: "Duty Free T2-L2 #2", code: "T2L2-RT-11", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 31, gridCol: 65  },
  { name: "Duty Free T2-L2 #3", code: "T2L2-RT-12", description: null, categoryName: "Retail", floorKey: "T2-L2", isActive: true, gridRow: 32, gridCol: 60  },

  // ── Toilet & Nursery ──────────────────────────────────────────────────────
  { name: "Toilet T2-L2 #1", code: "T2L2-TL-01", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 46, gridCol: 14  },
  { name: "Toilet T2-L2 #2", code: "T2L2-TL-02", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 12, gridCol: 52  },
  { name: "Toilet T2-L2 #3", code: "T2L2-TL-03", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 16, gridCol: 116 },
  { name: "Toilet T2-L2 #4", code: "T2L2-TL-04", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 11, gridCol: 116 },
  { name: "Toilet T2-L2 #5", code: "T2L2-TL-05", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 201 },
  { name: "Toilet T2-L2 #6", code: "T2L2-TL-06", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 241 },
  { name: "Toilet T2-L2 #7", code: "T2L2-TL-07", description: null, categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 281 },

  // ── Musholla ──────────────────────────────────────────────────────────────
  { name: "Musholla T2-L2 #1", code: "T2L2-MS-01", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 43, gridCol: 14  },
  { name: "Musholla T2-L2 #2", code: "T2L2-MS-02", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 10, gridCol: 52  },
  { name: "Musholla T2-L2 #3", code: "T2L2-MS-03", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 16, gridCol: 112 },
  { name: "Musholla T2-L2 #4", code: "T2L2-MS-04", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 9,  gridCol: 116 },
  { name: "Musholla T2-L2 #5", code: "T2L2-MS-05", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 34, gridCol: 170 },
  { name: "Musholla T2-L2 #6", code: "T2L2-MS-06", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 207 },
  { name: "Musholla T2-L2 #7", code: "T2L2-MS-07", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 247 },
  { name: "Musholla T2-L2 #8", code: "T2L2-MS-08", description: null, categoryName: "Musholla", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 287 },

  // ── Gate ──────────────────────────────────────────────────────────────────
  { name: "Gate T2 B1",  code: "T2L2-GT-01", description: "Gate keberangkatan B1",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 7,  gridCol: 58  },
  { name: "Gate T2 B2",  code: "T2L2-GT-02", description: "Gate keberangkatan B2",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 7,  gridCol: 74  },
  { name: "Gate T2 B3",  code: "T2L2-GT-03", description: "Gate keberangkatan B3",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 7,  gridCol: 81  },
  { name: "Gate T2 C1",  code: "T2L2-GT-04", description: "Gate keberangkatan C1",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 34, gridCol: 216 },
  { name: "Gate T2 C2",  code: "T2L2-GT-05", description: "Gate keberangkatan C2",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 34, gridCol: 256 },
  { name: "Gate T2 C3",  code: "T2L2-GT-06", description: "Gate keberangkatan C3",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 34, gridCol: 296 },
  { name: "Gate T2 D1",  code: "T2L2-GT-07", description: "Gate keberangkatan D1",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 1,  gridCol: 56  },
  { name: "Gate T2 D2",  code: "T2L2-GT-08", description: "Gate keberangkatan D2",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 1,  gridCol: 78  },
  { name: "Gate T2 D3",  code: "T2L2-GT-09", description: "Gate keberangkatan D3",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 1,  gridCol: 110 },
  { name: "Gate T2 D4",  code: "T2L2-GT-10", description: "Gate keberangkatan D4",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 1,  gridCol: 139 },
  { name: "Gate T2 D5",  code: "T2L2-GT-11", description: "Gate keberangkatan D5",  categoryName: "Gate", floorKey: "T2-L2", isActive: true, gridRow: 1,  gridCol: 168 },

  // ── Lounge ────────────────────────────────────────────────────────────────
  { name: "Lounge T2-L2", code: "T2L2-LO-01", description: null, categoryName: "Lounge", floorKey: "T2-L2", isActive: true, gridRow: 35, gridCol: 120 },
];

// =============================================================================
// OPERATIONAL HOURS TEMPLATES
// =============================================================================

type DaySchedule = {
  day: number;
  isOpen: boolean;
  is24Hours: boolean;
  openTime: string | null;
  closeTime: string | null;
};

type OperationalTemplate = "always_open" | "food" | "retail" | "medical";

function buildSchedule(
  fn: (dayIndex: number) => Omit<DaySchedule, "day">
): DaySchedule[] {
  return Array.from({ length: 7 }, (_, i) => ({ day: i + 1, ...fn(i) }));
}

const TEMPLATES: Record<OperationalTemplate, DaySchedule[]> = {
  always_open: buildSchedule(() => ({
    isOpen: true, is24Hours: true, openTime: null, closeTime: null,
  })),
  food: buildSchedule((i) => ({
    isOpen: true,
    is24Hours: false,
    openTime:  i < 5 ? "07:00" : "08:00",
    closeTime: i < 5 ? "21:00" : "22:00",
  })),
  retail: buildSchedule(() => ({
    isOpen: true, is24Hours: false, openTime: "06:00", closeTime: "22:00",
  })),
  medical: buildSchedule((i) => ({
    isOpen:    i < 6,
    is24Hours: false,
    openTime:  i < 6 ? "08:00" : null,
    closeTime: i < 6 ? "20:00" : null,
  })),
};

// Pemetaan kategori → template jam operasional
const CATEGORY_TEMPLATE_MAP: Record<CategoryName, OperationalTemplate> = {
  "Food & Beverages": "food",
  "Retail":           "retail",
  "Services":         "retail",
  "Check-in":         "always_open",
  "Musholla":         "always_open",
  "Toilet & Nursery": "always_open",
  "Medical":          "medical",
  "Gate":             "always_open",
  "Informasi":        "always_open",
  "Lounge":           "retail",
};

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function main(): Promise<void> {
  console.log("🌱 Memulai seed database...\n");

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    // ── 1. Categories ─────────────────────────────────────────────────────────
    console.log("📂 Seeding categories...");
    const categoryMap = new Map<string, number>();

    for (const category of CATEGORIES) {
      const result = await tx.category.upsert({
        where:  { name: category.name },
        update: { icon: category.icon, color: category.color },
        create: { name: category.name, icon: category.icon, color: category.color },
      });
      categoryMap.set(category.name, result.id);
    }
    console.log(`   ✅ ${CATEGORIES.length} categories selesai\n`);

    // ── 2. Floors ─────────────────────────────────────────────────────────────
    console.log("🏢 Seeding floors...");
    const floorMap = new Map<FloorKey, number>();

    for (const floor of FLOORS) {
      const result = await tx.floor.upsert({
        where:  { terminal_floorNumber: { terminal: floor.terminal, floorNumber: floor.floorNumber } },
        update: {
          label:    floor.label,
          gridRows: floor.gridRows,
          gridCols: floor.gridCols,
          startRow: floor.startRow,
          startCol: floor.startCol,
          wallData: floor.wallData,
        },
        create: {
          terminal:    floor.terminal,
          floorNumber: floor.floorNumber,
          label:       floor.label,
          gridRows:    floor.gridRows,
          gridCols:    floor.gridCols,
          startRow:    floor.startRow,
          startCol:    floor.startCol,
          wallData:    floor.wallData,
        },
      });
      floorMap.set(`${floor.terminal}-L${floor.floorNumber}` as FloorKey, result.id);
    }
    console.log(`   ✅ ${FLOORS.length} floors selesai\n`);

    // ── 3. Facilities ─────────────────────────────────────────────────────────
    console.log("🏪 Seeding facilities...");
    const facilityCodeMap = new Map<string, number>();

    for (const facility of FACILITIES) {
      const categoryId = categoryMap.get(facility.categoryName);
      const floorId    = floorMap.get(facility.floorKey);

      if (!categoryId) throw new Error(`Category tidak ditemukan: ${facility.categoryName}`);
      if (!floorId)    throw new Error(`Floor tidak ditemukan: ${facility.floorKey}`);

      const result = await tx.facility.upsert({
        where:  { code: facility.code },
        update: {
          name:        facility.name,
          description: facility.description,
          categoryId,
          floorId,
          isActive:    facility.isActive,
          gridRow:     facility.gridRow,
          gridCol:     facility.gridCol,
        },
        create: {
          name:        facility.name,
          code:        facility.code,
          description: facility.description,
          categoryId,
          floorId,
          nodeId:      null,
          isActive:    facility.isActive,
          gridRow:     facility.gridRow,
          gridCol:     facility.gridCol,
        },
      });
      facilityCodeMap.set(facility.code, result.id);
    }
    console.log(`   ✅ ${FACILITIES.length} facilities selesai\n`);

    // ── 4. Operational Hours ──────────────────────────────────────────────────
    console.log("🕐 Seeding operational hours...");
    let totalHours = 0;

    for (const facility of FACILITIES) {
      const facilityId = facilityCodeMap.get(facility.code);
      if (!facilityId) continue;

      const templateKey = CATEGORY_TEMPLATE_MAP[facility.categoryName];
      const schedule    = TEMPLATES[templateKey];

      for (const daySchedule of schedule) {
        await tx.operationalHour.upsert({
          where:  { facilityId_day: { facilityId, day: daySchedule.day } },
          update: {
            isOpen:    daySchedule.isOpen,
            is24Hours: daySchedule.is24Hours,
            openTime:  daySchedule.openTime,
            closeTime: daySchedule.closeTime,
          },
          create: {
            facilityId,
            day:       daySchedule.day,
            isOpen:    daySchedule.isOpen,
            is24Hours: daySchedule.is24Hours,
            openTime:  daySchedule.openTime,
            closeTime: daySchedule.closeTime,
          },
        });
        totalHours++;
      }
    }
    console.log(`   ✅ ${totalHours} operational hours selesai\n`);

    // ── 5. Admin ──────────────────────────────────────────────────────────────
    console.log("👤 Seeding admin...");
    const hashedPassword = await bcryptjs.hash("admin123", 10);

    await tx.admin.upsert({
      where:  { email: "admin@juanda.com" },
      update: { name: "Admin Juanda" },
      create: { email: "admin@juanda.com", name: "Admin Juanda", password: hashedPassword },
    });
    console.log("   ✅ Admin selesai\n");
  });

  console.log("🎉 Seed selesai!");
}

// =============================================================================
// RUN
// =============================================================================

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });