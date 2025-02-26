import { PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubmitReviewButton() {
  return (
    <Link
      to="/reviews/new"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      <PenLine className="h-4 w-4" />
      Submit Review
    </Link>
  );
} 