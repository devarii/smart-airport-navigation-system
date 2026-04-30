"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import type { Category } from "@/types";
import EditCategoryModal from "@/components/admin/category/editCategoryModal";
import DeleteConfirm from "@/components/admin/category/deleteConfirm";

export default function AdminCategoryBar() {
  const mapMode = useMapStore((s) => s.mapMode);
  const isAdmin = mapMode === "admin";

  const [categories, setCategories]     = useState<Category[]>([]);
  const [editTarget, setEditTarget]     = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    async function load() {
      const res  = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    }
    load();
  }, []);

  // Setelah save → update list lokal tanpa refetch
  function handleSaved(updated: Category) {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      if (exists) {
        return prev.map((c) => (c.id === updated.id ? updated : c));
      }
      return [...prev, updated];
    });
  }

  // Setelah delete → hapus dari list lokal
  function handleDeleted(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <div className="flex items-center gap-3 overflow-x-auto py-1 px-2">
        {categories.map((cat) => (
          <div key={cat.id} className="relative flex flex-col items-center shrink-0">

            {/* Badge delete (merah) + edit (biru) — hanya saat admin ON */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="absolute -top-1 -left-1 z-10 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow hover:bg-red-600 transition"
                  title="Hapus kategori"
                >
                  ×
                </button>
                <button
                  onClick={() => setEditTarget(cat)}
                  className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center shadow hover:bg-blue-600 transition"
                  title="Edit kategori"
                >
                  ✎
                </button>
              </>
            )}

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon && cat.icon.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cat.icon} alt={cat.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-white text-xs font-bold text-center leading-tight px-1">
                  {cat.name.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>

            <span className="text-[11px] text-gray-600 mt-1 text-center max-w-16 leading-tight line-clamp-2">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Modals */}
      {editTarget && (
        <EditCategoryModal
          initialData={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}