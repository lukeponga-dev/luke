'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import { AddProjectSheet } from './add-project-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export default function AdminPageComponent({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  const onProjectAdded = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
          <AddProjectSheet onProjectAdded={onProjectAdded} open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
             <Button>Add Project</Button>
          </AddProjectSheet>
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
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive">Delete</DropdownMenuItem>
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
  );
}
