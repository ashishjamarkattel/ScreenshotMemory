import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, FolderPlus, ChevronDown, ChevronRight } from "lucide-react";
import AddSpaceModal from "./AddSpaceModal";

interface Space {
  id: number;
  name: string;
  description?: string;
  memoryCount?: number;
}

interface SpaceViewProps {
  spaces: Space[];
  selectedSpace: number | null;
  onSpaceSelect: (spaceId: number | null) => void;
  onAddSpace?: (space: { name: string; description: string }) => void;
}

export default function SpaceView({ spaces, selectedSpace, onSpaceSelect, onAddSpace }: SpaceViewProps) {
  const [isAddSpaceOpen, setIsAddSpaceOpen] = useState(false);

  return (
    <>
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            Spaces
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddSpaceOpen(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-2">
          <Button
            variant="ghost"
            className={`w-full justify-between ${
              !selectedSpace ? 'bg-white/10 text-white' : 'text-gray-400'
            } hover:bg-white/10 hover:text-white mb-1`}
            onClick={() => onSpaceSelect(null)}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              All Spaces
            </span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
              {spaces.reduce((acc, space) => acc + (space.memoryCount || 0), 0)}
            </span>
          </Button>
          
          {spaces.map((space) => (
            <Button
              key={space.id}
              variant="ghost"
              className={`w-full justify-between group ${
                selectedSpace === space.id ? 'bg-white/10 text-white' : 'text-gray-400'
              } hover:bg-white/10 hover:text-white mb-1`}
              onClick={() => onSpaceSelect(space.id)}
            >
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                {space.name}
              </span>
              {space.memoryCount && (
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                  {space.memoryCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <AddSpaceModal
        open={isAddSpaceOpen}
        onOpenChange={setIsAddSpaceOpen}
        onAddSpace={onAddSpace || (() => {})}
      />
    </>
  );
}