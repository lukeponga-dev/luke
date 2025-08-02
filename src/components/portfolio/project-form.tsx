
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { getSuggestedKeywords } from '@/app/actions';
import { Badge } from '../ui/badge';
import type { Project } from '@/lib/types';

export default function ProjectForm({
  action,
  initialData,
  onCancel,
}: {
  action: (formData: FormData) => void;
  initialData?: Project;
  onCancel: () => void;
}) {
  const [isSuggesting, startSuggestingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();

  const [description, setDescription] = useState(initialData?.description || '');
  const [technologies, setTechnologies] = useState(initialData?.technologies?.join(', ') || '');
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
  const { toast } = useToast();

  const handleSuggestKeywords = () => {
    if (!description || !technologies) {
      toast({
        variant: 'destructive',
        title: 'Info needed',
        description: 'Please provide a description and technologies to suggest keywords.',
      });
      return;
    }

    startSuggestingTransition(async () => {
      const result = await getSuggestedKeywords({ description, technologies });
      if (result && result.success && result.keywords) {
        setKeywords((prev) => [...new Set([...prev, ...result.keywords])]);
        toast({ title: 'Keywords suggested', description: 'AI has suggested some new keywords.' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result?.error || 'An unexpected error occurred.',
        });
      }
    });
  };
  
  const handleSubmit = (formData: FormData) => {
    formData.set('keywords', keywords.join(', '));
    startSavingTransition(() => {
        action(formData);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={initialData?.title} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={initialData?.description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          name="technologies"
          required
          defaultValue={initialData?.technologies?.join(', ')}
          onChange={(e) => setTechnologies(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="https://placehold.co/600x400.png"
          defaultValue={initialData?.imageUrl}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Keywords</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSuggestKeywords}
            disabled={isSuggesting}
          >
            {isSuggesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 p-2 border min-h-10 rounded-md">
          {keywords.length > 0 ? (
            keywords.map((k) => (
              <Badge key={k} variant="secondary">
                {k}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No keywords yet.</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Project
        </Button>
      </div>
    </form>
  );
}
