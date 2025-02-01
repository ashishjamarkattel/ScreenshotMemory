import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FolderPlus } from "lucide-react";

interface AddSpaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSpace: (space: { name: string; description: string }) => void;
}

export default function AddSpaceModal({ open, onOpenChange, onAddSpace }: AddSpaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSpace({ name, description });
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1b1e]/95 backdrop-blur-md border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-400" />
            Create New Space
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Space Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Create Space
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 