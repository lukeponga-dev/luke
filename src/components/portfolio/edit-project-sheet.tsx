
'use client';

import { useState, useTransition, useEffect, useActionState } from 'react';
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
import { Pencil, Wand2, Loader2 } from 'lucide-react';
import { getSuggestedKeywords, updateProject } from '@/app/actions';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

const initialState = {
  success: false,
  message: '',
};

type EditProjectSheetProps = {
  project: Project;
  children?: React.ReactNode;
};

export default function EditProjectSheet({ project, children }: EditProjectSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuggesting, startSuggestingTransition] = useTransition();

  const [description, setDescription] = useState(project.description);
  const [technologies, setTechnologies] = useState(project.technologies.join(', '));
  const [keywords, setKeywords] = useState<string[]>(project.keywords);
  const { toast } = useToast();

  const [formState, formAction] = useActionState(updateProject, initialState);

  useEffect(() => {
    if (formState.success) {
      toast({ title: 'Project updated!', description: formState.message });
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : (
        <Button variant="outline">
            <Pencil className="mr-2" /> Edit Project
        </Button>
      )}
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Project</SheetTitle>
          <SheetDescription>Make changes to your project. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <form action={formAction} className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <div className="space-y-4 py-4">
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="createdAt" value={project.createdAt} />
              <input type="hidden" name="keywords" value={keywords.join(', ')} />
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required defaultValue={project.title}/>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required defaultValue={project.description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input id="technologies" name="technologies" required defaultValue={project.technologies.join(', ')} onChange={e => setTechnologies(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://placehold.co/600x400.png" defaultValue={project.imageUrl} />
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
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </SheetClose>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
