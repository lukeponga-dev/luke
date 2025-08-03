
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { addProject } from '@/app/actions';
import { useRef, useState, useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { generateDescription } from '@/ai/flows/generate-description-flow';

const initialState = {
    success: false,
    message: '',
    project: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Project
        </Button>
    );
}

export function AddProjectSheet({ onProjectAdded }: { 
    onProjectAdded: (project: Project) => void,
}) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [state, formAction] = useActionState(addProject, initialState);

  useEffect(() => {
    if (state && state.message) {
      if (state.success && state.project) {
        toast({
          title: 'Success!',
          description: 'New project has been added.',
        });
        onProjectAdded(state.project);
        setOpen(false);
        formRef.current?.reset();
      } else {
         toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, onProjectAdded]);


  const handleGenerateDescription = async () => {
    if (!title || !technologies) {
      toast({
        title: 'Error',
        description: 'Please enter a title and technologies to generate a description.',
        variant: 'destructive',
      });
      return;
    }
  
    setIsGenerating(true);
    try {
      const description = await generateDescription({ title, technologies });
      if (descriptionRef.current) {
        descriptionRef.current.value = description;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate description.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Project</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Project</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new project to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <form ref={formRef} action={formAction} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" required onChange={(e) => setTechnologies(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required ref={descriptionRef} />
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate with AI
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input id="keywords" name="keywords" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue="https://placehold.co/600x400.png" required />
          </div>
          <SubmitButton />
        </form>
      </SheetContent>
    </Sheet>
  );
}
