import PortfolioPage from '@/components/portfolio/portfolio-page';
import { projects as initialProjects } from '@/lib/data';

export default function Home() {
  return <PortfolioPage initialProjects={initialProjects} />;
}
