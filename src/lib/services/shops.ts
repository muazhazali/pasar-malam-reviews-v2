import { supabase } from '../supabase';

export interface Shop {
  id: string;
  name: string;
  description?: string;
  category: string;
  coordinates: [number, number];
  address: string;
  operating_hours?: string;
  phone?: string;
  website?: string;
  verified: boolean;
  photos?: string[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateShopData {
  name: string;
  description?: string;
  category: string;
  coordinates: [number, number];
  address: string;
  operating_hours?: string;
  phone?: string;
  website?: string;
  photos?: string[];
}

export async function getShops() {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Shop[];
}

export async function getShopsByCategory(category: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) throw error;
  return data as Shop[];
}

export async function getShopById(id: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Shop;
}

export async function searchShops(query: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
    .order('name');

  if (error) throw error;
  return data as Shop[];
}

export async function createShop(shopData: CreateShopData) {
  const { data, error } = await supabase
    .from('shops')
    .insert([shopData])
    .select()
    .single();

  if (error) throw error;
  return data as Shop;
}

export async function updateShop(id: string, shopData: Partial<CreateShopData>) {
  const { data, error } = await supabase
    .from('shops')
    .update(shopData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Shop;
}

export async function deleteShop(id: string) {
  const { error } = await supabase
    .from('shops')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getNearbyShops(lat: number, lng: number, radiusInMeters: number = 5000) {
  // Using PostGIS to find shops within radius
  const { data, error } = await supabase
    .rpc('get_shops_within_radius', {
      lat,
      lng,
      radius_meters: radiusInMeters
    });

  if (error) throw error;
  return data as Shop[];
} 