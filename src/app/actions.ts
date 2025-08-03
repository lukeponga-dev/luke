
'use server';

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addProject as addProjectToDb, deleteProject as deleteProjectFromDb, updateProject as updateProjectInDb } from '@/lib/project-fs';
import type { Project } from '@/lib/types';
import { generateDescription } from '@/ai/flows/generate-description-flow';

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password');

  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, message: 'Invalid password.' };
  }

  const session = await getIronSession(cookies(), sessionOptions);
  session.user = {
    isLoggedIn: true,
  };
  await session.save();
  redirect('/admin');
}

export async function logout() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  redirect('/login');
}

export async function addProject(prevState: any, formData: FormData) {
    const session = await getIronSession(cookies(), sessionOptions);
    if (!session.user?.isLoggedIn) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim());
        const keywords = (formData.get('keywords') as string).split(',').map(k => k.trim());
        const imageUrl = formData.get('imageUrl') as string;

        if (!title || !description || !technologies.length || !imageUrl) {
            return { success: false, message: 'Missing required fields.' };
        }

        const newProject = await addProjectToDb({
            title,
            description,
            technologies,
            keywords,
            imageUrl,
        });
        
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true, message: 'Project added successfully.', project: newProject };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while adding the project.' };
    }
}

export async function deleteProject(projectId: string) {
    const session = await getIronSession(cookies(), sessionOptions);
    if (!session.user?.isLoggedIn) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await deleteProjectFromDb(projectId);
        
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true, message: 'Project deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while deleting the project.' };
    }
}

export async function updateProject(prevState: any, formData: FormData) {
    const session = await getIronSession(cookies(), sessionOptions);
    if (!session.user?.isLoggedIn) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim());
        const keywords = (formData.get('keywords') as string).split(',').map(k => k.trim());
        const imageUrl = formData.get('imageUrl') as string;

        if (!id || !title || !description || !technologies.length || !imageUrl) {
            return { success: false, message: 'Missing required fields.' };
        }

        const updatedProject = await updateProjectInDb(id, {
            title,
            description,
            technologies,
            keywords,
            imageUrl,
        });
        
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true, message: 'Project updated successfully.', project: updatedProject };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while updating the project.' };
    }
}

export async function generateDescriptionAction(input: { title: string, technologies: string }): Promise<string> {
    const session = await getIronSession(cookies(), sessionOptions);
    if (!session.user?.isLoggedIn) {
        throw new Error('Unauthorized');
    }
    return await generateDescription(input);
}
