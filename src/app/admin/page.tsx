"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useMapStore } from "@/store/mapStore";
import { useState } from "react";

import MapCanvas from "@/components/map/mapCanvas";
import TerminalSelector from "@/components/ui/terminalSelector";
import RealtimeClock from "@/components/ui/realtimeClock";
import AdminToggle from "@/components/admin/adminToggle";
import AdminCategoryBar from "@/components/admin/adminCategoryBar";
import EditCategoryModal from "@/components/admin/category/editCategoryModal";
import EditFacilityModal from "@/components/admin/facility/editFacilityModal";

// Import komponen AdminSearchModal yang sebelumnya terlewat
import AdminSearchModal from "@/components/admin/adminSearchModal";

export default function AdminPage() {
  const { data: session }     = useSession();
  const mapMode               = useMapStore((s) => s.mapMode);
  const isAdmin               = mapMode === "admin";
  const adminSelectedFacility = useMapStore((s) => s.adminSelectedFacility);
  
  // Mengambil fungsi setter dari store untuk memproses fasilitas yang dipilih dari pencarian
  const setAdminSelectedFacility = useMapStore((s) => s.setAdminSelectedFacility);

  const [showAddCategory,    setShowAddCategory]    = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [categoryBarKey,     setCategoryBarKey]     = useState(0);

  return (
    <main className="relative w-full h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow-[0_1px_0_#e5e7eb,0_2px_12px_rgba(0,0,0,0.06)]">

        {/* Kiri: info user + signout */}
        <div className="flex items-center gap-3 min-w-50">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Logged in as</span>
            <span className="text-sm font-medium text-gray-700">
              {session?.user?.name ?? session?.user?.email ?? "Admin"}
            </span>
          </div>
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="ml-2 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Tengah: terminal selector + judul */}
        <div className="flex flex-col items-center gap-1">
          <TerminalSelector />
          <span className="text-xs text-gray-400">
            {isAdmin
              ? "Admin Mode ON — klik POI untuk edit"
              : "Admin Mode OFF — view only"}
          </span>
        </div>

        {/* Kanan: admin toggle */}
        <div className="flex items-center justify-end min-w-50">
          <AdminToggle />
        </div>
      </div>

      {/* ── Map area ── */}
      <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center px-8 py-4">
        <MapCanvas />
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex items-center justify-between px-6 py-2 bg-white shadow-[0_-1px_0_#e5e7eb,0_-2px_12px_rgba(0,0,0,0.06)]">

        {/* Logo */}
        <div className="flex items-center min-w-30">
          <Image
            src="/logo.png"
            alt="InJourney Airports"
            width={120}
            height={60}
            className="object-contain"
            draggable={false}
            priority
          />
        </div>

        {/* Category bar versi admin */}
        <div className="flex-1 flex justify-center">
          <AdminCategoryBar key={categoryBarKey} />
        </div>

        {/* Kanan: jam + Add Kategori */}
        <div className="flex items-center gap-4 min-w-50 justify-end">
          {isAdmin && (
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              <span>Add Kategori</span>
              <span className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-base leading-none">
                +
              </span>
            </button>
          )}
          <RealtimeClock />
        </div>
      </div>

      {/* ── FAB + ── */}
      {isAdmin && (
        <button
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gray-900 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-gray-700 active:scale-95 transition z-50"
          title="Tambah Fasilitas"
          disabled
        >
          +
        </button>
      )}

      {/* ── Sign Out Confirm ── */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 w-80">
            <p className="text-base font-semibold text-gray-800 text-center">
              Yakin ingin sign out?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Kategori Modal ── */}
      {showAddCategory && (
        <EditCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSaved={() => {
            setShowAddCategory(false);
            setCategoryBarKey((k) => k + 1);
          }}
        />
      )}

      {/* ── Edit Facility Modal ── */}
      {adminSelectedFacility && <EditFacilityModal />}

      {/* ── Admin Search Modal ── */}
      <AdminSearchModal onEdit={(facility) => setAdminSelectedFacility(facility)} />

    </main>
  );
}