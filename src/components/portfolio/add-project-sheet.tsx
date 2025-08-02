
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
import { addProject } from '@/app/actions';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
  project: null,
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
  const [state, formAction] = useActionState(addProject, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state && state.success && state.project) {
      toast({
        title: 'Success!',
        description: 'New project has been added.',
      });
      onProjectAdded(state.project);
      setOpen(false);
      formRef.current?.reset();
    } else if (state && state.message && !state.success) {
       toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, onProjectAdded]);

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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" name="technologies" required />
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
