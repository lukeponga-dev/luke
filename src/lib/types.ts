
import type { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  keywords: string[];
  imageUrl: string;
  createdAt: string | Timestamp; // ISO date string or Firestore Timestamp
};

export interface SessionData {
  isLoggedIn: boolean;
}
