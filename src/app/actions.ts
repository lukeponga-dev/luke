
'use server';

import { improveDescription } from '@/ai/flows/improve-description';
import { suggestKeywords } from '@/ai/flows/suggest-keywords';
import { getProjects, saveProjects } from '@/lib/project-fs';
import { Project } from '@/lib/types';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const improveDescriptionSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

export async function getImprovedDescription(data: { description: string }) {
  try {
    const validatedData = improveDescriptionSchema.parse(data);
    const result = await improveDescription(validatedData);
    if (result && result.improvedDescription) {
      return { success: true, improvedDescription: result.improvedDescription };
    }
    return { success: false, error: 'Failed to get an improved description.'}
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to improve description due to an unexpected error.' };
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
        if (result && result.keywords) {
          return { success: true, keywords: result.keywords };
        }
        return { success: false, error: 'Failed to get suggested keywords.' };
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
          return { success: false, error: error.errors.map(e => e.message).join(', ') };
        }
        return { success: false, error: 'Failed to suggest keywords due to an unexpected error.' };
    }
}

const loginSchema = z.object({
    password: z.string(),
});

export async function login(prevState: { error: string }, formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(values);

    if (parsed.success) {
        if (parsed.data.password === (process.env.ADMIN_PASSWORD || 'password')) {
            cookies().set('auth', 'true', {
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
    cookies().delete('auth');
    redirect('/login');
}


export async function addProject(prevState: any, formData: FormData) {
    const project: Project = {
        id: formData.get('id') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()),
        keywords: (formData.get('keywords') as string).split(',').map(k => k.trim()),
        imageUrl: formData.get('imageUrl') as string,
        createdAt: formData.get('createdAt') as string,
    };

    const projects = await getProjects();
    projects.unshift(project);
    await saveProjects(projects);

    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: "Project added successfully." };
}

export async function updateProject(project: Project) {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
        projects[index] = project;
        await saveProjects(projects);
        revalidatePath('/');
        revalidatePath('/admin');
    }
}

export async function deleteProject(projectId: string) {
    const projects = await getProjects();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    await saveProjects(updatedProjects);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function importProjects(newProjects: Project[]) {
    const projects = await getProjects();
    const updatedProjects = [...newProjects, ...projects.filter(p => !newProjects.some(np => np.id === p.id))];
    await saveProjects(updatedProjects);
    revalidatePath('/');
    revalidatePath('/admin');
}
