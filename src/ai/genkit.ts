import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = configureGenkit({
  plugins: [
    googleAI({
      apiVersion: ['v1', 'v1beta'],
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
