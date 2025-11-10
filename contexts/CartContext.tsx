import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { CartItem, Plant } from '../types';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../constants';

interface CartContextType {
  items: CartItem[];
  addItem: (plant: Plant, quantity: number) => Promise<void>;
  removeItem: (plantId: number) => Promise<void>;
  updateQuantity: (plantId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        try {
          const res = await fetch(`${API_BASE_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setItems(data);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear cart on logout
        setItems([]);
      }
    };
    fetchCart();
  }, [isAuthenticated, token]);

  const addItem = async (plant: Plant, quantity: number) => {
    if (!isAuthenticated || !token) {
      alert("Please log in to add items to your cart.");
      return;
    }
    const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ plantId: plant.id, quantity }),
    });
    if (res.ok) {
        const updatedCart = await res.json();
        setItems(updatedCart);
    }
  };

  const updateQuantity = async (plantId: number, quantity: number) => {
    if (!isAuthenticated || !token) return;
     const res = await fetch(`${API_BASE_URL}/cart/${plantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
        const updatedCart = await res.json();
        setItems(updatedCart);
    }
  };
  
  const removeItem = async (plantId: number) => {
    if (!isAuthenticated || !token) return;
     const res = await fetch(`${API_BASE_URL}/cart/${plantId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`},
    });
    if (res.ok) {
        const updatedCart = await res.json();
        setItems(updatedCart);
    }
  };

  const clearCart = () => {
      // In a real app, this would also call a backend endpoint
      setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if(context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
