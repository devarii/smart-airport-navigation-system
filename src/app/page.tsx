"use client";

import Image from "next/image";
import { useMapStore } from "@/store/mapStore";
import TerminalFloorSelector from "@/components/ui/terminalFloorSelector";
import CategoryBar from "@/components/ui/categoryBar";
import RealtimeClock from "@/components/ui/realtimeClock";
import SearchModal from "@/components/ui/searchModal";
import POIDetailPopup from "@/components/ui/POIDetailPopup";

export default function HomePage() {
  const isSearchOpen = useMapStore((s) => s.isSearchOpen);
  const selectedFacility = useMapStore((s) => s.selectedFacility);
  // Tambahkan ini jika kamu butuh fungsi membuka search dari tombol/elemen lain
  const setIsSearchOpen = useMapStore((s) => s.setIsSearchOpen);

  return (
    <main className="relative w-full min-h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* ── Top bar ── */}
      <div
        className={[
          "flex justify-center px-6 py-3",
          "bg-white",
          "shadow-[0_1px_0_#e5e7eb,0_2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        <TerminalFloorSelector />
      </div>

      {/* ── Map area ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-4">
        <div
          className={[
            "w-full max-w-283.25 aspect-1133/172",
            "bg-white rounded-2xl",
            "shadow-[0_2px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)]",
            "border border-gray-200/80",
            "flex items-center justify-center",
            "text-gray-300 text-[clamp(14px,1.6vw,18px)] font-medium tracking-wide",
          ].join(" ")}
          aria-label="Area peta bandara"
        >
          Peta akan ditampilkan di sini
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className={[
          "flex items-center justify-between px-6 py-2",
          "bg-white",
          "shadow-[0_-1px_0_#e5e7eb,0_-2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        {/* Kiri: Logo */}
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

        {/* Tengah: CategoryBar */}
        <div className="flex-1 flex justify-center">
          <CategoryBar />
        </div>

        {/* Kanan: RealtimeClock */}
        <div className="flex items-center justify-end min-w-30">
          <RealtimeClock />
        </div>
      </div>

      {/* ── Overlays ── */}
      {isSearchOpen && <SearchModal />}
      {selectedFacility && <POIDetailPopup />}

    </main>
  );
}