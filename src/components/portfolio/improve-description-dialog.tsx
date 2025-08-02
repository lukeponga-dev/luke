'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getImprovedDescription } from '@/app/actions';
import { Wand2, Loader2, Clipboard, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

type ImproveDescriptionDialogProps = {
  description: string;
  onSave: (newDescription: string) => void;
};

export default function ImproveDescriptionDialog({ description, onSave }: ImproveDescriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [improvedDescription, setImprovedDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await getImprovedDescription({ description });
      if (result && result.success && result.improvedDescription) {
        setImprovedDescription(result.improvedDescription);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result?.error || 'Could not generate a new description.',
        });
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedDescription);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleSave = () => {
    onSave(improvedDescription);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Wand2 className="mr-2 h-4 w-4" />
        Improve with AI
      </Button>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Improve Description
          </DialogTitle>
          <DialogDescription>
            Let AI suggest a more compelling version of your project description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
                <h3 className="text-sm font-semibold mb-2">Current Description</h3>
                <Textarea value={description} readOnly rows={10} className="bg-muted" />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-2">AI Suggestion</h3>
                {isPending ? (
                    <div className="flex items-center justify-center h-full border rounded-md">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : improvedDescription ? (
                    <div className="relative">
                        <Textarea value={improvedDescription} readOnly rows={10} />
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopy}>
                            {isCopied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground">Click "Generate" to see AI suggestion.</p>
                    </div>
                )}
            </div>
        </div>
        <Separator />
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Cancel
                </Button>
            </DialogClose>
            {improvedDescription ? (
                 <Button onClick={handleSave}>Accept & Save</Button>
            ) : (
                <Button onClick={handleGenerate} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
