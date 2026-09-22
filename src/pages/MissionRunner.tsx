import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, ShieldAlert, Volume2, VolumeX, FastForward, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import confetti from 'canvas-confetti';

export const MissionRunner: React.FC = () => {
  const { activeMission, finishActiveMission, cancelActiveMission, soundSettings, toggleMute } = useGame();
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
          particleCount: 80,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#B000FF', '#FF1744', '#7C3AED', '#ECE8F2'],
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

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#030207] select-none overflow-hidden transition-all duration-300 ${
      isCritical ? 'bg-[#0a0006]' : ''
    }`}>
      {/* Full-screen Horror Entity Background */}
      {activeMission.image && (
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            scale: isIntense ? [1.02, 1.06, 1.02] : [1, 1.03, 1],
          }}
          transition={{ duration: isIntense ? 2 : 6, repeat: Infinity }}
        >
          <img
            src={activeMission.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#030207]/70" />
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isCritical ? 'opacity-30' : 'opacity-10'
            }`}
            style={{ backgroundColor: activeMission.threatColor }}
          />
        </motion.div>
      )}

      {/* Dynamic Blood Moon & Cosmic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[1]">
        <motion.div
          animate={{
            scale: isIntense ? [1, 1.12, 1] : [1, 1.05, 1],
            opacity: isCritical ? 0.9 : 0.6,
          }}
          transition={{ duration: isIntense ? 0.8 : 2.5, repeat: Infinity }}
          className="w-[480px] h-[480px] sm:w-[680px] sm:h-[680px] rounded-full bg-gradient-to-b from-void-crimson/25 via-void-purple/20 to-transparent blur-3xl"
        />

        {/* Fictional Entity Shadow Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <motion.div
            animate={{
              scale: isIntense ? [0.95, 1.05, 0.95] : [1, 1.02, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-void-crimson/30 flex items-center justify-center relative"
          >
            <Skull className="w-48 h-48 sm:w-64 sm:h-64 text-void-purple/40 blur-sm" />
          </motion.div>
        </div>
      </div>

      {/* Atmospheric scanlines */}
      <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

      {/* Top HUD Bar */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-void-crimson rounded-full animate-ping" />
          <span className="font-mono text-xs tracking-widest text-void-crimson font-bold uppercase">
            LIVE CURSED MISSION IN PROGRESS // {activeMission.id.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-void-900/80 border border-void-purple/30 text-void-200 hover:text-white transition"
            title="Toggle Audio"
          >
            {soundSettings.isMuted ? (
              <VolumeX className="w-4 h-4 text-void-crimson" />
            ) : (
              <Volume2 className="w-4 h-4 text-void-purple" />
            )}
          </button>

          {!isCompleted && (
            <button
              onClick={() => cancelActiveMission()}
              className="px-3 py-1.5 rounded-lg bg-void-900/80 border border-void-purple/30 text-xs font-mono text-void-muted hover:text-void-crimson hover:border-void-crimson transition"
            >
              ABORT MISSION
            </button>
          )}
        </div>
      </div>

      {/* Main Console Box */}
      <div className="relative z-10 w-full max-w-xl mx-4 text-center">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="active-runner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="void-panel rounded-3xl p-8 sm:p-10 border-void-purple/40 shadow-2xl hud-corner-tl"
            >
              {/* Mission Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-crimson/15 border border-void-crimson/30 text-[10px] font-mono tracking-widest text-void-crimson mb-2 uppercase">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>TARGET: {activeMission.entityName}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wider text-white">
                  {activeMission.title}
                </h2>
                <p className="text-xs text-void-muted font-mono mt-1 max-w-md mx-auto">
                  {activeMission.objective}
                </p>
              </div>

              {/* Circular 20-Second Progress Timer */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto my-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="rgba(176, 0, 255, 0.15)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active Progress */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={isIntense ? '#FF1744' : '#B000FF'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Inner Numeric Timer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.2, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`font-mono text-5xl sm:text-6xl font-extrabold tracking-tighter ${
                      isIntense ? 'text-void-crimson text-glow-crimson' : 'text-white text-glow-purple'
                    }`}
                  >
                    {timeLeft}s
                  </motion.div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-void-muted mt-1">
                    {isIntense ? 'CONTAINMENT ESCALATION' : 'CONTAINMENT LOCK'}
                  </span>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full max-w-sm mx-auto mb-6">
                <div className="h-1.5 w-full bg-void-900 rounded-full overflow-hidden border border-void-purple/20">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${
                      isIntense
                        ? 'bg-gradient-to-r from-void-purple to-void-crimson'
                        : 'bg-void-purple'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Reward Teaser */}
              <div className="text-xs font-mono text-void-200">
                STAKES: <span className="text-yellow-400 font-bold">+{activeMission.rewardTokens} DEATH TOKENS</span> ON SUCCESS
              </div>
            </motion.div>
          ) : (
            /* MISSION COMPLETED VICTORY SCREEN */
            <motion.div
              key="completed-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="void-panel rounded-3xl p-8 sm:p-12 border-green-500/40 shadow-2xl text-center hud-corner-tl"
            >
              <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-400/50 flex items-center justify-center mx-auto mb-6 glow-border">
                <CheckCircle2 className="w-10 h-10 text-green-400 animate-bounce" />
              </div>

              <div className="text-xs font-mono text-void-crimson tracking-widest uppercase mb-1">
                CLASSIFIED OUTCOME
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white mb-2">
                CLAIMED BY THE VOID
              </h2>
              <p className="text-xs sm:text-sm text-void-200 font-mono max-w-md mx-auto mb-6">
                {activeMission.completionMessage}
              </p>

              {/* Reward granted card */}
              <div className="p-4 rounded-xl bg-void-900/90 border border-void-purple/30 max-w-xs mx-auto mb-8">
                <div className="text-[10px] font-mono text-void-muted uppercase">REWARD CREDITED</div>
                <div className="text-2xl font-mono font-bold text-yellow-400 mt-1">
                  +{activeMission.rewardTokens} DEATH TOKENS
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playAccessGranted();
                  finishActiveMission();
                }}
                className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-bold font-mono tracking-widest text-white flex items-center justify-center gap-2 shadow-glow-purple mx-auto transition active:scale-95"
              >
                <span>RETURN TO EMPIRE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
