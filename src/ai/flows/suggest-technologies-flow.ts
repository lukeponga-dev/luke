
'use server';
/**
 * @fileOverview A flow for suggesting technologies for a project.
 *
 * - suggestTechnologies - A function that handles suggesting technologies.
 * - SuggestTechnologiesInput - The input type for the suggestTechnologies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestTechnologiesInputSchema = z.object({
  description: z.string().describe('The description of the project.'),
});
export type SuggestTechnologiesInput = z.infer<typeof SuggestTechnologiesInputSchema>;

const prompt = ai.definePrompt({
  name: 'suggestTechnologiesPrompt',
  input: { schema: SuggestTechnologiesInputSchema },
  output: { schema: z.array(z.string()) },
  prompt: `You are an expert in software development and can identify the most relevant technologies for a project.
Based on the following project description, suggest a list of 5-10 relevant technologies.
Return the list as a JSON array of strings.

Project Description:
{{{description}}}

Suggested Technologies (JSON array of strings):`,
});

const suggestTechnologiesFlow = ai.defineFlow(
  {
    name: 'suggestTechnologiesFlow',
    inputSchema: SuggestTechnologiesInputSchema,
    outputSchema: z.array(z.string()),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function suggestTechnologies(input: SuggestTechnologiesInput): Promise<string[]> {
  return suggestTechnologiesFlow(input);
}
