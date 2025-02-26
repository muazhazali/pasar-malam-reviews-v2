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
    userId: 'user1',
    userName: 'John Doe',
    rating: 4.5,
    content: 'Amazing food! The traditional flavors are perfectly preserved while adding a modern touch. Must try their signature dishes.',
    date: '2024-02-25',
    category: 'Food',
    location: {
      lat: 3.1390,
      lng: 101.6869,
      address: 'Kuala Lumpur City Centre'
    },
    status: 'approved',
    votes: {
      upvotes: 12,
      downvotes: 2,
      userVotes: {},
    },
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: '2',
    shopId: '2',
    shopName: 'Fashion Hub',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 4.0,
    content: 'Great selection of trendy clothes. The staff is very helpful and prices are reasonable.',
    date: '2024-02-24',
    category: 'Fashion',
    location: {
      lat: 3.1421,
      lng: 101.6867,
      address: 'Bukit Bintang'
    },
    status: 'approved',
    votes: {
      upvotes: 8,
      downvotes: 1,
      userVotes: {},
    },
    createdAt: '2024-02-24',
    updatedAt: '2024-02-24',
  },
  {
    id: '3',
    shopId: '3',
    shopName: 'Tech Zone',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5.0,
    content: 'Excellent service and competitive prices. They have all the latest gadgets and the staff is very knowledgeable.',
    date: '2024-02-23',
    category: 'Electronics',
    location: {
      lat: 3.1380,
      lng: 101.6871,
      address: 'Pavilion KL'
    },
    status: 'approved',
    votes: {
      upvotes: 15,
      downvotes: 3,
      userVotes: {},
    },
    createdAt: '2024-02-23',
    updatedAt: '2024-02-23',
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews by shop name, content, or reviewer..."
              className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Filters & Sort</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {RATING_FILTERS.map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-sm ${
                        selectedRating === rating ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      {rating}
                      <Star className={`h-3 w-3 ${selectedRating === rating ? 'fill-primary-foreground' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid gap-6">
          {filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{review.shopName}</h2>
                  <p className="text-sm text-muted-foreground">{review.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="ml-1 font-medium">{review.rating}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{review.content}</p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{review.userName}</span>
                  <span>•</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{review.location.address}</span>
                </div>
                <VoteButton
                  reviewId={review.id}
                  votes={review.votes}
                  onVote={(type) => handleVote(review.id, type)}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 