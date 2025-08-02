
import AdminPageComponent from '@/components/portfolio/admin-page-component';
import { getProjects } from '@/lib/project-fs';

export default async function AdminPage() {
  const projects = await getProjects();

  return <AdminPageComponent initialProjects={projects} />;
}
