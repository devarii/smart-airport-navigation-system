// prisma/seed.ts
import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcryptjs from "bcryptjs";
import {
  T1_WALL_DATA,
  ROWS as T1_ROWS,
  COLS as T1_COLS,
  START_R as T1_START_R,
  START_C as T1_START_C,
} from "@/data/walls/t1";
import {
  T2_WALL_DATA,
  ROWS as T2_ROWS,
  COLS as T2_COLS,
  START_R as T2_START_R,
  START_C as T2_START_C,
} from "@/data/walls/t2";
import seedData from "./seed-data.json";

// =============================================================================
// SETUP
// =============================================================================

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// =============================================================================
// TYPES
// =============================================================================

interface SeedCategory {
  id: number;
  name: string;
  icon: string | null;
  color: string;
  terminals: string[];
  sortOrder: number;
}

interface SeedFloor {
  id: number;
  terminal: string;
  floorNumber: number;
  label: string;
  gridRows: number | null;
  gridCols: number | null;
  startRow: number | null;
  startCol: number | null;
}

interface SeedFacility {
  id: number;
  name: string;
  code: string;
  destId: string | null;
  description: string | null;
  categoryId: number;
  floorId: number;
  gridRow: number | null;
  gridCol: number | null;
  photo: string | null;
  isActive: boolean;
}

interface SeedOperationalHour {
  id: number;
  facilityId: number;
  day: number;
  isOpen: boolean;
  is24Hours: boolean;
  openTime: string | null;
  closeTime: string | null;
}

interface SeedAdmin {
  email: string;
  name: string;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("🌱 Memulai seed...\n");

  const categories     = seedData.categories     as SeedCategory[];
  const floors         = seedData.floors         as SeedFloor[];
  const facilities     = seedData.facilities     as SeedFacility[];
  const operationalHours = seedData.operationalHours as SeedOperationalHour[];
  const admins         = seedData.admins         as SeedAdmin[];

  await prisma.$transaction(async (tx) => {

    // ── 1. Categories ─────────────────────────────────────────────────────────
    console.log("📂 Seeding categories...");
    // Map: old id (dari JSON) → new id (dari DB)
    const categoryIdMap = new Map<number, number>();

    for (const cat of categories) {
      const result = await tx.category.upsert({
        where:  { name: cat.name },
        update: {
          icon:      cat.icon,
          color:     cat.color,
          terminals: cat.terminals,
          sortOrder: cat.sortOrder,
        },
        create: {
          name:      cat.name,
          icon:      cat.icon,
          color:     cat.color,
          terminals: cat.terminals,
          sortOrder: cat.sortOrder,
        },
      });
      categoryIdMap.set(cat.id, result.id);
    }
    console.log(`   ✅ ${categories.length} categories selesai\n`);

    // ── 2. Floors ─────────────────────────────────────────────────────────────
    console.log("🏢 Seeding floors...");
    // Map: old id (dari JSON) → new id (dari DB)
    const floorIdMap = new Map<number, number>();

    for (const floor of floors) {
      // wallData dan grid config diambil dari import, bukan dari JSON
      const isT1   = floor.terminal === "T1";
      const wallData   = isT1 ? T1_WALL_DATA : T2_WALL_DATA;
      const gridRows   = isT1 ? T1_ROWS       : T2_ROWS;
      const gridCols   = isT1 ? T1_COLS       : T2_COLS;
      const startRow   = isT1 ? T1_START_R    : T2_START_R;
      const startCol   = isT1 ? T1_START_C    : T2_START_C;

      const result = await tx.floor.upsert({
        where: {
          terminal_floorNumber: {
            terminal:    floor.terminal,
            floorNumber: floor.floorNumber,
          },
        },
        update: {
          label:    floor.label,
          gridRows,
          gridCols,
          startRow,
          startCol,
          wallData: wallData as unknown as Prisma.InputJsonValue,
        },
        create: {
          terminal:    floor.terminal,
          floorNumber: floor.floorNumber,
          label:       floor.label,
          gridRows,
          gridCols,
          startRow,
          startCol,
          wallData:    wallData as unknown as Prisma.InputJsonValue,
        },
      });
      floorIdMap.set(floor.id, result.id);
    }
    console.log(`   ✅ ${floors.length} floors selesai\n`);

    // ── 3. Facilities ─────────────────────────────────────────────────────────
    console.log("🏪 Seeding facilities...");
    // Map: old id (dari JSON) → new id (dari DB) — dipakai untuk operationalHours
    const facilityIdMap = new Map<number, number>();

    for (const facility of facilities) {
      const categoryId = categoryIdMap.get(facility.categoryId);
      const floorId    = floorIdMap.get(facility.floorId);

      if (!categoryId) throw new Error(`Category ID tidak ditemukan untuk mapping: ${facility.categoryId} (facility: ${facility.code})`);
      if (!floorId)    throw new Error(`Floor ID tidak ditemukan untuk mapping: ${facility.floorId} (facility: ${facility.code})`);

      const result = await tx.facility.upsert({
        where:  { code: facility.code },
        update: {
          name:        facility.name,
          destId:      facility.destId,
          description: facility.description,
          categoryId,
          floorId,
          gridRow:     facility.gridRow,
          gridCol:     facility.gridCol,
          photo:       facility.photo,
          isActive:    facility.isActive,
        },
        create: {
          name:        facility.name,
          code:        facility.code,
          destId:      facility.destId,
          description: facility.description,
          categoryId,
          floorId,
          gridRow:     facility.gridRow,
          gridCol:     facility.gridCol,
          photo:       facility.photo,
          isActive:    facility.isActive,
        },
      });
      facilityIdMap.set(facility.id, result.id);
    }
    console.log(`   ✅ ${facilities.length} facilities selesai\n`);

    // ── 4. Operational Hours ──────────────────────────────────────────────────
    console.log("🕐 Seeding operational hours...");

    for (const oh of operationalHours) {
      const facilityId = facilityIdMap.get(oh.facilityId);
      if (!facilityId) continue; // skip kalau facilityId tidak ada di map

      await tx.operationalHour.upsert({
        where:  { facilityId_day: { facilityId, day: oh.day } },
        update: {
          isOpen:    oh.isOpen,
          is24Hours: oh.is24Hours,
          openTime:  oh.openTime,
          closeTime: oh.closeTime,
        },
        create: {
          facilityId,
          day:       oh.day,
          isOpen:    oh.isOpen,
          is24Hours: oh.is24Hours,
          openTime:  oh.openTime,
          closeTime: oh.closeTime,
        },
      });
    }
    console.log(`   ✅ ${operationalHours.length} operational hours selesai\n`);

    // ── 5. Admin ──────────────────────────────────────────────────────────────
    console.log("👤 Seeding admin...");
    const hashedPassword = await bcryptjs.hash("admin123", 10);

    await tx.admin.upsert({
      where:  { email: "adminjuanda@gmail.com" },
      update: { name: admins[0]?.name ?? "Admin Juanda" },
      create: {
        email:    "adminjuanda@gmail.com",
        name:     admins[0]?.name ?? "Admin Juanda",
        password: hashedPassword,
      },
    });
    console.log("   ✅ Admin selesai\n");
  }, { timeout: 60000 });

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