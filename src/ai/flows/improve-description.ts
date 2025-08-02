// This file holds the Genkit flow for improving project descriptions.

'use server';

/**
 * @fileOverview AI agent that suggests improvements to project descriptions.
 *
 * - improveDescription - A function that takes a project description and suggests improvements.
 * - ImproveDescriptionInput - The input type for the improveDescription function.
 * - ImproveDescriptionOutput - The return type for the improveDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveDescriptionInputSchema = z.object({
  description: z.string().describe('The project description to improve.'),
});
export type ImproveDescriptionInput = z.infer<typeof ImproveDescriptionInputSchema>;

const ImproveDescriptionOutputSchema = z.object({
  improvedDescription: z
    .string()
    .describe('The improved project description suggested by the AI.'),
});
export type ImproveDescriptionOutput = z.infer<typeof ImproveDescriptionOutputSchema>;

export async function improveDescription(
  input: ImproveDescriptionInput
): Promise<ImproveDescriptionOutput> {
  return improveDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveDescriptionPrompt',
  input: {schema: ImproveDescriptionInputSchema},
  output: {schema: ImproveDescriptionOutputSchema},
  prompt: `You are an AI assistant that helps improve project descriptions.

  Please provide an improved version of the following project description, making it more compelling and informative:

  Original Description: {{{description}}}

  Improved Description:`, //Crucially, you MUST NOT attempt to directly call functions, use `await` keywords, or perform any complex logic _within_ the Handlebars template string. Handlebars is designed to be logic-less and is purely for presentation of pre-processed data.
});

const improveDescriptionFlow = ai.defineFlow(
  {
    name: 'improveDescriptionFlow',
    inputSchema: ImproveDescriptionInputSchema,
    outputSchema: ImproveDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
