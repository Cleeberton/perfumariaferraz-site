import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  theme?: 'default' | 'light' | 'gold';
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'w-32 h-32', 
  variant = 'full', 
  theme = 'default',
  color
}) => {
  // Cores harmonizadas da marca: Azul Tradicional Ferraz
  const isLight = theme === 'light';
  const primaryNavy = isLight ? '#FFFFFF' : '#2C5E8A';
  const accentGold = '#5B8FB9';
  const goldLight = '#DCEEFF';
  const goldDark = '#1E3F5E';

  const bottleStroke = color || primaryNavy;
  const goldStroke = color || accentGold;

  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          {/* Champagne Gold Gradient */}
          <linearGradient id="ferrazGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={goldLight} />
            <stop offset="50%" stopColor={accentGold} />
            <stop offset="100%" stopColor={goldDark} />
          </linearGradient>

          {/* Deep Midnight Navy Gradient */}
          <linearGradient id="ferrazNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#FFFFFF' : '#1A334E'} />
            <stop offset="100%" stopColor={isLight ? '#E2E8F0' : '#0F1E2E'} />
          </linearGradient>
        </defs>

        {/* Outer Circular Perfume Bottle */}
        <circle cx="150" cy="165" r="95" stroke={bottleStroke} strokeWidth="2.5" />
        <circle cx="150" cy="165" r="88" stroke="url(#ferrazGold)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
        
        {/* Bottle Neck / Spray Mechanism */}
        <rect x="135" y="60" width="30" height="10" stroke="url(#ferrazGold)" strokeWidth="2" fill={isLight ? '#0B1522' : 'white'} rx="1" />
        <rect x="140" y="52" width="20" height="8" stroke="url(#ferrazGold)" strokeWidth="1.5" fill={isLight ? '#0B1522' : 'white'} />
        
        {/* Diamond Cut Cap with Golden Brilliance */}
        <path
          d="M130 52 L142 30 L158 30 L170 52 Z"
          stroke="url(#ferrazGold)"
          strokeWidth="2.2"
          fill={isLight ? '#132338' : '#FAF9F6'}
          strokeLinejoin="round"
        />
        {/* Diamond facets */}
        <path d="M142 30 L150 52 L158 30" stroke="url(#ferrazGold)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M130 52 L150 52 L170 52" stroke="url(#ferrazGold)" strokeWidth="1.2" />
        <path d="M136 41 L164 41" stroke="url(#ferrazGold)" strokeWidth="1" opacity="0.8" />

        {/* Elegant Letter F in Midnight Navy / Solid Contrast */}
        {/* Stem of F */}
        <path d="M142 105 L158 105 M150 105 L150 220 M140 220 L165 220" stroke={bottleStroke} strokeWidth="4.5" strokeLinecap="round" />
        {/* Top Arm of F */}
        <path d="M150 105 C175 105 185 105 190 115" stroke={bottleStroke} strokeWidth="4" strokeLinecap="round" />
        {/* Middle Arm of F */}
        <path d="M150 155 L180 155" stroke={bottleStroke} strokeWidth="3" strokeLinecap="round" />
        
        {/* Delicate leaves on the left winding around F in pure Liquid Gold */}
        <path d="M125 185 C125 155 138 145 150 155" stroke="url(#ferrazGold)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Leaf 1 */}
        <path d="M125 185 C114 179 114 169 125 174 C130 179 128 185 125 185 Z" fill="url(#ferrazGold)" />
        {/* Leaf 2 */}
        <path d="M130 160 C117 151 117 138 130 147 C135 152 133 160 130 160 Z" fill="url(#ferrazGold)" />
        {/* Leaf 3 */}
        <path d="M141 142 C134 129 139 118 146 129 C148 134 145 142 141 142 Z" fill="url(#ferrazGold)" />
      </svg>
    );
  }

  // Full Logo with Harmonized Typography "PERFUMARIA FERRAZ"
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Icon portion */}
      <div className="w-full aspect-square max-w-[180px] flex items-center justify-center">
        <svg
          viewBox="0 0 300 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="ferrazGoldFull" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={goldLight} />
              <stop offset="50%" stopColor={accentGold} />
              <stop offset="100%" stopColor={goldDark} />
            </linearGradient>
          </defs>

          {/* Outer Circular Perfume Bottle */}
          <circle cx="150" cy="140" r="82" stroke={bottleStroke} strokeWidth="2.2" />
          <circle cx="150" cy="140" r="76" stroke="url(#ferrazGoldFull)" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
          
          {/* Bottle Neck / Spray Mechanism */}
          <rect x="137" y="50" width="26" height="8" stroke="url(#ferrazGoldFull)" strokeWidth="1.8" fill={isLight ? '#0B1522' : 'white'} rx="1" />
          <rect x="142" y="44" width="16" height="6" stroke="url(#ferrazGoldFull)" strokeWidth="1.2" fill={isLight ? '#0B1522' : 'white'} />
          
          {/* Diamond Cut Cap */}
          <path
            d="M132 44 L142 24 L158 24 L168 44 Z"
            stroke="url(#ferrazGoldFull)"
            strokeWidth="1.8"
            fill={isLight ? '#132338' : '#FAF9F6'}
            strokeLinejoin="round"
          />
          <path d="M142 24 L150 44 L158 24" stroke="url(#ferrazGoldFull)" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M132 44 L168 44" stroke="url(#ferrazGoldFull)" strokeWidth="1" />
          <path d="M137 34 L163 34" stroke="url(#ferrazGoldFull)" strokeWidth="0.8" opacity="0.7" />

          {/* Elegant Letter F */}
          <path d="M148 85 L156 85 M152 85 L152 185 M144 185 L162 185" stroke={bottleStroke} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M152 85 C172 85 180 85 184 94" stroke={bottleStroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M141 130 C155 130 162 130 178 130" stroke={bottleStroke} strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Delicate leaf vines in Liquid Gold */}
          <path d="M130 160 C128 135 138 126 150 132" stroke="url(#ferrazGoldFull)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M130 160 C122 156 122 148 130 152 C134 156 132 160 130 160 Z" fill="url(#ferrazGoldFull)" />
          <path d="M134 139 C124 132 124 122 134 128 C138 132 136 139 134 139 Z" fill="url(#ferrazGoldFull)" />
          <path d="M143 123 C138 113 142 105 147 113 C149 117 146 123 143 123 Z" fill="url(#ferrazGoldFull)" />
        </svg>
      </div>

      {/* Typography portion */}
      <div className="mt-2 w-full flex flex-col items-center">
        {/* Decorative Top Line of Header */}
        <div className="flex items-center justify-center w-full max-w-[240px]">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-[#C5A059] flex-1"></div>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] mx-2 shrink-0"></div>
          <span className="text-[10px] tracking-[0.38em] font-sans font-semibold uppercase text-[#C5A059] py-0.5">
            PERFUMARIA
          </span>
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A059] mx-2 shrink-0"></div>
          <div className="h-[1px] bg-gradient-to-l from-transparent via-[#C5A059]/50 to-[#C5A059] flex-1"></div>
        </div>

        {/* FERRAZ display text */}
        <h2 className={`text-3xl sm:text-4xl font-light tracking-[0.25em] ${isLight ? 'text-white' : 'text-slate-800'} uppercase font-serif mt-1`}>
          FERRAZ
        </h2>

        {/* Decorative Bottom Ornament */}
        <div className="flex items-center justify-center w-full max-w-[140px] mt-2 opacity-80">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]/70 flex-1"></div>
          {/* Stylized floral gold diamond element */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 mx-2 text-[#C5A059]">
            <path d="M12 2C12 2 10 7 10 9C10 10.1 10.9 11 12 11C13.1 11 14 10.1 14 9C14 7 12 2 12 2Z" />
            <path d="M12 22C12 22 10 17 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 17 12 22 12 22Z" />
            <path d="M2 12C2 12 7 10 9 10C10.1 10 11 10.9 11 12C11 13.1 10.1 14 9 14C7 14 2 12 2 12Z" />
            <path d="M22 12C22 12 17 10 15 10C13.9 10 13 10.9 13 12C13 13.1 13.9 14 15 14C17 14 22 12 22 12Z" />
          </svg>
          <div className="h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]/70 flex-1"></div>
        </div>
      </div>
    </div>
  );
};
