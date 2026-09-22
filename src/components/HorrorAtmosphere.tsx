import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

interface FlyerEntity {
  id: number;
  type: 'kid' | 'winged';
  startY: number; // percentage
  endY: number;
  duration: number; // seconds
  delay: number;
  scale: number;
  opacity: number;
  direction: 1 | -1; // 1 = left to right, -1 = right to left
}

const FLYERS_CONFIG: FlyerEntity[] = [
  // Flying Ghostly Kids floating across sky
  { id: 1, type: 'kid', startY: 18, endY: 26, duration: 22, delay: 0, scale: 0.95, opacity: 0.85, direction: 1 },
  { id: 2, type: 'kid', startY: 32, endY: 22, duration: 28, delay: 8, scale: 0.7, opacity: 0.65, direction: -1 },
  { id: 3, type: 'kid', startY: 12, endY: 38, duration: 25, delay: 15, scale: 0.85, opacity: 0.75, direction: 1 },
  
  // Winged Shadow Bats / Gargoyles swooping
  { id: 4, type: 'winged', startY: 28, endY: 16, duration: 14, delay: 2, scale: 1.1, opacity: 0.9, direction: 1 },
  { id: 5, type: 'winged', startY: 14, endY: 30, duration: 16, delay: 7, scale: 0.8, opacity: 0.7, direction: -1 },
  { id: 6, type: 'winged', startY: 42, endY: 25, duration: 12, delay: 12, scale: 1.0, opacity: 0.85, direction: 1 },
  { id: 7, type: 'winged', startY: 8, endY: 20, duration: 19, delay: 18, scale: 0.6, opacity: 0.5, direction: -1 },
];

export const HorrorAtmosphere: React.FC = () => {
  const { currentTheme } = useGame();
  const [fogActive] = useState<boolean>(true);
  const [flyersActive] = useState<boolean>(true);

  const themeGradients = {
    blood: 'radial-gradient(circle at 50% 40%, rgba(255,0,30,0.14) 0%, rgba(3,2,7,0.88) 70%)',
    void: 'radial-gradient(circle at 50% 40%, rgba(168,85,247,0.16) 0%, rgba(6,3,15,0.88) 70%)',
    crypt: 'radial-gradient(circle at 50% 40%, rgba(52,211,153,0.15) 0%, rgba(2,10,6,0.88) 70%)',
    noir: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.14) 0%, rgba(5,5,5,0.92) 70%)',
  };

  const currentAura = themeGradients[currentTheme] || themeGradients.blood;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Cinematic Vignette overlay */}
      <div className="vignette" />
      {/* Film Grain overlay */}
      <div className="film-grain" />

      {/* 1. MASTER HORROR WEBSITE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-cover bg-center bg-no-repeat transform-gpu"
          style={{
            backgroundImage: `url('/assets/horror/backgrounds/lord-evil-master-bg.jpg')`,
            backgroundAttachment: 'fixed',
          }}
        />

        {/* Cinematic Darkness Vignette & Dynamic Theme Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030207]/85 via-[#030207]/75 to-[#030207]/95" />
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{ background: currentAura }}
        />
        <div className="absolute inset-0 scanlines opacity-40 mix-blend-overlay" />
      </div>

      {/* 2. LAYERED ROLLING FOG EFFECT */}
      {fogActive && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Deep Volumetric Fog Layer (Slow drift) */}
          <div
            className="absolute inset-x-[-50%] top-0 h-full opacity-35 animate-fog-slow transform-gpu"
            style={{
              backgroundImage: `radial-gradient(ellipse 60% 40% at 30% 60%, rgba(122,12,22,0.3) 0%, transparent 70%),
                                radial-gradient(ellipse 80% 50% at 75% 45%, rgba(60,10,70,0.35) 0%, transparent 75%)`,
              filter: 'blur(30px)',
            }}
          />

          {/* Rolling Mid-Atmosphere Fog Waves */}
          <div
            className="absolute inset-x-[-40%] top-1/4 h-3/4 opacity-40 animate-fog-fast transform-gpu"
            style={{
              backgroundImage: `radial-gradient(ellipse 70% 35% at 50% 50%, rgba(20,15,30,0.65) 0%, transparent 80%),
                                radial-gradient(ellipse 90% 40% at 20% 70%, rgba(179,19,36,0.2) 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />

          {/* Creeping Ground & Screen Mist */}
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#030207] via-[#030207]/70 to-transparent opacity-80" />
        </div>
      )}

      {/* 3. FLYING APPARITIONS: FLYING GHOST KIDS & WINGED CREATURES */}
      {flyersActive && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {FLYERS_CONFIG.map((flyer) => (
            <FlyerItem key={flyer.id} flyer={flyer} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- INDIVIDUAL FLYER COMPONENT WITH PERFECT CINEMATIC TRAJECTORY ---
const FlyerItem: React.FC<{ flyer: FlyerEntity }> = ({ flyer }) => {
  const isLeftToRight = flyer.direction === 1;
  const startX = isLeftToRight ? '-15vw' : '115vw';
  const endX = isLeftToRight ? '115vw' : '-15vw';

  // Realistic undulating wave trajectory
  const yKeyframes = [
    `${flyer.startY}vh`,
    `${flyer.startY - 6}vh`,
    `${flyer.endY + 4}vh`,
    `${flyer.startY + 2}vh`,
    `${flyer.endY}vh`,
  ];

  return (
    <motion.div
      initial={{ x: startX, y: `${flyer.startY}vh`, opacity: 0 }}
      animate={{
        x: [startX, endX],
        y: yKeyframes,
        opacity: [0, flyer.opacity, flyer.opacity, flyer.opacity, 0],
      }}
      transition={{
        duration: flyer.duration,
        repeat: Infinity,
        delay: flyer.delay,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        transform: `scale(${flyer.scale}) ${!isLeftToRight ? 'scaleX(-1)' : ''}`,
        zIndex: flyer.scale > 0.9 ? 25 : 15,
      }}
      className="pointer-events-none transform-gpu"
    >
      {flyer.type === 'kid' ? (
        <GhostKidSilhouette />
      ) : (
        <WingedHorrorSilhouette />
      )}
    </motion.div>
  );
};

// --- GHOSTLY FLYING KID SILHOUETTE ---
const GhostKidSilhouette: React.FC = () => {
  return (
    <div className="relative w-16 h-24 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(179,19,36,0.5)]">
      {/* Floating Body and Rags */}
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full fill-[#07050b]/90 stroke-void-crimson/40 stroke-[1.5]"
      >
        {/* Child Silhouette with Floating Tattered Dress/Cloak */}
        <path d="M 50,15 C 43,15 38,21 38,28 C 38,36 43,41 50,41 C 57,41 62,36 62,28 C 62,21 57,15 50,15 Z" />
        {/* Floating Wisps of Hair */}
        <path
          d="M 40,24 Q 25,28 15,22 M 60,24 Q 75,28 85,22"
          fill="none"
          stroke="rgba(179,19,36,0.6)"
          strokeWidth="2"
        />
        {/* Slender Arms outstretched as if floating/flying */}
        <path
          d="M 45,45 Q 20,55 10,70 M 55,45 Q 80,55 90,70"
          fill="none"
          stroke="rgba(7,5,11,0.9)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Flowing tattered gown trailing in flight */}
        <path
          d="M 42,44 C 35,65 30,95 20,130 Q 35,115 45,135 Q 52,110 60,135 Q 70,118 80,130 C 70,95 65,65 58,44 Z"
          fill="rgba(8,6,14,0.95)"
        />
        {/* Piercing Glowing Red Ghost Eyes */}
        <circle cx="46" cy="27" r="1.8" fill="#FF1744" className="animate-pulse" />
        <circle cx="54" cy="27" r="1.8" fill="#FF1744" className="animate-pulse" />
      </svg>

      {/* Ghostly spectral aura smoke trailing behind */}
      <div className="absolute -bottom-4 inset-x-2 h-8 bg-gradient-to-b from-void-crimson/20 to-transparent blur-md pointer-events-none" />
    </div>
  );
};

// --- WINGED HORROR SILHOUETTE (BAT / GARGOYLE) WITH FLAPPING ANIMATION ---
const WingedHorrorSilhouette: React.FC = () => {
  return (
    <div className="relative w-20 h-14 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(179,19,36,0.6)]">
      <div className="relative flex items-center justify-center">
        {/* Left Wing with Realistic Flap Animation */}
        <div className="animate-wing-left origin-right">
          <svg viewBox="0 0 50 35" className="w-10 h-7 fill-[#0a0710] stroke-void-crimson/50 stroke-1">
            <path d="M 48,22 Q 35,5 18,2 C 12,8 5,18 2,24 Q 16,22 26,27 Q 36,25 48,22 Z" />
          </svg>
        </div>

        {/* Central Demon/Bat Torso */}
        <div className="relative z-10 -mx-1 flex flex-col items-center">
          <div className="w-3.5 h-6 bg-[#08050e] rounded-full border border-void-crimson/40 flex items-center justify-center">
            {/* Glowing red optical points */}
            <div className="w-1 h-1 bg-void-crimson rounded-full shadow-[0_0_6px_#FF1744] -mt-1" />
          </div>
        </div>

        {/* Right Wing with Realistic Flap Animation */}
        <div className="animate-wing-right origin-left">
          <svg viewBox="0 0 50 35" className="w-10 h-7 fill-[#0a0710] stroke-void-crimson/50 stroke-1">
            <path d="M 2,22 Q 15,5 32,2 C 38,8 45,18 48,24 Q 34,22 24,27 Q 14,25 2,22 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
