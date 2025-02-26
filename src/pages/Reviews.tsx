import { useState } from 'react';

interface Review {
  id: string;
  shopId: string;
  shopName: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  date: string;
}

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
  },
];

export function Reviews() {
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  const sortedReviews = [...MOCK_REVIEWS].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.rating - a.rating;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <select
            className="w-full sm:w-auto rounded-md border px-4 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
          >
            <option value="date">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        <div className="grid gap-6">
          {sortedReviews.map(review => (
            <div key={review.id} className="rounded-xl border bg-card p-6 hover:bg-accent/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">{review.shopName}</h2>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{review.rating}</span>
                  <span className="text-sm text-muted-foreground">stars</span>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{review.content}</p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground">
                <span>By {review.userName}</span>
                <span>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 