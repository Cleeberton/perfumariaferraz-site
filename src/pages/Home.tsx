import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, isLoadingProducts } = useApp();

  // Filter products for featured section: Perfumes a pronta entrega (estoque > 0 e preço > 0)
  const activeProducts = products.filter(p => p.ativo && p.preço > 0);
  const featuredProducts = activeProducts.filter(p => p.estoque > 0);

  return (
    <div className="space-y-12 pt-6 pb-16">
      {/* HERO BANNER - PERFUME MATCH CONSULTOR VIRTUAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#DCEEFF] via-[#EAF4FF] to-white border border-[#BBDDFB]/60 p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full border border-[#5B8FB9]/30 text-[#2C5E8A] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles size={13} className="text-[#5B8FB9]" />
              <span>Consultor Virtual Inteligente</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-light text-slate-800 tracking-wide uppercase leading-tight">
              Descubra o perfume <br className="hidden sm:inline" />
              <span className="font-semibold text-[#2C5E8A]">perfeito para você</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Responda algumas perguntas e encontre a fragrância que combina com seu estilo. Analisamos notas, ocasiões e famílias olfativas do nosso catálogo real.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/perfume-match"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#2C5E8A] hover:bg-[#1E4364] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg gap-2 cursor-pointer"
              >
                <Wand2 size={16} />
                <span>Descobrir meu perfume</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/90 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full border border-slate-200 transition-all cursor-pointer"
              >
                Ver Todo o Catálogo
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-6 -bottom-8 w-72 h-72 opacity-20 pointer-events-none text-[#2C5E8A]">
            <Sparkles size={280} strokeWidth={0.8} />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS (Pronta Entrega) */}
      {isLoadingProducts ? (
        <div className="flex justify-center py-24">
          <span className="text-sm text-slate-400 font-light animate-pulse">Carregando fragrâncias...</span>
        </div>
      ) : (
        featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-700 block">Disponibilidade Imediata</span>
              <h3 className="text-2xl font-light tracking-widest text-slate-800 uppercase">Perfumes a Pronta Entrega</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
};
