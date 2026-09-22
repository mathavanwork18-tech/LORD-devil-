import React, { useRef, useEffect, useState, useCallback } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface LordEvilIntroProps {
  onComplete: () => void;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const COLORS = {
  voidBlack: '#050505',
  bloodRed: '#7A0C16',
  darkCrimson: '#B31324',
  oldGold: '#B06D35',
  boneWhite: '#E7E0D2',
};

// The actual filename inside /public/intro/
const VIDEO_SRC = '/intro/lord-evil-intro.mp4.mp4';

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export const LordEvilIntro: React.FC<LordEvilIntroProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  // Phase state machine:
  //   loading        → video is buffering
  //   playing        → video is actively playing
  //   autoplayBlocked → browser blocked autoplay, user must click
  //   fading         → video ended or skipped, fade overlay is running
  //   done           → onComplete has been called
  const [phase, setPhase] = useState<
    'loading' | 'playing' | 'autoplayBlocked' | 'fading' | 'done'
  >('loading');

  const [showSkip, setShowSkip] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  // ── Accessibility: prefers-reduced-motion ──────────────────────────────
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) {
      onComplete();
    }
  }, [prefersReduced, onComplete]);

  // ── Show skip button after 2 seconds ───────────────────────────────────
  useEffect(() => {
    if (prefersReduced) return;
    const timer = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(timer);
  }, [prefersReduced]);

  // ── Trigger the cinematic fade-to-site transition ──────────────────────
  const triggerTransition = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    // Pause video immediately
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setPhase('fading');
    setFadeOpacity(1); // 350ms CSS transition to opaque black/crimson

    // After fade completes → call onComplete to reveal site
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 500);
  }, [onComplete]);

  // ── Attempt to play the video ──────────────────────────────────────────
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().then(() => {
      // Successfully playing
      setPhase('playing');
    }).catch(() => {
      // Autoplay blocked — DO NOT skip the intro.
      // Show a "click to enter" overlay so user can initiate playback.
      setPhase('autoplayBlocked');
    });
  }, []);

  // ── Video: canplay event ───────────────────────────────────────────────
  const handleCanPlay = useCallback(() => {
    if (phase === 'loading') {
      attemptPlay();
    }
  }, [phase, attemptPlay]);

  // ── Video: ended event (native — NOT a timeout) ────────────────────────
  const handleEnded = useCallback(() => {
    triggerTransition();
  }, [triggerTransition]);

  // ── Video: error event ─────────────────────────────────────────────────
  // A genuine load failure (404, codec unsupported, network error).
  // Show a brief LORD EVIL title card, then transition to site.
  const handleError = useCallback(() => {
    if (completedRef.current) return;
    // Don't instantly skip — show the fallback for 2s so user sees something
    setPhase('autoplayBlocked');
  }, []);

  // ── User clicks "ENTER LORD EVIL" when autoplay was blocked ────────────
  const handleUserInitiatedPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      // Video element doesn't exist (load error) — just transition
      triggerTransition();
      return;
    }

    video.play().then(() => {
      setPhase('playing');
    }).catch(() => {
      // Even user-initiated play failed — transition to site
      triggerTransition();
    });
  }, [triggerTransition]);

  // ── Skip handler ───────────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    triggerTransition();
  }, [triggerTransition]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, []);

  // If prefers-reduced-motion, render nothing
  if (prefersReduced) return null;

  return (
    <div
      className="lord-evil-intro"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
        background: COLORS.voidBlack,
        overflow: 'hidden',
      }}
    >
      {/* ── VIDEO ELEMENT ──────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onError={handleError}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          opacity: phase === 'fading' || phase === 'done' ? 0 : 1,
          transition: 'opacity 350ms ease-out',
          background: COLORS.voidBlack,
        }}
      />

      {/* ── FADE OVERLAY (black + subtle crimson glow) ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: fadeOpacity,
          transition: 'opacity 350ms ease-in',
          background: `
            radial-gradient(
              ellipse at 50% 50%,
              rgba(122, 12, 22, 0.25) 0%,
              rgba(5, 5, 5, 0.85) 40%,
              ${COLORS.voidBlack} 100%
            )
          `,
          zIndex: 2,
        }}
      />

      {/* ── LOADING STATE (subtle crimson pulse dot) ───────────────────── */}
      {phase === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: COLORS.darkCrimson,
              boxShadow: `0 0 20px ${COLORS.darkCrimson}, 0 0 40px ${COLORS.bloodRed}`,
              animation: 'lordEvilIntroPulse 2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* ── AUTOPLAY BLOCKED: "ENTER LORD EVIL" click-to-play ──────────── */}
      {phase === 'autoplayBlocked' && (
        <div
          onClick={handleUserInitiatedPlay}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            cursor: 'pointer',
            background: COLORS.voidBlack,
          }}
        >
          {/* Ambient glow behind text */}
          <div
            style={{
              position: 'absolute',
              width: '50vw',
              height: '50vw',
              maxWidth: 400,
              maxHeight: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(179,19,36,0.12) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          {/* Pulsing sigil */}
          <div style={{ marginBottom: 32, animation: 'lordEvilIntroPulse 3s ease-in-out infinite' }}>
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="35" stroke={COLORS.darkCrimson} strokeWidth="1.5"
                strokeDasharray="6 4" opacity="0.6" />
              <circle cx="50" cy="50" r="12" stroke={COLORS.bloodRed} strokeWidth="1.5" opacity="0.8" />
              <circle cx="50" cy="50" r="3" fill={COLORS.darkCrimson} />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'Creepster, cursive',
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
              color: COLORS.darkCrimson,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: `
                0 0 20px rgba(179,19,36,0.8),
                0 0 50px rgba(179,19,36,0.4),
                0 0 80px rgba(122,12,22,0.3)
              `,
              marginBottom: 24,
              position: 'relative',
            }}
          >
            LORD EVIL
          </h1>

          {/* Call to action */}
          <p
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.85rem)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: COLORS.boneWhite,
              opacity: 0.6,
              marginBottom: 8,
              position: 'relative',
              animation: 'lordEvilIntroFadeIn 1s ease-out',
            }}
          >
            Click to Enter
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: COLORS.oldGold,
              opacity: 0.35,
              position: 'relative',
            }}
          >
            Best experienced with sound
          </p>
        </div>
      )}

      {/* ── BOTTOM VIGNETTE (matches site atmosphere) ──────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: `linear-gradient(to top, ${COLORS.voidBlack} 0%, transparent 100%)`,
          pointerEvents: 'none',
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      {/* ── SKIP INTRO BUTTON (bottom-right, appears after 2s) ─────────── */}
      {showSkip && (phase === 'playing' || phase === 'loading') && (
        <button
          onClick={handleSkip}
          aria-label="Skip intro video"
          style={{
            position: 'absolute',
            bottom: 'clamp(20px, 4vh, 40px)',
            right: 'clamp(20px, 4vw, 40px)',
            zIndex: 10,
            padding: '8px 20px',
            fontFamily: 'Cinzel, serif',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: COLORS.boneWhite,
            background: 'rgba(5, 5, 5, 0.55)',
            border: '1px solid rgba(179, 19, 36, 0.35)',
            borderRadius: '2px',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            transition: 'all 0.3s ease',
            opacity: 0,
            animation: 'lordEvilIntroSkipAppear 0.6s ease-out 0s forwards',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '1';
            btn.style.borderColor = 'rgba(179, 19, 36, 0.7)';
            btn.style.color = COLORS.darkCrimson;
            btn.style.textShadow = '0 0 8px rgba(179,19,36,0.5)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '0.5';
            btn.style.borderColor = 'rgba(179, 19, 36, 0.35)';
            btn.style.color = COLORS.boneWhite;
            btn.style.textShadow = 'none';
          }}
        >
          Skip Intro
        </button>
      )}

      {/* ── THIN CRIMSON PROGRESS LINE AT BOTTOM ───────────────────────── */}
      {phase === 'playing' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${COLORS.bloodRed}, ${COLORS.darkCrimson}, ${COLORS.oldGold})`,
            boxShadow: `0 0 8px ${COLORS.darkCrimson}`,
            zIndex: 5,
            opacity: 0.5,
            width: '100%',
            animation: videoRef.current?.duration
              ? `lordEvilIntroProgress ${videoRef.current.duration}s linear forwards`
              : 'none',
          }}
        />
      )}

      {/* ── KEYFRAME ANIMATIONS ────────────────────────────────────────── */}
      <style>{`
        @keyframes lordEvilIntroPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.8);
            opacity: 1;
          }
        }

        @keyframes lordEvilIntroSkipAppear {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 0.5;
            transform: translateY(0);
          }
        }

        @keyframes lordEvilIntroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lordEvilIntroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LordEvilIntro;
