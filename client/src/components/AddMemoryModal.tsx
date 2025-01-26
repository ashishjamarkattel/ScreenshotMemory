import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Globe, FileText, File } from "lucide-react";

interface Space {
  id: number;
  name: string;
}

interface AddMemoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaces: Space[];
}

export default function AddMemoryModal({ open, onOpenChange, spaces }: AddMemoryModalProps) {
  const [type, setType] = useState<"website" | "note" | "document">("website");

  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
      content: "",
      spaceId: "",
    },
  });

  const handleSubmit = (data: any) => {
    console.log({ ...data, type });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add to your second brain</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="website" onValueChange={(value) => setType(value as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </TabsTrigger>
            <TabsTrigger value="note" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Note
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-2">
              <File className="w-4 h-4" />
              Document
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <TabsContent value="website">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="note">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your note..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="document">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input type="file" className="hidden" id="document-upload" />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  >
                    Drag and drop a file or click to upload
                  </label>
                </div>
              </TabsContent>

              <FormField
                control={form.control}
                name="spaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Space</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a space" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {spaces.map((space) => (
                          <SelectItem key={space.id} value={String(space.id)}>
                            {space.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Memory</Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}