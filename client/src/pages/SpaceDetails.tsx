import { useRoute } from "wouter";
import { mockSpaces, mockMemories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Files, Users } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import { Link } from "wouter";

export default function SpaceDetails() {
  const [, params] = useRoute("/space/:id");
  const spaceId = params?.id ? parseInt(params.id) : null;
  
  const space = mockSpaces.find((s) => s.id === spaceId);
  const memories = mockMemories.filter((m) => m.spaceId === spaceId);

  if (!space) {
    return <div>Space not found</div>;
  }

  return (
    <div className="min-h-screen bg-background bg-gradient-to-r from-teal-400 to-purple-600">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {space.name}
            </h1>
            <p className="text-muted-foreground">{space.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Files className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Memories</p>
                    <p className="text-2xl font-bold">{memories.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-2xl font-bold">
                      {new Date(space.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Collaborators</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Memories</h2>
          {memories.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {memories.map((memory) => (
                <ContentCard key={memory.id} memory={memory} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-card rounded-lg">
              <p className="text-muted-foreground">No memories yet. Create your first memory in this space!</p>
              <Button className="mt-4" variant="default">
                ✨ Capture New Memory
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
