// =============================================================================
// BASE ENTITY TYPES (mirror Prisma models)
// =============================================================================

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  color: string;
  terminals: string[];
  sortOrder: number;
  createdAt: Date;
}

export interface Floor {
  id: number;
  terminal: string;
  floorNumber: number;
  label: string;
  gridRows: number | null; 
  gridCols: number | null; 
  startRow: number | null; 
  startCol: number | null; 
  wallData: unknown | null; 
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
  gridRow: number | null; 
  gridCol: number | null; 
  photo: string | null;
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

export interface OperationalHour {
  id: number;
  facilityId: number;
  day: number;       // 1=Senin, 2=Selasa, ..., 7=Minggu
  isOpen: boolean;
  is24Hours: boolean;
  openTime: string | null;   // format "HH:mm"
  closeTime: string | null;  // format "HH:mm"
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
  operationalHours: OperationalHour[];
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

/** 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat, 6=Sabtu, 7=Minggu */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

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
  categoryIcon: string | null;
  categoryColor: string;
  floorLabel: string;
}

// =============================================================================
// ROUTE / PATHFINDING TYPES
// =============================================================================

// Legacy node-based (simpan untuk kompatibilitas API nodes/edges)
export interface RouteRequest {
  fromNodeId: number;
  toNodeId: number;
}

// =============================================================================
// GRID / A* PATHFINDING TYPES
// =============================================================================

export interface GridPoint {
  r: number;
  c: number;
}

export interface AStarNode {
  r: number;
  c: number;
  g: number;
  f: number;
  parent: AStarNode | null;
}

export interface PathResult {
  path: GridPoint[];
  stepCount: number;
}

export interface PathSegment {
  path: GridPoint[];
  color: string;
}

export interface MultiPathResult {
  segments: PathSegment[];
  totalSteps: number;
  usedStairs: boolean;
  stairsLabel?: string;
}

export interface DestinationPoint {
  id: string;
  label: string;
  r: number;
  c: number;
  color: string;
}

export interface WallDataJson {
  rows: number;
  cols: number;
  startRow: number;
  startCol: number;
  walls: string[]; // format "r,c"
}

// RouteResult sekarang grid-based
export interface RouteResult {
  multiPath: MultiPathResult;
  destId: string;
  destLabel: string;
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
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
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
  gridRow?: number;
  gridCol?: number;
  photo?: string;
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
  icon?: string;
  color: string;
  terminals?: string[];
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CreateOperationalHourPayload {
  facilityId: number;
  day: DayOfWeek;
  isOpen: boolean;
  is24Hours: boolean;
  openTime?: string;   // format "HH:mm"
  closeTime?: string;  // format "HH:mm"
}

export type UpdateOperationalHourPayload = Partial<Omit<CreateOperationalHourPayload, "facilityId" | "day">>;