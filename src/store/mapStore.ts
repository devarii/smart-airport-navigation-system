// store/mapStore.ts
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

interface AdminSelectedPOIState {
  adminSelectedFacility: FacilityWithRelations | null;
  setAdminSelectedFacility: (facility: FacilityWithRelations | null) => void;
}

// Counter — naik setiap kali ada perubahan data fasilitas
// MapCanvas watch ini untuk trigger re-fetch otomatis
interface FacilitiesVersionState {
  facilitiesVersion: number;
  incrementFacilitiesVersion: () => void;
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

type MapStore = TerminalState &
  MapModeState &
  SelectedPOIState &
  AdminSelectedPOIState &
  FacilitiesVersionState &
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
  // Terminal
  // ---------------------------------------------------------------------------
  activeTerminal: "T1",
  setActiveTerminal: (terminal) =>
    set({
      activeTerminal:   terminal,
      selectedFacility: null,
      isRouteOpen:      false,
      routeResult:      null,
      routeFrom:        null,
      routeTo:          null,
    }),

  // ---------------------------------------------------------------------------
  // Map Mode
  // ---------------------------------------------------------------------------
  mapMode: "view",
  setMapMode: (mode) => set({ mapMode: mode }),

  // ---------------------------------------------------------------------------
  // Selected POI — user (POIDetailPopup)
  // ---------------------------------------------------------------------------
  selectedFacility: null,
  setSelectedFacility: (facility) => set({ selectedFacility: facility }),
  clearSelectedFacility: () => set({ selectedFacility: null }),

  // ---------------------------------------------------------------------------
  // Admin Selected POI — admin (EditFacilityModal)
  // ---------------------------------------------------------------------------
  adminSelectedFacility: null,
  setAdminSelectedFacility: (facility) => set({ adminSelectedFacility: facility }),

  // ---------------------------------------------------------------------------
  // Facilities Version
  // Increment setiap kali edit/delete fasilitas berhasil → MapCanvas re-fetch
  // ---------------------------------------------------------------------------
  facilitiesVersion: 0,
  incrementFacilitiesVersion: () =>
    set((state) => ({ facilitiesVersion: state.facilitiesVersion + 1 })),

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------
  searchQuery: "",
  searchResults: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),

  // ---------------------------------------------------------------------------
  // Search Modal
  // ---------------------------------------------------------------------------
  isSearchOpen: false,
  setIsSearchOpen: (val) =>
    set(val
      ? { isSearchOpen: true, routeResult: null, isRouteOpen: false, selectedFacility: null }
      : { isSearchOpen: false }
    ),

  // ---------------------------------------------------------------------------
  // Filter Kategori — single-select
  // Pilih kategori baru → ganti. Pilih kategori yang sama → clear (kembali abu-abu)
  // ---------------------------------------------------------------------------
  activeCategories: [],
  toggleCategory: (id) =>
    set((state) => ({
      activeCategories: state.activeCategories[0] === id ? [] : [id],
    })),
  clearCategories: () => set({ activeCategories: [] }),

  // ---------------------------------------------------------------------------
  // Route
  // ---------------------------------------------------------------------------
  isRouteOpen: false,
  setIsRouteOpen: (val) => set({ isRouteOpen: val }),
  routeFrom: null,
  routeTo: null,
  routeResult: null,
  setRouteFrom: (facility) => set({ routeFrom: facility }),
  setRouteTo: (facility) => set({ routeTo: facility }),
  setRouteResult: (result) => set({ routeResult: result }),
  clearRoute: () => set({ routeFrom: null, routeTo: null, routeResult: null }),

  // ---------------------------------------------------------------------------
  // Nearby
  // ---------------------------------------------------------------------------
  nearbyMode: false,
  userPin: null,
  nearbyFacilities: [],
  setNearbyMode: (mode) => set({ nearbyMode: mode }),
  setUserPin: (pin) => set({ userPin: pin }),
  setNearbyFacilities: (facilities) => set({ nearbyFacilities: facilities }),

  // ---------------------------------------------------------------------------
  // Idle Reset
  // ---------------------------------------------------------------------------
  resetToIdle: () =>
    set({
      selectedFacility:      null,
      adminSelectedFacility: null,
      searchQuery:           "",
      searchResults:         [],
      isSearchOpen:          false,
      activeCategories:      [],
      isRouteOpen:           false,
      routeFrom:             null,
      routeTo:               null,
      routeResult:           null,
      mapMode:               "view",
      nearbyMode:            false,
      userPin:               null,
      nearbyFacilities:      [],
    }),
}));