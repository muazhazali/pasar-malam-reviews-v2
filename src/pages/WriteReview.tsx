import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewForm } from '@/components/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { getShops } from '@/lib/services/shops';
import { createReview } from '@/lib/services/reviews';
import { useQuery, useMutation } from '@tanstack/react-query';

export function WriteReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedShopId, setSelectedShopId] = useState<string>('');

  // Fetch shops
  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
  });

  // Create review mutation
  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      navigate(`/shops/${data.shop_id}`);
    },
  });

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">
            You need to be signed in to write a review.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const selectedShop = shops.find(shop => shop.id === selectedShopId);

  const handleSubmit = async (rating: number, content: string) => {
    if (!selectedShopId) return;

    try {
      await reviewMutation.mutate({
        shop_id: selectedShopId,
        rating,
        content,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading shops...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Write a Review</h1>
          <p className="mt-2 text-muted-foreground">
            Share your experience and help others discover great local shops.
          </p>
        </div>

        {/* Shop Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">Select a Shop</label>
          <select
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Choose a shop...</option>
            {shops.map(shop => (
              <option key={shop.id} value={shop.id}>
                {shop.name} - {shop.category}
              </option>
            ))}
          </select>
        </div>

        {/* Shop Details */}
        {selectedShop && (
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">{selectedShop.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selectedShop.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedShop.address}</p>
          </div>
        )}

        {/* Review Form */}
        <div className="rounded-lg border bg-card p-6">
          <ReviewForm
            shopId={selectedShopId}
            onSubmit={handleSubmit}
            isSubmitting={reviewMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
} 