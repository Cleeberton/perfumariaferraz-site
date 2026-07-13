import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ShoppingBag, Heart, ArrowLeft, Flame, Share2, Shield, Truck, RefreshCw, MessageSquare } from 'lucide-react';
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

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, favorites, toggleFavorite, config } = useApp();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'envio'>('desc');
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Load product based on ID
  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        setSelectedImage(found.imagem);
        setQuantity(1); // Reset qty on product change
        window.scrollTo(0, 0);
      } else {
        // Redirect to catalog if not found
        navigate('/catalogo');
      }
    }
  }, [id, products, navigate]);

  if (!product) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="text-sm text-gray-400 font-light animate-pulse">Carregando detalhes do perfume...</span>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const hasDiscount = (!!product.promoção && !!product.preçoPromocional) || (!!product.preçoPromocional && product.preçoPromocional < product.preço);
  const currentPrice = hasDiscount ? product.preçoPromocional! : product.preço;

  // Installments calculations (Strictly 3x interest-free and 5% discount on PIX)
  const maxInstallments = 3;
  const installmentValue = currentPrice / 3;
  const pixPrice = currentPrice * 0.95;

  const isPreOrder = product.preço === 0 && product.estoque === 0;

  // Filter similar products (same category or same brand, excluding current product)
  const similarProducts = products
    .filter(p => p.ativo && p.id !== product.id && (p.categoria === product.categoria || p.marca === product.marca))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setTimeout(() => {
      const cartBtn = document.getElementById('cart-drawer-toggle');
      if (cartBtn) cartBtn.click();
    }, 100);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    // Open cart drawer
    setTimeout(() => {
      const cartBtn = document.getElementById('cart-drawer-toggle');
      if (cartBtn) cartBtn.click();
    }, 100);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${product.nome} - Perfumaria Ferraz`,
        text: `Confira essa fragrância na Perfumaria Ferraz!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link to="/catalogo" className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} className="mr-1.5" /> Voltar ao Catálogo
        </Link>
        <span className="text-xs text-slate-400 font-bold font-mono">ID: #{product.id}</span>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-[2.5rem] p-4 overflow-hidden relative">
            {/* Promo flag */}
            {hasDiscount && (
              <span className="absolute top-6 left-6 z-10 bg-rose-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Desconto Ativo
              </span>
            )}
            <img
              src={selectedImage}
              alt={product.nome}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>

          {/* Thumbnails list (merges main image and multiple images if configured) */}
          {product.imagens && product.imagens.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.imagens.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-brand-blue-accent shadow-xs' : 'border-slate-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.nome} thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product details and actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            {/* Brand and Category badge */}
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-blue-dark block">{product.marca}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-bold">{product.categoria}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl text-slate-800 font-light uppercase tracking-wide leading-tight">
              {product.nome}
            </h1>

            {/* Intensity Level (Flames) */}
            <div className="flex items-center space-x-2 py-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Intensidade:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const intensity = product.intensidade || 3;
                  const isActive = i < intensity;
                  return (
                    <Flame 
                      key={i} 
                      size={15} 
                      className={isActive ? "fill-orange-500 text-orange-500" : "text-slate-200"} 
                    />
                  );
                })}
              </div>
              <span className="text-xs text-orange-600 font-bold uppercase tracking-wider pl-1">
                {getIntensityLabel(product.intensidade || 3)}
              </span>
            </div>
          </div>

          {/* Volume and Stock */}
          <div className="flex items-center justify-between border-y border-slate-100 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Frasco:</span>
              <span className="text-slate-800 bg-slate-50 px-3 py-1 rounded-full">{product.volume}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Disponibilidade:</span>
              {isPreOrder ? (
                <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-[10px]">
                  Sob Encomenda
                </span>
              ) : product.estoque > 0 ? (
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[10px]">
                  {product.estoque} em estoque
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-3 py-1 rounded-full text-[10px]">
                  Fora de Estoque
                </span>
              )}
            </div>
          </div>

          {/* Pricing container */}
          <div className="space-y-2">
            {isPreOrder ? (
              <div className="text-3xl font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-lg w-fit">
                SOB ENCOMENDA
              </div>
            ) : hasDiscount ? (
              <div className="space-y-1">
                <span className="text-xs text-slate-400 line-through font-mono">
                  De: R$ {product.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-slate-800">
                    R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-bold">
                    Economize R$ {(product.preço - product.preçoPromocional!).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-slate-800">
                R$ {product.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            )}

            {/* Installment terms */}
            {!isPreOrder && (
              <div className="text-sm text-slate-500 font-medium leading-relaxed">
                <div className="text-[#5B8FB9] font-bold text-lg flex items-center">
                  R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no PIX
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-2 uppercase tracking-wider">5% de desconto</span>
                </div>
                <div className="text-slate-400 mt-1">
                  ou em até <span className="font-bold text-slate-600">3x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> sem juros no cartão de crédito.
                </div>
              </div>
            )}
          </div>

          {/* Interactive Actions - Quantity selectors and add button */}
          {product.estoque > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity input */}
                <div className="flex items-center border border-slate-100 rounded-full h-12 bg-slate-50 w-full sm:w-auto px-4 justify-between">
                  <span className="text-[10px] text-slate-400 font-bold pr-4 uppercase tracking-widest">Qtd</span>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="text-slate-400 hover:text-slate-800 p-1 font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.estoque, q + 1))}
                      className="text-slate-400 hover:text-slate-800 p-1 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buy button */}
                <button
                  id="details-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full h-12 bg-brand-blue hover:bg-brand-blue-hover text-slate-800 text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={14} className="mr-2" />
                  Comprar Agora
                </button>
              </div>

              {/* Auxiliary buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="details-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3 border border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center cursor-pointer"
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  id="details-favorite-btn"
                  onClick={() => toggleFavorite(product.id)}
                  className="w-full py-3 border border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Heart size={12} className={`mr-1.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  {isFav ? 'Favoritado' : 'Favoritar'}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full py-3 border border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center cursor-pointer"
                >
                  <Share2 size={12} className="mr-1.5 text-slate-400" />
                  Compartilhar
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(isPreOrder ? `Olá! Gostaria de encomendar o perfume: ${product.nome} (${product.volume})` : `Olá! Gostaria de saber da previsão de estoque do perfume: ${product.nome} (${product.volume})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full h-12 ${isPreOrder ? 'bg-amber-100 text-amber-800' : 'bg-[#DCEEFF] text-slate-800'} text-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center transition-all shadow-xs`}
              >
                <MessageSquare size={14} className={`mr-2 ${isPreOrder ? 'text-amber-600' : 'text-brand-blue-dark'} animate-pulse`} />
                {isPreOrder ? 'Encomendar pelo WhatsApp' : 'Avise-me quando chegar'}
              </a>
            </div>
          )}

          {/* Secure purchase information indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5 text-[11px] text-slate-500 font-medium uppercase tracking-wider">
            <div className="flex items-center space-x-2">
              <Shield size={14} className="text-emerald-500 shrink-0" />
              <span>100% Original</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck size={14} className="text-brand-blue-dark shrink-0" />
              <span>Entrega a Combinar</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw size={14} className="text-slate-400 shrink-0" />
              <span>Troca em 7 dias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description / specs / shipping tabs toggle bar */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 space-y-6">
        <div className="flex space-x-2 overflow-x-auto pb-px scrollbar-none">
          {[
            { id: 'desc', label: 'Descrição' },
            { id: 'specs', label: 'Ficha Técnica' },
            { id: 'envio', label: 'Entrega e Suporte' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-brand-blue text-slate-800 shadow-xs' 
                  : 'bg-slate-50 text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content renderer */}
        <div className="text-sm leading-relaxed text-gray-600 font-light">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.descrição}</p>
              <p>Cada frasco é importado legalmente e armazenado sob temperatura controlada para preservar todas as propriedades aromáticas originais. Ideal para quem busca fixação prolongada, projeção sofisticada e uma fragrância inesquecível.</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <table className="w-full max-w-md border-collapse text-xs sm:text-sm">
              <tbody>
                <tr className="border-b border-gray-100 py-2.5 flex justify-between">
                  <td className="text-gray-400 font-light">Marca</td>
                  <td className="font-semibold text-gray-800">{product.marca}</td>
                </tr>
                <tr className="border-b border-gray-100 py-2.5 flex justify-between">
                  <td className="text-gray-400 font-light">Volume</td>
                  <td className="font-semibold text-gray-800">{product.volume}</td>
                </tr>
                <tr className="border-b border-gray-100 py-2.5 flex justify-between">
                  <td className="text-gray-400 font-light">Categoria</td>
                  <td className="font-semibold text-gray-800">{product.categoria}</td>
                </tr>
                <tr className="border-b border-gray-100 py-2.5 flex justify-between">
                  <td className="text-gray-400 font-light">Concentração</td>
                  <td className="font-semibold text-gray-800">Eau de Parfum (EDP)</td>
                </tr>
                <tr className="py-2.5 flex justify-between">
                  <td className="text-gray-400 font-light">Autenticidade</td>
                  <td className="font-semibold text-emerald-600">Garantida (Selo de Importação)</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'envio' && (
            <div className="space-y-3">
              <p>📍 Entregas para a cidade de <span className="font-medium text-gray-800">São Paulo e região metropolitana</span> são despachadas via motoboy no mesmo dia ou dia útil seguinte.</p>
              <p>🚚 Para outras localidades e cidades, enviamos via Correios com seguro total de extravio.</p>
              <p>💬 Dúvidas sobre a fixação, notas olfativas de topo ou coração? Clique no botão do WhatsApp na barra inferior e fale imediatamente com um especialista.</p>
            </div>
          )}
        </div>
      </section>

      {/* Similar products showcase */}
      {similarProducts.length > 0 && (
        <section className="space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-blue-dark block">Aproveite Também</span>
            <h3 className="text-2xl font-light tracking-widest text-slate-800 uppercase">Produtos Semelhantes</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Floating Link Copied Toast notification */}
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-100 bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider py-3.5 px-6 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-800 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Link copiado para a área de transferência!</span>
        </div>
      )}
    </div>
  );
};
