export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinates: [number, number];
  address: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
} 