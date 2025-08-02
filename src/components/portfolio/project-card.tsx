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
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ImproveDescriptionDialog from './improve-description-dialog';

type ProjectCardProps = {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
  onDelete: (projectId: string) => void;
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

export default function ProjectCard({ project, onUpdate, onDelete, className, style, readOnly = false }: ProjectCardProps) {
  const handleDescriptionSave = (newDescription: string) => {
    onUpdate({ ...project, description: newDescription });
  };
  
  return (
    <Card style={style} className={`flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <ImproveDescriptionDialog
                          description={project.description}
                          onSave={handleDescriptionSave}
                      />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                  </DropdownMenuItem>
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
