
'use server';
/**
 * @fileOverview A flow for suggesting keywords for a project.
 *
 * - suggestKeywords - A function that handles suggesting keywords.
 * - SuggestKeywordsInput - The input type for the suggestKeywords function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestKeywordsInputSchema = z.object({
  description: z.string().describe('The description of the project.'),
});
export type SuggestKeywordsInput = z.infer<typeof SuggestKeywordsInputSchema>;

const prompt = ai.definePrompt({
  name: 'suggestKeywordsPrompt',
  input: { schema: SuggestKeywordsInputSchema },
  output: { schema: z.array(z.string()) },
  prompt: `You are an expert in SEO and can identify the most relevant keywords for a project.
Based on the following project description, suggest a list of 5-10 relevant keywords.
Return the list as a JSON array of strings.

Project Description:
{{{description}}}

Suggested Keywords (JSON array of strings):`,
});

const suggestKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestKeywordsFlow',
    inputSchema: SuggestKeywordsInputSchema,
    outputSchema: z.array(z.string()),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function suggestKeywords(input: SuggestKeywordsInput): Promise<string[]> {
  return suggestKeywordsFlow(input);
}
