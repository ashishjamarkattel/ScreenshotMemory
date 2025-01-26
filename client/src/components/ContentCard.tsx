import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Globe, FileText, File } from "lucide-react";
import { Memory } from "@db/schema";

interface ContentCardProps {
  memory: Memory;
}

export default function ContentCard({ memory }: ContentCardProps) {
  const getIcon = () => {
    switch (memory.type) {
      case "website":
        return <Globe className="w-4 h-4" />;
      case "note":
        return <FileText className="w-4 h-4" />;
      case "document":
        return <File className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-2 p-4">
        {getIcon()}
        <span className="text-sm font-medium">{memory.type}</span>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <h3 className="font-medium line-clamp-2">{memory.title}</h3>
        {memory.content && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            {memory.content}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
