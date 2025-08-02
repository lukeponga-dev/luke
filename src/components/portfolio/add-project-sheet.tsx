
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ProjectForm from './project-form';
import { useToast } from '@/hooks/use-toast';
import { useActionState } from 'react';
import { addProject } from '@/app/actions';

const initialState = {
  success: false,
  message: '',
};

export default function AddProjectSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, formAction] = useActionState(addProject, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (formState.success) {
      toast({ title: 'Project added!', description: 'Your new project has been saved.' });
      setIsOpen(false);
    } else if (formState.message) {
      toast({ variant: 'destructive', title: 'Error', description: formState.message });
    }
  }, [formState, toast]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Project</SheetTitle>
          <SheetDescription>
            Fill out the form to add a new project to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ProjectForm
            action={formAction}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
