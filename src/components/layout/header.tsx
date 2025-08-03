import { Logo } from '../icons/logo';

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-bold text-lg">Portfolio Pilot</h1>
        </div>
        <div>{children}</div>
      </div>
    </header>
  );
}
