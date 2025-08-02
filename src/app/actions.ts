
// @ts-nocheck
'use server';

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getProjects, saveProjects } from '@/lib/project-fs';
import type { Project } from '@/lib/types';

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

        const projects = await getProjects();
        const newProject: Project = {
            id: String(Date.now()),
            title,
            description,
            technologies,
            keywords,
            imageUrl,
            createdAt: new Date().toISOString(),
        };

        const updatedProjects = [newProject, ...projects];
        await saveProjects(updatedProjects);
        
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true, message: 'Project added successfully.' };
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
        const projects = await getProjects();
        const updatedProjects = projects.filter(p => p.id !== projectId);
        await saveProjects(updatedProjects);
        
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

        const projects = await getProjects();
        const projectIndex = projects.findIndex(p => p.id === id);

        if (projectIndex === -1) {
            return { success: false, message: 'Project not found.' };
        }

        const updatedProject: Project = {
            ...projects[projectIndex],
            title,
            description,
            technologies,
            keywords,
            imageUrl,
        };

        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;

        await saveProjects(updatedProjects);
        
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true, message: 'Project updated successfully.', project: updatedProject };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while updating the project.' };
    }
}
