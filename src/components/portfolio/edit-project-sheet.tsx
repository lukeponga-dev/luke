'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/lib/types";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { updateProject } from "@/app/actions";

export function EditProjectSheet({ project, onProjectUpdated }: { project: Project, onProjectUpdated: (updatedProject: Project) => void }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(updateProject, { success: false, message: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        setOpen(false);
        if(state.project) {
          onProjectUpdated(state.project);
        }
      }
    }
  }, [state, toast, onProjectUpdated]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="space-y-4 mt-8">
          <input type="hidden" name="id" value={project.id} />
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project.description} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" defaultValue={project.technologies.join(', ')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input id="keywords" name="keywords" defaultValue={project.keywords.join(', ')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={project.imageUrl} required />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
