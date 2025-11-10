import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../constants';
import { ProductCard } from '../components/ProductCard';
import type { Plant } from '../types';

export const HomePage = () => {
  const [featuredPlants, setFeaturedPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchFeaturedPlants = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/plants`);
            const allPlants = await res.json();
            setFeaturedPlants(allPlants.slice(0, 3));
        } catch (error) {
            console.error("Failed to fetch plants:", error);
        }
    }
    fetchFeaturedPlants();
  }, []);

  const categories = [
    { name: 'Indoor Plants', link: '/shop?category=Indoor', image: 'https://picsum.photos/seed/indoor/800/600' },
    { name: 'Outdoor Plants', link: '/shop?category=Outdoor', image: 'https://picsum.photos/seed/outdoor/800/600' },
    { name: 'Seeds', link: '/shop?category=Seeds', image: 'https://picsum.photos/seed/seeds/800/600' },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://picsum.photos/seed/gardenhero/1600/600')" }}>
        <div className="absolute inset-0 bg-primary bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Green Sanctuary Awaits</h1>
            <p className="text-lg md:text-xl mb-8">Find the perfect plants to bring life and beauty to your space.</p>
            <Link to="/shop" className="bg-accent text-white font-bold py-3 px-8 rounded-full hover:bg-secondary transition-transform hover:scale-105">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map(category => (
            <Link key={category.name} to={category.link} className="group relative rounded-lg overflow-hidden shadow-lg">
              <img src={category.image} alt={category.name} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">Featured Plants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlants.length > 0 ? (
                featuredPlants.map(plant => <ProductCard key={plant.id} plant={plant} />)
            ) : (
                <p className="text-center col-span-3">Loading featured plants...</p>
            )}
          </div>
        </div>
      </section>

      {/* Quiz CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-secondary text-white rounded-lg p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-lg mb-6">Take our Plant Persona Quiz to find the perfect green companion for you!</p>
          <Link to="/quiz" className="bg-white text-secondary font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-transform hover:scale-105">
            Take the Quiz
          </Link>
        </div>
      </section>
    </div>
  );
};
