import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  return (
    <nav className="border-b bg-background/20 bg-gradient-to-r from-blue-400 to-teal-500 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 p-1">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent p-5">
            Supermemory
          </h1>

          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your memories..."
              className="pl-9"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            size="sm"
            className="rounded-full w-8 h-8 bg-primary text-primary-foreground"
          >
            R
          </Button>
        </div>
      </div>
    </nav>
  );
}