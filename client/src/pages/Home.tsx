import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import AddMemoryModal from "@/components/AddMemoryModal";
import SpaceView from "@/components/SpaceView";
import ContentCard from "@/components/ContentCard";
// import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { mockSpaces, mockMemories } from "@/lib/mockData";
import InitialChatInterface from "@/components/InitialChatInterface";

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

  const hasSearchResults = searchQuery && filteredMemories.length > 0;
  const showAllMemories = !searchQuery || !hasSearchResults;

  return (
    <div className="h-[2000px] bg-dark-gradient text-foreground z-50">    
  <Navbar onSearch={setSearchQuery} />

  <main className="container mx-auto p-6">
    {/* Masked background */}
    <div className="absolute inset-0 w-full h-full bottom-0 left-0 opacity-60 bg-transparent bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%236b6b6b%27%20fill-opacity%3D%270.2%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] mask-radial pointer-events-none"></div>

    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Your Second Brain
      </h1>
      <Button 
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500"
      >
        <PlusCircle className="w-4 h-4" />
        Add Memory
      </Button>
    </div>

    {/* Search Results Section */}
    {hasSearchResults && (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            Search Results for "{searchQuery}"
          </h2>
          <span className="text-sm text-muted-foreground">
            ({filteredMemories.length} results)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredMemories.map((memory) => (
            <ContentCard key={memory.id} memory={memory} />
          ))}
        </div>
      </div>
    )}

    {/* Main Content */}
    {showAllMemories && (
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
    )}
  </main>

  <AddMemoryModal 
    open={isAddModalOpen}
    onOpenChange={setIsAddModalOpen}
    spaces={mockSpaces}
  />

  {/* <ChatInterface /> */}
  <InitialChatInterface/>
</div>

  );
}