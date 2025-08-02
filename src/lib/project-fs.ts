import { existsSync } from 'fs';

import { promises as fs } from 'fs';
import path from 'path';
import type { Project } from './types';

const projectsFilePath = path.join(process.cwd(), 'projects.json');

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await fs.readFile(projectsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  const data = JSON.stringify(projects, null, 2);
  await fs.writeFile(projectsFilePath, data, 'utf-8');
}
