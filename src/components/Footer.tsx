import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Facebook, MapPin, Clock, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { config } = useApp();

  return (
    <footer className="bg-[#0B1522] text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Brand Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo variant="icon" theme="light" className="w-10 h-10" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] uppercase tracking-[0.35em] font-sans font-semibold text-[#C5A059]">
                  PERFUMARIA
                </span>
                <span className="text-xl font-light tracking-[0.2em] text-white uppercase font-serif mt-0.5">
                  FERRAZ
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Sua perfumaria premium especializada em fragrâncias exclusivas, importados selecionados, fragrâncias árabes autênticas e criações consagradas da Brand Collection. O luxo sensorial de frasco em frasco.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-white/10 transition-all shadow-xs"
                aria-label="WhatsApp"
              >
                <Phone size={15} />
              </a>
              <a
                href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-white/10 transition-all shadow-xs"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href={`https://facebook.com/${config.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-white/10 transition-all shadow-xs"
                aria-label="Facebook"
              >
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-light text-sm text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Coleções
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider">
              {['Masculino', 'Feminino', 'Importados', 'Árabes', 'Brand Collection', 'Promoções'].map((cat) => {
                const queryParam = (cat === 'Masculino' || cat === 'Feminino' || cat === 'Unissex')
                  ? `tipo=${encodeURIComponent(cat)}`
                  : `category=${encodeURIComponent(cat)}`;
                return (
                  <li key={cat}>
                    <Link
                      to={`/catalogo?${queryParam}`}
                      className="text-stone-400 hover:text-[#C5A059] transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Fast Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif font-light text-sm text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider">
              <li>
                <Link to="/" className="text-stone-400 hover:text-[#C5A059] transition-colors">Página Inicial</Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-stone-400 hover:text-[#C5A059] transition-colors">Catálogo Completo</Link>
              </li>
              <li>
                <Link to="/perfume-match" className="text-stone-400 hover:text-[#C5A059] transition-colors">✨ Perfume Match</Link>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-stone-400 hover:text-[#C5A059] transition-colors"
                >
                  Consultoria via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and Service */}
          <div className="space-y-4">
            <h4 className="font-serif font-light text-sm text-white uppercase tracking-widest border-b border-white/10 pb-2">
              Atendimento
            </h4>
            <ul className="space-y-3.5 text-xs text-stone-400">
              <li className="flex items-start">
                <MapPin size={15} className="mr-2 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="font-light">Guaraci - SP e Região</span>
              </li>
              <li className="flex items-center">
                <Clock size={15} className="mr-2 text-[#C5A059] shrink-0" />
                <span>{config.horarioAtendimento}</span>
              </li>
              <li className="flex items-center">
                <Mail size={15} className="mr-2 text-[#C5A059] shrink-0" />
                <span className="font-light">contato@perfumariaferraz.com.br</span>
              </li>
              <li className="flex items-center pt-2">
                <ShieldCheck size={16} className="mr-2 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-semibold">Compra 100% Segura & Garantida</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright / Info black bar */}
      <div className="h-14 bg-[#070E16] text-stone-400 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 text-[10px] uppercase tracking-[0.2em] font-medium border-t border-white/5 gap-2">
        <span>&copy; {new Date().getFullYear()} {config.nomeLoja.toUpperCase()}. TODOS OS DIREITOS RESERVADOS.</span>
        <span className="text-[#C5A059] font-serif tracking-widest">ALTA PERFUMARIA & AUTENTICIDADE</span>
      </div>
    </footer>
  );
};
