import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper to accurately resolve a product's gender categorization based on name and sheet data
const getProductGender = (p: { nome: string; categoria: string; tipo?: string }): 'masculino' | 'feminino' | 'unissex' => {
  const name = p.nome.toLowerCase();
  const cat = p.categoria.toLowerCase();
  const sheetTipo = (p.tipo || '').toLowerCase().trim();

  // 1. Force masculine for famous masculine names or brand collections
  if (
    name.includes('malbec') || 
    name.includes('club 6') || 
    name.includes('the blend') || 
    name.includes('sauvage') || 
    name.includes('bleu de chanel') || 
    name.includes('invictus') || 
    name.includes('1 million') || 
    name.includes('le male') || 
    name.includes('scandal pour homme') || 
    name.includes('ultra male') || 
    name.includes('eros') || 
    name.includes('pour homme') || 
    name.includes('bad boy') || 
    name.includes('212 vip black') || 
    name.includes('212 men') || 
    name.includes('ch men') || 
    name.includes('hugo man') || 
    name.includes('boss bottled') || 
    name.includes('explorer') || 
    name.includes('legend') || 
    name.includes('club de nuit') ||
    name.includes('asad') ||
    name.includes('fakhar') ||
    name.includes('9 pm') ||
    name.includes('9pm') ||
    name.includes('1899-12-31') ||
    name.includes('supremacy') ||
    name.includes('turathi') ||
    name.includes('hawas') ||
    name.includes('daarej')
  ) {
    return 'masculino';
  }

  // 2. Force feminine for famous feminine names or brand collections
  if (
    name.includes('la vie est belle') || 
    name.includes('idôle') || 
    name.includes('good girl') || 
    name.includes('212 vip rosé') || 
    name.includes('libre') || 
    name.includes('black opium') || 
    name.includes('j\'adore') || 
    name.includes('miss dior') || 
    name.includes('coco mademoiselle') || 
    name.includes('chance') || 
    name.includes('floratta') || 
    name.includes('egeo dolce') || 
    name.includes('lily')
  ) {
    return 'feminino';
  }

  // 3. Fallback to sheet tipo
  if (sheetTipo === 'masculino') return 'masculino';
  if (sheetTipo === 'feminino') return 'feminino';
  if (sheetTipo === 'unisex' || sheetTipo === 'unissex') return 'unissex';

  // 4. Default by category name
  if (cat.includes('masculino')) return 'masculino';
  if (cat.includes('feminino')) return 'feminino';

  return 'unissex';
};

export const Catalog: React.FC = () => {
  const { products, isLoadingProducts } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortOption, setSortOption] = useState('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Categories & Brands lists for dropdown selection filters (exclude Masculino/Feminino from categoriesList)
  const categoriesList = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.categoria)))
      .filter(Boolean)
      .filter((cat): cat is string => {
        const cLower = (cat as string).toLowerCase();
        return cLower !== 'masculino' && cLower !== 'feminino' && cLower !== 'unissex' && cLower !== 'unisex';
      });

    const mapped = unique.map(c => {
      if (c.toLowerCase() === 'body splash') return 'Brand Collection';
      if (c.toLowerCase() === 'kits') return 'Promoções';
      return c;
    });

    const finalSet = Array.from(new Set(mapped));
    if (!finalSet.includes('Promoções')) {
      finalSet.push('Promoções');
    }
    if (!finalSet.includes('Brand Collection')) {
      finalSet.push('Brand Collection');
    }

    return finalSet.filter(Boolean).sort();
  }, [products]);

  const brandsList = useMemo(() => {
    return Array.from(new Set(products.map(p => p.marca))).sort();
  }, [products]);

  // Synchronize filter states with URL Query Params on mount/change
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const categoryVal = searchParams.get('category') || '';
    const brandVal = searchParams.get('brand') || '';
    const tipoVal = searchParams.get('tipo') || '';
    const sortVal = searchParams.get('sort') || 'default';

    setSearchText(searchVal);
    setSelectedCategory(categoryVal);
    setSelectedBrand(brandVal);
    setSelectedTipo(tipoVal);
    setSortOption(sortVal);
  }, [searchParams]);

  // Update query params when state changes (debounced search text handled implicitly)
  const updateQueryAndState = (updates: { [key: string]: string }) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    updateQueryAndState({ search: val });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateQueryAndState({ category: cat });
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    updateQueryAndState({ brand: brand });
  };

  const handleTipoChange = (tipo: string) => {
    setSelectedTipo(tipo);
    updateQueryAndState({ tipo: tipo });
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    updateQueryAndState({ sort });
  };

  const clearAllFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedTipo('');
    setMaxPrice(2500);
    setSortOption('default');
    setSearchParams({});
  };

  // Filter and Sort calculation
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => p.ativo);

    // Filter by name, brand, category, description, and tipo
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(p => 
        p.nome.toLowerCase().includes(query) ||
        p.marca.toLowerCase().includes(query) ||
        p.categoria.toLowerCase().includes(query) ||
        (p.tipo && p.tipo.toLowerCase().includes(query)) ||
        p.descrição.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      const selCatLower = selectedCategory.toLowerCase().trim();
      if (selCatLower === 'promoções' || selCatLower === 'promocoes') {
        result = result.filter(p => (p.preçoPromocional && p.preçoPromocional > 0) || p.promoção);
      } else if (selCatLower === 'brand collection' || selCatLower === 'body splash') {
        result = result.filter(p => p.categoria.toLowerCase().trim() === 'brand collection' || p.categoria.toLowerCase().trim() === 'body splash');
      } else {
        result = result.filter(p => p.categoria === selectedCategory);
      }
    }

    if (selectedBrand) {
      result = result.filter(p => p.marca === selectedBrand);
    }

    if (selectedTipo) {
      const selTipo = selectedTipo.toLowerCase().trim();
      result = result.filter(p => {
        const gender = getProductGender(p);
        
        if (selTipo === 'unissex' || selTipo === 'unisex') {
          return gender === 'unissex';
        }
        if (selTipo === 'masculino') {
          return gender === 'masculino' || gender === 'unissex';
        }
        if (selTipo === 'feminino') {
          return gender === 'feminino' || gender === 'unissex';
        }
        return gender === selTipo;
      });
    }

    // Filter by price range (takes promotional price into account if active)
    result = result.filter(p => {
      const hasPromo = (!!p.promoção && !!p.preçoPromocional) || (!!p.preçoPromocional && p.preçoPromocional < p.preço);
      const price = hasPromo ? p.preçoPromocional! : p.preço;
      return price <= maxPrice;
    });

    // Apply Sorting Option
    switch (sortOption) {
      case 'menor_preço':
        result.sort((a, b) => {
          const hasPromoA = (!!a.promoção && !!a.preçoPromocional) || (!!a.preçoPromocional && a.preçoPromocional < a.preço);
          const priceA = hasPromoA ? a.preçoPromocional! : a.preço;
          const hasPromoB = (!!b.promoção && !!b.preçoPromocional) || (!!b.preçoPromocional && b.preçoPromocional < b.preço);
          const priceB = hasPromoB ? b.preçoPromocional! : b.preço;
          return priceA - priceB;
        });
        break;
      case 'maior_preço':
        result.sort((a, b) => {
          const hasPromoA = (!!a.promoção && !!a.preçoPromocional) || (!!a.preçoPromocional && a.preçoPromocional < a.preço);
          const priceA = hasPromoA ? a.preçoPromocional! : a.preço;
          const hasPromoB = (!!b.promoção && !!b.preçoPromocional) || (!!b.preçoPromocional && b.preçoPromocional < b.preço);
          const priceB = hasPromoB ? b.preçoPromocional! : b.preço;
          return priceB - priceA;
        });
        break;
      case 'vendas': // Simulated best sellers
        result.sort((a, b) => b.estoque - a.estoque); // Sorting by stock index as a proxy for best sellers
        break;
      case 'lancamentos':
        result.sort((a, b) => (b.lançamento ? 1 : 0) - (a.lançamento ? 1 : 0));
        break;
      case 'promocoes':
        result.sort((a, b) => {
          const hasPromoA = (!!a.promoção && !!a.preçoPromocional) || (!!a.preçoPromocional && a.preçoPromocional < a.preço);
          const hasPromoB = (!!b.promoção && !!b.preçoPromocional) || (!!b.preçoPromocional && b.preçoPromocional < b.preço);
          return (hasPromoB ? 1 : 0) - (hasPromoA ? 1 : 0);
        });
        break;
      case 'destaque':
        result.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
        break;
      default:
        // default sorting / ID
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, searchText, selectedCategory, selectedBrand, selectedTipo, maxPrice, sortOption]);

  const FilterSidebar = () => (
    <div className="space-y-6 bg-white p-6 border border-slate-100 rounded-3xl h-fit">
      <div className="flex items-center justify-between border-b border-slate-150 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-800 flex items-center">
          <Filter size={14} className="mr-2 text-brand-blue-dark" /> Filtros
        </span>
        {(searchText || selectedCategory || selectedBrand || selectedTipo || maxPrice < 2500 || sortOption !== 'default') && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-dark hover:underline flex items-center cursor-pointer"
          >
            Limpar todos
          </button>
        )}
      </div>

      {/* Text search filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Palavra-chave</label>
        <div className="relative">
          <input
            id="catalog-text-search"
            type="text"
            placeholder="Nome, descrição ou marca..."
            value={searchText}
            onChange={handleSearchChange}
            className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border-none rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Category Selection Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Categoria</label>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !selectedCategory 
                ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
            }`}
          >
            Todas
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo Selection Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tipo / Gênero</label>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleTipoChange('')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !selectedTipo 
                ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
            }`}
          >
            Todos
          </button>
          {['Masculino', 'Feminino', 'Unissex'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTipoChange(t)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTipo === t 
                  ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Marca / Casa</label>
        <div className="flex flex-wrap gap-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleBrandChange('')}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              !selectedBrand 
                ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
            }`}
          >
            Todas
          </button>
          {brandsList.map(brand => (
            <button
              key={brand}
              type="button"
              onClick={() => handleBrandChange(brand)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedBrand === brand 
                  ? 'bg-[#DCEEFF] text-slate-800 font-bold' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter slide slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Preço Máximo</span>
          <span className="font-bold text-brand-blue-dark font-mono">R$ {maxPrice.toLocaleString('pt-BR')}</span>
        </div>
        <input
          id="catalog-price-slider"
          type="range"
          min="50"
          max="2500"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-blue-dark cursor-pointer h-1 bg-slate-200 rounded-full appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>R$ 50</span>
          <span>R$ 2.500+</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-blue-dark block">Fragrâncias de Luxo</span>
          <h2 className="text-2xl font-light tracking-widest text-slate-800 uppercase mt-0.5">Catálogo Completo</h2>
          <p className="text-[11px] text-slate-400 font-mono uppercase mt-1">
            Exibindo {filteredAndSortedProducts.length} de {products.filter(p => p.ativo).length} perfumes disponíveis
          </p>
        </div>

        {/* Sorting options bar */}
        <div className="flex items-center space-x-3.5 select-none self-end md:self-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <ArrowUpDown size={12} className="mr-1.5 text-brand-blue-dark" /> Ordenar por
          </span>
          <select
            id="catalog-sort-select"
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 bg-slate-50 border-none rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer uppercase tracking-wider text-slate-600 outline-none"
          >
            <option value="default">Relevância / Lançamento</option>
            <option value="menor_preço">Menor Preço</option>
            <option value="maior_preço">Maior Preço</option>
            <option value="vendas">Mais Vendidos</option>
            <option value="lancamentos">Lançamentos</option>
            <option value="promocoes">Promoções</option>
          </select>

          {/* Mobile Filter toggle button */}
          <button
            id="mobile-filters-trigger"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden p-2.5 bg-slate-50 hover:bg-[#DCEEFF] rounded-full text-slate-700 flex items-center cursor-pointer transition-colors"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar - Desktop only */}
        <aside className="hidden lg:block lg:col-span-1">
          <FilterSidebar />
        </aside>

        {/* Products Catalogue Grid */}
        <div className="lg:col-span-3">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <RefreshCw size={24} className="text-brand-blue-dark animate-spin" />
              <span className="text-sm text-gray-400 font-light">Buscando catálogo de perfumes na planilha do Google Sheets...</span>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-50 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Search size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-gray-900">Nenhum perfume encontrado</h4>
                <p className="text-sm text-gray-400 font-light max-w-sm">
                  Não encontramos fragrâncias correspondentes aos filtros selecionados. Tente ajustar os parâmetros.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-brand-blue text-brand-blue-dark font-medium text-xs rounded-xl hover:bg-brand-blue-hover transition-colors cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-8">
              {filteredAndSortedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter bottom drawer sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-55 bg-white rounded-t-3xl p-6 lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-display font-bold text-lg">Filtros</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-6 py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-brand-blue-dark font-semibold text-sm rounded-xl cursor-pointer"
              >
                Aplicar Filtros ({filteredAndSortedProducts.length})
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
