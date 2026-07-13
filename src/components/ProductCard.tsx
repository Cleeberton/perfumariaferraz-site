import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Flame } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

const getIntensityLabel = (value: number) => {
  switch (value) {
    case 5: return "Muito intenso";
    case 4: return "Intenso";
    case 3: return "Moderado";
    case 2: return "Suave";
    case 1: return "Muito suave";
    default: return "Moderado";
  }
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  
  const isFavorite = favorites.includes(product.id);
  const hasDiscount = (!!product.promoção && !!product.preçoPromocional) || (!!product.preçoPromocional && product.preçoPromocional < product.preço);
  const currentPrice = hasDiscount ? product.preçoPromocional! : product.preço;
  const discountPercent = hasDiscount 
    ? Math.round(((product.preço - product.preçoPromocional!) / product.preço) * 100) 
    : 0;

  // Every perfume has up to 3x interest-free and 5% discount on PIX
  const maxInstallments = 3;
  const installmentValue = currentPrice / 3;
  const pixPrice = currentPrice * 0.95;

  const handleQuickBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    // Force open cart by navigating or triggering a custom click event or standard redirect
    const cartButton = document.getElementById('cart-drawer-toggle');
    if (cartButton) {
      cartButton.click();
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    const cartButton = document.getElementById('cart-drawer-toggle');
    if (cartButton) {
      cartButton.click();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border border-slate-100 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full hover:shadow-xl hover:border-brand-blue-accent/40 transition-all duration-300"
    >
      {/* Badges and Favorite Button */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 pointer-events-none">
        {product.destaque && (
          <span className="bg-amber-100 text-amber-800 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            Destaque
          </span>
        )}
        {product.lançamento && (
          <span className="bg-brand-blue-accent text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            NEW
          </span>
        )}
        {hasDiscount && (
          <span className="bg-rose-200 text-rose-600 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
            PROMO
          </span>
        )}
      </div>

      <button
        id={`fav-btn-${product.id}`}
        onClick={handleFavoriteClick}
        className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xs rounded-full border border-slate-100 shadow-xs hover:bg-white text-gray-400 hover:text-red-500 transition-all cursor-pointer"
        aria-label="Adicionar aos favoritos"
      >
        <Heart size={12} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
      </button>

      {/* Image Container */}
      <Link to={`/produto/${product.id}`} className="relative block aspect-[3/4] bg-slate-50 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={product.imagem}
          alt={product.nome}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="p-2 sm:p-2.5 bg-white text-slate-800 rounded-full shadow-md hover:bg-[#5B8FB9] transition-colors">
            <Eye size={14} className="sm:size-4" />
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-2.5 sm:pt-4 flex flex-col flex-grow">
        {/* Brand & Volume */}
        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
          {product.marca}
        </p>

        {/* Product Name */}
        <Link to={`/produto/${product.id}`} className="block text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue-dark transition-colors line-clamp-1">
          {product.nome}
        </Link>

        {/* Category tag / Subtitle info */}
        <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium font-mono uppercase tracking-wider mt-0.5 mb-1.5 sm:mb-2">
          {product.categoria} • {product.volume}
        </p>

        {/* Intensity indicator using flames */}
        <div className="flex items-center space-x-1 mb-2 sm:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const intensity = product.intensidade || 3;
              const isActive = i < intensity;
              return (
                <Flame 
                  key={i} 
                  size={10} 
                  className={isActive ? "fill-orange-500 text-orange-500" : "text-slate-200"} 
                />
              );
            })}
          </div>
          <span className="text-[8px] sm:text-[9px] text-slate-500 pl-0.5 font-semibold uppercase tracking-wider">
            {getIntensityLabel(product.intensidade || 3)}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto space-y-1 sm:space-y-2">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                R$ {product.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs sm:text-sm font-bold text-rose-600">
                R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ) : (
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              R$ {product.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          )}

          {/* Payment terms: 5% PIX discount and 3x interest-free */}
          <div className="text-[9px] sm:text-[10px] space-y-0.5">
            <div className="font-semibold text-[#5B8FB9] flex flex-wrap items-center gap-0.5">
              <span>R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-0.5 py-0.2 rounded-xs">PIX (5% OFF)</span>
            </div>
            <div className="text-slate-400 font-light truncate">
              ou {maxInstallments}x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
            </div>
          </div>
        </div>

        {/* Actions Button Panel */}
        <div className="grid grid-cols-2 gap-1.5 mt-3 sm:mt-4">
          <button
            id={`add-to-cart-quick-${product.id}`}
            onClick={handleAddToCart}
            className="flex items-center justify-center py-1.5 sm:py-2 px-1 sm:px-2 bg-slate-50 hover:bg-brand-blue/30 text-slate-700 border border-slate-100 text-[9px] sm:text-[11px] font-bold rounded-full transition-all cursor-pointer truncate"
            title="Adicionar ao carrinho"
          >
            <ShoppingBag size={11} className="mr-0.5 sm:mr-1 shrink-0" />
            <span className="truncate">Adicionar</span>
          </button>
          
          <button
            id={`buy-now-quick-${product.id}`}
            onClick={handleQuickBuyNow}
            className="flex items-center justify-center py-1.5 sm:py-2 px-1 sm:px-2 bg-brand-blue text-slate-800 text-[9px] sm:text-[11px] font-bold rounded-full hover:bg-brand-blue-hover transition-all cursor-pointer truncate"
          >
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
};
