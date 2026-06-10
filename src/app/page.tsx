"use client";

import Image from "next/image";
import { useMapStore } from "@/store/mapStore";
import TerminalSelector from "@/components/ui/terminalSelector";
import CategoryBar from "@/components/ui/categoryBar";
import RealtimeClock from "@/components/ui/realtimeClock";
import SearchModal from "@/components/ui/searchModal";
import POIDetailPopup from "@/components/ui/POIDetailPopup";
import RoutePanel from "@/components/ui/routePanel";
import MapCanvas from "@/components/map/mapCanvas";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import IdleWarningBanner from "@/components/ui/idleWarningBanner";


export default function HomePage() {
  const isSearchOpen     = useMapStore((s) => s.isSearchOpen);
  const selectedFacility = useMapStore((s) => s.selectedFacility);
  const isRouteOpen      = useMapStore((s) => s.isRouteOpen);
  const { countdown }    = useIdleTimer();
  const mapMode    = useMapStore(s => s.mapMode);
  const setMapMode = useMapStore(s => s.setMapMode);

  return (
    <main
      className={[
        "relative w-full h-screen",
        "flex flex-col",
        "overflow-hidden",
        "bg-gray-100",
      ].join(" ")}
    >
      {/* ── Top bar ── */}
      <div
        className={[
          "flex justify-center px-6 py-3",
          "bg-white",
          "shadow-[0_1px_0_#e5e7eb,0_2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        <TerminalSelector />
      </div>

      {/* ── Map area ── */}
      <div
        className={[
          "flex-1",
          "min-h-0",
          "overflow-hidden",
          "flex items-center justify-center",
          "px-8 py-4",
        ].join(" ")}
      >
        {/* MapCanvas tidak menerima routeResult — PathRenderer baca langsung dari store */}
        <MapCanvas />
        
        <button
        onClick={() => setMapMode(mapMode === "grid" ? "view" : "grid")}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          padding: "8px 14px",
          background: mapMode === "grid" ? "#1e293b" : "#f8fafc",
          color: mapMode === "grid" ? "#fff" : "#1e293b",
          border: "1.5px solid #94a3b8",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {mapMode === "grid" ? "🗺 SVG Mode" : "🔲 Wall Debug"}
      </button>

      </div>

      {/* ── Bottom bar ── */}
      <div
        className={[
          "flex items-center justify-between px-6 py-2",
          "bg-white",
          "shadow-[0_-1px_0_#e5e7eb,0_-2px_12px_rgba(0,0,0,0.06)]",
        ].join(" ")}
      >
        <div className="flex items-center min-w-30">
          <Image
            src="/logo.svg"
            alt="InJourney Airports"
            width={120}
            height={60}
            className="object-contain"
            draggable={false}
            priority
          />
        </div>

        <div className="flex-1 flex justify-center">
          <CategoryBar />
        </div>

        <div className="flex items-center justify-end min-w-30">
          <RealtimeClock />
        </div>
      </div>

      {/* ── Overlays ── */}
      {countdown !== null && <IdleWarningBanner countdown={countdown} />}

      {isSearchOpen && <SearchModal />}

      {/* Popup hanya tampil saat ada POI dipilih DAN rute belum dibuka */}
      {selectedFacility && !isRouteOpen && <POIDetailPopup />}

      {/* RoutePanel baca + tulis store sendiri — tidak perlu props dari page */}
      {isRouteOpen && <RoutePanel />}
    </main>

    
  );
}