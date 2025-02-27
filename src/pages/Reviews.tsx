import { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { VoteButton } from '@/components/VoteButton';
import { useAuth } from '@/contexts/AuthContext';
import { Review } from '@/types/review';
import { getReviews, voteReview } from '@/lib/services/reviews';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => getReviews(),
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: 'up' | 'down' }) =>
      voteReview(reviewId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    await voteMutation.mutate({ reviewId, voteType });
  };

  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter(review => {
        const matchesSearch = 
          review.shops.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || review.shops.category === selectedCategory;
        const matchesRating = !selectedRating || Math.floor(review.rating) === selectedRating;
        const isApproved = review.status === 'approved';
        
        return matchesSearch && matchesCategory && matchesRating && isApproved;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-desc':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'date-asc':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'rating-desc':
            return b.rating - a.rating;
          case 'rating-asc':
            return a.rating - b.rating;
          case 'votes-desc':
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
          default:
            return 0;
        }
      });
  }, [searchTerm, selectedCategory, selectedRating, sortBy, reviews]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Reviews</h1>
      
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Star className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex flex-wrap gap-2">
                {RATING_FILTERS.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedRating === rating
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Reviews list */}
      {isLoading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedReviews.map(review => (
            <div
              key={review.id}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-medium">{review.user_id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VoteButton
                    type="up"
                    count={review.upvotes}
                    userVote={review.review_votes?.[0]?.vote_type}
                    onVote={() => handleVote(review.id, 'up')}
                  />
                  <VoteButton
                    type="down"
                    count={review.downvotes}
                    userVote={review.review_votes?.[0]?.vote_type}
                    onVote={() => handleVote(review.id, 'down')}
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{review.shops.name}</span>
                  <span>•</span>
                  <span>{review.shops.category}</span>
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
      )}
    </div>
  );
} 