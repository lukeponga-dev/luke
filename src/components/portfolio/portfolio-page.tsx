
'use client';

import { useState, useMemo } from 'react';
import type { Project } from '@/lib/types';
import ProjectCard from './project-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';

type PortfolioPageProps = {
  initialProjects: Project[];
  readOnly?: boolean;
};

export default function PortfolioPage({ initialProjects, readOnly = false }: PortfolioPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const filteredAndSortedProjects = useMemo(() => {
    return (initialProjects || [])
      .filter(project => {
        const searchContent = [
          project.title,
          project.description,
          ...project.technologies,
          ...(project.keywords || []),
        ].join(' ').toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [initialProjects, searchTerm, sortBy]);
  
  if(!initialProjects) {
    return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <section id="projects">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Featured Projects</h2>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search projects..."
                        className="pl-10 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Date Added (Newest)</SelectItem>
                        <SelectItem value="oldest">Date Added (Oldest)</SelectItem>
                        <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              readOnly={readOnly}
              className="animate-in fade-in-0 zoom-in-95 duration-500"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            />
          ))}
        </div>
        {filteredAndSortedProjects.length === 0 && (
            <div className="text-center col-span-full py-16">
                <h3 className="text-xl font-semibold">No projects found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or add a new project.</p>
            </div>
        )}
    </section>
  );
}
