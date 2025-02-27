import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ShopMap } from '@/components/Map/ShopMap';
import { getShops, getShopsByCategory, getShopsByTag, searchShops, getAllTags } from '@/lib/services/shops';
import { useQuery } from '@tanstack/react-query';
import type { ShopTag } from '@/types/shop';
import { Button } from '@/components/ui/button';

const CATEGORIES = ['All', 'Food', 'Fashion', 'Electronics'];

export function Shops() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState<ShopTag | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [mapCenter] = useState<[number, number]>([3.1390, 101.6869]); // KL coordinates

  // Fetch all available tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
  });

  // Fetch shops based on filters
  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops', selectedCategory, selectedTag, searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return searchShops(searchQuery);
      }
      if (selectedTag) {
        return getShopsByTag(selectedTag);
      }
      return selectedCategory === 'All' ? getShops() : getShopsByCategory(selectedCategory);
    },
  });

  const handleShopClick = (shopId: string) => {
    navigate(`/shops/${shopId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered by the query hook
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedTag('');
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explore Shops</h1>
          <Button
            variant="ghost"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2"
          >
            Filters
            {isFiltersOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isFiltersOpen && (
          <div className="rounded-xl border bg-card p-4 space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shops..."
                className="w-full rounded-lg border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>

            {/* Categories */}
            <div>
              <label className="text-sm font-medium mb-2 block">Categories</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedTag('');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? '' : tag);
                      setSelectedCategory('All');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'All' || selectedTag || searchQuery) && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading shops...</div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map Section - Now in a container that's responsive */}
          <div className="order-2 lg:order-1">
            <div className="h-[300px] lg:h-[calc(100vh-16rem)] lg:sticky lg:top-24 rounded-xl border overflow-hidden">
              <ShopMap
                shops={shops}
                center={mapCenter}
                onMarkerClick={handleShopClick}
              />
            </div>
          </div>

          {/* Shops List - Now appears first on mobile */}
          <div className="order-1 lg:order-2 space-y-4">
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop.id)}
                className="group cursor-pointer rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold group-hover:text-primary">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>{shop.rating}</span>
                        <span className="text-muted-foreground">
                          ({shop.review_count})
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {shop.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {shop.category}
                      </span>
                      {shop.verified && (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          Verified
                        </span>
                      )}
                      {shop.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {shop.photos && shop.photos.length > 0 && (
                    <div className="aspect-square w-24 overflow-hidden rounded-lg">
                      <img
                        src={shop.photos[0]}
                        alt={shop.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {shops.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No shops found with the current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 