import { Logo } from '@/components/icons/logo';

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-xl font-semibold tracking-tight">
            Portfolio Pilot
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {children}
          </nav>
        </div>
      </div>
    </header>
  );
}
