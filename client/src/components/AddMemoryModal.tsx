import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Space {
  id: number;
  user_id: string;
  space_name: string;
}

interface AddMemoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaces: Space[];
  onSuccess: () => void;
}

export default function AddMemoryModal({ 
  open, 
  onOpenChange, 
  spaces, 
  onSuccess 
}: AddMemoryModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string>("default");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const cookieString = document.cookie;
      const sessionMatch = cookieString.match(/wos_session=([^;]+)/);
      const sessionValue = sessionMatch ? sessionMatch[1] : null;

      if (!sessionValue) {
        throw new Error("No session found");
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('space_name', selectedSpace);

      const response = await fetch('http://0.0.0.0:8000/upload', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionValue}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setSuccessMessage("Memory uploaded successfully!");
      setTimeout(() => {
        onOpenChange(false);
        setSelectedFile(null);
        setSuccessMessage(null);
        onSuccess?.();
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1b1e] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Memory</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Space Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select Space</label>
            <Select
              value={selectedSpace}
              onValueChange={setSelectedSpace}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select a space" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1b1e] border-white/10">
                <SelectItem value="default">Default Space</SelectItem>
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.space_name}>
                    {space.space_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Upload File</label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                selectedFile 
                  ? 'border-blue-500/50 bg-blue-500/5' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <Input
                type="file"
                onChange={handleFileSelect}
                className="bg-transparent file:bg-white/10 file:border-0 file:text-white file:hover:bg-white/20 cursor-pointer"
                accept="image/*"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-400">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className="bg-blue-500 hover:bg-blue-600 text-white min-w-[100px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}