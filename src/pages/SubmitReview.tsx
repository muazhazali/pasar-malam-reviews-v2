import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewForm } from '@/components/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import { Shop } from '@/types/shop';

// Using the mock shops data for now
const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Delicious Corner',
    description: 'Traditional street food with a modern twist.',
    category: 'Food',
    coordinates: [3.1390, 101.6869],
    address: '123 Jalan Example, Kuala Lumpur',
    rating: 4.5,
    reviewCount: 128,
    verified: true,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: '2',
    name: 'Fashion Hub',
    description: 'Trendy clothing and accessories.',
    category: 'Fashion',
    coordinates: [3.1421, 101.6867],
    address: '456 Jalan Sample, Kuala Lumpur',
    rating: 4.2,
    reviewCount: 85,
    verified: true,
    createdAt: '2024-02-24',
    updatedAt: '2024-02-24',
  },
  {
    id: '3',
    name: 'Tech Zone',
    description: 'Latest gadgets and electronics.',
    category: 'Electronics',
    coordinates: [3.1380, 101.6871],
    address: '789 Jalan Test, Kuala Lumpur',
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    createdAt: '2024-02-23',
    updatedAt: '2024-02-23',
  },
];

export function SubmitReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedShopId, setSelectedShopId] = useState<string>('');

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">
            You need to be signed in to submit a review.
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

  const selectedShop = MOCK_SHOPS.find(shop => shop.id === selectedShopId);

  const handleSubmit = async (review: { rating: number; content: string }) => {
    if (!user) {
      alert('Please sign in to submit a review');
      return;
    }

    try {
      // Add your review submission logic here
      console.log('Submitting review:', review);
      
      // Navigate back to the shop's page or reviews page
      navigate(selectedShopId ? `/shops/${selectedShopId}` : '/reviews');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit a Review</h1>
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
            {MOCK_SHOPS.map(shop => (
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
            onCancel={() => navigate('/shops')}
          />
        </div>
      </div>
    </div>
  );
} 