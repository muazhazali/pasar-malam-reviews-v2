import { useState, useMemo } from 'react';
import { Search, Star, SlidersHorizontal, X } from 'lucide-react';
import { VoteButton } from '@/components/VoteButton';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/types/review';

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    shopId: '1',
    shopName: 'Delicious Corner',
    category: 'Food',
    userId: 'user1',
    userName: 'John Doe',
    userPhotoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    rating: 5,
    content: 'Amazing food and great service! The nasi lemak was perfect.',
    status: 'approved',
    votes: {
      upvotes: 12,
      downvotes: 2,
      userVotes: {},
    },
    createdAt: '2024-02-25T10:00:00Z',
    updatedAt: '2024-02-25T10:00:00Z',
  },
  {
    id: '2',
    shopId: '2',
    shopName: 'Street Wok',
    category: 'Food',
    userId: 'user2',
    userName: 'Jane Smith',
    userPhotoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    rating: 4,
    content: 'Good char kway teow but could be spicier.',
    status: 'approved',
    votes: {
      upvotes: 8,
      downvotes: 1,
      userVotes: {},
    },
    createdAt: '2024-02-24T15:30:00Z',
    updatedAt: '2024-02-24T15:30:00Z',
  },
];

const CATEGORIES = ['All', 'Food', 'Fashion', 'Electronics'];
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'rating-desc', label: 'Highest Rating' },
  { value: 'rating-asc', label: 'Lowest Rating' },
  { value: 'votes-desc', label: 'Most Helpful' },
];
const RATING_FILTERS = [5, 4, 3, 2, 1];

export function Reviews() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    setReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;

      const currentVote = review.votes.userVotes[user.uid];
      const newVotes = { ...review.votes };

      // Remove previous vote if exists
      if (currentVote) {
        if (currentVote === 'up') newVotes.upvotes--;
        if (currentVote === 'down') newVotes.downvotes--;
      }

      // Add new vote if different from current vote
      if (currentVote !== voteType) {
        if (voteType === 'up') newVotes.upvotes++;
        if (voteType === 'down') newVotes.downvotes++;
        newVotes.userVotes[user.uid] = voteType;
      } else {
        // If same vote, remove the vote
        delete newVotes.userVotes[user.uid];
      }

      return {
        ...review,
        votes: newVotes,
      };
    }));
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter(review => {
        const matchesSearch = 
          review.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || review.category === selectedCategory;
        const matchesRating = !selectedRating || Math.floor(review.rating) === selectedRating;
        const isApproved = review.status === 'approved';
        
        return matchesSearch && matchesCategory && matchesRating && isApproved;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'date-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'rating-desc':
            return b.rating - a.rating;
          case 'rating-asc':
            return a.rating - b.rating;
          case 'votes-desc':
            return (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes);
          default:
            return 0;
        }
      });
  }, [searchTerm, selectedCategory, selectedRating, sortBy, reviews]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Reviews</h1>
      <div className="space-y-6">
        {reviews.map(review => (
          <div
            key={review.id}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {review.userPhotoURL && (
                  <img
                    src={review.userPhotoURL}
                    alt={review.userName}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium">{review.userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VoteButton
                  type="up"
                  count={review.votes.upvotes}
                  userVote={user ? review.votes.userVotes[user.uid] : undefined}
                  onVote={() => handleVote(review.id, 'up')}
                />
                <VoteButton
                  type="down"
                  count={review.votes.downvotes}
                  userVote={user ? review.votes.userVotes[user.uid] : undefined}
                  onVote={() => handleVote(review.id, 'down')}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{review.shopName}</span>
                <span>•</span>
                <span>{review.category}</span>
                <span>•</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2">{review.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 