import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ListMusic,
  ChevronDown,
  ChevronUp,
  Disc3,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine, SoundEngine } from '../utils/soundEngine';
import { HorrorTheme } from '../types';

export const HorrorMusicPlayer: React.FC = () => {
  const { currentTheme, setTheme, soundSettings, updateSoundSettings, toggleMute } = useGame();
  const [isPlaying, setIsPlaying] = useState<boolean>(() => soundEngine.isScaryTrackPlaying());
  const [currentTrack, setCurrentTrack] = useState(() => soundEngine.getCurrentScaryTrack());
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(soundSettings.ambienceVolume ?? 0.6);

  // Sync state with sound engine
  useEffect(() => {
    const checkState = () => {
      setIsPlaying(soundEngine.isScaryTrackPlaying());
      setCurrentTrack(soundEngine.getCurrentScaryTrack());
    };
    const interval = setInterval(checkState, 500);
    return () => clearInterval(interval);
  }, []);

  // First interaction auto-listener: Start atmosphere on user's first click anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!soundEngine.isScaryTrackPlaying()) {
        soundEngine.playScaryTrack(soundEngine.getScaryTrackId());
        setIsPlaying(true);
        setCurrentTrack(soundEngine.getCurrentScaryTrack());
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleTogglePlay = () => {
    soundEngine.playNormalClick();
    const next = soundEngine.toggleScaryThemeMusic();
    setIsPlaying(next);
    setCurrentTrack(soundEngine.getCurrentScaryTrack());
  };

  const handleNext = () => {
    soundEngine.playNormalClick();
    soundEngine.nextScaryTrack();
    setIsPlaying(true);
    setCurrentTrack(soundEngine.getCurrentScaryTrack());
  };

  const handlePrev = () => {
    soundEngine.playNormalClick();
    soundEngine.prevScaryTrack();
    setIsPlaying(true);
    setCurrentTrack(soundEngine.getCurrentScaryTrack());
  };

  const handleSelectTrack = (trackId: any) => {
    soundEngine.playNormalClick();
    soundEngine.playScaryTrack(trackId);
    setIsPlaying(true);
    setCurrentTrack(soundEngine.getCurrentScaryTrack());
    setIsPlaylistOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    updateSoundSettings({ ambienceVolume: val });
  };

  const themes: { id: HorrorTheme; name: string; icon: string; border: string; glow: string }[] = [
    { id: 'blood', name: 'BLOOD', icon: '🩸', border: '#ff001e', glow: 'rgba(255,0,30,0.5)' },
    { id: 'void', name: 'VOID', icon: '🔮', border: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
    { id: 'crypt', name: 'CRYPT', icon: '💀', border: '#34d399', glow: 'rgba(52,211,153,0.5)' },
    { id: 'noir', name: 'NOIR', icon: '🔪', border: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  ];

  return (
    <>
      {/* ── 1. MINIMIZED FLOATING BADGE (Bottom-Right) ── */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-5 right-5 z-40"
          >
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsMinimized(false);
              }}
              title="Expand Horror Theme Music Player"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#0A0507]/90 border border-[#ff001e]/60 shadow-[0_0_30px_rgba(255,0,30,0.4)] backdrop-blur-md text-white hover:border-[#ff001e] transition group cursor-pointer"
            >
              <Disc3
                className={`w-4 h-4 text-[#ff001e] ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`}
              />
              <span className="text-[10px] font-heading font-bold tracking-widest text-[#E7E0D2] group-hover:text-white uppercase">
                {isPlaying ? 'HORROR OST ACTIVE' : 'OST PAUSED'}
              </span>
              <div className="flex items-end gap-0.5 h-3">
                <div className={`w-0.5 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-1' : 'h-1'}`} />
                <div className={`w-0.5 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-3' : 'h-2'}`} />
                <div className={`w-0.5 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-2' : 'h-1.5'}`} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. FULL DOCKED HORROR OST THEME BAR ── */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-0 inset-x-0 z-40 select-none"
          >
            {/* Playlist Track Selection Drawer */}
            <AnimatePresence>
              {isPlaylistOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="max-w-xl mx-auto mb-2 px-4"
                >
                  <div className="p-3 rounded-2xl bg-[#090306]/95 border border-[#ff001e]/60 shadow-[0_0_40px_rgba(255,0,30,0.4)] backdrop-blur-xl space-y-1.5 hud-corner-crimson">
                    <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#7A0C16]/40 text-[10px] font-heading tracking-widest text-[#B06D35] uppercase">
                      <div className="flex items-center gap-1.5">
                        <ListMusic className="w-3.5 h-3.5 text-[#ff001e]" />
                        <span>HORROR THEME SOUNDTRACK LIBRARY (NO COPYRIGHT)</span>
                      </div>
                      <button
                        onClick={() => setIsPlaylistOpen(false)}
                        className="text-[#918B86] hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                      {SoundEngine.SCARY_TRACKS.map((track) => {
                        const isSelected = currentTrack.id === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => handleSelectTrack(track.id)}
                            onMouseEnter={() => soundEngine.playHover()}
                            className={`p-2 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#180508] border-[#ff001e] shadow-[0_0_15px_rgba(255,0,30,0.3)]'
                                : 'bg-[#0f0406] border-[#7A0C16]/30 hover:border-[#7A0C16] hover:bg-[#140609]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isSelected && isPlaying
                                    ? 'bg-[#ff001e] animate-ping'
                                    : isSelected
                                    ? 'bg-[#ff001e]'
                                    : 'bg-[#7A0C16]'
                                }`}
                              />
                              <div>
                                <div className="text-xs font-heading font-bold text-white flex items-center gap-2">
                                  <span>{track.name}</span>
                                  {isSelected && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ff001e]/30 text-[#ff4d61] font-mono">
                                      ACTIVE
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#918B86]">
                                  {track.artist} • <span className="text-[#B06D35]">{track.mood}</span>
                                </div>
                              </div>
                            </div>

                            <button className="text-[10px] font-heading font-bold text-[#ff4d61] hover:text-white px-2 py-1 rounded bg-[#7A0C16]/30 border border-[#7A0C16]/50">
                              {isSelected && isPlaying ? 'PLAYING' : 'PLAY'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Audio Dock Bar */}
            <div className="bg-[#070204]/95 border-t border-[#ff001e]/50 backdrop-blur-xl shadow-[0_-5px_30px_rgba(0,0,0,0.9)] px-4 sm:px-6 py-2.5">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
                {/* ── LEFT: CURRENT TRACK INFO & EQUALIZER ── */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                  <div className="flex items-center gap-2.5">
                    {/* Vinyl spinning icon */}
                    <div className="relative w-8 h-8 rounded-full bg-[#120508] border border-[#ff001e]/60 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,30,0.3)]">
                      <Disc3
                        className={`w-5 h-5 text-[#ff001e] ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-heading font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-xs">
                          {currentTrack.name}
                        </span>
                        <span className="hidden sm:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#7A0C16]/40 text-[#ff4d61] border border-[#ff001e]/30">
                          OST
                        </span>
                      </div>
                      <div className="text-[10px] text-[#918B86] truncate max-w-[220px]">
                        {currentTrack.artist} • <span className="text-[#B06D35]">{currentTrack.mood}</span>
                      </div>
                    </div>
                  </div>

                  {/* Equalizer Frequency Spectrum */}
                  <div className="flex items-end gap-1 h-5 px-2 py-0.5 rounded bg-[#0e0306] border border-[#7A0C16]/40">
                    <div className={`w-1 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-1' : 'h-1'}`} />
                    <div className={`w-1 rounded-full bg-[#ff4d61] ${isPlaying ? 'eq-bar-2' : 'h-1.5'}`} />
                    <div className={`w-1 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-3' : 'h-2'}`} />
                    <div className={`w-1 rounded-full bg-[#B31324] ${isPlaying ? 'eq-bar-4' : 'h-1'}`} />
                    <div className={`w-1 rounded-full bg-[#ff001e] ${isPlaying ? 'eq-bar-5' : 'h-2.5'}`} />
                    <div className={`w-1 rounded-full bg-[#ff4d61] ${isPlaying ? 'eq-bar-2' : 'h-1'}`} />
                  </div>
                </div>

                {/* ── CENTER: PLAYBACK CONTROLS & VOLUME ── */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handlePrev}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="p-1.5 rounded-lg text-[#918B86] hover:text-white hover:bg-[#150608] transition cursor-pointer"
                    title="Previous Horror Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isPlaying
                        ? 'bg-[#ff001e] text-white shadow-[0_0_20px_#ff001e]'
                        : 'bg-[#1a0508] border border-[#ff001e]/60 text-[#ff4d61] hover:bg-[#ff001e] hover:text-white'
                    }`}
                    title={isPlaying ? 'Pause Horror Theme' : 'Play Horror Theme'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={handleNext}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="p-1.5 rounded-lg text-[#918B86] hover:text-white hover:bg-[#150608] transition cursor-pointer"
                    title="Next Horror Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#7A0C16]/50">
                    <button
                      onClick={toggleMute}
                      className="text-[#918B86] hover:text-white transition cursor-pointer"
                      title={soundSettings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {soundSettings.isMuted ? (
                        <VolumeX className="w-4 h-4 text-[#ff001e]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#ff4d61]" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundSettings.isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-[#1a0508] rounded-lg appearance-none cursor-pointer accent-[#ff001e]"
                    />
                  </div>

                  {/* Track List Drawer Toggle */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsPlaylistOpen((v) => !v);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-heading tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
                      isPlaylistOpen
                        ? 'bg-[#ff001e]/20 border-[#ff001e] text-white'
                        : 'bg-[#120508] border-[#7A0C16]/50 text-[#918B86] hover:text-white'
                    }`}
                  >
                    <ListMusic className="w-3.5 h-3.5 text-[#ff001e]" />
                    <span className="hidden sm:inline uppercase">TRACKS</span>
                    <span className="font-mono text-[9px]">({SoundEngine.SCARY_TRACKS.length})</span>
                  </button>
                </div>

                {/* ── RIGHT: HORROR THEME PALETTE SELECTOR & MINIMIZE ── */}
                <div className="flex items-center gap-2">
                  <span className="hidden xl:inline text-[9px] font-heading tracking-widest text-[#B06D35] uppercase mr-1">
                    THEME:
                  </span>
                  <div className="flex items-center gap-1 bg-[#0d0407] p-1 rounded-xl border border-[#7A0C16]/50">
                    {themes.map((t) => {
                      const isActive = currentTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          onMouseEnter={() => soundEngine.playHover()}
                          className={`px-2 py-1 rounded-lg text-[10px] font-heading font-bold transition flex items-center gap-1 cursor-pointer ${
                            isActive
                              ? 'bg-[#22050a] text-white shadow-[0_0_12px_rgba(255,0,30,0.5)] border border-[#ff001e]'
                              : 'text-[#918B86] hover:text-white'
                          }`}
                          title={`Switch to ${t.name} Horror Theme`}
                        >
                          <span>{t.icon}</span>
                          <span className="hidden sm:inline">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Minimize button */}
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsMinimized(true);
                      setIsPlaylistOpen(false);
                    }}
                    className="p-1.5 rounded-lg text-[#918B86] hover:text-white hover:bg-[#150608] transition cursor-pointer"
                    title="Minimize Player Bar"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
