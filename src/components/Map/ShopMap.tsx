import { Map } from './Map';
import { Shop } from '@/types/shop';

interface ShopMapProps {
  shops: Shop[];
  center?: [number, number];
  zoom?: number;
}

export function ShopMap({ shops, center = [3.1390, 101.6869], zoom = 12 }: ShopMapProps) {
  const markers = shops.map(shop => ({
    position: shop.coordinates,
    title: shop.name,
    description: shop.description,
  }));

  return <Map center={center} zoom={zoom} markers={markers} />;
} 