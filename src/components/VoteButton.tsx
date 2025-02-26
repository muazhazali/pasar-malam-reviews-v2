import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface VoteButtonProps {
  type: 'up' | 'down';
  count: number;
  userVote?: 'up' | 'down';
  onVote: (type: 'up' | 'down') => Promise<void>;
}

export function VoteButton({ type, count, userVote, onVote }: VoteButtonProps) {
  const { user } = useAuth();
  const isActive = userVote === type;

  const handleClick = async () => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }
    await onVote(type);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-sm ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {type === 'up' ? (
        <ThumbsUp className="h-4 w-4" />
      ) : (
        <ThumbsDown className="h-4 w-4" />
      )}
      <span>{count}</span>
    </button>
  );
} 