import { useRoute, Link } from "wouter";
import { mockMemories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Link as LinkIcon, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function MemoryDetails() {
  const [, params] = useRoute("/memory/:id");
  const memoryId = params?.id ? parseInt(params.id) : null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  const memory = mockMemories.find((m) => m.id === memoryId);

  if (!memory) {
    return <div>Memory not found</div>;
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: input },
      { role: "assistant", content: "This is a simulated AI response about the memory content. In a real implementation, this would be connected to an AI service." }
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-to-r from-blue-300 to-blue-900">
      <div className="container mx-auto p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{memory.title}</h1>
                  {memory.type === "website" && memory.url && (
                    <a href={memory.url} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(memory.createdAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {memory.content}
                </div>
              </CardContent>
            </Card>

            {/* Chat Section */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Chat about this memory</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[300px] overflow-y-auto space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === "assistant"
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question about this memory..."
                      className="flex-1"
                    />
                    <Button type="submit">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Related Memories</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockMemories
                    .filter(m => m.id !== memory.id && m.spaceId === memory.spaceId)
                    .slice(0, 3)
                    .map(relatedMemory => (
                      <Link key={relatedMemory.id} href={`/memory/${relatedMemory.id}`}>
                        <Card className="cursor-pointer hover:bg-accent">
                          <CardContent className="p-4">
                            <h3 className="font-medium">{relatedMemory.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
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
