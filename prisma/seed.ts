// Script untuk isi data awal
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// =============================================================================
// DATA DUMMY — BELUM FINAL, AKAN DIGANTI SETELAH SURVEI LAPANGAN
// =============================================================================

// -----------------------------------------------------------------------------
// CATEGORIES
// -----------------------------------------------------------------------------

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
] as const;

// -----------------------------------------------------------------------------
// FLOORS
// -----------------------------------------------------------------------------

const FLOORS = [
  { terminal: "T1", floorNumber: 1, label: "Terminal 1 - Lantai 1" },
  { terminal: "T1", floorNumber: 2, label: "Terminal 1 - Lantai 2" },
  { terminal: "T2", floorNumber: 1, label: "Terminal 2 - Lantai 1" },
  { terminal: "T2", floorNumber: 2, label: "Terminal 2 - Lantai 2" },
] as const;

// -----------------------------------------------------------------------------
// FACILITIES
// -----------------------------------------------------------------------------

type FloorKey = "T1-L1" | "T1-L2" | "T2-L1" | "T2-L2";
type CategoryName = (typeof CATEGORIES)[number]["name"];

interface FacilitySeedData {
  name: string;
  code: string;
  description: string | null;
  categoryName: CategoryName;
  floorKey: FloorKey;
  isActive: boolean;
}

const FACILITIES: FacilitySeedData[] = [
  // ── Terminal 1 Lantai 1 ──────────────────────────────────────────────────
  { name: "Warung Nasi Bu Siti",  code: "FB-11-01", description: "Makanan tradisional Jawa Timur",       categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true },
  { name: "Kopi Kapal Api",       code: "FB-11-02", description: "Kedai kopi lokal",                     categoryName: "Food & Beverages", floorKey: "T1-L1", isActive: true },
  { name: "Minimarket Indomaret", code: "RT-11-01", description: "Minimarket kebutuhan perjalanan",       categoryName: "Retail",           floorKey: "T1-L1", isActive: true },
  { name: "Check-in Counter A",   code: "CI-11-01", description: "Counter check-in maskapai domestik",   categoryName: "Check-in",         floorKey: "T1-L1", isActive: true },
  { name: "Toilet Pria T1-L1",    code: "TL-11-01", description: null,                                   categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true },
  { name: "Toilet Wanita T1-L1",  code: "TL-11-02", description: null,                                   categoryName: "Toilet & Nursery", floorKey: "T1-L1", isActive: true },
  { name: "Meja Informasi T1",    code: "IF-11-01", description: "Pusat informasi Terminal 1",           categoryName: "Informasi",        floorKey: "T1-L1", isActive: true },

  // ── Terminal 1 Lantai 2 ──────────────────────────────────────────────────
  { name: "McDonald's T1",        code: "FB-12-01", description: "Restoran cepat saji",                  categoryName: "Food & Beverages", floorKey: "T1-L2", isActive: true },
  { name: "Musholla T1-L2",       code: "MS-12-01", description: "Tempat ibadah lantai 2 Terminal 1",   categoryName: "Musholla",         floorKey: "T1-L2", isActive: true },
  { name: "Gate 1",               code: "GT-12-01", description: "Gate keberangkatan 1",                 categoryName: "Gate",             floorKey: "T1-L2", isActive: true },
  { name: "Gate 2",               code: "GT-12-02", description: "Gate keberangkatan 2",                 categoryName: "Gate",             floorKey: "T1-L2", isActive: true },
  { name: "Gate 3",               code: "GT-12-03", description: "Gate keberangkatan 3",                 categoryName: "Gate",             floorKey: "T1-L2", isActive: true },
  { name: "Toilet T1-L2",         code: "TL-12-01", description: null,                                   categoryName: "Toilet & Nursery", floorKey: "T1-L2", isActive: true },
  { name: "Apotek Kimia Farma T1",code: "MD-12-01", description: "Apotek dan layanan kesehatan",         categoryName: "Medical",          floorKey: "T1-L2", isActive: true },

  // ── Terminal 2 Lantai 1 ──────────────────────────────────────────────────
  { name: "Solaria T2",           code: "FB-21-01", description: "Restoran keluarga",                    categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true },
  { name: "Es Teler 77",          code: "FB-21-02", description: "Minuman dan makanan ringan",           categoryName: "Food & Beverages", floorKey: "T2-L1", isActive: true },
  { name: "Check-in Counter B",   code: "CI-21-01", description: "Counter check-in maskapai internasional", categoryName: "Check-in",     floorKey: "T2-L1", isActive: true },
  { name: "Toko Oleh-Oleh Jatim", code: "RT-21-01", description: "Souvenir dan oleh-oleh khas Jawa Timur", categoryName: "Retail",       floorKey: "T2-L1", isActive: true },
  { name: "Toilet Pria T2-L1",    code: "TL-21-01", description: null,                                   categoryName: "Toilet & Nursery", floorKey: "T2-L1", isActive: true },
  { name: "Layanan Porter T2",    code: "SV-21-01", description: "Jasa angkut bagasi",                   categoryName: "Services",         floorKey: "T2-L1", isActive: true },
  { name: "Meja Informasi T2",    code: "IF-21-01", description: "Pusat informasi Terminal 2",           categoryName: "Informasi",        floorKey: "T2-L1", isActive: true },

  // ── Terminal 2 Lantai 2 ──────────────────────────────────────────────────
  { name: "Starbucks T2",         code: "FB-22-01", description: "Kedai kopi internasional",             categoryName: "Food & Beverages", floorKey: "T2-L2", isActive: true },
  { name: "Musholla T2-L2",       code: "MS-22-01", description: "Tempat ibadah lantai 2 Terminal 2",   categoryName: "Musholla",         floorKey: "T2-L2", isActive: true },
  { name: "Gate 10",              code: "GT-22-01", description: "Gate keberangkatan internasional 10",  categoryName: "Gate",             floorKey: "T2-L2", isActive: true },
  { name: "Gate 11",              code: "GT-22-02", description: "Gate keberangkatan internasional 11",  categoryName: "Gate",             floorKey: "T2-L2", isActive: true },
  { name: "Nursery Room T2",      code: "TL-22-01", description: "Ruang menyusui dan ganti popok",       categoryName: "Toilet & Nursery", floorKey: "T2-L2", isActive: true },
  { name: "Klinik Kesehatan T2",  code: "MD-22-01", description: "Layanan medis darurat bandara",        categoryName: "Medical",          floorKey: "T2-L2", isActive: true },
  { name: "Money Changer T2",     code: "SV-22-01", description: "Penukaran mata uang asing",            categoryName: "Services",         floorKey: "T2-L2", isActive: true },
];

// -----------------------------------------------------------------------------
// OPERATIONAL HOURS TEMPLATES
//
// Setiap template berisi jadwal 7 hari (1=Senin s/d 7=Minggu).
// Masing-masing fasilitas di-assign ke salah satu template sesuai karakternya.
// Data ini DUMMY — akan diganti setelah survei lapangan.
// -----------------------------------------------------------------------------

type DaySchedule = {
  day: number;
  isOpen: boolean;
  is24Hours: boolean;
  openTime: string | null;
  closeTime: string | null;
};

type OperationalTemplate =
  | "always_open"    // 24 jam, 7 hari — toilet, musholla, gate
  | "regular"        // 06:00–22:00, 7 hari — minimarket, retail
  | "check_in"       // 04:00–23:00, 7 hari — check-in, informasi
  | "food"           // Senin–Jumat 07:00–21:00, Sabtu–Minggu 08:00–22:00
  | "medical"        // 08:00–20:00, tutup Minggu — apotek, klinik
  | "money_changer"; // 06:00–21:00, 7 hari — money changer, porter

function buildSchedule(
  fn: (dayIndex: number) => Omit<DaySchedule, "day">
): DaySchedule[] {
  return Array.from({ length: 7 }, (_, i) => ({ day: i + 1, ...fn(i) }));
}

const TEMPLATES: Record<OperationalTemplate, DaySchedule[]> = {
  always_open: buildSchedule(() => ({
    isOpen: true, is24Hours: true, openTime: null, closeTime: null,
  })),

  regular: buildSchedule(() => ({
    isOpen: true, is24Hours: false, openTime: "06:00", closeTime: "22:00",
  })),

  check_in: buildSchedule(() => ({
    isOpen: true, is24Hours: false, openTime: "04:00", closeTime: "23:00",
  })),

  food: buildSchedule((i) => ({
    isOpen: true,
    is24Hours: false,
    openTime:  i < 5 ? "07:00" : "08:00",  // Senin–Jumat vs Sabtu–Minggu
    closeTime: i < 5 ? "21:00" : "22:00",
  })),

  medical: buildSchedule((i) => ({
    isOpen:    i < 6,                        // Senin–Sabtu buka, Minggu tutup
    is24Hours: false,
    openTime:  i < 6 ? "08:00" : null,
    closeTime: i < 6 ? "20:00" : null,
  })),

  money_changer: buildSchedule(() => ({
    isOpen: true, is24Hours: false, openTime: "06:00", closeTime: "21:00",
  })),
};

// Map: facility code → template
const FACILITY_TEMPLATE_MAP: Record<string, OperationalTemplate> = {
  "FB-11-01": "food",          "FB-11-02": "food",
  "FB-12-01": "food",          "FB-21-01": "food",
  "FB-21-02": "food",          "FB-22-01": "food",
  "RT-11-01": "regular",       "RT-21-01": "regular",
  "CI-11-01": "check_in",      "CI-21-01": "check_in",
  "MS-12-01": "always_open",   "MS-22-01": "always_open",
  "TL-11-01": "always_open",   "TL-11-02": "always_open",
  "TL-12-01": "always_open",   "TL-21-01": "always_open",
  "TL-22-01": "always_open",
  "MD-12-01": "medical",       "MD-22-01": "medical",
  "GT-12-01": "always_open",   "GT-12-02": "always_open",
  "GT-12-03": "always_open",   "GT-22-01": "always_open",
  "GT-22-02": "always_open",
  "IF-11-01": "check_in",      "IF-21-01": "check_in",
  "SV-21-01": "regular",       "SV-22-01": "money_changer",
};

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function main(): Promise<void> {
  console.log("🌱 Memulai seed database...\n");

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

    // ── 1. Categories ────────────────────────────────────────────────────────
    console.log("📂 Seeding categories...");
    const categoryMap = new Map<string, number>();

    for (const category of CATEGORIES) {
      const result = await tx.category.upsert({
        where: { name: category.name },
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
        where: { terminal_floorNumber: { terminal: floor.terminal, floorNumber: floor.floorNumber } },
        update: { label: floor.label },
        create: { terminal: floor.terminal, floorNumber: floor.floorNumber, label: floor.label },
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
        where: { code: facility.code },
        update: { name: facility.name, description: facility.description, categoryId, floorId, isActive: facility.isActive },
        create: { name: facility.name, code: facility.code, description: facility.description, categoryId, floorId, nodeId: null, isActive: facility.isActive },
      });
      facilityCodeMap.set(facility.code, result.id);
    }
    console.log(`   ✅ ${FACILITIES.length} facilities selesai\n`);

    // ── 4. Operational Hours ──────────────────────────────────────────────────
    console.log("🕐 Seeding operational hours...");
    let totalHours = 0;

    for (const [code, templateKey] of Object.entries(FACILITY_TEMPLATE_MAP)) {
      const facilityId = facilityCodeMap.get(code);
      if (!facilityId) throw new Error(`Facility tidak ditemukan saat seed jam: ${code}`);

      for (const daySchedule of TEMPLATES[templateKey]) {
        await tx.operationalHour.upsert({
          where: { facilityId_day: { facilityId, day: daySchedule.day } },
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
      where: { email: "admin@juanda.com" },
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