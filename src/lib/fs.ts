
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Project } from './types';

const projectsFilePath = path.join(process.cwd(), 'projects.json');

export async function getProjectsFromFile(): Promise<Project[]> {
  try {
    const data = await fs.readFile(projectsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // Return empty array if file doesn't exist
    }
    throw error;
  }
}

export async function saveProjectsToFile(projects: Project[]): Promise<void> {
  const data = JSON.stringify(projects, null, 2);
  await fs.writeFile(projectsFilePath, data, 'utf-8');
}
