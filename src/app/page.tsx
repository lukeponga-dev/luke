import PortfolioPage from '@/components/portfolio/portfolio-page';
import { projects as initialProjects } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function Home() {
  return <PortfolioPage 
    initialProjects={initialProjects}
    headerActions={
      <Button asChild variant="outline">
        <Link href="/about">
          <User className="mr-2" /> About Me
        </Link>
      </Button>
    }
   />;
}
