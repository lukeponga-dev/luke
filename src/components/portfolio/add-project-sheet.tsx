
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormState } from 'react-dom';
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

const initialState = {
  success: false,
  message: '',
};

type AddProjectSheetProps = {
  children?: React.ReactNode;
};

export default function AddProjectSheet({ children }: AddProjectSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, startSuggestingTransition] = useTransition();
  const [isImporting, startImportingTransition] = useTransition();

  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const { toast } = useToast();

  const [formState, formAction] = useFormState(addProject, initialState);

  useEffect(() => {
    if (formState.success) {
      toast({ title: 'Project added!', description: formState.message });
      setIsOpen(false);
    } else if (formState.message) {
      toast({ variant: 'destructive', title: 'Error', description: formState.message });
    }
  }, [formState, toast]);

  const handleSuggestKeywords = () => {
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
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedProjects: Project[] = JSON.parse(content);
          if (Array.isArray(importedProjects) && importedProjects.every(p => p.id && p.title)) {
            startImportingTransition(async () => {
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
        <form action={formAction} className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <div className="space-y-4 py-4">
              <input type="hidden" name="id" value={crypto.randomUUID()} />
              <input type="hidden" name="createdAt" value={new Date().toISOString()} />
              <input type="hidden" name="keywords" value={keywords.join(', ')} />
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input id="technologies" name="technologies" required onChange={e => setTechnologies(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/600x400.png" defaultValue="https://placehold.co/600x400.png" />
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
            </div>
        </ScrollArea>
        <SheetFooter className='mt-auto pt-4 border-t'>
          <div className="flex justify-between w-full">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild>
                <span><Upload className="mr-2 h-4 w-4" /> Import JSON</span>
              </Button>
              <input id="file-upload" type="file" accept=".json" className="hidden" onChange={handleFileImport} disabled={isImporting} />
            </label>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </SheetClose>
              <Button type="submit">
                Save Project
              </Button>
            </div>
          </div>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
