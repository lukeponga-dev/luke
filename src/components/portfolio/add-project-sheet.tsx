
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
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import ProjectForm from './project-form';

export default function AddProjectSheet({
  onSave,
  children,
}: {
  onSave: (formData: FormData) => Promise<boolean>;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (formData: FormData) => {
    const success = await onSave(formData);
    if (success) {
      setIsOpen(false);
    }
  };

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
            action={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
