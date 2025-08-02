
'use client';

import { useTransition } from 'react';
import Header from '@/components/layout/header';
import { logout, updateProject, deleteProject } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import ProjectTable from '@/components/portfolio/project-table';
import AddProjectSheet from '@/components/portfolio/add-project-sheet';
import Link from 'next/link';

type AdminPageProps = {
  initialProjects: Project[];
};

export default function AdminPageComponent({ initialProjects }: AdminPageProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleProjectUpdate = (updatedProject: Project) => {
    startTransition(async () => {
      try {
        await updateProject(updatedProject);
        toast({ title: 'Project updated!', description: `${updatedProject.title} has been updated.` });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update project.' });
      }
    });
  };

  const handleProjectDelete = (projectId: string) => {
    startTransition(async () => {
      try {
        await deleteProject(projectId);
        toast({ title: 'Project deleted.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete project.' });
      }
    });
  };
  
  if (initialProjects === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <div className="flex items-center gap-4">
          <form action={logout}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </Header>
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold">Manage Projects</h1>
            <div className="flex items-center gap-4">
              <Link href="/admin/crud">
                <Button>CRUD Page</Button>
              </Link>
              <AddProjectSheet />
            </div>
        </div>
        <ProjectTable
          projects={initialProjects}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete}
          isPending={isPending}
        />
      </main>
    </div>
  );
}
