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
  location?: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  votes: {
    upvotes: number;
    downvotes: number;
    userVotes: Record<string, 'up' | 'down'>;
  };
  createdAt: string;
  updatedAt: string;
} 