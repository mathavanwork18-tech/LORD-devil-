import React from 'react';

export interface SigilProps {
  className?: string;
  size?: number;
  color?: string;
  animated?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  faintRing?: boolean;
}

export const LordEvilSigil: React.FC<SigilProps> = ({
  className = '',
  size = 32,
  color = '#ff001e',
  animated = true,
  speed = 'normal',
  faintRing = false,
}) => {
  const spinClass = animated
    ? speed === 'fast'
      ? 'animate-sigil-spin-fast'
      : speed === 'slow'
      ? 'animate-sigil-spin [animation-duration:36s]'
      : 'animate-sigil-spin'
    : '';

  const reverseSpinClass = animated ? 'animate-sigil-spin-reverse' : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Faint rotating occult halo ring behind the sigil */}
      {faintRing && (
        <>
          <div
            className="absolute rounded-full border border-[#ff001e]/35 border-dashed animate-occult-ring pointer-events-none"
            style={{
              width: size * 1.35,
              height: size * 1.35,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="absolute rounded-full bg-[#ff001e]/15 blur-sm animate-sigil-pulse pointer-events-none"
            style={{
              width: size * 1.1,
              height: size * 1.1,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Outer dashed occult ring (counter-rotates) */}
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="5 3"
          className={`opacity-80 transition-opacity duration-300 ${reverseSpinClass}`}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Concentric protective ring */}
        <circle
          cx="50"
          cy="50"
          r="16"
          stroke={color}
          strokeWidth="2"
          className="opacity-75"
        />

        {/* 8-pointed barbed arrows (chaos cross - rotates smoothly) */}
        <g
          className={`transition-transform duration-500 ${spinClass}`}
          style={{ transformOrigin: '50px 50px' }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle}, 50, 50)`}>
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke={color}
                strokeWidth={idx % 2 === 0 ? '3' : '2'}
                strokeLinecap="round"
              />
              {/* Barb Arrowhead */}
              <polygon
                points="50,1 44,14 50,11 56,14"
                fill={color}
              />
              {/* Barbs on primary 4 cardinal axes */}
              {idx % 2 === 0 && (
                <>
                  <line x1="43" y1="23" x2="57" y2="23" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="45" y1="35" x2="55" y2="35" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </g>
          ))}
        </g>

        {/* Central demonic void pupil / core (pulses) */}
        <circle
          cx="50"
          cy="50"
          r="4.5"
          fill={color}
          className={animated ? 'animate-pulse' : ''}
        />
      </svg>
    </div>
  );
};

export interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSigil?: boolean;
  className?: string;
  animated?: boolean;
  faintRing?: boolean;
}

export const LordEvilLogo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSigil = true,
  className = '',
  animated = true,
  faintRing = true,
}) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    hero: 'text-6xl sm:text-7xl lg:text-8xl',
  }[size];

  const sigilSize = {
    sm: 26,
    md: 36,
    lg: 52,
    hero: 76,
  }[size];

  const logoColor = isLight ? '#E7E0D2' : '#ff001e';

  return (
    <div
      className={`group/lordlogo inline-flex items-center gap-3 select-none cursor-pointer transition-transform duration-300 ${className}`}
    >
      {showSigil && (
        <div className="relative shrink-0 flex items-center justify-center p-1">
          <LordEvilSigil
            size={sigilSize}
            color={logoColor}
            animated={animated}
            faintRing={faintRing}
            className="filter drop-shadow-[0_0_8px_rgba(255,0,30,0.6)] group-hover/lordlogo:drop-shadow-[0_0_20px_rgba(255,0,30,0.95)] transition-all duration-500 group-hover/lordlogo:scale-110"
          />
        </div>
      )}
      <div className="flex flex-col tracking-wider">
        <span
          className={`font-horror tracking-widest uppercase transition-all duration-300 ${sizeClasses} ${
            isLight
              ? 'text-[#E7E0D2] drop-shadow-[0_0_12px_rgba(255,0,30,0.7)] group-hover/lordlogo:text-[#ffffff] group-hover/lordlogo:drop-shadow-[0_0_22px_rgba(255,0,30,0.95)]'
              : 'text-[#ff001e] drop-shadow-[0_0_14px_rgba(255,0,30,0.8)] group-hover/lordlogo:text-[#ff334b] group-hover/lordlogo:drop-shadow-[0_0_25px_rgba(255,0,30,1)]'
          }`}
          style={{ letterSpacing: '0.12em' }}
        >
          LORD EVIL
        </span>
        {size !== 'sm' && (
          <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-ash-grey -mt-1 font-semibold transition-colors duration-300 group-hover/lordlogo:text-[#E7E0D2]">
            THE EMPIRE
          </span>
        )}
      </div>
    </div>
  );
};
