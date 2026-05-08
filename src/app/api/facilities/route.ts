import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type {
  ApiSuccess,
  ApiError,
  FacilityWithRelations,
  CreateFacilityPayload,
} from "@/types";

// =============================================================================
// GET /api/facilities — ambil semua fasilitas dengan filter opsional
// =============================================================================

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiSuccess<FacilityWithRelations[]> | ApiError>> {
  try {
    const { searchParams } = req.nextUrl;

    const terminal  = searchParams.get("terminal");   // "T1" | "T2"
    const floor     = searchParams.get("floor");       // "1" | "2"
    const category  = searchParams.get("category");    // category id
    const search    = searchParams.get("search");      // nama fasilitas
    const active    = searchParams.get("active");      // "true" | "false"

    const facilities = await prisma.facility.findMany({
      where: {
        // Filter by terminal — lewat relasi floor
        ...(terminal && {
          floor: { terminal },
        }),

        // Filter by floor number
        ...(floor && {
          floor: { floorNumber: parseInt(floor, 10) },
        }),

        // Filter by terminal + floor sekaligus
        ...(terminal && floor && {
          floor: {
            terminal,
            floorNumber: parseInt(floor, 10),
          },
        }),

        // Filter by category id
        ...(category && {
          categoryId: parseInt(category, 10),
        }),

        // Filter by nama (case-insensitive)
        ...(search && {
          name: { contains: search, mode: "insensitive" },
        }),

        // Filter by isActive
        ...(active !== null && {
          isActive: active === "true",
        }),
      },
      include: {
        category: true,
        floor: true,
        node: true,
        operationalHours: {
          orderBy: { day: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: facilities });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data fasilitas" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/facilities — tambah fasilitas baru (admin only)
// =============================================================================

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiSuccess<FacilityWithRelations> | ApiError>> {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body: CreateFacilityPayload = await req.json();
    const { name, code, description, categoryId, floorId, nodeId, isActive, photo, gridRow, gridCol } = body;

    // Validasi field wajib
    if (!name || !code || !categoryId || !floorId) {
      return NextResponse.json(
        { success: false, error: "name, code, categoryId, dan floorId wajib diisi" },
        { status: 400 }
      );
    }

    // Cek code unik
    const existing = await prisma.facility.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Code "${code}" sudah dipakai fasilitas lain` },
        { status: 409 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        name,
        code,
        description: description ?? null,
        categoryId,
        floorId,
        nodeId:   nodeId   ?? null,
        isActive: isActive ?? true,
        photo:    photo    ?? null,
        gridRow:  gridRow  ?? null,
        gridCol:  gridCol  ?? null,
      },
      include: {
        category: true,
        floor: true,
        node: true,
        operationalHours: { orderBy: { day: "asc" } },
      },
    });

    return NextResponse.json(
      { success: true, data: facility },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal membuat fasilitas baru" },
      { status: 500 }
    );
  }
}