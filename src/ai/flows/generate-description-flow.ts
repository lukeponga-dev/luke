
'use server';
/**
 * @fileOverview A flow for generating project descriptions.
 *
 * - generateDescription - A function that handles generating the description.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  technologies: z.string().describe('A comma-separated list of technologies used in the project.'),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert copywriter specializing in technology projects. 
Generate a compelling, one-paragraph project description based on the following information. 
The description should be suitable for a portfolio.

Project Title: {{{title}}}
Technologies Used: {{{technologies}}}

Description:`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateDescription(input: GenerateDescriptionInput): Promise<string> {
  return generateDescriptionFlow(input);
}
