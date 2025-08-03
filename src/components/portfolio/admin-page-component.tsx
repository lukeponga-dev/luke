
'use client';

import { useState, useActionState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { logout, deleteProject as deleteProjectAction } from '@/app/actions';
import Header from '@/components/layout/header';
import { MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { format } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AddProjectSheet } from './add-project-sheet';
import { EditProjectSheet } from './edit-project-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AdminPageComponent({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
  };
  
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
  };

  const onProjectAdded = (newProject: Project) => {
    setProjects(currentProjects => [newProject, ...currentProjects]);
  };
  
  const onProjectUpdated = (updatedProject: Project) => {
    setProjects(currentProjects => 
        currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        const result = await deleteProjectAction(projectToDelete.id);
         if (result.success) {
            toast({
                title: 'Success',
                description: 'Project deleted successfully.',
            });
            setProjects(currentProjects => currentProjects.filter(p => p.id !== projectToDelete.id));
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
      } catch (error) {
        toast({
            title: 'Error',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
        });
      } finally {
        setProjectToDelete(null);
      }
    }
  };

  return (
    <>
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
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <EditProjectSheet project={project} onProjectUpdated={onProjectUpdated} />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(project)}
                          >
                            Delete
                          </DropdownMenuItem>
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

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
