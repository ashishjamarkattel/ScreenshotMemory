import { useRoute, Link } from "wouter";
import { mockMemories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  ArrowLeft, Link as LinkIcon, Calendar, 
  Clock, Share2, Bookmark, MoreHorizontal, Globe, 
  FileText, File, Tag, Image, Search, ZoomIn, Download,
  Copy, ExternalLink, Edit2, Check, X, Sparkles
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  
  const memory = mockMemories.find((m) => m.id === memoryId);

  if (!memory) {
    return <div>Memory not found</div>;
  }

  const getIcon = () => {
    switch (memory.type.toLowerCase()) {
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

  const handleSaveDescription = () => {
    setDescription(editedDescription);
    setIsEditingDescription(false);
    // Here you would typically save to backend
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setIsEditingDescription(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e]">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1a1b1e]/95 backdrop-blur-md border-white/10">
                <DropdownMenuItem className="text-gray-400 hover:text-white cursor-pointer">
                  Edit Memory
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:text-red-300 cursor-pointer">
                  Delete Memory
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    {getIcon()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{memory.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(memory.createdAt).toLocaleDateString()}
                      </div>
                      {memory.type === "website" && memory.url && (
                        <a 
                          href={memory.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Original Image Display */}
                {memory.thumbnail && (
                  <div className="relative group rounded-lg overflow-hidden">
                    <img 
                      src={memory.thumbnail} 
                      alt={memory.title}
                      className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all">
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => window.open(memory.thumbnail, '_blank')}
                        >
                          <ZoomIn className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => {/* Add download logic */}}
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Saved Screenshot Display */}
                {memory.screenshot && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-400" />
                      Saved Screenshot
                    </h3>
                    <div className="relative group rounded-lg overflow-hidden">
                      <img 
                        src={memory.screenshot} 
                        alt="Saved screenshot"
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all">
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => window.open(memory.screenshot, '_blank')}
                          >
                            <ZoomIn className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">Resolution</span>
                    <span className="text-white font-medium">1920 x 1080</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">Size</span>
                    <span className="text-white font-medium">2.4 MB</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">Format</span>
                    <span className="text-white font-medium">PNG</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm block mb-1">Captured</span>
                    <span className="text-white font-medium">2 days ago</span>
                  </div>
                </div>

                {/* AI Description Section */}
                <div className="bg-white/5 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      AI Image Analysis
                    </h3>
                    <div className="flex gap-2">
                      {isEditingDescription ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-red-400 hover:text-red-300"
                            onClick={() => {
                              setEditedDescription(description);
                              setIsEditingDescription(false);
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-green-400 hover:text-green-300"
                            onClick={() => {
                              setDescription(editedDescription);
                              setIsEditingDescription(false);
                            }}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-gray-400 hover:text-white"
                            onClick={() => setIsEditingDescription(true)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-blue-400 hover:text-blue-300"
                            onClick={handleGenerateMoreDescription}
                            disabled={isGeneratingDescription}
                          >
                            {isGeneratingDescription ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin" />
                                Generating...
                              </div>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 mr-1" />
                                Regenerate
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditingDescription ? (
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="bg-white/5 border-white/10 text-white min-h-[100px]"
                      placeholder="Edit AI's description of the image..."
                    />
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {memory.tags?.map((tag) => (
                          <div 
                            key={tag} 
                            className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-300"
                          >
                            #{tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {memory.tags && (
                  <div className="flex flex-wrap gap-2">
                    {memory.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 transition-colors cursor-pointer">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="text-gray-400 hover:text-white border-white/10 hover:bg-white/5"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Reverse Search
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-gray-400 hover:text-white border-white/10 hover:bg-white/5"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Related Memories */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="bg-white/5 border-white/10 sticky top-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-400" />
                  Related Memories
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMemories
                    .filter(m => m.id !== memory.id && m.spaceId === memory.spaceId)
                    .slice(0, 3)
                    .map(relatedMemory => (
                      <Link key={relatedMemory.id} href={`/memory/${relatedMemory.id}`}>
                        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-blue-500/10">
                                {getIcon()}
                              </div>
                              <h3 className="font-medium text-white">{relatedMemory.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {relatedMemory.content}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
