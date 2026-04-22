"use client";

import { useMapStore } from "@/store/mapStore";
import { DAY_LABELS } from "@/types";
import type { DayOfWeek, OperationalHour } from "@/types";

export default function POIDetailPopup() {
  const selectedFacility = useMapStore((s) => s.selectedFacility);
  const clearSelectedFacility = useMapStore((s) => s.clearSelectedFacility);
  const isRouteOpen = useMapStore((s) => s.isRouteOpen);
  const setIsRouteOpen = useMapStore((s) => s.setIsRouteOpen);

  if (!selectedFacility) return null;

  // getDay() → 0=Minggu, konversi ke 1=Senin...7=Minggu
  const jsDay = new Date().getDay();
  const todayDay: DayOfWeek = jsDay === 0 ? 7 : (jsDay as DayOfWeek);

  const handleRouteClick = () => {
    setIsRouteOpen(true);
  };

  const handleClose = () => {
    clearSelectedFacility();
  };

  const formatJam = (hour: OperationalHour): string => {
    if (!hour.isOpen) return "Tutup";
    if (hour.is24Hours) return "24 Jam";
    if (hour.openTime && hour.closeTime) {
      return `${hour.openTime} – ${hour.closeTime}`;
    }
    return "—";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${selectedFacility.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={[
          "relative z-10 w-full max-w-lg mx-4",
          "max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden",
          "bg-gray-900 rounded-2xl shadow-2xl",
          "flex flex-col",
          "animate-in fade-in zoom-in-95 duration-150",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-white/10">
          {/* Icon kategori */}
          <span
            className="shrink-0 text-[clamp(32px,4vw,44px)] leading-none mt-0.5"
            aria-hidden="true"
          >
            {selectedFacility.category.icon}
          </span>

          {/* Nama fasilitas */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-[clamp(18px,2.2vw,26px)] leading-tight">
              {selectedFacility.name}
            </h2>
            {selectedFacility.code && (
              <p className="text-white/40 text-[clamp(12px,1.2vw,14px)] mt-0.5">
                {selectedFacility.code}
              </p>
            )}
          </div>

          {/* Tombol tutup */}
          <button
            onClick={handleClose}
            aria-label="Tutup detail fasilitas"
            className={[
              "shrink-0 flex items-center justify-center",
              "min-w-15 min-h-15 rounded-xl -mt-1 -mr-1",
              "text-white/60 hover:text-white hover:bg-white/10",
              "transition-colors duration-150",
            ].join(" ")}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-5">

          {/* Badge kategori + lantai */}
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1 rounded-full text-white text-[clamp(12px,1.3vw,14px)] font-medium"
              style={{ backgroundColor: selectedFacility.category.color }}
            >
              {selectedFacility.category.icon} {selectedFacility.category.name}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[clamp(12px,1.3vw,14px)]">
              📍 {selectedFacility.floor.label}
            </span>
          </div>

          {/* Deskripsi */}
          {selectedFacility.description && (
            <p className="text-white/70 text-[clamp(14px,1.6vw,17px)] leading-relaxed">
              {selectedFacility.description}
            </p>
          )}

          {/* Jam operasional */}
          {selectedFacility.operationalHours.length > 0 && (
            <div>
              <h3 className="text-white/60 text-[clamp(12px,1.3vw,14px)] font-semibold uppercase tracking-wider mb-3">
                Jam Operasional
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {selectedFacility.operationalHours
                  .slice()
                  .sort((a, b) => a.day - b.day)
                  .map((hour) => {
                    const isToday = hour.day === todayDay;
                    const isClosed = !hour.isOpen;

                    return (
                      <div key={hour.id} className="contents">
                        {/* Nama hari */}
                        <span
                          className={[
                            "text-[clamp(13px,1.4vw,16px)]",
                            isToday
                              ? "text-sky-400 font-bold"
                              : isClosed
                              ? "text-white/30 line-through"
                              : "text-white/70",
                          ].join(" ")}
                        >
                          {isToday ? "▶ " : ""}
                          {DAY_LABELS[hour.day as DayOfWeek]}
                        </span>

                        {/* Jam */}
                        <span
                          className={[
                            "text-[clamp(13px,1.4vw,16px)]",
                            isToday
                              ? "text-sky-400 font-bold"
                              : isClosed
                              ? "text-white/30 line-through"
                              : "text-white/60",
                          ].join(" ")}
                        >
                          {formatJam(hour)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Tombol rute */}
          <button
            onClick={handleRouteClick}
            disabled={isRouteOpen}
            aria-label={
              isRouteOpen
                ? "Panel rute sudah terbuka"
                : "Tampilkan rute ke fasilitas ini"
            }
            className={[
              "w-full min-h-15 rounded-2xl",
              "text-[clamp(16px,1.8vw,20px)] font-semibold",
              "transition-colors duration-150",
              isRouteOpen
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white",
            ].join(" ")}
          >
            {isRouteOpen ? "✅ Panel Rute Terbuka" : "🗺️ Rute ke sini"}
          </button>

        </div>
      </div>
    </div>
  );
}