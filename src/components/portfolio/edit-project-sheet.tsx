
'use client';

import { useState } from 'react';
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
import type { Project } from '@/lib/types';

export default function EditProjectSheet({
  project,
  onSave,
  children,
}: {
  project: Project;
  onSave: (updatedProject: Project) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (formData: FormData) => {
    const updatedProject: Project = {
        id: project.id,
        createdAt: project.createdAt,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
        keywords: (formData.get('keywords') as string).split(',').map(k => k.trim()),
        imageUrl: formData.get('imageUrl') as string,
    };
    onSave(updatedProject);
    setIsOpen(false);
  };

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
            action={handleSave}
            initialData={project}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
