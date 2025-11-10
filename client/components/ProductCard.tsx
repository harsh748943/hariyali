import React from 'react';
import { Link } from 'react-router-dom';
import type { Plant } from '../types';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon } from './Icons';

interface ProductCardProps {
  plant: Plant;
}

export const ProductCard: React.FC<ProductCardProps> = ({ plant }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(plant, 1);
  };

  return (
    <Link to={`/plant/${plant.id}`} className="group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-64">
        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover" />
        {plant.isSeasonal && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
            Seasonal
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-primary mb-1">{plant.name}</h3>
        <p className="text-sm text-text-light italic mb-2">{plant.latinName}</p>
        <p className="text-lg font-bold text-secondary mt-auto">${plant.price.toFixed(2)}</p>
      </div>
      <button 
        onClick={handleAddToCart}
        className="w-full bg-secondary text-white font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-300"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        Add to Cart
      </button>
    </Link>
  );
};
