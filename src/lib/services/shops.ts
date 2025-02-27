import { supabase } from '@/lib/supabase';
import type { Shop, ShopTag } from '@/types/shop';

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
  tags?: ShopTag[];
}

export async function getShops(): Promise<Shop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getShopsByCategory(category: string): Promise<Shop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('category', category)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getShopById(id: string): Promise<Shop> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function searchShops(query: string): Promise<Shop[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createShop(shopData: CreateShopData): Promise<Shop> {
  const { data, error } = await supabase
    .from('shops')
    .insert(shopData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShop(
  id: string,
  shopData: Partial<CreateShopData>
): Promise<Shop> {
  const { data, error } = await supabase
    .from('shops')
    .update(shopData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShop(id: string): Promise<void> {
  const { error } = await supabase.from('shops').delete().eq('id', id);
  if (error) throw error;
}

export async function getNearbyShops(
  lat: number,
  lng: number,
  radiusInMeters: number
): Promise<Shop[]> {
  const { data, error } = await supabase.rpc('get_shops_within_radius', {
    lat,
    lng,
    radius_meters: radiusInMeters,
  });

  if (error) throw error;
  return data;
}

export async function getShopsByTag(tag: ShopTag): Promise<Shop[]> {
  const { data, error } = await supabase
    .rpc('search_shops_by_tag', { tag_to_search: tag });

  if (error) throw error;
  return data;
}

export async function updateShopTags(id: string, tags: ShopTag[]): Promise<Shop> {
  const { data, error } = await supabase
    .from('shops')
    .update({ tags })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllTags(): Promise<ShopTag[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('tags')
    .not('tags', 'is', null);

  if (error) throw error;
  
  // Flatten all tags arrays and remove duplicates
  const uniqueTags = [...new Set(data.flatMap(shop => shop.tags))];
  return uniqueTags as ShopTag[];
} 