"use client"; 

import { useMapStore } from "@/store/mapStore"; 
import RealtimeClock from '@/components/ui/realtimeClock'; 
// import TerminalFloorSelector from '@/components/ui/terminalFloorSelector';
import SearchModal from '@/components/ui/searchModal';

function App() {
  // Sekarang hook ini bisa berjalan karena sudah jadi Client Component
  const setIsSearchOpen = useMapStore((s) => s.setIsSearchOpen);

  return (
    <div className="p-10">
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Buka Pencarian
      </button>

      <SearchModal />
      
      {/* Komponen lainnya */}
      <div className="mt-5">
        <RealtimeClock />
      </div>
    </div>
  );
}

export default App;