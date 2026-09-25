import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, Skull, ArrowRight, ShieldAlert, Sparkles, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import { LordEvilSigil } from './LordEvilLogo';
import { EmberCanvas } from './EmberCanvas';
import confetti from 'canvas-confetti';

interface IdentityGateProps {
  onComplete?: () => void;
}

export const IdentityGate: React.FC<IdentityGateProps> = ({ onComplete }) => {
  const { setCodename, soundSettings, toggleMute } = useGame();
  const [inputVal, setInputVal] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stage, setStage] = useState<'input' | 'jumpscare' | 'covenant' | 'granting'>('input');
  const [grantedDisplayTokens, setGrantedDisplayTokens] = useState(0);
  const [submittedName, setSubmittedName] = useState('');
  const [eyeGlowBoost, setEyeGlowBoost] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [shakeScreen, setShakeScreen] = useState(false);

  // 3D Parallax tilt tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Typing interaction: play whisper sound and pulse demon eyes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    if (errorMsg) setErrorMsg('');

    // Trigger subtle whisper & demonic eye reaction
    soundEngine.playWhisperSound();
    setEyeGlowBoost(true);
    setTimeout(() => setEyeGlowBoost(false), 300);
  };

  // ── THE GREAT JUMPSCARE EXECUTION ─────────────────────────────────────
  const triggerHorrorJumpscare = (targetName: string) => {
    setSubmittedName(targetName);
    setErrorMsg('');
    setStage('jumpscare');

    // Phase 1 (0ms): Silence & blackout
    soundEngine.duckAmbient(4500);

    // Phase 2 (150ms): THE JUMPSCARE DETONATION!
    setTimeout(() => {
      setShakeScreen(true);
      soundEngine.playReaperJumpscareRoar();
    }, 150);

    // Stop intense camera shake after 1.8s
    setTimeout(() => {
      setShakeScreen(false);
    }, 2000);

    // Phase 3 (2300ms): Transmutation & Covenant Inscription
    setTimeout(() => {
      setStage('covenant');
      soundEngine.playAccessGranted();
    }, 2300);

    // Phase 4 (3800ms): Token Granting & Empire Induction
    setTimeout(() => {
      setStage('granting');
      soundEngine.playEnterConfirm();

      // Crimson & demonic gold particle burst
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ff001e', '#B31324', '#7A0C16', '#B06D35', '#E7E0D2'],
        });
      } catch {
        // ignore
      }

      // Count up to 1,250 tokens
      let cur = 0;
      const step = 50;
      const interval = setInterval(() => {
        cur += step;
        if (cur >= 1250) {
          cur = 1250;
          clearInterval(interval);
          setGrantedDisplayTokens(1250);
          setTimeout(() => {
            setCodename(targetName);
            onComplete?.();
          }, 900);
        } else {
          setGrantedDisplayTokens(cur);
        }
      }, 25);
    }, 3800);
  };

  const handleSubmit = (nameToSubmit?: string) => {
    const targetName = (nameToSubmit || inputVal).trim();
    if (!targetName) {
      setErrorMsg('A CODENAME IS REQUIRED TO SACRIFICE UNTO THE VOID.');
      soundEngine.playError();
      return;
    }
    if (targetName.length > 20) {
      setErrorMsg('CODENAME CANNOT EXCEED 20 CHARACTERS.');
      soundEngine.playError();
      return;
    }

    triggerHorrorJumpscare(targetName);
  };

  const handleGuestEntry = () => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const guestName = `REAPER_${randNum}`;
    setInputVal(guestName);
    handleSubmit(guestName);
  };

  const handleSkip = () => {
    const targetName = inputVal.trim() || 'OPERATIVE_SHADOW';
    setCodename(targetName);
    soundEngine.playAccessGranted();
    onComplete?.();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#020104] overflow-hidden select-none ${
        shakeScreen ? 'horror-camera-shake-violent' : ''
      }`}
    >
      {/* ── 1. BACKGROUND HORROR FICTION REAPER DEMON ARTWORK ──────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out flex items-center justify-center overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 3.5}deg) rotateX(${-mousePos.y * 3.5}deg) scale(1.06)`,
        }}
      >
        <img
          src="/assets/horror/entities/reaper_demon.jpg"
          alt="Lord Evil Grim Harvester"
          className="w-full h-full object-cover object-center animate-reaper-breathe filter contrast-125"
        />

        {/* Demonic Crimson Eye Flares placed over the Reaper's skull */}
        <div
          className={`absolute top-[28%] left-[49.2%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] pointer-events-none transition-all duration-300 ${
            eyeGlowBoost
              ? 'w-14 h-14 blur-lg opacity-100 scale-150'
              : 'w-8 h-8 blur-md opacity-75 animate-reaper-eyes'
          } mix-blend-screen`}
        />
        <div
          className={`absolute top-[28.5%] left-[51.8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] pointer-events-none transition-all duration-300 ${
            eyeGlowBoost
              ? 'w-14 h-14 blur-lg opacity-100 scale-150'
              : 'w-8 h-8 blur-md opacity-75 animate-reaper-eyes'
          } mix-blend-screen`}
        />

        {/* Ambient blood moon aura & atmospheric vortex */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/50 to-[#020104]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020104] via-transparent to-[#020104]/80 pointer-events-none" />
      </div>

      {/* ── 2. DYNAMIC RISING EMBERS & SCANLINES ────────────────────────── */}
      <EmberCanvas density={40} />
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" />

      {/* ── 3. TOP UTILITY CONTROLS ────────────────────────────────────── */}
      <div className="absolute top-5 right-5 flex items-center gap-3 z-30">
        <button
          onClick={() => triggerHorrorJumpscare(inputVal.trim() || 'VICTIM')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#100305]/85 border border-[#ff001e]/40 text-xs font-heading tracking-widest text-[#ff4d61] hover:bg-[#ff001e]/20 hover:border-[#ff001e] transition cursor-pointer shadow-[0_0_12px_rgba(255,0,30,0.3)]"
          title="Directly trigger and test the great jumpscare"
        >
          <Skull className="w-3.5 h-3.5 text-[#ff001e] animate-pulse" />
          <span>TEST JUMPSCARE</span>
        </button>

        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#120508]/85 border border-[#7A0C16]/50 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition cursor-pointer"
        >
          {soundSettings.isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-[#B31324]" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#E7E0D2]" />
          )}
          <span>{soundSettings.isMuted ? 'MUTED' : 'AUDIO ON'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#120508]/85 border border-[#7A0C16]/40 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] transition cursor-pointer"
          title="Skip cinematic onboarding sequence"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>SKIP INTRO</span>
        </button>
      </div>

      {/* ── 4. HORROR FICTION LORE BANNER AT TOP ───────────────────────── */}
      <div className="absolute top-6 left-6 hidden md:flex items-center gap-2.5 z-20 pointer-events-none opacity-80">
        <Flame className="w-4 h-4 text-[#ff001e] animate-pulse" />
        <span className="font-heading text-[11px] tracking-[0.3em] text-[#ff4d61] uppercase text-horror-fiction">
          PROLOGUE: COVENANT OF THE CRIMSON HARVESTER
        </span>
      </div>

      {/* ── 5. MAIN INTERACTIVE CONSOLE MODAL ──────────────────────────── */}
      {stage === 'input' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="relative z-20 w-full max-w-lg mx-4"
        >
          <div className="relative rounded-xl p-8 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-md bg-[#070306]/85 border border-[#7A0C16]/70 hud-corner-crimson text-center overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#ff001e]/15 blur-3xl pointer-events-none" />

            {/* Sigil Mark with Occult Halo */}
            <div className="flex justify-center mb-4">
              <div className="relative p-3.5 rounded-full bg-[#0d0407] border border-[#B31324] shadow-[0_0_30px_rgba(255,0,30,0.5)] group/lordlogo hover:border-[#ff001e] transition-colors duration-500">
                <LordEvilSigil size={48} color="#ff001e" animated={true} faintRing={true} />
              </div>
            </div>

            {/* Fiction Title */}
            <h1 className="font-horror text-4xl sm:text-5xl tracking-widest text-[#ff001e] text-glow-crimson mb-1 drop-shadow-[0_0_20px_rgba(255,0,30,0.8)]">
              LORD EVIL
            </h1>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#B06D35] font-heading font-bold mb-4">
              CHRONICLES OF THE VOID • THE BLOOD PACT
            </p>

            {/* Fiction Prologue Narrative */}
            <div className="space-y-2 mb-6 px-2">
              <p className="text-xs font-heading uppercase text-[#E7E0D2] tracking-wider font-semibold">
                THE SHADOWS DEMAND SACRIFICE
              </p>
              <p className="text-xs text-[#b8b0a9] leading-relaxed font-sans">
                You have not merely visited a website. You have stepped across the threshold of the Abyss.
                Inscribe your operative codename to awaken the covenant and claim your bounty of{' '}
                <span className="text-[#ff001e] font-bold underline decoration-[#7A0C16]">1,250 Death Tokens</span>.
              </p>
            </div>

            {/* Input Box */}
            <div className="relative mb-5">
              <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                placeholder="ENTER THY OPERATIVE CODENAME..."
                maxLength={20}
                autoFocus
                className="w-full px-5 py-3.5 bg-[#090204]/90 border border-[#7A0C16] focus:border-[#ff001e] rounded-md text-[#E7E0D2] font-heading text-sm text-center tracking-widest placeholder:text-[#918B86]/40 focus:outline-none focus:ring-2 focus:ring-[#ff001e]/40 transition shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]"
              />
              {errorMsg && (
                <p className="text-xs text-[#ff334b] font-mono mt-1.5 text-center flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit()}
                onMouseEnter={() => soundEngine.playHover()}
                className="gothic-btn w-full py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer text-sm font-heading tracking-widest shadow-[0_0_25px_rgba(179,19,36,0.4)] hover:shadow-[0_0_35px_rgba(255,0,30,0.7)]"
              >
                <span>ENTER THE EMPIRE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleGuestEntry}
                onMouseEnter={() => soundEngine.playHover()}
                className="w-full py-2.5 rounded bg-[#130508]/80 border border-[#7A0C16]/50 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition cursor-pointer"
              >
                INVOKE ANONYMOUS DOSSIER
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 6. THE GREAT JUMPSCARE OVERLAY STAGE ───────────────────────── */}
      <AnimatePresence>
        {stage === 'jumpscare' && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center pointer-events-none">
            {/* Absolute Void Blackout */}
            <div className="absolute inset-0 bg-[#020104]" />

            {/* Inverted / Strobe Flash */}
            <div className="absolute inset-0 animate-horror-strobe pointer-events-none z-30" />

            {/* Demon Screaming Surge Leaping into Viewer */}
            <div className="relative w-full h-full flex items-center justify-center horror-jumpscare-leap z-20">
              <img
                src="/assets/horror/entities/reaper_demon.jpg"
                alt="Grim Harvester Jumpscare"
                className="max-w-[135vw] max-h-[135vh] w-auto h-auto object-contain filter contrast-200 drop-shadow-[0_0_100px_#ff001e]"
              />

              {/* Blinding Laser Eyes */}
              <div className="absolute top-[28%] left-[47.5%] w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] blur-md mix-blend-screen shadow-[0_0_50px_#ff001e]" />
              <div className="absolute top-[28.5%] left-[52.5%] w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff001e] blur-md mix-blend-screen shadow-[0_0_50px_#ff001e]" />

              {/* Violent Blood Claw Slashes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[90vw] h-2 bg-gradient-to-r from-transparent via-[#ff001e] to-transparent animate-claw-slash-1 shadow-[0_0_30px_#ff001e]" />
                <div className="w-[90vw] h-2 bg-gradient-to-r from-transparent via-[#ff001e] to-transparent animate-claw-slash-2 shadow-[0_0_30px_#ff001e]" />
              </div>
            </div>

            {/* Screaming Blood-Red Typography Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-40 text-center px-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <h2 className="font-horror text-5xl sm:text-7xl lg:text-8xl tracking-widest text-[#ff001e] text-horror-fiction drop-shadow-[0_0_40px_#ff001e]">
                  THY SOUL IS MARKED!
                </h2>
                <p className="font-heading text-lg sm:text-2xl tracking-[0.3em] text-[#E7E0D2] uppercase drop-shadow-[0_0_15px_#7A0C16]">
                  {submittedName || 'OPERATIVE'} ... THOU ART CHOSEN BY LORD EVIL!
                </p>
              </motion.div>
            </div>

            {/* Peripheral Crimson Blood Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-45"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(179,19,36,0.7) 75%, rgba(2,1,4,0.98) 100%)',
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ── 7. COVENANT INSCRIBED STAGE ────────────────────────────────── */}
      {stage === 'covenant' && (
        <motion.div
          key="covenant"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="relative z-20 w-full max-w-md mx-4 text-center"
        >
          <div className="rounded-xl p-8 bg-[#090306]/90 border border-[#B31324] shadow-[0_0_50px_rgba(179,19,36,0.6)] backdrop-blur-lg hud-corner-crimson">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#7A0C16]/30 border-2 border-[#ff001e] flex items-center justify-center mb-5 shadow-[0_0_25px_#ff001e]">
              <LordEvilSigil size={36} color="#ff001e" className="animate-spin [animation-duration:15s]" />
            </div>
            <h3 className="font-heading text-xl font-bold tracking-widest text-[#E7E0D2] mb-2 uppercase">
              COVENANT SEALED IN BLOOD
            </h3>
            <p className="font-mono text-xs tracking-widest text-[#ff4d61] uppercase mb-4">
              ARCHIVES OF LORD EVIL UPDATED
            </p>
            <p className="font-heading text-sm text-[#B06D35] tracking-widest uppercase">
              WELCOME, OPERATIVE {submittedName}
            </p>
          </div>
        </motion.div>
      )}

      {/* ── 8. TOKEN GRANTING STAGE ────────────────────────────────────── */}
      {stage === 'granting' && (
        <motion.div
          key="granting"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-20 w-full max-w-md mx-4 text-center"
        >
          <div className="rounded-xl p-8 sm:p-10 bg-[#090306]/95 border border-[#ff001e] shadow-[0_0_60px_rgba(255,0,30,0.5)] backdrop-blur-xl hud-corner-crimson space-y-5">
            <div className="flex items-center justify-center gap-2 text-xs font-heading tracking-widest text-[#918B86] uppercase">
              <Sparkles className="w-4 h-4 text-[#ff001e]" />
              <span>COVENANT COMMENCEMENT GRANT</span>
            </div>

            <div className="text-5xl sm:text-6xl font-heading font-extrabold text-[#ff001e] text-glow-crimson tracking-wider">
              +{grantedDisplayTokens.toLocaleString()}
            </div>

            <p className="text-xs font-heading tracking-widest text-[#E7E0D2] uppercase">
              DEATH TOKENS TRANSFERRED UNTO THY SOUL
            </p>

            <div className="w-full h-1.5 bg-[#150608] rounded-full overflow-hidden border border-[#7A0C16]/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7A0C16] via-[#B31324] to-[#ff001e]"
                style={{ width: `${(grantedDisplayTokens / 1250) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
