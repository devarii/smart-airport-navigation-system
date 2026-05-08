"use client";

import { useState, useEffect } from "react";
import { useMapStore } from "@/store/mapStore";
import type { Category, FacilityWithRelations, OperationalHour } from "@/types";
import OperationalHoursModal from "@/components/admin/facility/operationalHoursModal";

// =============================================================================
// HELPERS
// =============================================================================

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =============================================================================
// KOMPONEN UTAMA
// =============================================================================

export default function EditFacilityModal() {
  const adminSelectedFacility      = useMapStore((s) => s.adminSelectedFacility);
  const setAdminSelectedFacility   = useMapStore((s) => s.setAdminSelectedFacility);
  const incrementFacilitiesVersion = useMapStore((s) => s.incrementFacilitiesVersion);

  const facility = adminSelectedFacility!;

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name,        setName]        = useState("");
  const [code,        setCode]        = useState("");
  const [description, setDescription] = useState("");
  const [categoryId,  setCategoryId]  = useState<number>(0);
  const [photo,       setPhoto]       = useState<string | null>(null);
  const [hours,       setHours]       = useState<OperationalHour[]>([]);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [categories,     setCategories]     = useState<Category[]>([]);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);

  // Sync form saat facility berubah
  useEffect(() => {
    if (!facility) return;
    setName(facility.name);
    setCode(facility.code);
    setDescription(facility.description ?? "");
    setCategoryId(facility.categoryId);
    setPhoto(facility.photo ?? null);
    setHours(facility.operationalHours);
    setError(null);
  }, [facility]);

  // Fetch categories untuk dropdown
  useEffect(() => {
    async function load() {
      const res  = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    }
    load();
  }, []);

  if (!facility) return null;

  // ── Handle upload foto ─────────────────────────────────────────────────────
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB.");
      return;
    }
    const base64 = await toBase64(file);
    setPhoto(base64);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    setError(null);

    if (!name.trim()) { setError("Nama fasilitas wajib diisi."); return; }
    if (!code.trim()) { setError("Kode tempat wajib diisi.");    return; }
    if (!categoryId)  { setError("Kategori wajib dipilih.");     return; }

    setLoading(true);

    try {
      const res = await fetch(`/api/facilities/${facility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        name.trim(),
          code:        code.trim(),
          description: description.trim() || null,
          categoryId,
          photo:       photo ?? null,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Gagal menyimpan.");
        return;
      }

      // Trigger re-fetch di MapCanvas — marker langsung update tanpa refresh
      incrementFacilitiesVersion();

      setAdminSelectedFacility(null);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setAdminSelectedFacility(null);
  }

  function renderHoursSummary(): string {
    if (hours.length === 0) return "Belum diatur";
    const open = hours.filter((h) => h.isOpen).length;
    return `${open} / 7 hari buka`;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="relative bg-[#dce8f5] rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 flex flex-col gap-4">

          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 flex flex-col items-center text-gray-500 hover:text-gray-800 transition"
          >
            <span className="text-2xl leading-none">✕</span>
            <span className="text-[10px] mt-0.5">Close</span>
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-3">
            Edit Detail Lokasi
          </h2>

          <div className="flex gap-5">

            {/* ── Kiri: foto ── */}
            <div className="flex flex-col items-center gap-3 shrink-0 w-36">
              <div className="w-full aspect-square rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10"
                      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                    <span className="text-[10px] text-center px-1 text-gray-400">
                      Belum ada foto
                    </span>
                  </div>
                )}
              </div>

              <label className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600 transition cursor-pointer">
                <span>↑</span>
                <span>Upload Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>

              {photo && (
                <button onClick={() => setPhoto(null)}
                  className="w-full text-xs text-red-400 hover:text-red-600 transition">
                  Hapus foto
                </button>
              )}
            </div>

            {/* ── Kanan: form ── */}
            <div className="flex-1 flex flex-col gap-3">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Nama lokasi <span className="text-red-500">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Musholla Terminal 1"
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Kode tempat <span className="text-red-500">*</span>
                </label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: T4-T1L2"
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Jam Operasional <span className="text-red-500">*</span>
                </label>
                <button type="button" onClick={() => setShowHoursModal(true)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-left text-gray-600 hover:border-blue-400 transition flex items-center justify-between">
                  <span>{renderHoursSummary()}</span>
                  <span className="text-gray-400">✎</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Deskripsi Fasilitas <span className="text-red-500">*</span>
                </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan detail fasilitas di sini.." rows={3}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Kategori Tempat <span className="text-red-500">*</span>
                </label>
                <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                  <option value={0} disabled>Pilih kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex justify-end gap-3 mt-1">
            <button onClick={handleClose} disabled={loading}
              className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition disabled:opacity-60">
              {loading ? "Menyimpan..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {showHoursModal && (
        <OperationalHoursModal
          facilityId={facility.id}
          initialHours={hours}
          onClose={() => setShowHoursModal(false)}
          onSaved={(updated) => {
            setHours(updated);
            setShowHoursModal(false);
          }}
        />
      )}
    </>
  );
}