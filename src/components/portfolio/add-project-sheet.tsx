
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/types';
import { PlusCircle, Wand2, Loader2, Upload } from 'lucide-react';
import { getSuggestedKeywords, addProject, importProjects } from '@/app/actions';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  technologies: z.string().min(1, 'Please enter at least one technology'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type AddProjectSheetProps = {
  children?: React.ReactNode;
};

export default function AddProjectSheet({ children }: AddProjectSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, startSuggestingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [keywords, setKeywords] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: '', description: '', technologies: '', imageUrl: '' },
  });

  const handleSuggestKeywords = () => {
    const { description, technologies } = form.getValues();
    if (!description || !technologies) {
      toast({ variant: 'destructive', title: 'Info needed', description: 'Please provide a description and technologies to suggest keywords.' });
      return;
    }

    startSuggestingTransition(async () => {
      const result = await getSuggestedKeywords({ description, technologies });
      if (result && result.success && result.keywords) {
        setKeywords(prev => [...new Set([...prev, ...result.keywords])]);
        toast({ title: 'Keywords suggested', description: 'AI has suggested some new keywords.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result?.error || 'An unexpected error occurred.' });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    startSavingTransition(async () => {
      const newProjectData: Project = {
        id: crypto.randomUUID(),
        ...values,
        technologies: values.technologies.split(',').map(t => t.trim()).filter(Boolean),
        keywords,
        imageUrl: values.imageUrl || `https://placehold.co/600x400.png`,
        createdAt: new Date().toISOString(),
      };
      
      try {
        await addProject(newProjectData);
        toast({ title: 'Project added!', description: `${values.title} has been added to your portfolio.` });
        form.reset();
        setKeywords([]);
        setIsOpen(false);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add project.' });
      }
    });
  };
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedProjects: Project[] = JSON.parse(content);
          // Basic validation
          if (Array.isArray(importedProjects) && importedProjects.every(p => p.id && p.title)) {
            startSavingTransition(async () => {
              await importProjects(importedProjects);
              toast({ title: 'Success', description: `${importedProjects.length} projects imported.` });
              setIsOpen(false);
            });
          } else {
            throw new Error('Invalid project structure in JSON file.');
          }
        } catch (error) {
          toast({ variant: 'destructive', title: 'Import Error', description: 'Failed to parse or validate the JSON file.' });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children || (
        <SheetTrigger asChild>
          <Button>
            <PlusCircle className="mr-2" /> Add Project
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Add a New Project</SheetTitle>
          <SheetDescription>Fill in the details of your project. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
        <form className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register('description')} />
            {form.formState.errors.description && <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input id="technologies" {...form.register('technologies')} />
            {form.formState.errors.technologies && <p className="text-sm text-destructive mt-1">{form.formState.errors.technologies.message}</p>}
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input id="imageUrl" placeholder="https://placehold.co/600x400.png" {...form.register('imageUrl')} />
            {form.formState.errors.imageUrl && <p className="text-sm text-destructive mt-1">{form.formState.errors.imageUrl.message}</p>}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
                <Label>Keywords</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestKeywords} disabled={isSuggesting}>
                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Suggest
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 border min-h-10 rounded-md">
                {keywords.length > 0 ? keywords.map(k => <Badge key={k} variant="secondary">{k}</Badge>) : <p className="text-sm text-muted-foreground">No keywords yet.</p>}
            </div>
          </div>
        </form>
        </ScrollArea>
        <SheetFooter className='mt-auto pt-4 border-t'>
          <div className="flex justify-between w-full">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild>
                <span><Upload className="mr-2 h-4 w-4" /> Import JSON</span>
              </Button>
              <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileImport} />
            </label>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button type="button" variant="ghost" disabled={isSaving}>Cancel</Button>
              </SheetClose>
              <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Project
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
