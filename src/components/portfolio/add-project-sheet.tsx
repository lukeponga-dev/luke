
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
import { useFormStatus } from 'react-dom';
import { addProject, generateDescriptionAction } from '@/app/actions';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
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

export function AddProjectSheet() {
  const [state, formAction] = useActionState(addProject, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
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
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
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
  }, [state, toast]);

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
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" required />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
               <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate with AI
              </Button>
            </div>
            <Textarea id="description" name="description" required />
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
