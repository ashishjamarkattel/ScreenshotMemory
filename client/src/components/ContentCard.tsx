import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Globe, FileText, File, Calendar, Clock } from "lucide-react";

interface Memory {
  id: number;
  title: string;
  content?: string;
  type: string;
  thumbnail?: string;
  createdAt: string | Date;
  url?: string;
  tags?: string[];
}

interface ContentCardProps {
  memory: Memory;
}

export default function ContentCard({ memory }: ContentCardProps) {
  const getIcon = () => {
    switch (memory.type.toLowerCase()) {
      case "website":
        return <Globe className="w-4 h-4" />;
      case "note":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <Link href={`/memory/${memory.id}`}>
      <Card className="group relative overflow-hidden cursor-pointer backdrop-blur-sm bg-white/5 border-white/10 hover:border-white/20 transition-all">
        {memory.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img 
              src={memory.thumbnail} 
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              {getIcon()}
            </div>
            <span className="text-xs text-gray-400">{memory.type}</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {memory.title}
          </h3>
          
          {memory.content && (
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">
              {memory.content}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {memory.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(memory.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(memory.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}