import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Layers,
  Sparkles,
  Lock,
  Flame,
  Radio,
  Eye,
  Key,
  Database,
  ArrowRight,
} from 'lucide-react';
import { LAIR_ROOMS } from '../data/mockData';
import { LairRoom } from '../types';
import { soundEngine } from '../utils/soundEngine';

export const Lair: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<LairRoom>(LAIR_ROOMS[0]);
  const [inspectedArtifact, setInspectedArtifact] = useState<{
    name: string;
    description: string;
    status: 'ACTIVE' | 'CONTAINED' | 'STANDBY';
  } | null>(null);

  const handleSelectRoom = (room: LairRoom) => {
    soundEngine.playClick();
    setSelectedRoom(room);
    setInspectedArtifact(null);
  };

  const handleInspectArtifact = (art: typeof inspectedArtifact) => {
    soundEngine.playScan();
    setInspectedArtifact(art);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>SUBTERRANEAN STRONGHOLD ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          THE EVIL <span className="text-void-purple text-glow-purple">LAIR</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Dr. Void’s personal citadel carved beneath the dormant magma chambers of Mount Erebus. Six classified sectors housing ancient relics and doomsday arrays.
        </p>
      </div>

      {/* Room Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {LAIR_ROOMS.map((room) => {
          const isSelected = selectedRoom.id === room.id;
          return (
            <button
              key={room.id}
              onClick={() => handleSelectRoom(room)}
              onMouseEnter={() => soundEngine.playHover()}
              className={`rounded-xl border text-left transition flex flex-col justify-between h-32 overflow-hidden relative group ${
                isSelected
                  ? 'border-void-crimson shadow-[0_0_20px_rgba(179,19,36,0.5)] ring-2 ring-void-crimson/50'
                  : 'border-void-purple/20 hover:border-void-crimson/50'
              }`}
            >
              {/* Thumbnail Background */}
              {room.image && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover filter brightness-50 group-hover:brightness-75 transition duration-300"
                  />
                  <div className={`absolute inset-0 ${isSelected ? 'bg-void-crimson/30' : 'bg-black/60'} transition`} />
                </div>
              )}

              <div className="relative z-10 p-3 flex flex-col justify-between h-full w-full">
                <div className="flex items-center justify-between w-full">
                  <Layers className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-void-muted'}`} />
                  <span className="text-[8px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded border border-void-crimson/40">
                    {room.securityLevel.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-mono text-[11px] font-bold leading-tight line-clamp-2 uppercase text-white group-hover:text-red-300">
                    {room.name}
                  </h4>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Room Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Atmosphere & Description */}
        <div className="lg:col-span-2 void-panel rounded-2xl overflow-hidden border border-void-crimson/40 relative shadow-2xl">
          {/* Cinematic Room Visual Feed */}
          {selectedRoom.image && (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-void-950">
              <motion.img
                key={selectedRoom.id}
                initial={{ scale: 1.08, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a16] via-[#0e0a16]/30 to-black/60" />
              <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />

              {/* HUD Coordinates & Sector Status Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white font-bold uppercase tracking-widest bg-void-crimson/90 px-2.5 py-0.5 rounded border border-void-crimson">
                    {selectedRoom.securityLevel}
                  </span>
                  <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    SECTOR {selectedRoom.id.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-void-crimson/30">
                  <span className="w-2 h-2 rounded-full bg-void-crimson animate-ping" />
                  <span className="text-[10px] font-mono text-white">LIVE SURVEILLANCE FEED</span>
                </div>
              </div>

              {/* Title on lower part of image */}
              <div className="absolute bottom-4 left-6 right-6 z-10">
                <p className="text-[11px] font-mono text-void-crimson mb-1 uppercase tracking-widest font-bold">
                  {selectedRoom.subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-wide text-glow-crimson">
                  {selectedRoom.name}
                </h2>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 pt-4">
            <p className="text-xs sm:text-sm text-void-200 font-mono leading-relaxed mb-6 bg-void-900/80 p-4 rounded-xl border border-void-purple/20">
              {selectedRoom.description}
            </p>

            {/* Artifacts in Room */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-void-crimson" />
                <span>CLASSIFIED RELICS & CONSOLES LOCATED IN THIS SECTOR</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedRoom.artifacts.map((art, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleInspectArtifact(art)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      inspectedArtifact?.name === art.name
                        ? 'bg-void-crimson/20 border-void-crimson shadow-[0_0_15px_rgba(179,19,36,0.3)]'
                        : 'bg-void-900/60 border-void-purple/15 hover:border-void-crimson/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-2 h-2 rounded-full bg-void-crimson" />
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          art.status === 'ACTIVE'
                            ? 'bg-green-500/20 text-green-400'
                            : art.status === 'CONTAINED'
                            ? 'bg-void-crimson/20 text-void-crimson'
                            : 'bg-void-muted/20 text-void-muted'
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                    <h5 className="font-mono text-xs font-bold text-white mb-1">{art.name}</h5>
                    <p className="text-[11px] text-void-muted line-clamp-2">{art.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Artifact Scanner Inspector */}
        <div className="void-panel rounded-2xl p-6 border-void-purple/40 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-void-purple" />
              <span>SUBSURFACE SPECTROMETER</span>
            </div>

            {inspectedArtifact ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-void-900 border border-void-purple/30 glow-border">
                  <div className="text-[10px] font-mono text-void-crimson uppercase mb-1">
                    STATUS: {inspectedArtifact.status}
                  </div>
                  <h4 className="text-lg font-bold font-mono text-white mb-2">
                    {inspectedArtifact.name}
                  </h4>
                  <p className="text-xs font-mono text-void-200 leading-relaxed">
                    {inspectedArtifact.description}
                  </p>
                </div>

                <div className="p-3 bg-void-900/60 rounded-lg border border-void-purple/15 text-[11px] font-mono text-void-muted space-y-1">
                  <div>QUANTUM SIGNATURE: 99.82 GHz</div>
                  <div>ISOTOPE DECAY: ZERO (STABLE)</div>
                  <div>SECURITY SEAL: INTACT</div>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 text-center text-xs font-mono text-void-muted">
                SELECT ANY RELIC OR CONSOLE TO INITIATE SPECTRAL SCAN.
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-void-purple/20 text-center">
            <p className="text-[10px] font-mono text-void-crimson uppercase">
              WARNING: DO NOT TOUCH THE RED MOON HOLO-PROJECTOR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
