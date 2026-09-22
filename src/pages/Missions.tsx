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
  const [isCustomHuntOpen, setIsCustomHuntOpen] = useState<boolean>(false);
  const [customTargetName, setCustomTargetName] = useState<string>('INQUISITOR VANE');
  const [customCurseMethod, setCustomCurseMethod] = useState<string>('Abyssal Singularity');
  const [customImage, setCustomImage] = useState<string>('/assets/horror/entities/reaper_demon.jpg');

  const TARGET_PORTRAITS = [
    { id: 'p1', name: 'Grim Harvester', image: '/assets/horror/entities/reaper_demon.jpg' },
    { id: 'p2', name: 'Last Room Phantom', image: '/assets/horror/entities/mission-01-last-room.jpg' },
    { id: 'p3', name: 'Shadow Hunter', image: '/assets/horror/entities/mission-02-shadow-hunt.jpg' },
    { id: 'p4', name: 'The Vanishing Entity', image: '/assets/horror/entities/mission-03-the-vanishing.jpg' },
    { id: 'p5', name: 'Void Walker Nemesis', image: '/assets/horror/entities/mission-04-void-walker.jpg' },
    { id: 'p6', name: 'Red Warden Colossus', image: '/assets/horror/entities/mission-05-red-warden.jpg' },
  ];

  const CURSE_METHODS = [
    { title: 'Abyssal Singularity', desc: 'Target is atomized into antimatter particles within 20 seconds.' },
    { title: 'Blood Moon Severance', desc: 'Demonic winged fiends drag target from the mortal realm.' },
    { title: 'Crypt Entombment', desc: 'Target is sealed into an impenetrable obsidian void sarcophagus.' },
    { title: 'Reaper’s Judgement', desc: 'The Grim Executioner claims the soul with a blood-forged scythe.' },
  ];

  const handleLaunchCustomHunt = () => {
    soundEngine.playMissionStart();
    const cleanName = customTargetName.trim().toUpperCase() || 'VOID ADVERSARY';
    const mission: Mission = {
      id: `custom-hunt-${Date.now()}`,
      title: `VOID HUNT: ${cleanName}`,
      subtitle: 'Classified 20-Second Elimination Protocol',
      entityName: cleanName,
      category: 'CLASSIFIED',
      difficulty: 'LETHAL',
      durationSec: 20,
      rewardTokens: 1000,
      description: `Target declared: ${cleanName}. Condemned under the rite of ${customCurseMethod}. Exactly 20 seconds of containment required.`,
      objective: `Maintain void entrapment while ${customCurseMethod} disintegrates target mortal ties.`,
      completionMessage: `Target ${cleanName} has perished and been dragged into the abyss! +1,000 Death Tokens harvested.`,
      iconName: 'Skull',
      threatColor: '#ff001e',
      image: customImage,
    };
    setIsCustomHuntOpen(false);
    startMission(mission);
  };

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

      {/* ── CUSTOM VOID HUNT / ELIMINATION PROTOCOL HERO CTA ── */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-[#ff001e]/60 shadow-[0_0_40px_rgba(255,0,30,0.25)] bg-[#0A0407] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0C16]/40 border border-[#ff001e] text-[10px] font-heading tracking-widest text-[#ff4d61] uppercase">
            <Skull className="w-3.5 h-3.5 text-[#ff001e] animate-pulse" />
            <span>20-SECOND ELIMINATION CHAMBER</span>
          </div>
          <h2 className="font-horror text-2xl sm:text-4xl text-[#ff001e] tracking-wider text-horror-fiction drop-shadow-[0_0_20px_#ff001e] uppercase">
            DECLARE A CUSTOM VOID TARGET
          </h2>
          <p className="text-xs sm:text-sm text-[#b8b0a9] max-w-xl font-sans leading-relaxed">
            Name any fictional traitor or nemesis. Choose their doomed portrait and curse method. Subject them to 20 seconds of escalating supernatural terror and harvest a <span className="text-[#ff001e] font-bold">+1,000 Death Token</span> bounty upon their elimination.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playSecret();
            setIsCustomHuntOpen(true);
          }}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#7A0C16] via-[#B31324] to-[#ff001e] text-white font-heading font-extrabold tracking-widest text-xs uppercase shadow-[0_0_30px_rgba(255,0,30,0.5)] hover:brightness-125 transition flex items-center gap-3 cursor-pointer shrink-0 border border-[#ff001e]"
        >
          <Skull className="w-4 h-4 text-white" />
          <span>DECLARE TARGET & HUNT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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
              className={`void-card rounded-2xl overflow-hidden flex flex-col justify-between relative group ${
                isDone ? 'border-green-500/30' : ''
              }`}
            >
              {/* Horror Mission Image Banner */}
              {mission.image && (
                <div className="relative w-full h-44 overflow-hidden">
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a12]/40" />
                  {/* Animated threat pulse overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: mission.threatColor }}
                  />
                  {/* Difficulty badge on image */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="text-[9px] font-mono font-bold tracking-widest px-2 py-1 rounded-md border backdrop-blur-sm"
                      style={{
                        color: mission.threatColor,
                        borderColor: `${mission.threatColor}50`,
                        backgroundColor: `${mission.threatColor}15`,
                      }}
                    >
                      {mission.difficulty}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
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
                        {!mission.image && (
                          <div className="text-[10px] font-mono text-void-muted">
                            THREAT: {mission.difficulty}
                          </div>
                        )}
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
              className="w-full max-w-lg void-panel rounded-2xl overflow-hidden border-void-purple/50 shadow-2xl relative hud-corner-tl"
            >
              <button
                onClick={() => setPreviewMission(null)}
                className="absolute top-4 right-4 p-1 text-void-muted hover:text-white z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Preview Horror Image */}
              {previewMission.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={previewMission.image}
                    alt={previewMission.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/60 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{ background: `radial-gradient(ellipse at center, ${previewMission.threatColor}30, transparent 70%)` }}
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CUSTOM VOID HUNT CREATION MODAL ── */}
      <AnimatePresence>
        {isCustomHuntOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#090306] border-2 border-[#ff001e] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,0,30,0.4)] text-left hud-corner-crimson max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCustomHuntOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#918B86] hover:text-white z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0C16]/30 border border-[#ff001e]/50 text-[10px] font-heading tracking-widest text-[#ff4d61] mb-2 uppercase">
                    <Skull className="w-3.5 h-3.5 text-[#ff001e]" />
                    <span>SOUL CONDEMNATION CHAMBER</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-wider text-[#E7E0D2] uppercase">
                    DECLARE VOID TARGET
                  </h2>
                  <p className="text-xs text-[#918B86] font-mono mt-1">
                    Designate any fictional target for supernatural claiming. The 20-second sequence will initiate immediately.
                  </p>
                </div>

                {/* Target Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-heading tracking-widest text-[#ff4d61] uppercase">
                    TARGET CODENAME / ADVERSARY IDENTIFIER
                  </label>
                  <input
                    type="text"
                    value={customTargetName}
                    onChange={(e) => setCustomTargetName(e.target.value)}
                    placeholder="Enter target name (e.g. Rogue Inquisitor, Corrupted Marshal)..."
                    className="w-full px-4 py-3 bg-[#120508] border border-[#7A0C16] rounded-xl text-sm font-heading tracking-wider text-white placeholder:text-[#6a5e59] focus:outline-none focus:border-[#ff001e] focus:shadow-[0_0_15px_rgba(255,0,30,0.3)] uppercase"
                  />
                </div>

                {/* Target Visage / Portrait Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-heading tracking-widest text-[#B06D35] uppercase">
                    SELECT CONDEMNED VISAGE
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TARGET_PORTRAITS.map((portrait) => {
                      const isSelected = customImage === portrait.image;
                      return (
                        <div
                          key={portrait.id}
                          onClick={() => {
                            soundEngine.playClick();
                            setCustomImage(portrait.image);
                          }}
                          className={`relative rounded-lg overflow-hidden border cursor-pointer transition aspect-square group ${
                            isSelected
                              ? 'border-[#ff001e] ring-2 ring-[#ff001e]/60 shadow-[0_0_15px_rgba(255,0,30,0.4)]'
                              : 'border-[#7A0C16]/40 opacity-70 hover:opacity-100 hover:border-[#ff001e]/60'
                          }`}
                        >
                          <img src={portrait.image} alt={portrait.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-1 inset-x-1 text-[8px] font-heading font-bold text-center text-white truncate">
                            {portrait.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Curse Method Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-heading tracking-widest text-[#B06D35] uppercase">
                    SELECT UNHOLY CURSE PROTOCOL
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CURSE_METHODS.map((method) => {
                      const isSelected = customCurseMethod === method.title;
                      return (
                        <div
                          key={method.title}
                          onClick={() => {
                            soundEngine.playClick();
                            setCustomCurseMethod(method.title);
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#180508] border-[#ff001e] shadow-[0_0_15px_rgba(255,0,30,0.25)]'
                              : 'bg-[#0f0406] border-[#7A0C16]/40 hover:border-[#ff001e]/50'
                          }`}
                        >
                          <div className="font-heading text-xs font-bold text-[#E7E0D2]">{method.title}</div>
                          <div className="text-[10px] text-[#918B86] mt-0.5">{method.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mission Specs Summary */}
                <div className="p-4 rounded-xl bg-[#0f0406] border border-[#7A0C16]/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[#918B86]">CONTAINMENT LOCK:</span>{' '}
                    <span className="text-[#ff4d61] font-bold font-heading">20 SECONDS</span>
                  </div>
                  <div>
                    <span className="text-[#918B86]">BOUNTY HARVEST:</span>{' '}
                    <span className="text-[#ff001e] font-extrabold font-heading text-glow-crimson">+1,000 DEATH TOKENS</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCustomHuntOpen(false)}
                    className="w-1/3 py-3.5 rounded-xl bg-[#120508] border border-[#7A0C16]/50 text-xs font-heading tracking-wider text-[#918B86] hover:text-white cursor-pointer"
                  >
                    ABORT
                  </button>

                  <button
                    onClick={handleLaunchCustomHunt}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-[#7A0C16] via-[#B31324] to-[#ff001e] hover:brightness-125 font-bold font-heading tracking-widest text-xs text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,0,30,0.5)] transition active:scale-95 border border-[#ff001e] cursor-pointer"
                  >
                    <Skull className="w-4 h-4 text-white" />
                    <span>INITIATE 20s VOID EXECUTION</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
