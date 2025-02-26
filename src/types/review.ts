export interface Review {
  id: string;
  shopId: string;
  shopName: string;
  category: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: Record<string, 'up' | 'down'>;  // userId -> vote type
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
} 