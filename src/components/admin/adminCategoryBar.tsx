"use client";

import { useEffect, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import type { Category } from "@/types";
import EditCategoryModal from "@/components/admin/category/editCategoryModal";
import DeleteConfirm from "@/components/admin/category/deleteConfirm";

// =============================================================================
// HELPER — render icon sesuai tipe konten
// =============================================================================

function CategoryIcon({ icon, name }: { icon: string | null; name: string }) {
  if (!icon) {
    return (
      <span className="text-white text-xs font-bold text-center leading-tight px-1">
        {name.slice(0, 3).toUpperCase()}
      </span>
    );
  }

  if (icon.trimStart().startsWith("<svg")) {
    return (
      <div
        className="w-7 h-7 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-white"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  if (icon.startsWith("data:") || icon.startsWith("http") || icon.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt={name} className="w-7 h-7 object-contain" />
    );
  }

  return (
    <span className="text-2xl leading-none">{icon}</span>
  );
}

// =============================================================================
// KOMPONEN UTAMA
// =============================================================================

export default function AdminCategoryBar() {
  const mapMode        = useMapStore((s) => s.mapMode);
  const setIsSearchOpen = useMapStore((s) => s.setIsSearchOpen);
  const isAdmin        = mapMode === "admin";

  const [categories,   setCategories]   = useState<Category[]>([]);
  const [editTarget,   setEditTarget]   = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    async function load() {
      const res  = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    }
    load();
  }, []);

  function handleSaved(updated: Category) {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
      return [...prev, updated];
    });
  }

  function handleDeleted(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  // Gabungkan search + kategori jadi satu list, lalu bagi 2 baris
  const allItems = [
    { type: "search" as const },
    ...categories.map((c) => ({ type: "category" as const, data: c })),
  ];
  const half   = Math.ceil(allItems.length / 2);
  const rowOne = allItems.slice(0, half);
  const rowTwo = allItems.slice(half);

  const renderSearchButton = () => (
    <button
      key="search"
      onClick={() => setIsSearchOpen(true)}
      aria-label="Buka pencarian fasilitas"
      className="flex flex-col items-center gap-1 transition-all duration-150 active:scale-95"
    >
      <div
        className={[
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          "bg-orange-500",
          "shadow-[0_3px_8px_rgba(249,115,22,0.40)]",
          "hover:scale-105 transition-transform duration-150",
        ].join(" ")}
      >
        <svg
          className="w-6 h-6 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
      <span className="text-[10px] text-gray-500 font-medium leading-tight text-center">
        Search
      </span>
    </button>
  );

  const renderCategoryButton = (cat: Category) => (
    <div
      key={cat.id}
      className="relative flex flex-col items-center gap-1 transition-all duration-150 active:scale-95"
    >
      {/* Badge admin */}
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

      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.14)] hover:scale-105 transition-transform duration-150"
        style={{ backgroundColor: cat.color }}
      >
        <CategoryIcon icon={cat.icon} name={cat.name} />
      </div>

      <span className="text-[10px] text-gray-500 font-medium leading-tight text-center w-12 line-clamp-1">
        {cat.name}
      </span>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center gap-2 px-4 py-2">
        {/* Baris 1 */}
        <div className="flex gap-3 justify-center">
          {rowOne.map((item) =>
            item.type === "search"
              ? renderSearchButton()
              : renderCategoryButton(item.data)
          )}
        </div>

        {/* Baris 2 */}
        {rowTwo.length > 0 && (
          <div className="flex gap-3 justify-center">
            {rowTwo.map((item) =>
              item.type === "search"
                ? renderSearchButton()
                : renderCategoryButton(item.data)
            )}
          </div>
        )}
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