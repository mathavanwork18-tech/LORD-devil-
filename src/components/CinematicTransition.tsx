// ═══════════════════════════════════════════════════════════════════════════
// LORD EVIL — CINEMATIC PAGE TRANSITION
// Short atmospheric transition between major sections.
// BLACK → FOG → CRIMSON LIGHT → SECTION TITLE → FADE OUT
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/soundEngine';

// Section display names
const SECTION_TITLES: Record<string, string> = {
  home: 'THE EMPIRE',
  missions: 'CURSED MISSIONS',
  services: 'DARK SERVICES',
  lair: 'THE LAIR',
  'command-center': 'COMMAND CENTER',
  intelligence: 'INTELLIGENCE',
  minions: 'MINIONS',
  team: 'THE INNER CIRCLE',
  profile: 'DOSSIER',
  achievements: 'DARK ACHIEVEMENTS',
  about: 'THE ARCHIVE',
  contact: 'CONTACT',
};

interface CinematicTransitionProps {
  currentRoute: string;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({ currentRoute }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'darken' | 'fog' | 'title' | 'reveal'>('idle');
  const [displayTitle, setDisplayTitle] = useState('');
  const prevRoute = useRef(currentRoute);
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip transition on initial render
    if (firstRender.current) {
      firstRender.current = false;
      prevRoute.current = currentRoute;
      return;
    }

    // Skip if same route
    if (prevRoute.current === currentRoute) return;
    prevRoute.current = currentRoute;

    // Start transition sequence
    setDisplayTitle(SECTION_TITLES[currentRoute] || currentRoute.toUpperCase());
    setIsTransitioning(true);

    // Play transition sound
    soundEngine.playTransition();

    // Phase 1: Darken (0-150ms)
    setPhase('darken');

    // Phase 2: Fog (150-350ms)
    const t1 = setTimeout(() => setPhase('fog'), 150);

    // Phase 3: Title (350-700ms)
    const t2 = setTimeout(() => setPhase('title'), 350);

    // Phase 4: Reveal (700-1000ms)
    const t3 = setTimeout(() => setPhase('reveal'), 700);

    // Phase 5: Done
    const t4 = setTimeout(() => {
      setPhase('idle');
      setIsTransitioning(false);
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentRoute]);

  if (!isTransitioning) return null;

  return (
    <div
      className="fixed inset-0 z-[55] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050505',
          opacity: phase === 'darken' ? 0.9
            : phase === 'fog' ? 0.85
            : phase === 'title' ? 0.8
            : phase === 'reveal' ? 0
            : 0,
          transition: phase === 'reveal' ? 'opacity 300ms ease-out' : 'opacity 150ms ease-in',
        }}
      />

      {/* Fog gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 60%, rgba(122,12,22,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 40%, rgba(20,15,30,0.3) 0%, transparent 70%)
          `,
          opacity: phase === 'fog' || phase === 'title' ? 1 : 0,
          transition: 'opacity 200ms ease',
          filter: 'blur(20px)',
        }}
      />

      {/* Crimson light pulse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(179,19,36,0.12) 0%, transparent 50%)',
          opacity: phase === 'title' ? 1 : 0,
          transition: 'opacity 150ms ease',
        }}
      />

      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: phase === 'title' ? 1 : 0,
          transition: phase === 'title' ? 'opacity 100ms ease-in' : 'opacity 200ms ease-out',
        }}
      >
        <h2
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#B31324',
            textShadow: '0 0 20px rgba(179,19,36,0.6), 0 0 40px rgba(122,12,22,0.3)',
          }}
        >
          {displayTitle}
        </h2>
      </div>

      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: phase === 'idle' || phase === 'reveal' ? 0 : 0.3,
          transition: 'opacity 200ms',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};
