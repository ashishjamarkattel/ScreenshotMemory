import { useState } from "react";
import Navbar from "@/components/Navbar";
import AddMemoryModal from "@/components/AddMemoryModal";
import SpaceView from "@/components/SpaceView";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { mockSpaces, mockMemories } from "@/lib/mockData";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMemories = mockMemories.filter(memory => 
    (!selectedSpace || memory.spaceId === selectedSpace) &&
    (!searchQuery || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />

      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Second Brain
          </h1>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Memory
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <SpaceView 
              spaces={mockSpaces} 
              selectedSpace={selectedSpace}
              onSpaceSelect={setSelectedSpace}
            />
          </div>

          <div className="col-span-9">
            <div className="grid grid-cols-3 gap-4">
              {filteredMemories.map((memory) => (
                <ContentCard key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <AddMemoryModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        spaces={mockSpaces}
      />
    </div>
  );
}