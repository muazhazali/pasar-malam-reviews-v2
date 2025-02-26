import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton } from './SignInButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Pasar Malam Reviews</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/shops" className="text-sm font-medium transition-colors hover:text-primary">
                  Shops
                </Link>
                <Link to="/reviews" className="text-sm font-medium transition-colors hover:text-primary">
                  Reviews
                </Link>
              </nav>
            </div>
            <SignInButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 