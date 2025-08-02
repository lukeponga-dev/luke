
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { MoreVertical, Trash2, Pencil, Wand2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ImproveDescriptionDialog from './improve-description-dialog';
import EditProjectSheet from './edit-project-sheet';

type ProjectTableProps = {
  projects: Project[];
  onUpdate: (updatedProject: Project) => void;
  onDelete: (projectId: string) => void;
  isPending?: boolean;
};

export default function ProjectTable({ projects, onUpdate, onDelete, isPending = false }: ProjectTableProps) {
  const handleDescriptionSave = (project: Project, newDescription: string) => {
    onUpdate({ ...project, description: newDescription });
  };
  
  return (
    <div className="border rounded-lg relative">
       {isPending && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin" />
          </div>
      )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-sm">
                    <p className="truncate">{project.description}</p>
                </TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0,3).map((tech) => (
                            <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                        {project.technologies.length > 3 && <Badge variant="outline">...</Badge>}
                    </div>
                </TableCell>
                <TableCell>{format(new Date(project.createdAt), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isPending}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                         <EditProjectSheet project={project} onSave={(updated) => onUpdate(updated)}>
                            <div className="flex items-center w-full">
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </div>
                          </EditProjectSheet>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <ImproveDescriptionDialog
                              description={project.description}
                              onSave={(newDescription) => handleDescriptionSave(project, newDescription)}
                          />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {projects.length === 0 && (
            <div className="text-center p-16">
                <h3 className="text-xl font-semibold">No projects yet</h3>
                <p className="text-muted-foreground mt-2">Add your first project to see it here.</p>
            </div>
        )}
    </div>
  );
}
