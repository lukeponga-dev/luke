
import { genkit, type GenkitMemory } from '@genkit-ai/next';
import { googleAI } from '@genkit-ai/googleai';
import { GENKIT_CLIENT_HEADER } from 'genkit';

export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: ['v1', 'v1beta'],
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
