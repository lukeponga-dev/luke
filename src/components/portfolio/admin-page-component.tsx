'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { logout, addProject } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const addProjectInitialState = {
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

function AddProjectSheet({ onProjectAdded }: { onProjectAdded: (project: Project) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, formAction] = useActionState(addProject, addProjectInitialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success && formState.project) {
      toast({
        title: 'Success!',
        description: 'New project has been added.',
      });
      onProjectAdded(formState.project);
      setIsOpen(false);
      formRef.current?.reset();
    } else if (!formState.success && formState.message) {
      toast({
        title: 'Error',
        description: formState.message,
        variant: 'destructive',
      });
    }
  }, [formState, toast, onProjectAdded]);
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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

export default function AdminPageComponent({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  const handleLogout = async () => {
    await logout();
  };
  
  const onProjectAdded = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
          <AddProjectSheet onProjectAdded={onProjectAdded} />
        </div>
        <div className="bg-card rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={80}
                      height={60}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{format(new Date(project.createdAt), 'PPP')}</TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
