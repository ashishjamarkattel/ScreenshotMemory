import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AddMemoryModal from "@/components/AddMemoryModal";
import SpaceView from "@/components/SpaceView";
import ContentCard from "@/components/ContentCard";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MessageCircle, ChevronDown, Database, FolderKanban, Star, Camera, HardDrive, Download, ArrowRight } from "lucide-react";
import { mockSpaces, mockMemories } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from 'wouter';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Space {
  id: number;
  user_id: string;
  space_name: string;
}

interface Memory {
  id: string;
  file_name: string;
  image_description: string;
  created_at: string;
}

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [memories, setMemories] = useState<Memory[]>([]);

  const filteredMemories = mockMemories.filter(memory => 
    (!selectedSpace || memory.spaceId === Number(selectedSpace)) &&
    (!searchQuery || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const fetchUserData = async () => {
    try {
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      if (sessionValue) {
        const response = await fetch('http://0.0.0.0:8000/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${sessionValue}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Update spaces endpoint to match backend
          const spacesResponse = await fetch(`http://0.0.0.0:8000/spaces/${userData.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${sessionValue}`
            }
          });
          
          if (spacesResponse.ok) {
            const spacesData = await spacesResponse.json();
            setSpaces(spacesData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch all memories initially and when space changes
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const cookieString = document.cookie;
        const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
        const sessionValue = sessionMatch ? sessionMatch[1] : null;

        if (sessionValue) {
          // If no space is selected, fetch all memories
          const selectedSpaceName = spaces.find(space => space.id === selectedSpace)?.space_name

          const endpoint = selectedSpaceName 
          ? `http://0.0.0.0:8000/spaces/memories/${encodeURIComponent(selectedSpaceName)}`
          : 'http://0.0.0.0:8000/memories';


          const response = await fetch(endpoint, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${sessionValue}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setMemories(data);
          }
        }
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, [selectedSpace]); // Re-fetch when selected space changes

  const createSpace = async (spaceName: string) => {
    try {
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      if (!sessionValue) {
        console.error('No session token found');
        return;
      }

      const response = await fetch(`http://0.0.0.0:8000/api/spaces/${spaceName}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionValue}`
        }
      });

      if (response.ok) {
        // Refresh spaces after creation
        fetchUserData();
        setIsAddModalOpen(false); // Close the modal after successful creation
      } else {
        console.error('Failed to create space');
      }
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-[#1a1b1e] ${
        isChatOpen ? 'blur-sm brightness-50 pointer-events-none' : ''
      }`}>    
        <Navbar onSearch={setSearchQuery} />

        <main className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Good evening, {user?.first_name || 'User'}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Ask your supermemory anything or add new memories to your second brain.
              </p>
              
              {/* Quick Actions */}
              <div className="absolute top-0 right-0 flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Ask AI
                </Button>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-500/80 hover:bg-blue-500 text-white"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Memory
                </Button>
              </div>
            </div>

            {/* Memory Insights */}
            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-medium flex items-center gap-2">
                  <span>Memory Insights</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Last 30 days</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-blue-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Total Knowledge Base</span>
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">247</span>
                    <p className="text-gray-400 text-sm">Total memories saved</p>
                    <span className="text-xs text-emerald-400 mt-1">+12 this month</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-blue-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4" />
                    <span>Active Spaces</span>
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">8</span>
                    <p className="text-gray-400 text-sm">Knowledge spaces</p>
                    <span className="text-xs text-emerald-400 mt-1">+2 new this month</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-blue-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Most Active Space</span>
                  </h3>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-white">Work Projects</span>
                    <p className="text-gray-400 text-sm">23 memories this month</p>
                    <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-6">
                <SpaceView 
                  spaces={spaces}
                  selectedSpace={selectedSpace}
                  onSpaceSelect={(id: number | null) => setSelectedSpace(id)}
                  onCreateSpace={createSpace}
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9">
              {searchQuery && (
                <div className="mb-6 flex items-center gap-2 text-gray-400">
                  <Search className="w-4 h-4" />
                  <span>Results for "{searchQuery}"</span>
                  <span className="text-sm">({memories.length})</span>
                </div>
              )}

              {selectedSpace && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-white">
                    {spaces.find(s => s.id === selectedSpace)?.space_name || 'Default Space'}
                  </h2>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memories.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">
                      {selectedSpace 
                        ? "No memories in this space yet. Start by adding some!"
                        : "No memories yet. Start by adding some!"}
                    </p>
                  </div>
                ) : (
                  memories.map((memory) => (
                    <div 
                      key={memory.id}
                      onClick={() => setLocation(`/memory/${memory.id}`)}
                      className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <h3 className="text-white font-medium mb-2">{memory.file_name}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {memory.image_description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(memory.created_at).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Chat overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsChatOpen(false)}
          />
          
          <div className="absolute inset-0 m-4 border border-white/10 rounded-lg shadow-xl flex flex-col backdrop-blur-sm">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/40">
              <h2 className="text-xl font-bold text-white">Ask Your Memory</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-white/80"
              >
                Close
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatInterface onClose={() => setIsChatOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <AddMemoryModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        spaces={spaces}
        onSuccess={() => {
          fetchUserData();
        }}
      />
    </>
  );
}