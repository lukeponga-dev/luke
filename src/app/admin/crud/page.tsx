'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { getProjects } from '@/lib/project-fs';
import { addProject, updateProject, deleteProject } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useFormState } from 'react-dom';

export default function AdminCrudPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    }
    fetchProjects();
  }, []);

  const [addState, addAction] = useFormState(addProject, { error: '' });
  const [updateState, updateAction] = useFormState(updateProject, { error: '' });

  const handleAddClick = () => {
    setSelectedProject(null);
    setIsSheetOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedProject(null);
  };

  const handleSubmit = async (formData: FormData) => {
    const projectData = {
      id: selectedProject?.id || crypto.randomUUID(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
      keywords: (formData.get('keywords') as string).split(',').map(k => k.trim()),
      imageUrl: formData.get('imageUrl') as string,
      createdAt: selectedProject?.createdAt || new Date().toISOString(),
    };

    if (selectedProject) {
      await updateProject(projectData);
    } else {
      await addProject(projectData);
    }
    const fetchedProjects = await getProjects();
    setProjects(fetchedProjects);
    closeSheet();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button onClick={handleAddClick}>Add Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600">{project.description}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleEditClick(project)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteClick(project.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedProject ? 'Edit Project' : 'Add Project'}</SheetTitle>
          </SheetHeader>
          <form action={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input id="title" name="title" defaultValue={selectedProject?.title} required />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Textarea id="description" name="description" defaultValue={selectedProject?.description} required />
            </div>
            <div>
              <label htmlFor="technologies">Technologies (comma-separated)</label>
              <Input id="technologies" name="technologies" defaultValue={selectedProject?.technologies.join(', ')} required />
            </div>
            <div>
              <label htmlFor="keywords">Keywords (comma-separated)</label>
              <Input id="keywords" name="keywords" defaultValue={selectedProject?.keywords.join(', ')} required />
            </div>
            <div>
              <label htmlFor="imageUrl">Image URL</label>
              <Input id="imageUrl" name="imageUrl" defaultValue={selectedProject?.imageUrl} required />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={closeSheet}>Cancel</Button>
              <Button type="submit">{selectedProject ? 'Update' : 'Add'}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
