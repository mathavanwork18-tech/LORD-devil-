import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const [stage, setStage] = useState<'input' | 'scanning' | 'checking' | 'verified' | 'granting'>('input');
  const [grantedDisplayTokens, setGrantedDisplayTokens] = useState(0);

  const handleSubmit = (nameToSubmit?: string) => {
    const targetName = (nameToSubmit || inputVal).trim();
    if (!targetName) {
      setErrorMsg('AN OPERATIVE CODENAME IS MANDATORY TO ENTER.');
      soundEngine.playError();
      return;
    }
    if (targetName.length > 20) {
      setErrorMsg('CODENAME CANNOT EXCEED 20 CHARACTERS.');
      soundEngine.playError();
      return;
    }

    setErrorMsg('');
    soundEngine.playHeartbeat();
    setStage('scanning');

    // Cinematic sequence
    setTimeout(() => {
      setStage('checking');
      soundEngine.playTerminalChirp();
    }, 900);

    setTimeout(() => {
      setStage('verified');
      soundEngine.playAccessGranted();
    }, 1800);

    setTimeout(() => {
      setStage('granting');
      soundEngine.playEnterConfirm();

      // Confetti burst (crimson, gold, bone white)
      try {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#B31324', '#7A0C16', '#B06D35', '#E7E0D2'],
        });
      } catch {
        // ignore
      }

      // Count up to 1,250
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
          }, 800);
        } else {
          setGrantedDisplayTokens(cur);
        }
      }, 25);
    }, 2700);
  };

  const handleGuestEntry = () => {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const guestName = `OPERATIVE_${randNum}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden select-none">
      {/* Dynamic Rising Embers Canvas */}
      <EmberCanvas density={35} />

      {/* Atmospheric Fog & Blood Moon Glow in Background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-b from-[#7A0C16]/30 via-[#B31324]/20 to-transparent blur-3xl opacity-75 animate-pulse-slow" />
        <div className="absolute w-[500px] h-[500px] sm:w-[720px] sm:h-[720px] rounded-full border border-[#7A0C16]/25 border-dashed animate-spin [animation-duration:120s]" />
      </div>

      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Top Utility Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#151313]/90 border border-[#7A0C16]/50 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition"
        >
          {soundSettings.isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#B31324]" /> : <Volume2 className="w-3.5 h-3.5 text-[#E7E0D2]" />}
          <span>{soundSettings.isMuted ? 'MUTED' : 'AUDIO ON'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#151313]/90 border border-[#7A0C16]/40 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] transition"
          title="Skip cinematic onboarding sequence"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>SKIP INTRO</span>
        </button>
      </div>

      {/* Center Console Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="charcoal-panel rounded-lg p-8 sm:p-10 shadow-2xl hud-corner-crimson text-center">
          {/* Evil Solar Sigil Mark */}
          <div className="flex justify-center mb-5">
            <div className="p-4 rounded-full bg-[#0A0909] border border-[#B31324] shadow-[0_0_20px_rgba(179,19,36,0.5)] group">
              <LordEvilSigil size={48} color="#B31324" className="group-hover:rotate-45" />
            </div>
          </div>

          <h1 className="font-horror text-4xl sm:text-5xl tracking-widest text-[#B31324] text-glow-crimson mb-1">
            LORD EVIL
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#B06D35] font-heading font-semibold mb-6">
            THE EMPIRE COVENANT
          </p>

          <AnimatePresence mode="wait">
            {stage === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="space-y-1.5 text-center">
                  <p className="text-xs font-heading uppercase text-[#E7E0D2] tracking-wider font-semibold">
                    YOU HAVE BEEN CHOSEN
                  </p>
                  <p className="text-xs text-[#918B86] leading-relaxed">
                    This is not a game. This is a covenant. Enter your operative codename to receive your starter grant of <span className="text-[#B31324] font-bold">1,250 Death Tokens</span>.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmit();
                    }}
                    placeholder="ENTER OPERATIVE CODENAME..."
                    maxLength={20}
                    autoFocus
                    className="w-full px-4 py-3 bg-[#0A0909] border border-[#7A0C16] rounded text-[#E7E0D2] font-heading text-sm text-center tracking-widest placeholder:text-[#918B86]/40 focus:outline-none focus:border-[#B31324] focus:ring-1 focus:ring-[#B31324] transition"
                  />
                  {errorMsg && (
                    <p className="text-xs text-[#B31324] font-mono mt-1 text-center">
                      ▲ {errorMsg}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit()}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="gothic-btn w-full py-3.5 px-6 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ENTER THE EMPIRE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleGuestEntry}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="w-full py-2.5 rounded bg-[#151313] border border-[#7A0C16]/40 text-xs font-heading tracking-widest text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition"
                  >
                    GENERATE ANONYMOUS DOSSIER
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8 space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-[#B31324] border-t-transparent animate-spin shadow-[0_0_15px_rgba(179,19,36,0.5)]" />
                <p className="font-heading text-sm text-[#E7E0D2] tracking-widest">
                  COMMUNING WITH THE VOID...
                </p>
                <p className="text-xs font-mono text-[#918B86]">
                  BINDING ASTRAL FREQUENCY
                </p>
              </motion.div>
            )}

            {stage === 'checking' && (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#7A0C16]/20 border border-[#B31324] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#B31324] animate-ping" />
                </div>
                <p className="font-heading text-sm text-[#E7E0D2] tracking-widest">
                  SEALING THE COVENANT
                </p>
                <p className="text-xs font-mono text-[#B06D35]">
                  REGISTERING IN ARCHIVE OF LORD EVIL
                </p>
              </motion.div>
            )}

            {stage === 'verified' && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="py-8 space-y-4"
              >
                <CheckCircle2 className="w-14 h-14 mx-auto text-[#B31324] filter drop-shadow-[0_0_12px_rgba(179,19,36,0.8)]" />
                <p className="font-heading text-base font-bold text-[#E7E0D2] tracking-widest">
                  IDENTITY VERIFIED
                </p>
                <p className="font-heading text-sm text-[#B06D35] tracking-widest uppercase">
                  WELCOME, OPERATIVE {inputVal.trim() || 'INITIATE'}
                </p>
              </motion.div>
            )}

            {stage === 'granting' && (
              <motion.div
                key="granting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 space-y-4"
              >
                <p className="text-xs font-heading tracking-widest text-[#918B86] uppercase">
                  COVENANT COMMENCEMENT GRANT
                </p>
                <div className="text-4xl sm:text-5xl font-heading font-extrabold text-[#B31324] text-glow-crimson tracking-wider">
                  +{grantedDisplayTokens.toLocaleString()}
                </div>
                <p className="text-xs font-heading tracking-widest text-[#E7E0D2] uppercase">
                  DEATH TOKENS TRANSFERRED
                </p>
                <div className="w-full h-1 bg-[#151313] rounded-full overflow-hidden border border-[#7A0C16]/40">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#7A0C16] to-[#B31324]"
                    style={{ width: `${(grantedDisplayTokens / 1250) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
