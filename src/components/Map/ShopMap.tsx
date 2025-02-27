import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Shop } from '@/types/shop';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';

// Fix for default marker icon
const defaultIcon = icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ShopMapProps {
  shops: Shop[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (shopId: string) => void;
}

function getCoordinates(coordinates: any): [number, number] | null {
  if (!coordinates) return null;

  // Handle Supabase point type which comes as a string like "(101.6869,3.1390)"
  if (typeof coordinates === 'string') {
    const match = coordinates.match(/\(([-\d.]+),([-\d.]+)\)/);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lng) && !isNaN(lat)) {
        return [lat, lng];
      }
    }
    return null;
  }

  // Handle array format
  if (Array.isArray(coordinates)) {
    const [lng, lat] = coordinates;
    if (!isNaN(lng) && !isNaN(lat)) {
      return [lat, lng];
    }
    return null;
  }

  // Handle object format
  if (coordinates.x !== undefined && coordinates.y !== undefined) {
    const lng = parseFloat(coordinates.x.toString());
    const lat = parseFloat(coordinates.y.toString());
    if (!isNaN(lng) && !isNaN(lat)) {
      return [lat, lng];
    }
  }

  return null;
}

export function ShopMap({ 
  shops, 
  center = [3.1390, 101.6869], // Default to KL center
  zoom = 13,
  onMarkerClick 
}: ShopMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map((shop) => {
        const coordinates = getCoordinates(shop.coordinates);
        if (!coordinates) return null;

        return (
          <Marker
            key={shop.id}
            position={coordinates}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(shop.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{shop.name}</h3>
                <p className="text-sm text-muted-foreground">{shop.address}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
} 