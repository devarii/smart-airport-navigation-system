// store/ → State management global (Zustand)
// mapStore.ts → Semua state: POI dipilih, mode admin, rute aktif, filter kategori

// dapat diubah masi tahap perencanaan
import { create } from "zustand";
import type {
  TerminalId,
  FloorNumber,
  MapMode,
  FacilityWithRelations,
  RouteResult,
} from "@/types";

// =============================================================================
// STATE & ACTION TYPES
// =============================================================================

interface TerminalFloorState {
  activeTerminal: TerminalId;
  activeFloor: FloorNumber;
  setActiveTerminal: (terminal: TerminalId) => void;
  setActiveFloor: (floor: FloorNumber) => void;
}

interface MapModeState {
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;
}

interface SelectedPOIState {
  selectedFacility: FacilityWithRelations | null;
  setSelectedFacility: (facility: FacilityWithRelations) => void;
  clearSelectedFacility: () => void;
}

interface SearchState {
  searchQuery: string;
  searchResults: FacilityWithRelations[];
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: FacilityWithRelations[]) => void;
}

interface CategoryFilterState {
  activeCategories: number[];
  toggleCategory: (id: number) => void;
  clearCategories: () => void;
}

interface RouteState {
  routeFrom: FacilityWithRelations | null;
  routeTo: FacilityWithRelations | null;
  routeResult: RouteResult | null;
  setRouteFrom: (facility: FacilityWithRelations | null) => void;
  setRouteTo: (facility: FacilityWithRelations | null) => void;
  setRouteResult: (result: RouteResult | null) => void;
  clearRoute: () => void;
}

interface NearbyState {
  nearbyMode: boolean;
  userPin: { x: number; y: number } | null;
  nearbyFacilities: FacilityWithRelations[];
  setNearbyMode: (mode: boolean) => void;
  setUserPin: (pin: { x: number; y: number } | null) => void;
  setNearbyFacilities: (facilities: FacilityWithRelations[]) => void;
}

// Gabungan semua state & action
type MapStore = TerminalFloorState &
  MapModeState &
  SelectedPOIState &
  SearchState &
  CategoryFilterState &
  RouteState &
  NearbyState;

// =============================================================================
// STORE
// =============================================================================

export const useMapStore = create<MapStore>((set) => ({

  // ---------------------------------------------------------------------------
  // Terminal & Lantai
  // ---------------------------------------------------------------------------
  activeTerminal: "T1",
  activeFloor: 1,

  setActiveTerminal: (terminal) =>
    set({ activeTerminal: terminal }),

  setActiveFloor: (floor) =>
    set({ activeFloor: floor }),

  // ---------------------------------------------------------------------------
  // Map Mode
  // ---------------------------------------------------------------------------
  mapMode: "view",

  setMapMode: (mode) =>
    set({ mapMode: mode }),

  // ---------------------------------------------------------------------------
  // Selected POI
  // ---------------------------------------------------------------------------
  selectedFacility: null,

  setSelectedFacility: (facility) =>
    set({ selectedFacility: facility }),

  clearSelectedFacility: () =>
    set({ selectedFacility: null }),

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------
  searchQuery: "",
  searchResults: [],

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  setSearchResults: (results) =>
    set({ searchResults: results }),

  // ---------------------------------------------------------------------------
  // Filter Kategori
  // ---------------------------------------------------------------------------
  activeCategories: [],

  toggleCategory: (id) =>
    set((state) => ({
      activeCategories: state.activeCategories.includes(id)
        ? state.activeCategories.filter((c) => c !== id)
        : [...state.activeCategories, id],
    })),

  clearCategories: () =>
    set({ activeCategories: [] }),

  // ---------------------------------------------------------------------------
  // Route
  // ---------------------------------------------------------------------------
  routeFrom: null,
  routeTo: null,
  routeResult: null,

  setRouteFrom: (facility) =>
    set({ routeFrom: facility }),

  setRouteTo: (facility) =>
    set({ routeTo: facility }),

  setRouteResult: (result) =>
    set({ routeResult: result }),

  clearRoute: () =>
    set({ routeFrom: null, routeTo: null, routeResult: null }),

  // ---------------------------------------------------------------------------
  // Nearby
  // ---------------------------------------------------------------------------
  nearbyMode: false,
  userPin: null,
  nearbyFacilities: [],

  setNearbyMode: (mode) =>
    set({ nearbyMode: mode }),

  setUserPin: (pin) =>
    set({ userPin: pin }),

  setNearbyFacilities: (facilities) =>
    set({ nearbyFacilities: facilities }),
}));