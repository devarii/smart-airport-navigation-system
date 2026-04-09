import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { ApiSuccess, ApiError, CreateCategoryPayload } from "@/types";
import type { Category } from "@/types";

// =============================================================================
// GET /api/categories — ambil semua kategori
// =============================================================================

export async function GET(): Promise<NextResponse<ApiSuccess<Category[]> | ApiError>> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/categories — tambah kategori baru (admin only)
// =============================================================================

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiSuccess<Category> | ApiError>> {
  // Cek session admin
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body: CreateCategoryPayload = await req.json();
    const { name, icon, color } = body;

    // Validasi field wajib
    if (!name || !icon || !color) {
      return NextResponse.json(
        { success: false, error: "name, icon, dan color wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, icon, color },
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori baru" },
      { status: 500 }
    );
  }
}