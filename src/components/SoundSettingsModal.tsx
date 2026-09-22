import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, SlidersHorizontal, Activity, Music } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const SoundSettingsModal: React.FC = () => {
  const {
    soundSettings,
    updateSoundSettings,
    toggleMute,
    isSoundSettingsOpen,
    setSoundSettingsOpen,
  } = useGame();

  const [droneEnabled, setDroneEnabled] = useState(false);

  if (!isSoundSettingsOpen) return null;

  const handleDroneToggle = () => {
    const next = !droneEnabled;
    setDroneEnabled(next);
    soundEngine.toggleDrone(next);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md void-panel rounded-2xl p-6 border-void-purple/40 shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-void-purple/20">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-void-purple" />
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest text-white uppercase">
                AUDIO SUBSYSTEM MIXER
              </h2>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                setSoundSettingsOpen(false);
              }}
              className="p-1 rounded text-void-muted hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-5 text-xs font-mono">
            {/* Master Mute Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-void-900 border border-void-purple/20">
              <div className="flex items-center gap-2.5">
                {soundSettings.isMuted ? (
                  <VolumeX className="w-4 h-4 text-void-crimson" />
                ) : (
                  <Volume2 className="w-4 h-4 text-void-purple" />
                )}
                <div>
                  <div className="text-white font-semibold">MASTER SOUND BUS</div>
                  <div className="text-[10px] text-void-muted">
                    {soundSettings.isMuted ? 'ALL CHANNELS MUTED' : 'SYNTHESIS ACTIVE'}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  soundSettings.isMuted
                    ? 'bg-void-crimson/20 text-void-crimson border border-void-crimson/40'
                    : 'bg-void-purple/20 text-void-purple border border-void-purple/40'
                }`}
              >
                {soundSettings.isMuted ? 'UNMUTE' : 'MUTE'}
              </button>
            </div>

            {/* Volume Sliders */}
            <div className="space-y-4">
              {/* Master Volume */}
              <div>
                <div className="flex justify-between text-void-200 mb-1">
                  <span>MASTER VOLUME</span>
                  <span>{Math.round(soundSettings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundSettings.masterVolume}
                  onChange={(e) => updateSoundSettings({ masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-void-purple cursor-pointer bg-void-800"
                />
              </div>

              {/* UI Volume */}
              <div>
                <div className="flex justify-between text-void-200 mb-1">
                  <span>UI FEEDBACK & CHIRPS</span>
                  <span>{Math.round(soundSettings.uiVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundSettings.uiVolume}
                  onChange={(e) => updateSoundSettings({ uiVolume: parseFloat(e.target.value) })}
                  className="w-full accent-void-purple cursor-pointer bg-void-800"
                />
              </div>

              {/* FX Volume */}
              <div>
                <div className="flex justify-between text-void-200 mb-1">
                  <span>HORROR FX & PULSES</span>
                  <span>{Math.round(soundSettings.fxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundSettings.fxVolume}
                  onChange={(e) => updateSoundSettings({ fxVolume: parseFloat(e.target.value) })}
                  className="w-full accent-void-crimson cursor-pointer bg-void-800"
                />
              </div>

              {/* Ambience Volume */}
              <div>
                <div className="flex justify-between text-void-200 mb-1">
                  <span>AMBIENCE CARRIER</span>
                  <span>{Math.round(soundSettings.ambienceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundSettings.ambienceVolume}
                  onChange={(e) => updateSoundSettings({ ambienceVolume: parseFloat(e.target.value) })}
                  className="w-full accent-void-purple cursor-pointer bg-void-800"
                />
              </div>
            </div>

            {/* Procedural Horror Soundtrack & Ambience Generator */}
            <div className="pt-2 border-t border-void-purple/20 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-void-900/80 border border-void-crimson/30">
                <div className="flex items-center gap-2 text-void-200">
                  <Music className="w-4 h-4 text-void-crimson animate-pulse" />
                  <div>
                    <div className="font-bold text-white text-[11px]">TERRIFYING HORROR SOUNDTRACK</div>
                    <div className="text-[9px] text-void-muted">Sub-bass drone, heartbeat pulse & haunted chimes</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = soundEngine.toggleHorrorMusic();
                    setDroneEnabled(next);
                  }}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition border ${
                    soundEngine.isHorrorMusicActive()
                      ? 'bg-void-crimson/30 text-white border-void-crimson shadow-[0_0_12px_rgba(179,19,36,0.5)]'
                      : 'bg-void-900 text-void-muted border-void-purple/20 hover:text-white'
                  }`}
                >
                  {soundEngine.isHorrorMusicActive() ? 'STOP MUSIC' : 'PLAY MUSIC'}
                </button>
              </div>

              <div className="flex items-center justify-between px-1 text-[11px]">
                <div className="flex items-center gap-2 text-void-muted">
                  <Activity className="w-3.5 h-3.5 text-void-purple" />
                  <span>Simple 55Hz Carrier Drone</span>
                </div>
                <button
                  onClick={handleDroneToggle}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition ${
                    droneEnabled
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : 'bg-void-900 text-void-muted border border-void-purple/20'
                  }`}
                >
                  {droneEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Test Cue Buttons */}
            <div className="pt-3 border-t border-void-purple/20">
              <div className="text-[10px] text-void-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3 text-void-purple" />
                <span>Audio Engine Diagnostic Tones</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => soundEngine.playClick()}
                  className="p-1.5 rounded bg-void-900/80 border border-void-purple/20 text-[10px] text-void-200 hover:text-white hover:border-void-purple"
                >
                  UI CLICK
                </button>
                <button
                  onClick={() => soundEngine.playAccessGranted()}
                  className="p-1.5 rounded bg-void-900/80 border border-void-purple/20 text-[10px] text-void-200 hover:text-white hover:border-void-purple"
                >
                  ACCESS OK
                </button>
                <button
                  onClick={() => soundEngine.playHeartbeat()}
                  className="p-1.5 rounded bg-void-900/80 border border-void-crimson/20 text-[10px] text-void-crimson hover:border-void-crimson"
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
