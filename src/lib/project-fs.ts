import { firestore } from './firebase';
import type { Project } from './types';

const projectsCollection = firestore.collection('projects');

export async function getProjects(): Promise<Project[]> {
  const snapshot = await projectsCollection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const newProjectRef = projectsCollection.doc();
  const createdAt = new Date().toISOString();
  const newProject = { ...project, id: newProjectRef.id, createdAt };
  await newProjectRef.set(newProject);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  await projectsCollection.doc(id).update(updates);
  const updatedDoc = await projectsCollection.doc(id).get();
  return { id, ...updatedDoc.data() } as Project;
}

export async function deleteProject(id: string): Promise<void> {
  await projectsCollection.doc(id).delete();
}
