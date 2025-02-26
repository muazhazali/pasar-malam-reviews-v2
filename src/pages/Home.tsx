import { Store, BookOpen, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 md:py-24">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Discover & Review Local Shops
          </h1>
          <p className="mx-auto mt-6 text-lg text-muted-foreground">
            Your trusted platform for finding and reviewing the best local shops. Share your experiences and help others discover hidden gems.
          </p>
        </section>
        
        <section className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Link 
            to="/shops" 
            className="group relative rounded-xl border bg-card p-8 transition-all hover:bg-accent hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Store className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">Browse Shops</h2>
            <p className="mt-3 text-muted-foreground">
              Explore a curated list of local shops across various categories.
            </p>
            <div className="absolute right-8 top-8 opacity-0 transition-opacity group-hover:opacity-100">
              <Store className="h-6 w-6 text-muted-foreground" />
            </div>
          </Link>
          
          <Link 
            to="/reviews" 
            className="group relative rounded-xl border bg-card p-8 transition-all hover:bg-accent hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">Read Reviews</h2>
            <p className="mt-3 text-muted-foreground">
              Get insights from real customers and make informed decisions.
            </p>
            <div className="absolute right-8 top-8 opacity-0 transition-opacity group-hover:opacity-100">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
          </Link>
          
          <Link 
            to="/reviews" 
            className="group relative rounded-xl border bg-card p-8 transition-all hover:bg-accent hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Share2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">Share Experiences</h2>
            <p className="mt-3 text-muted-foreground">
              Write reviews and help others discover great local businesses.
            </p>
            <div className="absolute right-8 top-8 opacity-0 transition-opacity group-hover:opacity-100">
              <Share2 className="h-6 w-6 text-muted-foreground" />
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
} 