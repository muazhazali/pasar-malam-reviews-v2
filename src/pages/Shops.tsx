import { useState } from 'react';
import { Shop } from '@/types/shop';
import { ShopMap } from '@/components/Map/ShopMap';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Search, SlidersHorizontal, X } from 'lucide-react';

const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Delicious Corner',
    description: 'Traditional street food with a modern twist.',
    category: 'Food',
    coordinates: [3.1390, 101.6869], // KL city center
    address: 'Kuala Lumpur City Centre',
    rating: 4.5,
    reviewCount: 128,
    verified: true,
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: '2',
    name: 'Fashion Hub',
    description: 'Trendy clothing and accessories.',
    category: 'Fashion',
    coordinates: [3.1421, 101.6867], // Near KL city center
    address: 'Bukit Bintang',
    rating: 4.2,
    reviewCount: 85,
    verified: true,
    createdAt: '2024-02-24',
    updatedAt: '2024-02-24',
  },
  {
    id: '3',
    name: 'Tech Zone',
    description: 'Latest gadgets and electronics.',
    category: 'Electronics',
    coordinates: [3.1380, 101.6871], // Also near KL city center
    address: 'Pavilion KL',
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    createdAt: '2024-02-23',
    updatedAt: '2024-02-23',
  },
];

const CATEGORIES = ['All', 'Food', 'Fashion', 'Electronics'];
const LOCATIONS = ['All', ...Array.from(new Set(MOCK_SHOPS.map(shop => shop.address)))];

export function Shops() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.1390, 101.6869]); // Default to KL center
  const [mapZoom, setMapZoom] = useState(12);

  const filteredShops = MOCK_SHOPS.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || shop.address === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Update map center when location is selected
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    if (location !== 'All') {
      const selectedShop = MOCK_SHOPS.find(shop => shop.address === location);
      if (selectedShop) {
        setMapCenter(selectedShop.coordinates);
        setMapZoom(15);
      }
    } else {
      setMapCenter([3.1390, 101.6869]); // Reset to KL center
      setMapZoom(12);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shops..."
                className="w-full min-w-[200px] rounded-md border pl-9 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="rounded-full p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                >
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="h-[400px] w-full rounded-lg border overflow-hidden">
          <ShopMap 
            shops={filteredShops} 
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        {/* Shop Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map(shop => (
            <div
              key={shop.id}
              className="group rounded-xl border bg-card p-6 transition-all hover:bg-accent/50 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold group-hover:text-primary">{shop.name}</h2>
              <p className="mt-2 text-muted-foreground">{shop.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{shop.category}</span>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-sm text-muted-foreground">({shop.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{shop.address}</p>
              <div className="mt-6 flex justify-end">
                <Link
                  to={`/shops/${shop.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No shops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 