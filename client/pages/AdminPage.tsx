import React, { useState, useEffect } from 'react';
import type { Plant, GardeningTip } from '../types';
import { generateGardeningTip } from '../services/geminiService';
import { SparklesIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../constants';

export const AdminPage = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [tips, setTips] = useState<GardeningTip[]>([]);
  const [tipTopic, setTipTopic] = useState('');
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plantsRes, tipsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/plants`),
          fetch(`${API_BASE_URL}/tips`),
        ]);
        const plantsData = await plantsRes.json();
        const tipsData = await tipsRes.json();
        setPlants(plantsData);
        setTips(tipsData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };
    fetchData();
  }, []);


  const handleStockChange = async (id: number, newStock: number) => {
    const updatedStock = Math.max(0, newStock);
    // Optimistic UI update
    setPlants(plants.map(p => p.id === id ? { ...p, stock: updatedStock } : p));
    
    try {
        await fetch(`${API_BASE_URL}/admin/plants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ stock: updatedStock }),
        });
    } catch(error) {
        console.error("Failed to update stock", error);
        // Revert on failure
        // For a real app, you might want to refetch the data to be safe
    }
  };

  const handleGenerateTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipTopic) return;
    setIsGeneratingTip(true);
    try {
        const newTipContent = await generateGardeningTip(tipTopic);
        
        // Save the new tip to the backend
        const res = await fetch(`${API_BASE_URL}/admin/tips`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: tipTopic, content: newTipContent }),
        });
        const savedTip = await res.json();

        setTips([...tips, savedTip]);
        setTipTopic('');
    } catch (error) {
        alert("Failed to generate and save tip. Please try again.");
        console.error(error);
    } finally {
        setIsGeneratingTip(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Admin Dashboard</h1>

        {/* Plant Inventory Management */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Plant Inventory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {plants.map(plant => (
                  <tr key={plant.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{plant.name}</td>
                    <td className="p-2">{plant.category}</td>
                    <td className="p-2">${plant.price.toFixed(2)}</td>
                    <td className="p-2">
                      <input 
                        type="number"
                        value={plant.stock}
                        onChange={(e) => handleStockChange(plant.id, parseInt(e.target.value, 10))}
                        className="w-20 p-1 border rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gardening Tips Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-4">Gardening Tips Content</h2>
          <form onSubmit={handleGenerateTip} className="mb-6 flex gap-4">
            <input 
              type="text"
              value={tipTopic}
              onChange={(e) => setTipTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'pruning roses')"
              className="flex-grow p-2 border rounded-md focus:ring-secondary focus:border-secondary"
            />
            <button
              type="submit"
              disabled={isGeneratingTip}
              className="bg-accent text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-secondary disabled:bg-gray-400"
            >
              <SparklesIcon className="h-5 w-5" />
              {isGeneratingTip ? 'Generating...' : 'Generate New Tip'}
            </button>
          </form>

          <div className="space-y-4">
            {tips.map(tip => (
              <div key={tip.id} className="p-4 border rounded-md">
                <h3 className="font-bold text-lg text-secondary">{tip.title}</h3>
                <p>{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
