export type ShopTag = 
  | 'satay' 
  | 'martabak' 
  | 'roti john' 
  | 'western' 
  | 'kuih' 
  | 'pizza';

export interface Shop {
  id: string;
  name: string;
  description?: string;
  category: string;
  coordinates: string | { x: number; y: number } | [number, number];
  address: string;
  operating_hours?: string;
  phone?: string;
  website?: string;
  verified: boolean;
  photos?: string[];
  rating: number;
  review_count: number;
  tags: ShopTag[];
  created_at: string;
  updated_at: string;
} 