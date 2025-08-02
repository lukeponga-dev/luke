
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/project-fs';
import { PlusCircle } from 'lucide-react';
import ProjectTable from '@/components/portfolio/project-table';
import AddProjectSheet from '@/components/portfolio/add-project-sheet';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Projects</h1>
        <AddProjectSheet>
          <Button>
            <PlusCircle className="mr-2" /> Add Project
          </Button>
        </AddProjectSheet>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
