import { useState } from "react";
import { Folder, PlusCircle } from "lucide-react";
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Space {
  id: number;
  user_id: string;
  space_name: string;
}

interface SpaceViewProps {
  spaces: Space[];
  selectedSpace: number | null;
  onSpaceSelect: (id: number | null) => void;
  onCreateSpace: (name: string) => Promise<void>;
}

export default function SpaceView({ spaces, selectedSpace, onSpaceSelect, onCreateSpace }: SpaceViewProps) {
  const [, setLocation] = useLocation();
  const [isAddSpaceOpen, setIsAddSpaceOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) return;
    
    setIsCreating(true);
    try {
      await onCreateSpace(newSpaceName);
      setNewSpaceName("");
      setIsAddSpaceOpen(false);
    } catch (error) {
      console.error("Failed to create space:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-white font-medium flex items-center gap-2">
            <Folder className="w-4 h-4" />
            <span>Spaces</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddSpaceOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
        </div>

        <div className="border-t border-white/10">
          {/* Default Space without dropdown */}
          <button
            onClick={() => onSpaceSelect(null)}
            className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
              selectedSpace === null 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
            Default Space
          </button>

          {/* User Created Spaces */}
          <div className="py-2 border-t border-white/10">
            {spaces.map((space) => (
              <button
                key={space.id}
                onClick={() => onSpaceSelect(space.id)}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                  selectedSpace === space.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                {space.space_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Space Modal */}
      <Dialog open={isAddSpaceOpen} onOpenChange={setIsAddSpaceOpen}>
        <DialogContent className="bg-[#1a1b1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Space Name</label>
              <Input
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="Enter space name"
                className="bg-black/20 border-white/10 text-white mt-1.5"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddSpaceOpen(false);
                  setNewSpaceName("");
                }}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSpace}
                disabled={isCreating || !newSpaceName.trim()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isCreating ? "Creating..." : "Create Space"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}