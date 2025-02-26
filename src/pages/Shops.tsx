import { useState } from 'react';
import { Shop } from '@/types/shop';
import { ShopMap } from '@/components/Map/ShopMap';

const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Delicious Corner',
    description: 'Traditional street food with a modern twist.',
    category: 'Food',
    coordinates: [3.1390, 101.6869], // KL city center
    address: '123 Jalan Example, Kuala Lumpur',
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
    address: '456 Jalan Sample, Kuala Lumpur',
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
    address: '789 Jalan Test, Kuala Lumpur',
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    createdAt: '2024-02-23',
    updatedAt: '2024-02-23',
  },
];

export function Shops() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredShops = MOCK_SHOPS.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search shops..."
              className="w-full sm:w-auto min-w-[200px] rounded-md border px-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full sm:w-auto rounded-md border px-4 py-2"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>
        </div>

        <div className="h-[400px] w-full rounded-lg border overflow-hidden">
          <ShopMap shops={filteredShops} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map(shop => (
            <div key={shop.id} className="rounded-xl border bg-card p-6 hover:bg-accent/50 transition-colors">
              <h2 className="text-xl font-semibold">{shop.name}</h2>
              <p className="mt-2 text-muted-foreground">{shop.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{shop.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{shop.rating}</span>
                  <span className="text-sm text-muted-foreground">({shop.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{shop.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 