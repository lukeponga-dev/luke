import type { Project } from './types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'New Zealand Website',
    description: "This project was an assignment for my diploma in web development and design, I was required to develop a website about New Zealand and it's history.",
    technologies: ['HTML', 'CSS', 'JavaScript'],
    keywords: ['web development', 'design', 'New Zealand', 'history'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date('2023-03-15T00:00:00.000Z').toISOString(),
  },
  {
    id: '2',
    title: 'Doctors Appointments Web App',
    description: 'I developed doctors appointments for one of my assignments in software development using the asp.net core framework. The purpose is to provide staff with an easy appointment tracking system.',
    technologies: ['ASP.NET Core', 'C#', 'Entity Framework'],
    keywords: ['healthcare', 'appointment tracking', 'software development'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date('2023-07-20T00:00:00.000Z').toISOString(),
  },
  {
    id: '3',
    title: 'Health Clinic MVC',
    description: 'Software Development ASP.NET MVC Assessment, MVC version of my Doctors Appointment project uses asp.net core mvc framework.',
    technologies: ['ASP.NET MVC', 'C#', 'SQL Server'],
    keywords: ['MVC', 'healthcare', 'clinic management'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date('2023-09-01T00:00:00.000Z').toISOString(),
  },
  {
    id: '4',
    title: 'Vehicle API',
    description: 'Web api i made with .net api for storing vehicles.',
    technologies: ['.NET API', 'C#', 'RESTful API'],
    keywords: ['API', 'vehicle management', 'backend'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date('2024-01-10T00:00:00.000Z').toISOString(),
  },
  {
    id: '5',
    title: 'Crypto Currency Stats',
    description: 'Website that shows crypto currency prices using an api to retrieve coin data built with html5, css, javascript and bootstrap.',
    technologies: ['HTML5', 'CSS', 'JavaScript', 'Bootstrap', 'CoinGecko API'],
    keywords: ['cryptocurrency', 'API integration', 'data visualization', 'finance'],
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date('2024-04-22T00:00:00.000Z').toISOString(),
  },
];
