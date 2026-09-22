import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, SlidersHorizontal, Activity, Music, Eye, EyeOff, AlertTriangle, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine, SoundEngine } from '../utils/soundEngine';
import { horrorEventManager } from '../utils/horrorEventManager';

export const SoundSettingsModal: React.FC = () => {
  const {
    soundSettings,
    updateSoundSettings,
    toggleMute,
    isSoundSettingsOpen,
    setSoundSettingsOpen,
  } = useGame();

  const [horrorEventsEnabled, setHorrorEventsEnabled] = React.useState(true);
  const [jumpScaresEnabled, setJumpScaresEnabled] = React.useState(true);
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (!isSoundSettingsOpen) return null;

  const handleHorrorToggle = () => {
    const next = !horrorEventsEnabled;
    setHorrorEventsEnabled(next);
    horrorEventManager.setEnabled(next);
  };

  const handleJumpScareToggle = () => {
    const next = !jumpScaresEnabled;
    setJumpScaresEnabled(next);
    horrorEventManager.setJumpScareEnabled(next);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md void-panel rounded-2xl p-6 border-void-purple/40 shadow-2xl relative"
          style={{
            background: 'linear-gradient(135deg, rgba(21,19,19,0.95) 0%, rgba(10,9,9,0.98) 100%)',
            border: '1px solid rgba(179,19,36,0.3)',
            boxShadow: '0 0 40px rgba(179,19,36,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#7A0C16]/30">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#B31324]" />
              <h2 className="font-heading text-sm sm:text-base font-bold tracking-widest text-white uppercase">
                HORROR AUDIO ENGINE
              </h2>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSoundSettingsOpen(false);
              }}
              className="p-1 rounded text-[#918B86] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-4 text-xs font-mono max-h-[70vh] overflow-y-auto scrollbar-thin">
            {/* Master Mute Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0909] border border-[#7A0C16]/30">
              <div className="flex items-center gap-2.5">
                {soundSettings.isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#B31324]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#B31324]" />
                )}
                <div>
                  <div className="text-white font-semibold">MASTER SOUND</div>
                  <div className="text-[10px] text-[#918B86]">
                    {soundSettings.isMuted ? 'ALL AUDIO MUTED' : 'HORROR SYNTHESIS ACTIVE'}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  soundSettings.isMuted
                    ? 'bg-[#B31324]/20 text-[#B31324] border border-[#B31324]/40'
                    : 'bg-[#7A0C16]/20 text-[#E7E0D2] border border-[#7A0C16]/40'
                }`}
              >
                {soundSettings.isMuted ? 'UNMUTE' : 'MUTE'}
              </button>
            </div>

            {/* Volume Sliders */}
            <div className="space-y-3">
              {/* Master Volume */}
              <div>
                <div className="flex justify-between text-[#E7E0D2] mb-1">
                  <span>MASTER VOLUME</span>
                  <span className="text-[#B31324]">{Math.round(soundSettings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={soundSettings.masterVolume}
                  onChange={(e) => updateSoundSettings({ masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#B31324] cursor-pointer bg-[#151313]"
                />
              </div>

              {/* Music / Ambient Volume */}
              <div>
                <div className="flex justify-between text-[#E7E0D2] mb-1">
                  <span>MUSIC / AMBIENT</span>
                  <span className="text-[#B31324]">{Math.round(soundSettings.ambienceVolume * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={soundSettings.ambienceVolume}
                  onChange={(e) => updateSoundSettings({ ambienceVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#B31324] cursor-pointer bg-[#151313]"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex justify-between text-[#E7E0D2] mb-1">
                  <span>HORROR SFX</span>
                  <span className="text-[#B31324]">{Math.round(soundSettings.fxVolume * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={soundSettings.fxVolume}
                  onChange={(e) => updateSoundSettings({ fxVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#7A0C16] cursor-pointer bg-[#151313]"
                />
              </div>

              {/* UI Volume */}
              <div>
                <div className="flex justify-between text-[#E7E0D2] mb-1">
                  <span>UI FEEDBACK</span>
                  <span className="text-[#B31324]">{Math.round(soundSettings.uiVolume * 100)}%</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.05"
                  value={soundSettings.uiVolume}
                  onChange={(e) => updateSoundSettings({ uiVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#7A0C16] cursor-pointer bg-[#151313]"
                />
              </div>
            </div>

            {/* Scary Horror Theme Music Selector */}
            <div className="pt-2 border-t border-[#7A0C16]/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-[#B06D35] uppercase tracking-wider flex items-center gap-1 font-bold">
                  <Music className="w-3.5 h-3.5 text-[#ff001e] animate-pulse" />
                  <span>SCARY HORROR THEME MUSIC (NON-COPYRIGHT)</span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.toggleScaryThemeMusic();
                    // force re-render
                    setHorrorEventsEnabled((v) => v);
                  }}
                  className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider transition border ${
                    soundEngine.isScaryTrackPlaying()
                      ? 'bg-[#ff001e]/30 text-white border-[#ff001e] shadow-[0_0_15px_rgba(255,0,30,0.6)]'
                      : 'bg-[#150508] text-[#ff4d61] border-[#7A0C16]/50 hover:border-[#ff001e]'
                  }`}
                >
                  {soundEngine.isScaryTrackPlaying() ? '■ STOP MUSIC' : '▶ PLAY HORROR MUSIC'}
                </button>
              </div>

              {/* Track Selection Pills */}
              <div className="space-y-1.5">
                {SoundEngine.SCARY_TRACKS.map((t) => {
                  const isCurrent = soundEngine.getScaryTrackId() === t.id;
                  const isPlaying = isCurrent && soundEngine.isScaryTrackPlaying();
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        soundEngine.playScaryTrack(t.id);
                        setHorrorEventsEnabled((v) => v);
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#180508] border-[#ff001e] shadow-[0_0_15px_rgba(255,0,30,0.25)]'
                          : 'bg-[#0A0909] border-[#7A0C16]/30 hover:border-[#7A0C16] hover:bg-[#120508]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#ff001e] animate-ping' : 'bg-[#7A0C16]'}`} />
                        <div>
                          <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                            <span>{t.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ff001e]/20 text-[#ff4d61] font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] text-[#918B86]">
                            {t.artist} • <span className="text-[#B06D35]">{t.mood}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#ff001e] font-bold uppercase">
                        {isPlaying ? 'PLAYING' : 'SELECT'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Horror Events & Jump Scares */}
            <div className="pt-2 border-t border-[#7A0C16]/20 space-y-2.5">
              <div className="text-[10px] text-[#918B86] uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3 text-[#B31324]" />
                <span>SUPERNATURAL EVENTS</span>
              </div>

              {/* Horror Events Toggle */}
              <div className="flex items-center justify-between p-2 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B31324]" />
                  <span className="text-[#E7E0D2]">Random Horror Events</span>
                </div>
                <button
                  onClick={handleHorrorToggle}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition border ${
                    horrorEventsEnabled
                      ? 'bg-[#B31324]/25 text-white border-[#B31324]'
                      : 'bg-[#0A0909] text-[#918B86] border-[#7A0C16]/20'
                  }`}
                >
                  {horrorEventsEnabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Jump Scare Toggle */}
              <div className="flex items-center justify-between p-2 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#B31324]" />
                  <span className="text-[#E7E0D2]">Jump Scares</span>
                </div>
                <button
                  onClick={handleJumpScareToggle}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition border ${
                    jumpScaresEnabled
                      ? 'bg-[#B31324]/25 text-white border-[#B31324]'
                      : 'bg-[#0A0909] text-[#918B86] border-[#7A0C16]/20'
                  }`}
                >
                  {jumpScaresEnabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Reduced Motion Indicator */}
              {prefersReducedMotion && (
                <div className="flex items-center gap-2 p-2 rounded bg-[#0A0909]/80 border border-[#B08D35]/30 text-[10px] text-[#B08D35]">
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>REDUCED MOTION DETECTED — intense effects minimized</span>
                </div>
              )}
            </div>

            {/* Test Sound Buttons */}
            <div className="pt-3 border-t border-[#7A0C16]/20">
              <div className="text-[10px] text-[#918B86] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#B31324]" />
                <span>Audio Engine Diagnostics</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => soundEngine.playClick()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20 text-[10px] text-[#E7E0D2] hover:text-white hover:border-[#B31324] transition"
                >
                  DARK CLICK
                </button>
                <button
                  onClick={() => soundEngine.playImpactSound()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20 text-[10px] text-[#E7E0D2] hover:text-white hover:border-[#B31324] transition"
                >
                  IMPACT
                </button>
                <button
                  onClick={() => soundEngine.playWhisperSound()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20 text-[10px] text-[#E7E0D2] hover:text-white hover:border-[#B31324] transition"
                >
                  WHISPER
                </button>
                <button
                  onClick={() => soundEngine.playPortalSound()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20 text-[10px] text-[#E7E0D2] hover:text-white hover:border-[#B31324] transition"
                >
                  PORTAL
                </button>
                <button
                  onClick={() => soundEngine.playWarningSound()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#7A0C16]/20 text-[10px] text-[#B31324] hover:border-[#B31324] transition"
                >
                  WARNING
                </button>
                <button
                  onClick={() => soundEngine.playHeartbeat()}
                  className="p-1.5 rounded bg-[#0A0909]/80 border border-[#B31324]/20 text-[10px] text-[#B31324] hover:border-[#B31324] transition"
                >
                  HEARTBEAT
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
