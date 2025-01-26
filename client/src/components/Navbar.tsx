import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Supermemory</h1>
          
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your memories..."
              className="pl-9"
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
