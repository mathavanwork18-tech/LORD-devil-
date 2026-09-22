import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, ShieldAlert, Volume2, VolumeX, FastForward, CheckCircle2, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

export const MissionRunner: React.FC = () => {
  const {
    activeMission,
    finishActiveMission,
    cancelActiveMission,
    soundSettings,
    toggleMute,
    codename,
  } = useGame();

  const [timeLeft, setTimeLeft] = useState(20);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!activeMission) return;

    setTimeLeft(20);
    setIsCompleted(false);
    setHasTriggeredComplete(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        const next = prev - 1;

        // Sound & Atmospheric escalations
        if (next === 15) {
          soundEngine.playHeartbeat();
        } else if (next === 10) {
          soundEngine.playHeartbeat();
          soundEngine.playCountdownTick(false);
        } else if (next === 5) {
          soundEngine.playHeartbeat();
          soundEngine.playCountdownTick(false);
        } else if (next <= 3 && next > 0) {
          soundEngine.playHeartbeat();
          soundEngine.playCountdownTick(true);
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMission]);

  // Handle zero countdown completion
  useEffect(() => {
    if (timeLeft === 0 && !hasTriggeredComplete) {
      setHasTriggeredComplete(true);
      setIsCompleted(true);
      soundEngine.playMissionComplete();

      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ff001e', '#B31324', '#7A0C16', '#B06D35', '#FFFFFF'],
        });
      } catch {
        // ignore
      }
    }
  }, [timeLeft, hasTriggeredComplete]);

  if (!activeMission) return null;

  const progressPct = ((20 - timeLeft) / 20) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  const isIntense = timeLeft <= 5 && timeLeft > 0;
  const isCritical = timeLeft <= 3 && timeLeft > 0;

  const getTelemetryLog = (t: number, name: string) => {
    if (t > 16) return `[00:${t.toString().padStart(2, '0')}] LOCKING SOUL SIGNATURE // TARGET: ${name.toUpperCase()} ...`;
    if (t > 12) return `[00:${t.toString().padStart(2, '0')}] CARDIAC TACHYCARDIA (174 BPM) // ABYSSAL CIRCLE ENGAGED ...`;
    if (t > 8) return `[00:${t.toString().padStart(2, '0')}] VOID TENDRILS CONSTRICTING // CELLULAR DESTABILIZATION AT 64% ...`;
    if (t > 4) return `[00:${t.toString().padStart(2, '0')}] ASTRAL SEVERANCE INITIATED // SPIRIT FLEEING MORTAL VESSEL ...`;
    if (t > 0) return `[00:${t.toString().padStart(2, '0')}] CRITICAL AGONY STAGE // SOUL CONSUMPTION AT 99% ...`;
    return `[00:00] TERMINATION ABSOLUTE // TARGET PERISHED & CLAIMED BY LORD EVIL!`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#030207] select-none overflow-hidden transition-all duration-300 ${
        isCritical ? 'bg-[#0e0004]' : ''
      }`}
    >
      {/* Full-screen Horror Entity Background */}
      {activeMission.image && (
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            scale: isIntense ? [1.02, 1.08, 1.02] : [1, 1.03, 1],
            filter: isCritical ? ['brightness(0.7) contrast(150%)', 'brightness(1.1) contrast(200%)', 'brightness(0.7) contrast(150%)'] : 'none',
          }}
          transition={{ duration: isIntense ? 1 : 6, repeat: Infinity }}
        >
          <img
            src={activeMission.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#030207]/75" />
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isCritical ? 'opacity-40' : 'opacity-15'
            }`}
            style={{ backgroundColor: activeMission.threatColor || '#ff001e' }}
          />
        </motion.div>
      )}

      {/* Dynamic Blood Moon & Cosmic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[1]">
        <motion.div
          animate={{
            scale: isIntense ? [1, 1.15, 1] : [1, 1.05, 1],
            opacity: isCritical ? 0.95 : 0.6,
          }}
          transition={{ duration: isIntense ? 0.6 : 2.5, repeat: Infinity }}
          className="w-[480px] h-[480px] sm:w-[680px] sm:h-[680px] rounded-full bg-gradient-to-b from-[#ff001e]/30 via-[#7A0C16]/20 to-transparent blur-3xl"
        />

        {/* Fictional Entity Shadow Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <motion.div
            animate={{
              scale: isIntense ? [0.95, 1.05, 0.95] : [1, 1.02, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#ff001e]/30 flex items-center justify-center relative"
          >
            <Skull className="w-48 h-48 sm:w-64 sm:h-64 text-[#ff001e]/40 blur-sm" />
          </motion.div>
        </div>
      </div>

      {/* Atmospheric scanlines */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

      {/* Critical tremor flashes */}
      {isCritical && (
        <div className="absolute inset-0 pointer-events-none bg-[#ff001e]/15 mix-blend-screen animate-horror-strobe z-20" />
      )}

      {/* Top HUD Bar */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-30 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#ff001e] rounded-full animate-ping" />
          <span className="font-heading text-xs tracking-widest text-[#ff4d61] font-bold uppercase">
            LIVE VOID ELIMINATION IN PROGRESS // {activeMission.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Fast-forward for instant judge demo */}
          {!isCompleted && (
            <button
              onClick={() => {
                soundEngine.playGlitchStatic();
                setTimeLeft(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#7A0C16]/40 border border-[#ff001e]/50 text-xs font-heading text-[#ff4d61] hover:text-white hover:bg-[#7A0C16] transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,0,30,0.3)]"
              title="Fast Forward 20s Countdown (Hackathon Demo Shortcut)"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FAST FORWARD</span>
            </button>
          )}

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-[#0A0507] border border-[#7A0C16]/50 text-[#918B86] hover:text-white transition"
            title="Toggle Audio"
          >
            {soundSettings.isMuted ? (
              <VolumeX className="w-4 h-4 text-[#ff001e]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#ff4d61]" />
            )}
          </button>

          {!isCompleted && (
            <button
              onClick={() => cancelActiveMission()}
              className="px-3 py-1.5 rounded-lg bg-[#0A0507] border border-[#7A0C16]/40 text-xs font-heading text-[#918B86] hover:text-[#ff001e] hover:border-[#ff001e] transition cursor-pointer"
            >
              ABORT
            </button>
          )}
        </div>
      </div>

      {/* Main Console Box */}
      <div className="relative z-20 w-full max-w-xl mx-4 text-center">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="active-runner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-3xl p-8 sm:p-10 border border-[#7A0C16]/70 shadow-[0_0_50px_rgba(179,19,36,0.35)] bg-[#070305]/95 backdrop-blur-xl hud-corner-crimson"
            >
              {/* Mission Header */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0C16]/30 border border-[#ff001e]/40 text-[10px] font-heading tracking-widest text-[#ff4d61] mb-2 uppercase">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#ff001e]" />
                  <span>TARGET: {activeMission.entityName}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-wider text-[#E7E0D2] uppercase">
                  {activeMission.title}
                </h2>
                <p className="text-xs text-[#918B86] font-mono mt-1 max-w-md mx-auto">
                  {activeMission.objective}
                </p>
              </div>

              {/* Circular 20-Second Progress Timer */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto my-5 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="rgba(122, 12, 22, 0.25)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active Progress */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={isIntense ? '#ff001e' : '#B31324'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear shadow-[0_0_15px_#ff001e]"
                  />
                </svg>

                {/* Inner Numeric Timer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.25, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`font-heading text-5xl sm:text-6xl font-extrabold tracking-tighter ${
                      isIntense ? 'text-[#ff001e] text-glow-crimson' : 'text-white'
                    }`}
                  >
                    {timeLeft}s
                  </motion.div>
                  <span className="text-[10px] font-heading tracking-widest uppercase text-[#918B86] mt-1">
                    {isIntense ? 'SOUL SEVERANCE PEAK' : 'VOID ENTRAPMENT'}
                  </span>
                </div>
              </div>

              {/* Telemetry Log */}
              <div className="p-3 rounded-lg bg-[#0A0406] border border-[#7A0C16]/50 mb-5 font-mono text-[11px] text-[#ff4d61] tracking-wide animate-pulse">
                {getTelemetryLog(timeLeft, activeMission.entityName)}
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full max-w-sm mx-auto mb-4">
                <div className="h-1.5 w-full bg-[#120507] rounded-full overflow-hidden border border-[#7A0C16]/40">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${
                      isIntense
                        ? 'bg-gradient-to-r from-[#7A0C16] to-[#ff001e]'
                        : 'bg-[#B31324]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Reward Teaser */}
              <div className="text-xs font-heading tracking-wider text-[#d4ccc5]">
                BOUNTY: <span className="text-[#ff001e] font-bold">+{activeMission.rewardTokens} DEATH TOKENS</span> UPON CONSUMPTION
              </div>
            </motion.div>
          ) : (
            /* MISSION COMPLETED CELEBRATORY VICTORY SCREEN */
            <motion.div
              key="completed-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-8 sm:p-10 border-2 border-[#ff001e] shadow-[0_0_60px_rgba(255,0,30,0.5)] text-center relative overflow-hidden hud-corner-crimson bg-[#070204]/95 backdrop-blur-xl"
            >
              {/* Bloody decorative banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A0C16]/40 border border-[#ff001e] text-xs font-heading tracking-widest text-[#ff4d61] uppercase mb-4 shadow-[0_0_15px_rgba(255,0,30,0.4)]">
                <Skull className="w-4 h-4 text-[#ff001e] animate-pulse" />
                <span>CONGRATULATIONS // TARGET ELIMINATION CONFIRMED</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-horror tracking-wider text-[#ff001e] text-horror-fiction drop-shadow-[0_0_30px_#ff001e] mb-2 uppercase">
                TARGET PERISHED & CLAIMED!
              </h2>

              <p className="text-xs sm:text-sm font-heading tracking-[0.2em] text-[#E7E0D2] uppercase mb-5">
                {activeMission.entityName} HAS BEEN DRAGGED INTO THE ABYSS
              </p>

              {/* Target elimination badge */}
              <div className="relative max-w-sm mx-auto mb-6 rounded-xl overflow-hidden border border-[#7A0C16] bg-[#0A0507] p-3 sm:p-4 flex items-center gap-4 text-left">
                {activeMission.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#ff001e]/60 flex-shrink-0 relative">
                    <img
                      src={activeMission.image}
                      alt={activeMission.entityName}
                      className="w-full h-full object-cover filter grayscale contrast-150"
                    />
                    <div className="absolute inset-0 bg-[#ff001e]/30 mix-blend-multiply flex items-center justify-center">
                      <span className="text-[10px] font-heading font-black text-white bg-black/80 px-1 py-0.5 rounded rotate-[-12deg] border border-[#ff001e]">
                        DEAD
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-[10px] font-mono text-[#918B86] uppercase">OUTCOME DOSSIER</div>
                  <div className="text-sm font-heading font-bold text-[#E7E0D2]">{activeMission.entityName}</div>
                  <div className="text-[11px] font-mono text-[#ff4d61]">{activeMission.completionMessage}</div>
                </div>
              </div>

              {/* Reward granted card */}
              <div className="p-4 rounded-xl bg-[#120508] border border-[#ff001e]/40 max-w-xs mx-auto mb-6 shadow-[0_0_25px_rgba(255,0,30,0.25)]">
                <div className="text-[10px] font-heading tracking-widest text-[#B06D35] uppercase">
                  DEATH TOKENS TRANSFERRED
                </div>
                <div className="text-3xl font-heading font-extrabold text-[#ff001e] text-glow-crimson mt-1">
                  +{activeMission.rewardTokens.toLocaleString()} TOKENS
                </div>
                <div className="text-[10px] font-mono text-[#918B86] mt-1">
                  CREDITED TO OPERATIVE {codename || 'INITIATE'}
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playAccessGranted();
                  finishActiveMission();
                }}
                className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-[#7A0C16] to-[#B31324] hover:brightness-125 font-bold font-heading tracking-widest text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(179,19,36,0.6)] mx-auto transition active:scale-95 border border-[#ff001e] cursor-pointer"
              >
                <span>CLAIM BOUNTY & RETURN TO EMPIRE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

