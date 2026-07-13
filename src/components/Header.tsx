import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Shield, Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface HeaderProps {
  onCartOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartOpen }) => {
  const { cart, favorites, auth, config } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'Masculino' || category === 'Feminino' || category === 'Unissex') {
      navigate(`/catalogo?tipo=${encodeURIComponent(category)}`);
    } else {
      navigate(`/catalogo?category=${encodeURIComponent(category)}`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Top bar with store info */}
      <div className="hidden md:flex justify-between items-center px-6 py-1.5 bg-brand-soft-bg text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Phone size={12} className="mr-1 text-brand-blue-dark" />
            <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Suporte via WhatsApp
            </a>
          </span>
          <span className="flex items-center">
            <MapPin size={12} className="mr-1 text-brand-blue-dark" />
            Guaraci - SP
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Clock size={12} className="mr-1 text-brand-blue-dark" />
            {config.horarioAtendimento}
          </span>

        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Menu icon (Mobile) */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-black p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <Logo variant="icon" className="w-9 h-9" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-light text-slate-400">PERFUMARIA</span>
              <span className="text-lg font-light tracking-[0.18em] text-slate-800 uppercase font-serif mt-0.5">
                FERRAZ
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              id="desktop-search-input"
              type="text"
              placeholder="Pesquisar fragrância..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </form>

          {/* Action icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Search toggler (Mobile) */}
            <button
              id="mobile-search-toggle"
              onClick={() => navigate('/catalogo')}
              className="md:hidden text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-50"
              aria-label="Buscar no catálogo"
            >
              <Search size={20} />
            </button>

            {/* Shopping Cart */}
            <button
              id="cart-drawer-toggle"
              onClick={onCartOpen}
              className="relative text-gray-600 hover:text-brand-blue-dark p-2 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Carrinho de compras"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartItemsCount}
                  className="absolute -top-0.5 -right-0.5 bg-brand-blue-dark text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>


          </div>
        </div>
      </div>

      {/* Category Nav bar for desktops */}
      <div className="hidden md:block border-t border-slate-100 bg-white py-3">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center justify-center gap-8 text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
            <li>
              <Link to="/" className="hover:text-slate-900 transition-colors">Início</Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-slate-900 transition-colors">Catálogo</Link>
            </li>
            {['Masculino', 'Feminino', 'Importados', 'Árabes', 'Brand Collection', 'Promoções'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className="hover:text-slate-900 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Close header inside stacking context */}
      </header>

      {/* Mobile Drawer Navigation Overlay - placed outside header tag to avoid stacking context limitations caused by backdrop-blur */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display font-bold text-xl tracking-tight">Perfumaria Ferraz</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-black">
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Search form */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <input
                  id="mobile-search-input"
                  type="text"
                  placeholder="Pesquisar fragrância..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </button>
              </form>

              <nav className="flex-1">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Navegação</p>
                <ul className="space-y-3 mb-6">
                  <li>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-base font-medium text-gray-800 hover:text-brand-blue-dark">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-base font-medium text-gray-800 hover:text-brand-blue-dark">
                      Todos os Perfumes
                    </Link>
                  </li>
                </ul>

                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Categorias</p>
                <ul className="space-y-3 mb-6">
                  {['Masculino', 'Feminino', 'Importados', 'Árabes', 'Brand Collection', 'Promoções'].map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className="block w-full text-left py-1 text-base text-gray-700 hover:text-brand-blue-dark"
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>


              </nav>

              <div className="mt-auto pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                <p className="font-semibold text-gray-800">Horário de Atendimento:</p>
                <p>{config?.horarioAtendimento || "Segunda a Sábado: 09h às 19h"}</p>
                <div className="flex space-x-4 pt-3">
                  {config?.whatsapp && (
                    <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue-dark hover:underline">WhatsApp</a>
                  )}
                  {config?.instagram && (
                    <a href={`https://instagram.com/${config.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">Instagram</a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
