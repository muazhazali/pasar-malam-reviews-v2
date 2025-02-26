export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  content: string;
  photos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
} 