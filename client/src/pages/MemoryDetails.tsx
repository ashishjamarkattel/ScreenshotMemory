import { useRoute, Link } from "wouter";
import { mockMemories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ArrowLeft, Link as LinkIcon, Calendar, 
  Clock, Share2, Bookmark, MoreHorizontal, Globe, 
  FileText, File, Tag, Image, Search, ZoomIn, Download,
  Copy, ExternalLink, Edit2, Check, X, Sparkles,
  RefreshCw, Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from '@/components/Navbar';

interface Memory {
  id: string;
  file_name: string;
  image_description: string;
  created_at: string;
}

export default function MemoryDetails() {
  const [, params] = useRoute("/memory/:id");
  const memoryId = params?.id ? parseInt(params.id) : null;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [description, setDescription] = useState(
    "This image shows a screenshot of a web application interface with a dark theme..."
  );
  const [editedDescription, setEditedDescription] = useState(description);
  const [aiDescriptions, setAiDescriptions] = useState<string[]>([
    "Initial AI-generated description of the image...",
  ]);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getIcon = () => {
    switch (memory?.file_name.toLowerCase()) {
      case "website":
        return <Globe className="w-5 h-5" />;
      case "note":
        return <FileText className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const handleGenerateMoreDescription = () => {
    setIsGeneratingDescription(true);
    // Simulate AI generating new description
    setTimeout(() => {
      setAiDescriptions(prev => [...prev, `New AI analysis #${prev.length + 1} of the image...`]);
      setIsGeneratingDescription(false);
    }, 1500);
  };

  const handleSaveDescription = async () => {
    if (!memory) return;

    try {
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      const response = await fetch(`http://0.0.0.0:8000/spaces/memory/${memory.id}/description`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionValue}`
        },
        body: JSON.stringify({ description: editedDescription })
      });

      if (response.ok) {
        setMemory({ ...memory, image_description: editedDescription });
        setIsEditingDescription(false);
        // ✅ Show success notification
      setSuccessMessage("Description updated successfully!");

      // ✅ Auto-hide the message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setIsEditingDescription(false);
  };

  const handleRegenerateDescription = async () => {
    if (!memory) return;

    setIsRegenerating(true);
    try {
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      const response = await fetch(`http://0.0.0.0:8000/spaces/memory/${memory.id}/regenerate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionValue}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMemory({ ...memory, image_description: data.description });
        setEditedDescription(data.description);
      }
    } catch (error) {
      console.error('Error regenerating description:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const cookieString = document.cookie;
        const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
        const sessionValue = sessionMatch ? sessionMatch[1] : null;

        if (sessionValue) {
          const response = await fetch(`http://0.0.0.0:8000/spaces/memory/${memoryId}`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${sessionValue}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setMemory(data);
            setEditedDescription(data.image_description);
          }
        }
      } catch (error) {
        console.error('Error fetching memory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemory();
  }, [memoryId]);

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

  if (!memory) {
    return (
      <div className="min-h-screen bg-[#1a1b1e] flex items-center justify-center text-white">
        Memory not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <Navbar />
  
      <main className="container mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link href="/home">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Memory Content */}
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{memory.file_name}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(memory.created_at).toLocaleDateString()}</span>
              <span className="text-gray-500">•</span>
              <span>Default Space</span>
            </div>
          </div>
          {successMessage && (
      <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        {successMessage}
        </div>
      )}
          <div className="mb-6">
            <div className="max-w-3xl mx-auto">
              <div className="aspect-video bg-black/20 rounded-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Memory Preview
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium text-white">Description</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDescription(!isEditingDescription)}
                  className="text-gray-400 hover:text-white"
                  disabled={isRegenerating}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateDescription}
                  className="text-gray-400 hover:text-white"
                  disabled={isRegenerating || isEditingDescription}
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isEditingDescription ? (
              <div className="space-y-4">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[150px] bg-black/20 border-white/10 text-white"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditedDescription(memory?.image_description || '');
                      setIsEditingDescription(false);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveDescription}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 leading-relaxed">
                {memory.image_description}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
