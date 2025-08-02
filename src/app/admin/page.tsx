
'use client';

import { useState, useTransition, useEffect } from 'react';
import Header from '@/components/layout/header';
import { logout, updateProject, deleteProject } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import ProjectTable from '@/components/portfolio/project-table';
import AddProjectSheet from '@/components/portfolio/add-project-sheet';

type AdminPageProps = {
  initialProjects: Project[];
};

function AdminPageComponent({ initialProjects }: AdminPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);


  const handleProjectUpdate = (updatedProject: Project) => {
    startTransition(async () => {
      await updateProject(updatedProject);
      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
      toast({ title: 'Project updated!', description: `${updatedProject.title} has been updated.` });
    });
  };

  const handleProjectDelete = (projectId: string) => {
    startTransition(async () => {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast({ variant: 'destructive', title: 'Project deleted.' });
    });
  };
  
  const handleProjectAdd = (addedProject: Project) => {
    setProjects(prev => [addedProject, ...prev]);
  }

  if (projects === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
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
            <AddProjectSheet onProjectAdded={handleProjectAdd} />
        </div>
        <ProjectTable
          projects={projects}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete}
          isPending={isPending}
        />
      </main>
    </div>
  );
}

// We must import getProjects from the fs library.
import { getProjects } from '@/lib/project-fs';

export default async function AdminPage() {
  const projects = await getProjects();

  return <AdminPageComponent initialProjects={projects} />;
}
