import { useState } from 'react';
import { MapPin, Star, Clock, Phone, Globe } from 'lucide-react';
import { ShopMap } from '@/components/Map/ShopMap';
import { ReviewDialog } from '@/components/ReviewDialog';
import { VoteButton } from '@/components/VoteButton';
import { useAuth } from '@/contexts/AuthContext';
import { Shop } from '@/types/shop';
import { Review } from '@/types/review';

// Mock data - This will be replaced with real data from Firebase later
const MOCK_SHOP: Shop = {
  id: '1',
  name: 'Delicious Corner',
  description: 'Traditional street food with a modern twist. We serve authentic Malaysian cuisine in a contemporary setting, bringing together the best of traditional flavors with modern presentation.',
  category: 'Food',
  coordinates: [3.1390, 101.6869],
  address: '123 Jalan Example, Taman Sample, 50000 Kuala Lumpur',
  rating: 4.5,
  reviewCount: 128,
  verified: true,
  operatingHours: '10:00 AM - 10:00 PM',
  phone: '+60123456789',
  website: 'https://example.com',
  photos: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  ],
  createdAt: '2024-02-25',
  updatedAt: '2024-02-25',
};

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    shopId: '1',
    shopName: 'Delicious Corner',
    category: 'Food',
    userId: 'user1',
    userName: 'John Doe',
    rating: 4,
    content: 'Great food and service!',
    status: 'approved',
    votes: {
      upvotes: 5,
      downvotes: 1,
      userVotes: {},
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    shopId: '1',
    shopName: 'Delicious Corner',
    category: 'Food',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 5,
    content: 'Amazing experience!',
    status: 'approved',
    votes: {
      upvotes: 3,
      downvotes: 0,
      userVotes: {},
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function ShopDetails() {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // In a real app, we would fetch the shop data based on the ID
  const shop = MOCK_SHOP;

  const handleSubmitReview = async (review: { rating: number; content: string }) => {
    if (!user) return;

    const newReview: Review = {
      id: Math.random().toString(),
      shopId: shop.id,
      shopName: shop.name,
      category: shop.category,
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhotoURL: user.photoURL || undefined,
      rating: review.rating,
      content: review.content,
      status: 'pending',
      votes: {
        upvotes: 0,
        downvotes: 0,
        userVotes: {},
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReviews(prev => [...prev, newReview]);
    setIsReviewDialogOpen(false);
  };

  const handleVote = async (type: 'up' | 'down', reviewId: string) => {
    if (!user) return;

    setReviews(prev => prev.map(review => {
      if (review.id !== reviewId) return review;

      const currentVote = review.votes.userVotes[user.uid];
      const newVotes = { ...review.votes };

      if (currentVote) {
        if (currentVote === 'up') newVotes.upvotes--;
        if (currentVote === 'down') newVotes.downvotes--;
      }

      if (currentVote !== type) {
        if (type === 'up') newVotes.upvotes++;
        if (type === 'down') newVotes.downvotes++;
        newVotes.userVotes[user.uid] = type;
      } else {
        delete newVotes.userVotes[user.uid];
      }

      return {
        ...review,
        votes: newVotes,
      };
    }));
  };

  const approvedReviews = reviews.filter(review => review.status === 'approved');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        {/* Shop Header */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">{shop.name}</h1>
            <p className="text-muted-foreground">{shop.description}</p>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-medium">{shop.rating}</span>
              <span className="text-muted-foreground">({shop.reviewCount} reviews)</span>
              {shop.verified && (
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Verified
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{shop.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{shop.phone}</span>
              </div>
              {shop.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a href={shop.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {shop.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-xl border">
              <img
                src={shop.photos?.[selectedPhoto]}
                alt={`${shop.name} photo ${selectedPhoto + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {shop.photos?.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  className={`aspect-square overflow-hidden rounded-lg border ${
                    selectedPhoto === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${shop.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Location</h2>
          <div className="h-[400px] w-full rounded-xl border overflow-hidden">
            <ShopMap shops={[shop]} center={shop.coordinates} zoom={15} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            <button
              onClick={() => setIsReviewDialogOpen(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Write a Review
            </button>
          </div>
          <div className="grid gap-6">
            {approvedReviews.map((review) => (
              <div key={review.id} className="rounded-xl border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.userPhotoURL && (
                      <img
                        src={review.userPhotoURL}
                        alt={review.userName}
                        className="h-8 w-8 rounded-full"
                      />
                    )}
                    <span className="font-medium">{review.userName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VoteButton
                      type="up"
                      count={review.votes.upvotes}
                      userVote={user ? review.votes.userVotes[user.uid] : undefined}
                      onVote={() => handleVote('up', review.id)}
                    />
                    <VoteButton
                      type="down"
                      count={review.votes.downvotes}
                      userVote={user ? review.votes.userVotes[user.uid] : undefined}
                      onVote={() => handleVote('down', review.id)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
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
                  <p className="mt-2">{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReviewDialog
        shopId={shop.id}
        shopName={shop.name}
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}