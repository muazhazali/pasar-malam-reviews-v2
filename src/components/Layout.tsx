import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton } from './SignInButton';
import { SubmitReviewButton } from './SubmitReviewButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Logo */}
            <Link to="/" className="mr-8">
              <span className="text-xl font-bold">Pasar Malam Reviews</span>
            </Link>

            {/* Centered Navigation */}
            <div className="flex-1 flex justify-center gap-2">
              <Link
                to="/shops"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActiveRoute('/shops')
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                Shops
              </Link>
              <Link
                to="/reviews"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActiveRoute('/reviews')
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                Reviews
              </Link>
              <SubmitReviewButton />
            </div>

            {/* Auth Button */}
            <div className="ml-8">
              <SignInButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 