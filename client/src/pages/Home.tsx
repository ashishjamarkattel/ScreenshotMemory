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

  const chatInterfaceRef = useRef<HTMLInputElement | null>(null);  //reference to chat interface 

  useEffect(() => {
    if (chatInterfaceRef.current) {
      chatInterfaceRef.current.focus();
    }
  }, []);

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
    <div className="h-[2000px] bg-gradient-to-r from-blue-300 to-blue-900 z-50">    
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
      <InitialChatInterface ref={chatInterfaceRef}/>
      
    </div>
  );
}