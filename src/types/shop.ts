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
  operatingHours?: string;
  phone?: string;
  website?: string;
  photos?: string[];
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
} 