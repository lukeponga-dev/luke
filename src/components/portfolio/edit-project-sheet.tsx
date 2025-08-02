
'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ProjectForm from './project-form';
import type { Project } from '@/lib/types';
import { useActionState } from 'react';
import { updateProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  success: false,
  message: '',
  project: undefined,
};

export default function EditProjectSheet({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, formAction] = useActionState(updateProject, initialState);
  const { toast } = useToast();
  
  const actionWithId = (formData: FormData) => {
    formData.append('id', project.id);
    formData.append('createdAt', project.createdAt);
    formAction(formData);
  }

  useEffect(() => {
    if (formState.success) {
      toast({ title: 'Project updated!', description: 'Your project has been saved.' });
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
          <SheetTitle>Edit Project</SheetTitle>
          <SheetDescription>
            Update the details for your project.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ProjectForm
            action={actionWithId}
            initialData={project}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
