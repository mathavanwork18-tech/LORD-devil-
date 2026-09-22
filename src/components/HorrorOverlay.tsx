// ═══════════════════════════════════════════════════════════════════════════
// LORD EVIL — HORROR OVERLAY
// Renders all visual horror effects as fixed overlays.
// Subscribes to HorrorEventManager for random atmospheric events.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { horrorEventManager, HorrorEvent, HorrorEventType } from '../utils/horrorEventManager';

// ─── Occult symbols for glitch/symbol events ─────────────────────────────
const OCCULT_SYMBOLS = ['⊕', '⌬', '◈', '⊗', '⌖', '◎', '⊙', '⟐', '⊛', '⬡', '☽', '⛧', '⍟', '☠'];
const ANCIENT_TEXTS = [
  'TENEBRIS DOMINABIT',
  'IN UMBRA VERITAS',
  'SANGUIS IMPERIUM',
  'VOX MORTIS',
  'NOCTIS AETERNA',
  'REGNUM MALUM',
  'DOMINUS MALEFICUS',
];

export const HorrorOverlay: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<HorrorEvent | null>(null);
  const [shakeClass, setShakeClass] = useState('');
  const randomsRef = useRef({
    symbolIndex: 0,
    textIndex: 0,
    eyeX: 50,
    eyeY: 40,
    shadowDir: 1,
    glitchOffset: 0,
  });

  // Subscribe to horror event manager
  useEffect(() => {
    const unsubscribe = horrorEventManager.subscribe((event) => {
      setActiveEvent(event);

      // Randomize values for each new event
      if (event) {
        randomsRef.current = {
          symbolIndex: Math.floor(Math.random() * OCCULT_SYMBOLS.length),
          textIndex: Math.floor(Math.random() * ANCIENT_TEXTS.length),
          eyeX: 20 + Math.random() * 60,
          eyeY: 20 + Math.random() * 50,
          shadowDir: Math.random() > 0.5 ? 1 : -1,
          glitchOffset: 2 + Math.random() * 6,
        };
      }

      // Camera shake for specific events
      if (event?.type === 'jumpScare') {
        setShakeClass('horror-camera-shake-violent');
        setTimeout(() => setShakeClass(''), 1900);
      } else if (event?.type === 'shadowPass') {
        setShakeClass('horror-camera-shake');
        setTimeout(() => setShakeClass(''), 300);
      }
    });

    return unsubscribe;
  }, []);

  const r = randomsRef.current;

  if (!activeEvent) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[60] overflow-hidden ${shakeClass}`}
      aria-hidden="true"
    >
      {/* ── FOG SURGE ──────────────────────────────────────────────────── */}
      {activeEvent.type === 'fogSurge' && (
        <div
          className="absolute inset-0 animate-horror-fade-in-out"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 70%, rgba(122,12,22,0.2) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 30% 50%, rgba(20,15,30,0.4) 0%, transparent 70%)
            `,
            filter: 'blur(30px)',
            animationDuration: `${activeEvent.duration}ms`,
          }}
        />
      )}

      {/* ── SHADOW PASS ────────────────────────────────────────────────── */}
      {activeEvent.type === 'shadowPass' && (
        <>
          {/* Screen darken */}
          <div
            className="absolute inset-0 animate-horror-flash"
            style={{
              background: 'rgba(5,5,5,0.6)',
              animationDuration: `${activeEvent.duration}ms`,
            }}
          />
          {/* Shadow silhouette crossing */}
          <div
            className="absolute top-[10%] h-[80%] w-[30%]"
            style={{
              background: 'radial-gradient(ellipse, rgba(5,5,5,0.9) 30%, transparent 70%)',
              filter: 'blur(20px)',
              animation: `horror-shadow-cross ${activeEvent.duration}ms ease-in-out forwards`,
              animationDirection: r.shadowDir === 1 ? 'normal' : 'reverse',
            }}
          />
          {/* Crimson flash at midpoint */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(179,19,36,0.15) 0%, transparent 60%)',
              animation: `horror-crimson-pulse ${activeEvent.duration * 0.5}ms ease-out ${activeEvent.duration * 0.3}ms forwards`,
              opacity: 0,
            }}
          />
        </>
      )}

      {/* ── RED FLICKER ────────────────────────────────────────────────── */}
      {activeEvent.type === 'redFlicker' && (
        <div
          className="absolute inset-0 animate-horror-flicker"
          style={{
            background: 'rgba(179,19,36,0.08)',
            mixBlendMode: 'screen',
            animationDuration: `${activeEvent.duration}ms`,
          }}
        />
      )}

      {/* ── SCREEN GLITCH ──────────────────────────────────────────────── */}
      {activeEvent.type === 'screenGlitch' && (
        <>
          {/* Horizontal glitch slices */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-full"
              style={{
                top: `${15 + i * 16}%`,
                height: '3px',
                background: `linear-gradient(90deg, transparent ${20 + i * 10}%, rgba(179,19,36,0.4) ${40 + i * 5}%, transparent ${60 + i * 8}%)`,
                transform: `translateX(${(i % 2 === 0 ? 1 : -1) * r.glitchOffset}px)`,
                animation: `horror-glitch-slice ${80 + i * 20}ms linear ${i * 40}ms infinite alternate`,
                opacity: 0.7,
              }}
            />
          ))}
          {/* Chromatic aberration overlay */}
          <div
            className="absolute inset-0 animate-horror-flash"
            style={{
              background: 'rgba(179,19,36,0.04)',
              mixBlendMode: 'difference',
              animationDuration: `${activeEvent.duration}ms`,
            }}
          />
          {/* Random symbol flash */}
          <div
            className="absolute animate-horror-flash"
            style={{
              top: `${20 + Math.random() * 50}%`,
              left: `${20 + Math.random() * 50}%`,
              fontSize: '24px',
              color: 'rgba(179,19,36,0.6)',
              fontFamily: 'monospace',
              textShadow: '0 0 10px rgba(179,19,36,0.8)',
              animationDuration: '200ms',
            }}
          >
            {OCCULT_SYMBOLS[r.symbolIndex]}
          </div>
        </>
      )}

      {/* ── MYSTERIOUS SYMBOL ──────────────────────────────────────────── */}
      {activeEvent.type === 'mysteriousSymbol' && (
        <div
          className="absolute inset-0 flex items-center justify-center animate-horror-fade-in-out"
          style={{ animationDuration: `${activeEvent.duration}ms` }}
        >
          <div
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              color: 'rgba(179,19,36,0.25)',
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(179,19,36,0.3), 0 0 60px rgba(122,12,22,0.2)',
              filter: 'blur(1px)',
            }}
          >
            {OCCULT_SYMBOLS[(r.symbolIndex + 3) % OCCULT_SYMBOLS.length]}
          </div>
        </div>
      )}

      {/* ── EYE APPEARANCE ─────────────────────────────────────────────── */}
      {activeEvent.type === 'eyeAppearance' && (
        <div
          className="absolute animate-horror-fade-in-out"
          style={{
            left: `${r.eyeX}%`,
            top: `${r.eyeY}%`,
            transform: 'translate(-50%, -50%)',
            animationDuration: `${activeEvent.duration}ms`,
          }}
        >
          <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
            {/* Eye shape */}
            <ellipse
              cx="40" cy="25" rx="35" ry="18"
              stroke="rgba(179,19,36,0.4)"
              strokeWidth="1.5"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(179,19,36,0.5))' }}
            />
            {/* Iris */}
            <circle
              cx="40" cy="25" r="10"
              stroke="rgba(179,19,36,0.5)"
              strokeWidth="1"
              fill="rgba(122,12,22,0.2)"
            />
            {/* Pupil */}
            <circle
              cx="40" cy="25" r="4"
              fill="rgba(179,19,36,0.6)"
              style={{ filter: 'drop-shadow(0 0 8px rgba(179,19,36,0.8))' }}
            />
          </svg>
        </div>
      )}

      {/* ── SHADOW FIGURE ──────────────────────────────────────────────── */}
      {activeEvent.type === 'shadowFigure' && (
        <div
          className="absolute top-[5%] h-[85%]"
          style={{
            width: '8%',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(5,5,5,0.85) 20%, rgba(5,5,5,0.4) 50%, transparent 80%)',
            filter: 'blur(8px)',
            animation: `horror-shadow-cross ${activeEvent.duration}ms ease-in-out forwards`,
            animationDirection: r.shadowDir === 1 ? 'normal' : 'reverse',
          }}
        >
          {/* Head shape */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              paddingBottom: '60%',
              borderRadius: '50%',
              background: 'rgba(5,5,5,0.9)',
              filter: 'blur(3px)',
            }}
          />
          {/* Faint red eyes */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '35%',
              width: '4px',
              height: '2px',
              borderRadius: '50%',
              background: 'rgba(179,19,36,0.5)',
              boxShadow: '0 0 6px rgba(179,19,36,0.5)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '55%',
              width: '4px',
              height: '2px',
              borderRadius: '50%',
              background: 'rgba(179,19,36,0.5)',
              boxShadow: '0 0 6px rgba(179,19,36,0.5)',
            }}
          />
        </div>
      )}

      {/* ── PORTAL PULSE ───────────────────────────────────────────────── */}
      {activeEvent.type === 'portalPulse' && (
        <div
          className="absolute inset-0 flex items-center justify-center animate-horror-fade-in-out"
          style={{ animationDuration: `${activeEvent.duration}ms` }}
        >
          <div
            style={{
              width: 'clamp(100px, 20vw, 200px)',
              height: 'clamp(100px, 20vw, 200px)',
              borderRadius: '50%',
              border: '2px solid rgba(179,19,36,0.3)',
              boxShadow: `
                0 0 30px rgba(179,19,36,0.2),
                0 0 60px rgba(122,12,22,0.15),
                inset 0 0 30px rgba(179,19,36,0.1)
              `,
              animation: 'horror-portal-spin 2s linear infinite',
            }}
          />
        </div>
      )}

      {/* ── SUDDEN SILENCE ─────────────────────────────────────────────── */}
      {activeEvent.type === 'suddenSilence' && (
        <div
          className="absolute inset-0 animate-horror-fade-in-out"
          style={{
            background: 'rgba(5,5,5,0.3)',
            animationDuration: `${activeEvent.duration}ms`,
          }}
        />
      )}

      {/* ── ANCIENT TEXT ───────────────────────────────────────────────── */}
      {activeEvent.type === 'ancientText' && (
        <div
          className="absolute inset-0 flex items-center justify-center animate-horror-fade-in-out"
          style={{ animationDuration: `${activeEvent.duration}ms` }}
        >
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(179,19,36,0.2)',
              textShadow: '0 0 15px rgba(179,19,36,0.3)',
              filter: 'blur(0.5px)',
            }}
          >
            {ANCIENT_TEXTS[r.textIndex]}
          </div>
        </div>
      )}

      {/* ── JUMP SCARE ─────────────────────────────────────────────────── */}
      {activeEvent.type === 'jumpScare' && (
        <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
          {/* Phase 1: Sudden black void backdrop */}
          <div className="absolute inset-0 bg-[#030105]/95 animate-horror-flash" />

          {/* Phase 2: Strobe invert overlay */}
          <div className="absolute inset-0 animate-horror-strobe pointer-events-none z-30" />

          {/* Phase 3: Screaming Reaper Demon lunging into camera */}
          <div className="relative w-full h-full flex items-center justify-center horror-jumpscare-leap z-20">
            <img
              src="/assets/horror/entities/reaper_demon.jpg"
              alt="Grim Lord Jump Scare"
              className="max-w-[120vw] max-h-[120vh] w-auto h-auto object-contain filter drop-shadow-[0_0_80px_#ff001e]"
            />

            {/* Glowing demonic eye flares */}
            <div className="absolute top-[28%] left-[47%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] blur-md animate-reaper-eyes mix-blend-screen" />
            <div className="absolute top-[29%] left-[53%] w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] blur-md animate-reaper-eyes mix-blend-screen" />

            {/* Bloody claw slash overlays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[85vw] h-1.5 bg-gradient-to-r from-transparent via-[#ff001e] to-transparent animate-claw-slash-1 shadow-[0_0_25px_#ff001e]" />
              <div className="w-[85vw] h-1.5 bg-gradient-to-r from-transparent via-[#ff001e] to-transparent animate-claw-slash-2 shadow-[0_0_25px_#ff001e]" />
            </div>
          </div>

          {/* Phase 4: Crimson blood edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(179,19,36,0.6) 80%, rgba(5,5,5,0.95) 100%)',
            }}
          />
        </div>
      )}

      {/* ── GLOBAL KEYFRAMES ───────────────────────────────────────────── */}
      <style>{`
        .horror-camera-shake {
          animation: horror-shake 300ms ease-out;
        }

        @keyframes horror-shake {
          0% { transform: translate(0, 0); }
          15% { transform: translate(-3px, 2px); }
          30% { transform: translate(3px, -2px); }
          45% { transform: translate(-2px, -1px); }
          60% { transform: translate(2px, 1px); }
          75% { transform: translate(-1px, 1px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes horror-shadow-cross {
          0% { left: -30%; opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { left: 130%; opacity: 0; }
        }

        @keyframes horror-crimson-pulse {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-horror-fade-in-out {
          animation: horror-fade-in-out 2s ease-in-out forwards;
        }

        @keyframes horror-fade-in-out {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-horror-flash {
          animation: horror-flash-once 300ms ease-out forwards;
        }

        @keyframes horror-flash-once {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-horror-flicker {
          animation: horror-flicker 300ms steps(4) infinite;
        }

        @keyframes horror-flicker {
          0% { opacity: 0; }
          25% { opacity: 0.6; }
          50% { opacity: 0.1; }
          75% { opacity: 0.8; }
          100% { opacity: 0; }
        }

        @keyframes horror-glitch-slice {
          0% { transform: translateX(-4px); }
          100% { transform: translateX(4px); }
        }

        @keyframes horror-portal-spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1); }
        }

        @keyframes horror-jumpscare-dark {
          0% { opacity: 0; }
          30% { opacity: 0.9; }
          55% { opacity: 0.85; }
          70% { opacity: 0.3; }
          100% { opacity: 0; }
        }

        @keyframes horror-jumpscare-entity {
          0% { opacity: 0; transform: scale(0.5); }
          35% { opacity: 0; transform: scale(0.5); }
          45% { opacity: 1; transform: scale(1.1); }
          55% { opacity: 1; transform: scale(1); }
          65% { opacity: 0; transform: scale(1.2); }
          100% { opacity: 0; }
        }

        @keyframes horror-jumpscare-flash {
          0% { opacity: 0; background: transparent; }
          48% { opacity: 0; background: transparent; }
          52% { opacity: 0.5; background: rgba(179,19,36,0.3); }
          58% { opacity: 0.8; background: rgba(231,224,210,0.15); }
          65% { opacity: 0; background: transparent; }
          100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .horror-camera-shake {
            animation: none !important;
          }
          .animate-horror-flicker {
            animation: horror-fade-in-out 500ms ease-in-out forwards !important;
          }
          @keyframes horror-jumpscare-entity {
            0% { opacity: 0; }
            40% { opacity: 0; }
            50% { opacity: 0.6; }
            60% { opacity: 0; }
            100% { opacity: 0; }
          }
        }
      `}</style>
    </div>
  );
};
