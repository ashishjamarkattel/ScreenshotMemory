import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Space } from "@db/schema";
import { cn } from "@/lib/utils";

interface SpaceViewProps {
  spaces: Space[];
  selectedSpace: number | null;
  onSpaceSelect: (spaceId: number) => void;
}

export default function SpaceView({ spaces, selectedSpace, onSpaceSelect }: SpaceViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Spaces</h2>
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {spaces.map((space) => (
          <Card
            key={space.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-accent",
              selectedSpace === space.id && "bg-accent"
            )}
            onClick={() => onSpaceSelect(space.id)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium">{space.name}</h3>
              {space.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {space.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
