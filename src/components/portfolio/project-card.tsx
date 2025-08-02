
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { MoreVertical, Trash2, Pencil, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ImproveDescriptionDialog from './improve-description-dialog';
import EditProjectSheet from './edit-project-sheet';
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
import { useTransition } from 'react';
import { deleteProject, updateProject } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type ProjectCardProps = {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
  readOnly?: boolean;
};

const aiHints: Record<string, string> = {
  '1': 'new zealand landscape',
  '2': 'medical doctor',
  '3': 'clinic reception',
  '4': 'space galaxy',
};

export default function ProjectCard({ project, className, style, readOnly = false }: ProjectCardProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDescriptionSave = (newDescription: string) => {
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

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProject(project.id);
      toast({ variant: 'destructive', title: 'Project deleted' });
    });
  };
  
  return (
    <Card style={style} className={`relative flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {isPending && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <CardHeader>
        <div className="aspect-[3/2] relative w-full mb-4">
            <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="rounded-t-lg object-cover"
                data-ai-hint={aiHints[project.id] || 'project code'}
            />
        </div>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg">{project.title}</CardTitle>
            {!readOnly && (
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={isPending}>
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
                          onSave={handleDescriptionSave}
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
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

              </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
        <CardDescription>
          Added {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
        <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Technologies</h4>
            <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Keywords</h4>
            <div className="flex flex-wrap gap-1">
            {(project.keywords || []).slice(0, 5).map((keyword) => (
                <Badge key={keyword} variant="outline">{keyword}</Badge>
            ))}
            {(project.keywords?.length || 0) > 5 && <Badge variant="outline">...</Badge>}
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
