// store/mapStore.ts
// State management global via Zustand.
// activeFloor DIHAPUS — T1 dan T2 masing-masing punya 1 grid vertikal berisi
// 2 lantai sekaligus; tidak ada toggle lantai.

import { create } from "zustand";
import type {
  TerminalId,
  MapMode,
  FacilityWithRelations,
  RouteResult,
} from "@/types";

// =============================================================================
// STATE & ACTION TYPES
// =============================================================================

interface TerminalState {
  activeTerminal: TerminalId;
  setActiveTerminal: (terminal: TerminalId) => void;
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

interface SearchModalState {
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
}

interface CategoryFilterState {
  activeCategories: number[];
  toggleCategory: (id: number) => void;
  clearCategories: () => void;
}

interface RouteState {
  isRouteOpen: boolean;
  setIsRouteOpen: (val: boolean) => void;
  routeFrom: FacilityWithRelations | null;
  routeTo: FacilityWithRelations | null;
  routeResult: RouteResult | null;
  setRouteFrom: (facility: FacilityWithRelations | null) => void;
  setRouteTo: (facility: FacilityWithRelations | null) => void;
  setRouteResult: (result: RouteResult | null) => void;
  clearRoute: () => void;
}

interface IdleState {
  resetToIdle: () => void;
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
type MapStore = TerminalState &
  MapModeState &
  SelectedPOIState &
  SearchState &
  SearchModalState &
  CategoryFilterState &
  RouteState &
  NearbyState &
  IdleState;

// =============================================================================
// STORE
// =============================================================================

export const useMapStore = create<MapStore>((set) => ({

  // ---------------------------------------------------------------------------
  // Terminal aktif (T1 / T2)
  // activeFloor dihapus: kedua lantai selalu tampil bersamaan dalam 1 grid.
  // ---------------------------------------------------------------------------
  activeTerminal: "T1",

  setActiveTerminal: (terminal) =>
    set({ activeTerminal: terminal }),

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
  // Search Modal
  // ---------------------------------------------------------------------------
  isSearchOpen: false,

  setIsSearchOpen: (val) =>
    set({ isSearchOpen: val }),

  // ---------------------------------------------------------------------------
  // Filter Kategori (activeCategories: number[])
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
  isRouteOpen: false,

  setIsRouteOpen: (val) =>
    set({ isRouteOpen: val }),

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

  // ---------------------------------------------------------------------------
  // Idle Reset
  // Dipanggil oleh useIdleTimer setelah X menit tidak ada interaksi.
  // activeTerminal TIDAK direset — user mungkin sudah pilih terminal tertentu.
  // isSearchOpen + isRouteOpen juga direset agar overlay tertutup.
  // ---------------------------------------------------------------------------
  resetToIdle: () =>
    set({
      selectedFacility: null,
      searchQuery:       "",
      searchResults:     [],
      isSearchOpen:      false,
      activeCategories:  [],
      isRouteOpen:       false,
      routeFrom:         null,
      routeTo:           null,
      routeResult:       null,
      mapMode:           "view",
      nearbyMode:        false,
      userPin:           null,
      nearbyFacilities:  [],
    }),
}));