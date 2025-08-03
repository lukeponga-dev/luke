
import { getProjectsFromFile, saveProjectsToFile } from './fs';
import type { Project } from './types';

export async function getProjects(): Promise<Project[]> {
  return await getProjectsFromFile();
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const projects = await getProjectsFromFile();
    const newProject: Project = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    const updatedProjects = [newProject, ...projects];
    await saveProjectsToFile(updatedProjects);
    return newProject;
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    const projects = await getProjectsFromFile();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
        throw new Error('Project not found');
    }

    const updatedProject = {
        ...projects[projectIndex],
        ...updates,
    };

    projects[projectIndex] = updatedProject;
    await saveProjectsToFile(projects);
    return updatedProject;
}

export async function deleteProject(id: string): Promise<void> {
    const projects = await getProjectsFromFile();
    const updatedProjects = projects.filter(p => p.id !== id);
    if (projects.length === updatedProjects.length) {
        throw new Error('Project not found');
    }
    await saveProjectsToFile(updatedProjects);
}
