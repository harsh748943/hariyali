import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getAdvancedCareTips } from '../services/geminiService';
import type { Plant } from '../types';
import { ShoppingCartIcon, SparklesIcon } from '../components/Icons';
import { API_BASE_URL } from '../constants';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoadingPlant, setIsLoadingPlant] = useState(true);
  const [aiTips, setAiTips] = useState('');
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [errorTips, setErrorTips] = useState('');
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchPlant = async () => {
      setIsLoadingPlant(true);
      try {
        const res = await fetch(`${API_BASE_URL}/plants/${id}`);
        if (res.ok) {
            const data = await res.json();
            setPlant(data);
        } else {
            setPlant(null);
        }
      } catch (error) {
        console.error("Failed to fetch plant", error);
        setPlant(null);
      } finally {
        setIsLoadingPlant(false);
      }
    };
    fetchPlant();
  }, [id]);

  if (isLoadingPlant) {
      return <div className="text-center py-20">Loading plant details...</div>
  }

  if (!plant) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-semibold">Plant not found!</h2>
        <Link to="/shop" className="text-secondary hover:underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(plant, 1);
  };

  const fetchAiTips = async () => {
    setIsLoadingTips(true);
    setErrorTips('');
    try {
      const tips = await getAdvancedCareTips(plant.name);
      setAiTips(tips);
    } catch (err: any) {
      setErrorTips(err.message || 'Failed to fetch tips.');
    } finally {
      setIsLoadingTips(false);
    }
  };

  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={plant.image} alt={plant.name} className="w-full h-auto object-cover rounded-lg"/>
          </div>
          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-4xl font-bold text-primary">{plant.name}</h1>
            <p className="text-lg text-text-light italic mb-4">{plant.latinName}</p>
            <p className="text-3xl font-bold text-secondary mb-6">${plant.price.toFixed(2)}</p>
            <p className="text-text-main mb-6">{plant.description}</p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h3 className="text-xl font-semibold text-primary mb-2">Care Instructions</h3>
              <ul className="list-none space-y-2">
                <li><strong>Light:</strong> {plant.careInstructions.light}</li>
                <li><strong>Water:</strong> {plant.careInstructions.water}</li>
                <li><strong>Soil:</strong> {plant.careInstructions.soil}</li>
              </ul>
            </div>

            <button onClick={handleAddToCart} className="mt-auto bg-secondary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-300 w-full">
              <ShoppingCartIcon className="h-6 w-6" /> Add to Cart
            </button>
            
            <div className="mt-8 bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-secondary" />
                    AI-Powered Care Tips
                </h3>
                {aiTips ? (
                  <div className="text-text-main whitespace-pre-wrap">{aiTips}</div>
                ) : (
                  <p className="text-sm text-text-light">Want to level up your plant care? Get advanced tips from our AI assistant!</p>
                )}
                {errorTips && <p className="text-sm text-red-500 mt-2">{errorTips}</p>}
                <button
                    onClick={fetchAiTips}
                    disabled={isLoadingTips}
                    className="mt-3 bg-accent text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-secondary disabled:bg-gray-400 transition-colors"
                >
                    {isLoadingTips ? 'Generating...' : 'Get Advanced Tips'}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
