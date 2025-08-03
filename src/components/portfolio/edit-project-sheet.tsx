
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/lib/types";
import { useFormStatus } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef, useActionState } from "react";
import { updateProject, generateDescriptionAction } from "@/app/actions";
import { Loader2, Sparkles } from "lucide-react";

const initialState = {
  success: false,
  message: '',
  project: undefined as Project | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
       {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}


export function EditProjectSheet({ project, onProjectUpdated }: { project: Project, onProjectUpdated: (project: Project) => void }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(updateProject, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateDescription = async () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const title = formData.get('title') as string;
    const technologies = formData.get('technologies') as string;

    if (!title || !technologies) {
      toast({
        title: 'Info needed',
        description: 'Please enter a title and technologies to generate a description.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      const description = await generateDescriptionAction({ title, technologies });
      if (formRef.current) {
        const descriptionField = formRef.current.elements.namedItem('description') as HTMLTextAreaElement;
        if (descriptionField) {
          descriptionField.value = description;
        }
      }
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Failed to generate description.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  useEffect(() => {
    if (state && state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success && state.project) {
        onProjectUpdated(state.project);
        setOpen(false);
      }
    }
  }, [state, toast, onProjectUpdated]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="w-full text-left">Edit</span>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
        </SheetHeader>
        <form ref={formRef} action={formAction} className="space-y-4 mt-8">
          <input type="hidden" name="id" value={project.id} />
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" defaultValue={project.technologies.join(', ')} required />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate with AI
                </Button>
            </div>
            <Textarea id="description" name="description" defaultValue={project.description} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input id="keywords" name="keywords" defaultValue={project.keywords?.join(', ')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={project.imageUrl} required />
          </div>
          <SubmitButton />
        </form>
      </SheetContent>
    </Sheet>
  );
}
