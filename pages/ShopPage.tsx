import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { API_BASE_URL } from '../constants';
import type { Plant } from '../types';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const activeCategory = searchParams.get('category') || 'All';
  const categories = ['All', 'Indoor', 'Outdoor', 'Seeds'];

  useEffect(() => {
    const fetchPlants = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/plants`);
        const data = await res.json();
        setAllPlants(data);
      } catch (error) {
        console.error("Failed to fetch plants", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const filteredPlants = useMemo(() => {
    return allPlants.filter(plant => {
      const matchesCategory = activeCategory === 'All' || plant.category === activeCategory;
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, allPlants]);

  const handleCategoryChange = (category: string) => {
    setSearchParams(category === 'All' ? {} : { category });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Our Collection</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-full shadow-sm">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeCategory === category ? 'bg-primary text-white' : 'text-text-main hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a plant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
             <div className="text-center py-16">
                <p className="text-2xl font-semibold text-text-main">Loading plants...</p>
             </div>
        ) : filteredPlants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredPlants.map(plant => (
              <ProductCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-text-main">No plants found!</h2>
            <p className="text-text-light mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};
