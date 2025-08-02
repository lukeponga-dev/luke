
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { MoreVertical, Trash2, Pencil, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ImproveDescriptionDialog from './improve-description-dialog';
import EditProjectSheet from './edit-project-sheet';
import { useTransition } from 'react';
import { deleteProject, updateProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type ProjectTableProps = {
  projects: Project[];
};

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const handleDescriptionSave = (project: Project, newDescription: string) => {
     startTransition(async () => {
      const formData = new FormData();
      Object.keys(project).forEach(key => {
        const value = project[key as keyof Project];
        if (key === 'description') {
          formData.append(key, newDescription);
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value);
        }
      });
      await updateProject({}, formData);
      toast({ title: 'Description updated!' });
    });
  };
  
  const onDelete = (projectId: string) => {
    startTransition(async () => {
      await deleteProject(projectId);
      toast({ variant: 'destructive', title: 'Project deleted.' });
    });
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
                         <EditProjectSheet project={project}>
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
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(project.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
