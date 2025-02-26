import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VoteButtonProps {
  reviewId: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: Record<string, 'up' | 'down'>;
  };
  onVote: (type: 'up' | 'down') => Promise<void>;
}

export function VoteButton({ reviewId, votes, onVote }: VoteButtonProps) {
  const { user } = useAuth();
  const userVote = user ? votes.userVotes[user.uid] : undefined;

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }
    
    try {
      await onVote(type);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote('up')}
        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-colors ${
          userVote === 'up'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent'
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{votes.upvotes}</span>
      </button>
      <button
        onClick={() => handleVote('down')}
        className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-sm transition-colors ${
          userVote === 'down'
            ? 'bg-destructive text-destructive-foreground'
            : 'hover:bg-accent'
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{votes.downvotes}</span>
      </button>
    </div>
  );
} 