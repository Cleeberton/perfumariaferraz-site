import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { products, isLoadingProducts, config } = useApp();
  const navigate = useNavigate();

  // Filter products for featured section (only active and featured items, no slice limit)
  const activeProducts = products.filter(p => p.ativo);
  const featuredProducts = activeProducts.filter(p => p.destaque);

  const categories = [
    { name: 'Masculino', image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=300' },
    { name: 'Feminino', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300' },
    { name: 'Importados', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300' },
    { name: 'Árabes', image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=300' },
    { name: 'Brand Collection', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=300' },
    { name: 'Promoções', image: 'https://images.unsplash.com/photo-1528740564264-7a96894d418e?auto=format&fit=crop&q=80&w=300' }
  ];

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Masculino' || categoryName === 'Feminino' || categoryName === 'Unissex') {
      navigate(`/catalogo?tipo=${encodeURIComponent(categoryName)}`);
    } else {
      navigate(`/catalogo?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <div className="space-y-16 pt-8">
      {/* 2. FEATURED PRODUCTS (Destaque) */}
      {isLoadingProducts ? (
        <div className="flex justify-center py-24">
          <span className="text-sm text-slate-400 font-light animate-pulse">Carregando fragrâncias em destaque...</span>
        </div>
      ) : (
        featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-blue-dark block">Seleção Especial</span>
              <h3 className="text-2xl font-light tracking-widest text-slate-800 uppercase">Fragrâncias em Destaque</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )
      )}

      {/* 3. CATEGORIES EXHIBIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-blue-dark block">Navegação Expressa</span>
          <h3 className="text-2xl font-light tracking-widest text-slate-800 uppercase">Comprar por Categoria</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group flex flex-col items-center space-y-3 cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shadow-xs group-hover:shadow-md group-hover:border-brand-blue-accent transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
