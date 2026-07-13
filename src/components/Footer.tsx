import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Facebook, MapPin, Clock, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { config } = useApp();

  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Brand Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo variant="icon" className="w-8 h-8" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] uppercase tracking-[0.3em] font-sans font-light text-slate-400">PERFUMARIA</span>
                <span className="text-sm font-light tracking-[0.18em] text-slate-800 uppercase font-serif mt-0.5">FERRAZ</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Sua perfumaria premium especializada em fragrâncias exclusivas, importados selecionados, fragrâncias árabes autênticas e marcas selecionadas da Brand Collection. Conectando você ao luxo sensorial de frasco em frasco.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-brand-blue-dark hover:bg-brand-blue/20 transition-all shadow-xs"
                aria-label="WhatsApp"
              >
                <Phone size={14} />
              </a>
              <a
                href={`https://instagram.com/${config.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-rose-100 transition-all shadow-xs"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href={`https://facebook.com/${config.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-xs"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-widest">Categorias</h4>
            <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider">
              {['Masculino', 'Feminino', 'Importados', 'Árabes', 'Brand Collection', 'Promoções'].map((cat) => {
                const queryParam = (cat === 'Masculino' || cat === 'Feminino' || cat === 'Unissex')
                  ? `tipo=${encodeURIComponent(cat)}`
                  : `category=${encodeURIComponent(cat)}`;
                return (
                  <li key={cat}>
                    <Link
                      to={`/catalogo?${queryParam}`}
                      className="text-slate-500 hover:text-slate-900 transition-colors"
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
            <h4 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-widest">Links Úteis</h4>
            <ul className="space-y-2.5 text-xs font-mono uppercase tracking-wider">
              <li>
                <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">Página Inicial</Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-slate-500 hover:text-slate-900 transition-colors">Catálogo</Link>
              </li>
              <li>
                <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">Fale Conosco</a>
              </li>
            </ul>
          </div>

          {/* Contact and Service */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-widest">Atendimento</h4>
            <ul className="space-y-3.5 text-xs text-slate-500 font-mono uppercase tracking-wider">
              <li className="flex items-start">
                <MapPin size={14} className="mr-2 text-brand-blue-dark shrink-0 mt-0.5" />
                <span className="normal-case font-sans font-light">Guaraci - SP</span>
              </li>
              <li className="flex items-center">
                <Clock size={14} className="mr-2 text-brand-blue-dark shrink-0" />
                <span>{config.horarioAtendimento}</span>
              </li>
              <li className="flex items-center">
                <Mail size={14} className="mr-2 text-brand-blue-dark shrink-0" />
                <span className="lowercase font-sans font-light">contato@perfumariaferraz.com.br</span>
              </li>
              <li className="flex items-center">
                <ShieldCheck size={14} className="mr-2 text-emerald-500 shrink-0" />
                <span className="text-emerald-700 font-bold">Compra 100% Segura</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright / Info black bar */}
      <div className="h-12 bg-slate-900 text-white flex items-center justify-between px-8 text-[9px] uppercase tracking-[0.2em] font-medium mt-8">
        <span>&copy; {new Date().getFullYear()} {config.nomeLoja.toUpperCase()}. TODOS OS DIREITOS RESERVADOS.</span>
        <span className="hidden sm:inline text-brand-blue">CRAFTED WITH GEOMETRIC BALANCE</span>
      </div>
    </footer>
  );
};
