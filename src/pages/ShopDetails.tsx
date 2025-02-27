import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Globe } from 'lucide-react';
import { ShopMap } from '@/components/Map/ShopMap';
import { ReviewDialog } from '@/components/ReviewDialog';
import { VoteButton } from '@/components/VoteButton';
import { useAuth } from '@/contexts/AuthContext';
import { getShopById } from '@/lib/services/shops';
import { getReviews, voteReview } from '@/lib/services/reviews';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function ShopDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch shop data
  const { data: shop, isLoading: isLoadingShop } = useQuery({
    queryKey: ['shop', id],
    queryFn: () => getShopById(id!),
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(id),
    enabled: !!id,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: 'up' | 'down' }) =>
      voteReview(reviewId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
  });

  const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    await voteMutation.mutate({ reviewId, voteType });
  };

  if (isLoadingShop) {
    return <div className="text-center py-8">Loading shop details...</div>;
  }

  if (!shop) {
    return <div className="text-center py-8">Shop not found</div>;
  }

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
              <span className="text-muted-foreground">({shop.review_count} reviews)</span>
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
              {shop.operating_hours && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{shop.operating_hours}</span>
                </div>
              )}
              {shop.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{shop.phone}</span>
                </div>
              )}
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
          {shop.photos && shop.photos.length > 0 && (
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-xl border">
                <img
                  src={shop.photos[selectedPhoto]}
                  alt={`${shop.name} photo ${selectedPhoto + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {shop.photos.map((photo, index) => (
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
          )}
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

          {isLoadingReviews ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user_id}</span>
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
          )}
        </div>
      </div>

      <ReviewDialog
        shopId={shop.id}
        shopName={shop.name}
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
      />
    </div>
  );
}