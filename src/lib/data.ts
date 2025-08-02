import type { Project } from './types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'New Zealand Website',
    description: "A responsive site showcasing NZ's culture and tourism with interactive elements.",
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    keywords: ['web development', 'design', 'New Zealand', 'tourism', 'responsive design'],
    imageUrl: 'https://lukeponga-dev.github.io/images/nz.png',
    createdAt: new Date('2023-03-15T00:00:00.000Z').toISOString(),
  },
  {
    id: '2',
    title: 'Doctors Appointments',
    description: 'A healthcare management system for scheduling appointments and managing patient records.',
    technologies: ['C#', 'ASP.NET', 'SQL Server'],
    keywords: ['healthcare', 'appointment tracking', 'software development', 'patient management'],
    imageUrl: 'https://lukeponga-dev.github.io/images/doctors.png',
    createdAt: new Date('2023-07-20T00:00:00.000Z').toISOString(),
  },
  {
    id: '3',
    title: 'Health Clinic MVC',
    description: 'An MVC app for managing clinic operations, including patient data, appointments, and billing.',
    technologies: ['MVC', 'Entity Framework', 'C#'],
    keywords: ['MVC', 'healthcare', 'clinic management', 'billing'],
    imageUrl: 'https://lukeponga-dev.github.io/images/clinic.png',
    createdAt: new Date('2023-09-01T00:00:00.000Z').toISOString(),
  },
  {
    id: '4',
    title: 'CosmicPic - Explore the Universe',
    description: "A web app that allows users to explore stunning images of the universe, powered by NASA's API.",
    technologies: ['React', 'Node.js', 'CSS', 'JavaScript', 'API Integration', 'Responsive Design'],
    keywords: ['space', 'NASA', 'API', 'React', 'astronomy'],
    imageUrl: 'https://lukeponga-dev.github.io/images/cosmic.png',
    createdAt: new Date('2024-01-10T00:00:00.000Z').toISOString(),
  },
];
