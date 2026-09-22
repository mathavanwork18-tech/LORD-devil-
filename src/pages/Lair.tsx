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
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-void-purple/25 border-void-purple text-white shadow-glow-purple'
                  : 'bg-void-900/70 border-void-purple/15 text-void-200 hover:border-void-purple/40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Layers className={`w-4 h-4 ${isSelected ? 'text-void-purple' : 'text-void-muted'}`} />
                <span className="text-[9px] font-mono text-void-crimson">{room.securityLevel.split(' ')[0]}</span>
              </div>
              <div>
                <h4 className="font-mono text-xs font-bold leading-snug line-clamp-2 uppercase">
                  {room.name}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Room Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Atmosphere & Description */}
        <div className="lg:col-span-2 void-panel rounded-2xl p-6 sm:p-8 border-void-purple/40 relative hud-corner-tl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-void-crimson uppercase tracking-widest bg-void-crimson/10 px-2.5 py-0.5 rounded border border-void-crimson/30">
              {selectedRoom.securityLevel}
            </span>
            <span className="text-[10px] font-mono text-void-muted">
              SECTOR ID: {selectedRoom.id.toUpperCase()}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">
            {selectedRoom.name}
          </h2>
          <p className="text-xs font-mono text-void-purple mb-6 uppercase tracking-wider">
            {selectedRoom.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-void-200 font-mono leading-relaxed mb-8 bg-void-900/60 p-4 rounded-xl border border-void-purple/15">
            {selectedRoom.description}
          </p>

          {/* Artifacts in Room */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-void-purple" />
              <span>CLASSIFIED RELICS & CONSOLES LOCATED IN THIS SECTOR</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedRoom.artifacts.map((art, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInspectArtifact(art)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    inspectedArtifact?.name === art.name
                      ? 'bg-void-purple/20 border-void-purple'
                      : 'bg-void-900/60 border-void-purple/15 hover:border-void-purple/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2 h-2 rounded-full bg-void-purple" />
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
