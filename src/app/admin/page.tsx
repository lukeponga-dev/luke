import Header from '@/components/layout/header';
import PortfolioPage from '@/components/portfolio/portfolio-page';
import { getProjects } from '@/lib/project-fs';
import { logout } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default async function AdminPage() {
  const projects = await getProjects();
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <div className="flex items-center gap-4">
          <form action={logout}>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </Header>
      <main className="flex-1 container py-8">
        <PortfolioPage initialProjects={projects} />
      </main>
    </div>
  );
}
