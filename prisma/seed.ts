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
// FACILITIES (dummy, nodeId null, imageUrl belum ada — menunggu Cloudinary)
//
// Format kode: [SINGKATAN_KATEGORI]-[TERMINAL][LANTAI]-[NOMOR]
// Contoh: FB-11-01 = Food & Beverages, Terminal 1 Lantai 1, urutan 1
//
// floorKey dipakai sebagai referensi saat seed, bukan field di DB
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
  {
    name: "Warung Nasi Bu Siti",
    code: "FB-11-01",
    description: "Makanan tradisional Jawa Timur",
    categoryName: "Food & Beverages",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Kopi Kapal Api",
    code: "FB-11-02",
    description: "Kedai kopi lokal",
    categoryName: "Food & Beverages",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Minimarket Indomaret",
    code: "RT-11-01",
    description: "Minimarket kebutuhan perjalanan",
    categoryName: "Retail",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Check-in Counter A",
    code: "CI-11-01",
    description: "Counter check-in maskapai domestik",
    categoryName: "Check-in",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Toilet Pria T1-L1",
    code: "TL-11-01",
    description: null,
    categoryName: "Toilet & Nursery",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Toilet Wanita T1-L1",
    code: "TL-11-02",
    description: null,
    categoryName: "Toilet & Nursery",
    floorKey: "T1-L1",
    isActive: true,
  },
  {
    name: "Meja Informasi T1",
    code: "IF-11-01",
    description: "Pusat informasi Terminal 1",
    categoryName: "Informasi",
    floorKey: "T1-L1",
    isActive: true,
  },

  // ── Terminal 1 Lantai 2 ──────────────────────────────────────────────────
  {
    name: "McDonald's T1",
    code: "FB-12-01",
    description: "Restoran cepat saji",
    categoryName: "Food & Beverages",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Musholla T1-L2",
    code: "MS-12-01",
    description: "Tempat ibadah lantai 2 Terminal 1",
    categoryName: "Musholla",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Gate 1",
    code: "GT-12-01",
    description: "Gate keberangkatan 1",
    categoryName: "Gate",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Gate 2",
    code: "GT-12-02",
    description: "Gate keberangkatan 2",
    categoryName: "Gate",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Gate 3",
    code: "GT-12-03",
    description: "Gate keberangkatan 3",
    categoryName: "Gate",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Toilet T1-L2",
    code: "TL-12-01",
    description: null,
    categoryName: "Toilet & Nursery",
    floorKey: "T1-L2",
    isActive: true,
  },
  {
    name: "Apotek Kimia Farma T1",
    code: "MD-12-01",
    description: "Apotek dan layanan kesehatan",
    categoryName: "Medical",
    floorKey: "T1-L2",
    isActive: true,
  },

  // ── Terminal 2 Lantai 1 ──────────────────────────────────────────────────
  {
    name: "Solaria T2",
    code: "FB-21-01",
    description: "Restoran keluarga",
    categoryName: "Food & Beverages",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Es Teler 77",
    code: "FB-21-02",
    description: "Minuman dan makanan ringan",
    categoryName: "Food & Beverages",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Check-in Counter B",
    code: "CI-21-01",
    description: "Counter check-in maskapai internasional",
    categoryName: "Check-in",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Toko Oleh-Oleh Jatim",
    code: "RT-21-01",
    description: "Souvenir dan oleh-oleh khas Jawa Timur",
    categoryName: "Retail",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Toilet Pria T2-L1",
    code: "TL-21-01",
    description: null,
    categoryName: "Toilet & Nursery",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Layanan Porter T2",
    code: "SV-21-01",
    description: "Jasa angkut bagasi",
    categoryName: "Services",
    floorKey: "T2-L1",
    isActive: true,
  },
  {
    name: "Meja Informasi T2",
    code: "IF-21-01",
    description: "Pusat informasi Terminal 2",
    categoryName: "Informasi",
    floorKey: "T2-L1",
    isActive: true,
  },

  // ── Terminal 2 Lantai 2 ──────────────────────────────────────────────────
  {
    name: "Starbucks T2",
    code: "FB-22-01",
    description: "Kedai kopi internasional",
    categoryName: "Food & Beverages",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Musholla T2-L2",
    code: "MS-22-01",
    description: "Tempat ibadah lantai 2 Terminal 2",
    categoryName: "Musholla",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Gate 10",
    code: "GT-22-01",
    description: "Gate keberangkatan internasional 10",
    categoryName: "Gate",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Gate 11",
    code: "GT-22-02",
    description: "Gate keberangkatan internasional 11",
    categoryName: "Gate",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Nursery Room T2",
    code: "TL-22-01",
    description: "Ruang menyusui dan ganti popok",
    categoryName: "Toilet & Nursery",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Klinik Kesehatan T2",
    code: "MD-22-01",
    description: "Layanan medis darurat bandara",
    categoryName: "Medical",
    floorKey: "T2-L2",
    isActive: true,
  },
  {
    name: "Money Changer T2",
    code: "SV-22-01",
    description: "Penukaran mata uang asing",
    categoryName: "Services",
    floorKey: "T2-L2",
    isActive: true,
  },
];

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
        update: {
          icon: category.icon,
          color: category.color,
        },
        create: {
          name: category.name,
          icon: category.icon,
          color: category.color,
        },
      });
      categoryMap.set(category.name, result.id);
    }

    console.log(`   ✅ ${CATEGORIES.length} categories selesai\n`);

    // ── 2. Floors ─────────────────────────────────────────────────────────────
    console.log("🏢 Seeding floors...");

    const floorMap = new Map<FloorKey, number>();

    for (const floor of FLOORS) {
      const result = await tx.floor.upsert({
        where: {
          terminal_floorNumber: {
            terminal: floor.terminal,
            floorNumber: floor.floorNumber,
          },
        },
        update: { label: floor.label },
        create: {
          terminal: floor.terminal,
          floorNumber: floor.floorNumber,
          label: floor.label,
        },
      });
      const key: FloorKey = `${floor.terminal}-L${floor.floorNumber}` as FloorKey;
      floorMap.set(key, result.id);
    }

    console.log(`   ✅ ${FLOORS.length} floors selesai\n`);

    // ── 3. Facilities ─────────────────────────────────────────────────────────
    console.log("🏪 Seeding facilities...");

    for (const facility of FACILITIES) {
      const categoryId = categoryMap.get(facility.categoryName);
      const floorId = floorMap.get(facility.floorKey);

      if (!categoryId) throw new Error(`Category tidak ditemukan: ${facility.categoryName}`);
      if (!floorId)    throw new Error(`Floor tidak ditemukan: ${facility.floorKey}`);

      await tx.facility.upsert({
        where: { code: facility.code },
        update: {
          name: facility.name,
          description: facility.description,
          categoryId,
          floorId,
          isActive: facility.isActive,
        },
        create: {
          name: facility.name,
          code: facility.code,
          description: facility.description,
          categoryId,
          floorId,
          nodeId: null, // graph belum dibuat
          isActive: facility.isActive,
        },
      });
    }

    console.log(`   ✅ ${FACILITIES.length} facilities selesai\n`);

    // ── 4. Admin ──────────────────────────────────────────────────────────────
    console.log("👤 Seeding admin...");

    const hashedPassword = await bcryptjs.hash("admin123", 10);

    await tx.admin.upsert({
      where: { email: "admin@juanda.com" },
      update: { name: "Admin Juanda" },
      create: {
        email: "admin@juanda.com",
        name: "Admin Juanda",
        password: hashedPassword,
      },
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