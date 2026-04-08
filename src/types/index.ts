// types/ → TypeScript type definitions
// index.ts → Semua tipe data: Facility, Category, MapNode, MapEdge, dll

// =============================================================================
// BASE ENTITY TYPES (mirror Prisma models)
// =============================================================================

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  createdAt: Date;
}

export interface Floor {
  id: number;
  terminal: string;   // "T1" | "T2"
  floorNumber: number; // 1 | 2
  label: string;       // e.g. "Terminal 1 - Lantai 1"
}

export interface Facility {
  id: number;
  name: string;
  code: string;
  description: string | null;
  categoryId: number;
  floorId: number;
  nodeId: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapNode {
  id: number;
  x: number;
  y: number;
  label: string | null;
  floorId: number;
}

export interface MapEdge {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  distance: number;
  isAccessible: boolean;
}

export interface Admin {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

// =============================================================================
// RELATION / POPULATED TYPES
// =============================================================================

export interface CategoryWithFacilities extends Category {
  facilities: Facility[];
}

export interface FacilityWithRelations extends Facility {
  category: Category;
  floor: Floor;
  node: MapNode | null;
}

export interface MapNodeWithEdges extends MapNode {
  facility: Facility | null;
  edgesFrom: MapEdge[];
  edgesTo: MapEdge[];
}

export interface MapEdgeWithNodes extends MapEdge {
  fromNode: MapNode;
  toNode: MapNode;
}

// =============================================================================
// MAP / FLOOR TYPES
// =============================================================================

export type TerminalId = "T1" | "T2";
export type FloorNumber = 1 | 2;

export interface FloorKey {
  terminal: TerminalId;
  floorNumber: FloorNumber;
}

/** SVG viewBox ukuran peta: "0 0 1133 172" */
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// =============================================================================
// SEARCH TYPES
// =============================================================================

export interface SearchSuggestion {
  id: number;
  name: string;
  code: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  floorLabel: string;
}

// =============================================================================
// ROUTE / PATHFINDING TYPES
// =============================================================================

export interface RouteRequest {
  fromNodeId: number;
  toNodeId: number;
}

export interface RouteResult {
  path: number[];        // ordered list of node IDs
  totalDistance: number;
  nodes: MapNode[];      // populated nodes along the path
}

// =============================================================================
// POI / NEARBY TYPES
// =============================================================================

export interface UserPin {
  x: number;
  y: number;
  floorId: number;
}

export interface NearbyFacility {
  facility: FacilityWithRelations;
  distance: number; // pixel distance dari user pin
}

// =============================================================================
// MAP INTERACTION TYPES
// =============================================================================

export type MapMode = "view" | "admin";

export type AdminAction = "add" | "edit" | "delete" | null;

export interface SelectedPOI {
  facility: FacilityWithRelations;
  node: MapNode;
}

// =============================================================================
// ZUSTAND STORE TYPES
// =============================================================================

export interface MapState {
  // Floor
  activeFloor: Floor | null;
  setActiveFloor: (floor: Floor) => void;

  // Facilities & categories
  facilities: FacilityWithRelations[];
  categories: Category[];
  setFacilities: (facilities: FacilityWithRelations[]) => void;
  setCategories: (categories: Category[]) => void;

  // Filter
  activeCategoryIds: number[];
  toggleCategory: (id: number) => void;
  clearCategoryFilter: () => void;

  // Search
  searchQuery: string;
  searchSuggestions: SearchSuggestion[];
  setSearchQuery: (query: string) => void;
  setSearchSuggestions: (suggestions: SearchSuggestion[]) => void;

  // Selected POI
  selectedPOI: SelectedPOI | null;
  setSelectedPOI: (poi: SelectedPOI | null) => void;

  // Route
  routeResult: RouteResult | null;
  routeFrom: MapNode | null;
  routeTo: MapNode | null;
  setRouteFrom: (node: MapNode | null) => void;
  setRouteTo: (node: MapNode | null) => void;
  setRouteResult: (result: RouteResult | null) => void;
  clearRoute: () => void;

  // Nearby
  userPin: UserPin | null;
  nearbyFacilities: NearbyFacility[];
  setUserPin: (pin: UserPin | null) => void;
  setNearbyFacilities: (facilities: NearbyFacility[]) => void;

  // Mode
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void;

  // Admin action
  adminAction: AdminAction;
  setAdminAction: (action: AdminAction) => void;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// =============================================================================
// FORM / PAYLOAD TYPES (untuk API request body)
// =============================================================================

export interface CreateFacilityPayload {
  name: string;
  code: string;
  description?: string;
  categoryId: number;
  floorId: number;
  nodeId?: number;
  isActive?: boolean;
}

export type UpdateFacilityPayload = Partial<CreateFacilityPayload>;

export interface CreateNodePayload {
  x: number;
  y: number;
  label?: string;
  floorId: number;
}

export type UpdateNodePayload = Partial<CreateNodePayload>;

export interface CreateEdgePayload {
  fromNodeId: number;
  toNodeId: number;
  distance: number;
  isAccessible?: boolean;
}

export type UpdateEdgePayload = Partial<CreateEdgePayload>;

export interface CreateCategoryPayload {
  name: string;
  icon: string;
  color: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;