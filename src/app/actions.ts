'use server';

import { improveDescription } from '@/ai/flows/improve-description';
import { suggestKeywords } from '@/ai/flows/suggest-keywords';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

const loginSchema = z.object({
    password: z.string(),
});

export async function login(prevState: { error: string }, formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(values);

    if (parsed.success) {
        // IMPORTANT: In a real application, use a secure password hash comparison.
        // You can change the password here.
        if (parsed.data.password === 'password') {
            const cookieStore = cookies();
            cookieStore.set('auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });
            redirect('/admin');
        }
    }
    return { error: 'Invalid password.' };
}

export async function logout() {
    const cookieStore = cookies();
    cookieStore.delete('auth');
    redirect('/login');
}
