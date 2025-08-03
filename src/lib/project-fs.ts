
'use server';

import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import type { Project } from './types';

const projectsCollection = collection(db, 'projects');

export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(query(projectsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if it exists
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      } as Project;
  });
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const docRef = await addDoc(projectsCollection, {
        ...project,
        createdAt: serverTimestamp(),
    });

    return {
        ...project,
        id: docRef.id,
        createdAt: new Date().toISOString(), // Return current time as a temporary value
    };
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    const projectDoc = doc(db, 'projects', id);
    await updateDoc(projectDoc, updates);

    // This is a simplified return, ideally we would fetch the updated doc
    return {
        id,
        title: updates.title!,
        description: updates.description!,
        technologies: updates.technologies!,
        keywords: updates.keywords!,
        imageUrl: updates.imageUrl!,
        createdAt: new Date().toISOString(),
    };
}

export async function deleteProject(id: string): Promise<void> {
    const projectDoc = doc(db, 'projects', id);
    await deleteDoc(projectDoc);
}
