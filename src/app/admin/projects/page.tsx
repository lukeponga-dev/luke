
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/project-fs';
import { PlusCircle, Loader2 } from 'lucide-react';
import ProjectTable from '@/components/portfolio/project-table';
import { addProject, updateProject, deleteProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import AddProjectSheet from '@/components/portfolio/add-project-sheet';
import type { Project } from '@/lib/types';
import { useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      setIsLoading(false);
    }
    loadProjects();
  }, []);

  const handleProjectAdd = async (formData: FormData) => {
    let newProject: Project | null = null;
    startTransition(async () => {
      const result = await addProject({}, formData);
      if (result.project) {
        newProject = result.project;
        setProjects((prev) => [newProject!, ...prev]);
        toast({ title: 'Project added!', description: 'Your new project has been saved.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
    return !!newProject;
  };
  
  const handleProjectUpdate = (updatedProject: Project) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', updatedProject.id);
      formData.append('title', updatedProject.title);
      formData.append('description', updatedProject.description);
      formData.append('technologies', updatedProject.technologies.join(','));
      formData.append('keywords', updatedProject.keywords.join(','));
      formData.append('imageUrl', updatedProject.imageUrl);
      formData.append('createdAt', updatedProject.createdAt);
      
      await updateProject({}, formData);
      setProjects((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      toast({ title: 'Project updated!', description: `${updatedProject.title} has been updated.` });
    });
  };

  const handleProjectDelete = (projectId: string) => {
    startTransition(async () => {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter(p => p.id !== projectId));
      toast({ variant: 'destructive', title: 'Project deleted.' });
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Projects</h1>
        <AddProjectSheet onSave={handleProjectAdd}>
            <Button>
                <PlusCircle className="mr-2" /> Add Project
            </Button>
        </AddProjectSheet>
      </div>
      <ProjectTable 
        projects={projects}
        onUpdate={handleProjectUpdate}
        onDelete={handleProjectDelete}
        isPending={isPending}
      />
    </div>
  );
}
