import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { PlusIcon, MinusIcon, TrashIcon } from '../components/Icons';

export const CartPage = () => {
  const { items, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [deliverySlot, setDeliverySlot] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverySlot) {
      alert("Please select a delivery slot.");
      return;
    }
    alert(`Order placed! Your plants will be delivered during your selected slot: ${deliverySlot}. Total: $${total.toFixed(2)}`);
    // Here you would typically clear the cart and navigate to a confirmation page
    clearCart();
  };
  
  if (isLoading) {
    return <div className="text-center py-20">Loading your cart...</div>;
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Your Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-text-main">Your cart is empty.</h2>
            <p className="text-text-light mt-2 mb-6">Looks like you haven't added any plants yet!</p>
            <Link to="/shop" className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-transform hover:scale-105">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-primary border-b pb-4 mb-4">Cart Items</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md"/>
                      <div>
                        <h3 className="font-semibold text-lg text-text-main">{item.name}</h3>
                        <p className="text-text-light">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100"><MinusIcon className="h-4 w-4"/></button>
                        <span className="px-3">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100"><PlusIcon className="h-4 w-4"/></button>
                      </div>
                       <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-semibold text-primary border-b pb-4 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <form onSubmit={handleCheckout}>
                <div className="mt-6">
                  <label htmlFor="delivery" className="block text-sm font-medium text-text-main mb-2">Select Delivery Slot</label>
                  <select 
                    id="delivery" 
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-secondary focus:border-secondary"
                    required
                  >
                    <option value="">Choose a time...</option>
                    <option value="Tomorrow, 9am - 12pm">Tomorrow, 9am - 12pm</option>
                    <option value="Tomorrow, 1pm - 5pm">Tomorrow, 1pm - 5pm</option>
                    <option value="Day after, 9am - 12pm">Day after, 9am - 12pm</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 mt-6 rounded-lg hover:bg-secondary transition-colors">
                  Proceed to Checkout
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
