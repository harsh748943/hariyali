import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCartIcon, MenuIcon, XIcon, LeafIcon } from './Icons';

export const Header = () => {
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-lg hover:text-accent transition-colors ${isActive ? 'text-accent font-semibold' : 'text-white'}`;
    
  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2 text-white">
          <LeafIcon className="h-8 w-8 text-accent"/>
          <span className="text-2xl font-bold">Hariyali</span>
        </NavLink>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/quiz" className={navLinkClass}>Plant Quiz</NavLink>
          {isAuthenticated && user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="flex items-center gap-4">
           {isAuthenticated ? (
             <button onClick={handleLogout} className="hidden md:block text-lg text-white hover:text-accent">Logout</button>
           ) : (
            <div className="hidden md:flex items-center gap-4">
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/signup" className="bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary transition-colors">Sign Up</NavLink>
            </div>
           )}
          <NavLink to="/cart" className="relative text-white hover:text-accent transition-colors">
            <ShoppingCartIcon className="h-7 w-7" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </NavLink>
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-primary pb-4">
          <nav className="flex flex-col items-center gap-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Shop</NavLink>
            <NavLink to="/quiz" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Plant Quiz</NavLink>
            {isAuthenticated && user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Admin</NavLink>}
            <div className="border-t border-secondary w-full my-2"></div>
            {isAuthenticated ? (
                <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className="text-lg text-white hover:text-accent">Logout</button>
            ): (
                <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                <NavLink to="/signup" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink>
                </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
