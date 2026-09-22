import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crosshair,
  Search,
  CheckCircle2,
  AlertTriangle,
  Skull,
  X,
  Play,
  ArrowRight,
  Flame,
  Ghost,
  DoorClosed,
  Timer,
  ShieldAlert,
} from 'lucide-react';
import { Mission } from '../types';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const Missions: React.FC = () => {
  const { missions, completedMissions, startMission } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [previewMission, setPreviewMission] = useState<Mission | null>(null);

  const categories = ['ALL', 'MYSTERY', 'SURVIVAL', 'SUPERNATURAL', 'CLASSIFIED'];
  const difficulties = ['ALL', 'MEDIUM', 'HIGH', 'EXTREME', 'LETHAL'];

  const filteredMissions = useMemo(() => {
    return missions.filter((m) => {
      const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'ALL' || m.difficulty === selectedDifficulty;
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [missions, selectedCategory, selectedDifficulty, searchQuery]);

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorClosed':
        return <DoorClosed className="w-5 h-5 text-void-purple" />;
      case 'Ghost':
        return <Ghost className="w-5 h-5 text-void-crimson" />;
      case 'Timer':
        return <Timer className="w-5 h-5 text-void-purple" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-void-crimson" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-yellow-400" />;
      default:
        return <Skull className="w-5 h-5 text-void-purple" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-crimson/15 border border-void-crimson/30 text-xs font-mono text-void-crimson mb-3 uppercase tracking-widest">
          <Crosshair className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" />
          <span>REALM OPERATIONS (20-SECOND CONTAINMENT PROTOCOLS)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          CURSED <span className="text-void-crimson text-glow-crimson">MISSIONS</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Survive 20 seconds of escalating supernatural terror. Neutralize entities without violence, claim cosmic Death Tokens, and expand Dr. Void's territory.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="void-panel rounded-2xl p-4 sm:p-5 mb-8 border-void-purple/30 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-void-purple absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search missions by entity, codename, or objective..."
            className="w-full pl-10 pr-4 py-2.5 bg-void-900/90 border border-void-purple/20 rounded-xl text-xs font-mono text-white placeholder:text-void-muted focus:outline-none focus:border-void-purple"
          />
        </div>

        {/* Category & Difficulty Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-void-purple/15">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-void-muted text-[10px] mr-1 uppercase">CLASS:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  selectedCategory === cat
                    ? 'bg-void-purple text-white border-void-purple font-bold'
                    : 'bg-void-900 text-void-200 border-void-purple/15 hover:border-void-purple/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-void-muted text-[10px] uppercase">THREAT:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                soundEngine.playClick();
                setSelectedDifficulty(e.target.value);
              }}
              className="bg-void-900 border border-void-purple/30 text-xs font-mono text-white px-2.5 py-1.5 rounded-lg focus:outline-none"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mission Count Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-void-muted mb-6 px-1">
        <div>
          SHOWING {filteredMissions.length} OF {missions.length} AVAILABLE ASSIGNMENTS
        </div>
        <div>
          COMPLETED: <span className="text-green-400 font-bold">{completedMissions.length} / {missions.length}</span>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => {
          const isDone = completedMissions.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`void-card rounded-2xl p-6 flex flex-col justify-between relative group ${
                isDone ? 'border-green-500/30' : ''
              }`}
            >
              {/* Top Meta Chips */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-void-900 border border-void-purple/20">
                      {getMissionIcon(mission.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-void-crimson uppercase">
                        {mission.category}
                      </span>
                      <div className="text-[10px] font-mono text-void-muted">
                        THREAT: {mission.difficulty}
                      </div>
                    </div>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                      <CheckCircle2 className="w-3 h-3" /> DONE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-void-purple bg-void-purple/10 px-2 py-0.5 rounded border border-void-purple/30">
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-mono text-white group-hover:text-void-purple transition mb-1">
                  {mission.title}
                </h3>
                <div className="text-xs font-mono text-void-crimson mb-3 uppercase">
                  TARGET: {mission.entityName}
                </div>

                <p className="text-xs text-void-muted leading-relaxed mb-6 line-clamp-3">
                  {mission.description}
                </p>
              </div>

              {/* Bottom Stakes & Actions */}
              <div className="pt-4 border-t border-void-purple/15">
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-void-muted">BOUNTY:</span>
                  <span className="font-bold text-yellow-400">+{mission.rewardTokens} DEATH TOKENS</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setPreviewMission(mission);
                    }}
                    className="py-2.5 rounded-lg bg-void-900 hover:bg-void-850 border border-void-purple/30 text-xs font-mono text-void-200 hover:text-white transition"
                  >
                    PREVIEW
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playScan();
                      startMission(mission);
                    }}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="py-2.5 rounded-lg bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-bold font-mono tracking-wider text-xs text-white flex items-center justify-center gap-1.5 shadow-glow-purple transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>ACCEPT</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Preview Modal */}
      <AnimatePresence>
        {previewMission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg void-panel rounded-2xl p-6 sm:p-8 border-void-purple/50 shadow-2xl relative hud-corner-tl"
            >
              <button
                onClick={() => setPreviewMission(null)}
                className="absolute top-4 right-4 p-1 text-void-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[10px] font-mono text-void-crimson uppercase tracking-widest mb-1">
                CLASSIFIED BRIEFING // {previewMission.id.toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold font-mono text-white mb-2">
                {previewMission.title}
              </h2>
              <div className="text-xs font-mono text-void-purple mb-4">
                ENTITY IDENTIFIER: {previewMission.entityName}
              </div>

              <div className="space-y-3 text-xs font-mono text-void-200 mb-6 bg-void-900/80 p-4 rounded-xl border border-void-purple/20">
                <div>
                  <span className="text-void-muted block mb-1">OCCURRENCE BRIEF:</span>
                  <p className="text-white leading-relaxed">{previewMission.description}</p>
                </div>
                <div className="pt-2 border-t border-void-purple/10">
                  <span className="text-void-muted block mb-1">PRIMARY OBJECTIVE:</span>
                  <p className="text-yellow-300 font-semibold">{previewMission.objective}</p>
                </div>
                <div className="pt-2 border-t border-void-purple/10 flex justify-between">
                  <span className="text-void-muted">LOCKDOWN DURATION:</span>
                  <span className="text-white font-bold">20 SECONDS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-void-muted">VICTORY PAYOUT:</span>
                  <span className="text-yellow-400 font-bold">+{previewMission.rewardTokens} DEATH TOKENS</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewMission(null)}
                  className="w-1/2 py-3 rounded-lg bg-void-900 border border-void-purple/20 text-xs font-mono text-void-200 hover:text-white"
                >
                  RETURN TO ROSTER
                </button>

                <button
                  onClick={() => {
                    const target = previewMission;
                    setPreviewMission(null);
                    startMission(target);
                  }}
                  className="w-1/2 py-3 rounded-lg bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-bold font-mono tracking-widest text-xs text-white flex items-center justify-center gap-2 shadow-glow-purple transition active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ENGAGE RUNNER</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
