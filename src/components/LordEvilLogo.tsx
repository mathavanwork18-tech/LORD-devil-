import React from 'react';

interface SigilProps {
  className?: string;
  size?: number;
  color?: string;
}

export const LordEvilSigil: React.FC<SigilProps> = ({
  className = '',
  size = 32,
  color = '#B31324',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-500 ${className}`}
    >
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="4 2"
        className="opacity-75"
      />
      <circle
        cx="50"
        cy="50"
        r="14"
        stroke={color}
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="50"
        r="4"
        fill={color}
      />
      {/* 8-pointed barbed arrows */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <g key={idx} transform={`rotate(${angle}, 50, 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="6"
            stroke={color}
            strokeWidth={idx % 2 === 0 ? '3' : '2'}
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <polygon
            points="50,2 45,14 50,11 55,14"
            fill={color}
          />
          {/* Barbs on main 4 axes */}
          {idx % 2 === 0 && (
            <>
              <line x1="44" y1="22" x2="56" y2="22" stroke={color} strokeWidth="2" />
              <line x1="46" y1="34" x2="54" y2="34" stroke={color} strokeWidth="1.5" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
};

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSigil?: boolean;
  className?: string;
}

export const LordEvilLogo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSigil = true,
  className = '',
}) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    hero: 'text-6xl sm:text-7xl lg:text-8xl',
  }[size];

  const sigilSize = {
    sm: 24,
    md: 32,
    lg: 48,
    hero: 72,
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {showSigil && (
        <div className="relative group">
          <LordEvilSigil
            size={sigilSize}
            color={isLight ? '#E7E0D2' : '#B31324'}
            className="filter drop-shadow-[0_0_8px_rgba(179,19,36,0.6)] group-hover:rotate-45"
          />
        </div>
      )}
      <div className="flex flex-col tracking-wider">
        <span
          className={`font-horror tracking-widest uppercase transition-all duration-300 ${sizeClasses} ${
            isLight
              ? 'text-[#E7E0D2] drop-shadow-[0_0_12px_rgba(179,19,36,0.7)]'
              : 'text-[#B31324] drop-shadow-[0_0_15px_rgba(179,19,36,0.8)]'
          }`}
          style={{ letterSpacing: '0.12em' }}
        >
          LORD EVIL
        </span>
        {size !== 'sm' && (
          <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-ash-grey -mt-1 font-semibold">
            THE EMPIRE
          </span>
        )}
      </div>
    </div>
  );
};
