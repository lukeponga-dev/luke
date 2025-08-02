'use server';

import { improveDescription } from '@/ai/flows/improve-description';
import { suggestKeywords } from '@/ai/flows/suggest-keywords';
import { z } from 'zod';

const improveDescriptionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

export async function getImprovedDescription(data: { description: string }) {
  try {
    const validatedData = improveDescriptionSchema.parse(data);
    const result = await improveDescription(validatedData);
    return { success: true, improvedDescription: result.improvedDescription };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to improve description.' };
  }
}

const suggestKeywordsSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  technologies: z.string().min(1, 'Please provide at least one technology.'),
});

export async function getSuggestedKeywords(data: { description: string; technologies: string }) {
    try {
        const validatedData = suggestKeywordsSchema.parse(data);
        const result = await suggestKeywords(validatedData);
        return { success: true, keywords: result.keywords };
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
          return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: 'Failed to suggest keywords.' };
    }
}
