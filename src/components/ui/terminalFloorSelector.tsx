"use client";

import { useMapStore } from "@/store/mapStore";
import type { TerminalId, FloorNumber } from "@/types";

// =============================================================================
// DATA
// =============================================================================

const TERMINALS: { value: TerminalId; label: string }[] = [
  { value: "T1", label: "Terminal 1" },
  { value: "T2", label: "Terminal 2" },
];

const FLOORS: { value: FloorNumber; label: string }[] = [
  { value: 1, label: "Lantai 1" },
  { value: 2, label: "Lantai 2" },
];

// =============================================================================
// CHEVRON ICON
// =============================================================================

function ChevronDown() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function TerminalFloorSelector() {
  const activeTerminal  = useMapStore((s) => s.activeTerminal);
  const activeFloor     = useMapStore((s) => s.activeFloor);
  const setActiveTerminal = useMapStore((s) => s.setActiveTerminal);
  const setActiveFloor    = useMapStore((s) => s.setActiveFloor);

  function handleTerminalChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const terminal = e.target.value as TerminalId;
    setActiveTerminal(terminal);
    setActiveFloor(1); // reset floor ke 1 saat terminal berganti
  }

  function handleFloorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActiveFloor(Number(e.target.value) as FloorNumber);
  }

  return (
    <div className="selector-wrapper">
      {/* Terminal Dropdown */}
      <div className="select-container">
        <select
          value={activeTerminal}
          onChange={handleTerminalChange}
          className="select-input"
          aria-label="Pilih Terminal"
        >
          {TERMINALS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <span className="select-chevron">
          <ChevronDown />
        </span>
      </div>

      {/* Floor Dropdown */}
      <div className="select-container">
        <select
          value={activeFloor}
          onChange={handleFloorChange}
          className="select-input"
          aria-label="Pilih Lantai"
        >
          {FLOORS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <span className="select-chevron">
          <ChevronDown />
        </span>
      </div>

      <style>{`
        .selector-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .select-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 200px;
        }

        .select-input {
          width: 100%;
          min-height: 60px;
          padding: 0 48px 0 20px;
          background: #ffffff;
          border: 1.5px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a2e;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          line-height: 1;
        }

        .select-input:hover {
          border-color: #9ca3af;
        }

        .select-input:focus {
          border-color: #3b6fe8;
          box-shadow: 0 0 0 3px rgba(59, 111, 232, 0.12);
        }

        .select-input:active {
          border-color: #3b6fe8;
        }

        .select-chevron {
          position: absolute;
          right: 16px;
          pointer-events: none;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}