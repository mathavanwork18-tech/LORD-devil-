import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Skull,
  Crosshair,
  Shield,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Radio,
  Activity,
  ChevronRight,
  AlertTriangle,
  Crown,
  Gem,
  Flame,
  Flower2,
  Key,
  BookOpen,
  EyeOff,
  Hourglass,
  Volume2,
  Lock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import { LordEvilSigil, LordEvilLogo } from '../components/LordEvilLogo';
import { LORD_ENTITIES, CURSED_RELICS } from '../data/mockData';
import { EmberCanvas } from '../components/EmberCanvas';

interface HomeProps {
  onRouteChange: (route: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onRouteChange }) => {
  const { codename, rank, tokens, missions, startMission } = useGame();
  const [selectedEntity, setSelectedEntity] = useState(LORD_ENTITIES[0]);
  const [activeRelic, setActiveRelic] = useState(CURSED_RELICS[0]);

  const featuredMission = missions[0];

  const handleNav = (route: string) => {
    soundEngine.playEnterConfirm();
    onRouteChange(route);
  };

  const getRelicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-6 h-6 text-[#B06D35]" />;
      case 'Gem': return <Gem className="w-6 h-6 text-[#B31324]" />;
      case 'Flame': return <Flame className="w-6 h-6 text-[#B06D35]" />;
      case 'Flower2': return <Flower2 className="w-6 h-6 text-[#7A0C16]" />;
      case 'Key': return <Key className="w-6 h-6 text-[#B06D35]" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-[#E7E0D2]" />;
      case 'EyeOff': return <EyeOff className="w-6 h-6 text-[#918B86]" />;
      case 'Hourglass': return <Hourglass className="w-6 h-6 text-[#B31324]" />;
      default: return <Sparkles className="w-6 h-6 text-[#B31324]" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E7E0D2] overflow-x-hidden">
      <EmberCanvas density={30} />

      {/* ============================================================ */}
      {/* 1. CINEMATIC HERO SECTION (MATCHING DESIGN BOARD EXACTLY)      */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[#7A0C16]/30">
        {/* Background Image of Blood Moon Citadel with Crowned Lord Evil */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/lord_evil_hero.jpg"
            alt="Lord Evil Blood Moon Citadel"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.1]"
          />
          {/* Gradients overlay to blend seamlessly into void black */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 scanlines opacity-25" />
        </div>

        {/* Floating Right Badge: NOT A GAME / NOT A DREAM / A REALITY */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex absolute top-12 right-8 lg:right-16 z-20 flex-col items-center p-4 rounded bg-[#0A0909]/80 border border-[#7A0C16]/60 backdrop-blur-md shadow-[0_0_20px_rgba(179,19,36,0.3)] text-center"
        >
          <span className="text-[10px] font-heading font-semibold text-[#918B86] tracking-[0.25em] uppercase">
            NOT A GAME
          </span>
          <span className="text-[10px] font-heading font-semibold text-[#918B86] tracking-[0.25em] uppercase my-0.5">
            NOT A DREAM
          </span>
          <span className="text-[11px] font-heading font-bold text-[#B31324] tracking-[0.25em] uppercase text-glow-crimson mb-2">
            A REALITY
          </span>
          <LordEvilSigil size={36} color="#B31324" className="animate-pulse-slow" />
        </motion.div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-left">
            {/* Clearance Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#151313]/90 border border-[#7A0C16]/80 text-[11px] font-heading tracking-widest text-[#E7E0D2] mb-6 shadow-[0_0_15px_rgba(179,19,36,0.3)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#B31324] animate-ping" />
              <span>COVENANT CITADEL // {codename ? `OPERATIVE: ${codename}` : 'GUEST DOSSIER'}</span>
            </motion.div>

            {/* Sub-heading */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm sm:text-base font-heading tracking-[0.35em] text-[#E7E0D2] uppercase mb-1 font-semibold"
            >
              WELCOME TO
            </motion.p>

            {/* Giant Dripping Horror Typography */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-horror tracking-wider text-[#B31324] text-glow-crimson leading-none mb-4"
              style={{ letterSpacing: '0.08em' }}
            >
              LORD EVIL
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-xl font-heading font-bold text-[#B31324] tracking-[0.2em] uppercase mb-4 text-glow-crimson"
            >
              "THE WORLD ISN'T GOING TO DOMINATE ITSELF."
            </motion.p>

            {/* Covenant Lore Body */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-[#918B86] leading-relaxed max-w-lg mb-8"
            >
              You have been chosen. This is not a game. This is a covenant. Explore the dark. Complete the missions. Build your empire.
            </motion.p>

            {/* Primary Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => handleNav('missions')}
                onMouseEnter={() => soundEngine.playHover()}
                className="gothic-btn px-8 py-4 text-sm flex items-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(179,19,36,0.6)]"
              >
                <span>ENTER THE EMPIRE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNav('command-center')}
                onMouseEnter={() => soundEngine.playHover()}
                className="gothic-btn-outline px-6 py-3.5 rounded text-xs flex items-center gap-2 cursor-pointer"
              >
                <Crosshair className="w-4 h-4 text-[#B31324]" />
                <span>WAR ROOM INTEL</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SYSTEM WARNING BANNER (MATCHING DESIGN BOARD)             */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="p-3.5 rounded bg-[#151313] border border-[#B31324] flex items-center justify-between shadow-[0_0_20px_rgba(179,19,36,0.4)]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B31324] animate-pulse" />
            <div>
              <span className="font-heading text-xs font-bold text-[#E7E0D2] tracking-wider uppercase mr-2">
                SYSTEM WARNING:
              </span>
              <span className="text-xs text-[#B31324] font-mono tracking-wide">
                THE VOID IS WATCHING. DIMENSIONAL SHIFT ACTIVE IN SECTOR 7.
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-heading tracking-widest text-[#918B86]">
            <span>COVENANT STATUS:</span>
            <span className="text-[#B06D35] font-bold">SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CHARACTER & ENTITY IMAGES (SAMPLES FROM DESIGN BOARD)     */}
      {/* ============================================================ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#7A0C16]/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-heading tracking-[0.25em] text-[#B31324] uppercase mb-1">
              <LordEvilSigil size={18} color="#B31324" />
              <span>COVENANT ARCHIVES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#E7E0D2] tracking-wider uppercase">
              CHARACTER & ENTITY DOSSIERS
            </h2>
          </div>
          <p className="text-xs text-[#918B86] max-w-md font-mono mt-2 sm:mt-0">
            Fictional supernatural entities bound to the Obsidian Throne. Inspect dossiers and assign operational status.
          </p>
        </div>

        {/* 5 Entity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {LORD_ENTITIES.map((entity) => {
            const isSelected = selectedEntity.id === entity.id;
            return (
              <div
                key={entity.id}
                onClick={() => {
                  soundEngine.playNormalClick();
                  setSelectedEntity(entity);
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className={`charcoal-panel rounded p-4 cursor-pointer transition duration-300 relative group ${
                  isSelected
                    ? 'border-[#B31324] shadow-[0_0_25px_rgba(179,19,36,0.6)] bg-[#151313]'
                    : 'hover:border-[#7A0C16] hover:bg-[#151313]/90'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-[10px] font-heading font-semibold text-[#918B86] mb-3">
                  <span className="text-[#B06D35]">{entity.fileNumber}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#0A0909] text-[9px] text-[#B31324] border border-[#7A0C16]/40">
                    {entity.status}
                  </span>
                </div>

                {/* Entity Avatar Silhouette Box */}
                <div className="relative h-44 rounded bg-[#0A0909] border border-[#7A0C16]/40 mb-3 flex items-center justify-center overflow-hidden group-hover:border-[#B31324] transition">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0909] via-transparent to-transparent z-10" />
                  <LordEvilSigil size={64} color={entity.auraColor} className="opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-2 left-2 z-20 text-[9px] font-mono text-[#918B86]">
                    PWR // {entity.power}
                  </div>
                </div>

                {/* Name & Title */}
                <h3 className="font-heading font-bold text-xs sm:text-sm text-[#E7E0D2] tracking-wider uppercase mb-1">
                  {entity.name}
                </h3>
                <p className="text-[10px] text-[#918B86] line-clamp-2 leading-relaxed">
                  {entity.title}
                </p>

                <div className="mt-3 pt-2 border-t border-[#7A0C16]/20 flex items-center justify-between text-[10px] font-heading text-[#B31324]">
                  <span>VIEW DOSSIER</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Entity Dossier Viewer */}
        <div className="charcoal-panel rounded p-6 sm:p-8 hud-corner-crimson">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-[#7A0C16]/30 border border-[#B31324] text-xs font-heading font-bold text-[#B31324]">
                  {selectedEntity.fileNumber}
                </span>
                <h4 className="text-xl sm:text-2xl font-heading font-extrabold text-[#E7E0D2] tracking-wider uppercase">
                  {selectedEntity.name}
                </h4>
                <span className="text-xs font-mono text-[#B06D35]">[{selectedEntity.status}]</span>
              </div>
              <p className="text-xs font-heading text-[#B06D35] uppercase tracking-widest">
                REALM: {selectedEntity.realm} // POWER INDEX: {selectedEntity.power}/100
              </p>
              <p className="text-xs sm:text-sm text-[#918B86] leading-relaxed">
                {selectedEntity.description}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => handleNav('minions')}
                onMouseEnter={() => soundEngine.playHover()}
                className="gothic-btn px-6 py-3 text-xs flex-1 lg:flex-initial flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>DEPLOY ENTITY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CURSED OBJECTS & RELICS (SAMPLES FROM DESIGN BOARD)        */}
      {/* ============================================================ */}
      <section className="py-16 bg-[#0A0909] border-t border-b border-[#7A0C16]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#7A0C16]/30">
            <div>
              <div className="flex items-center gap-2 text-xs font-heading tracking-[0.25em] text-[#B06D35] uppercase mb-1">
                <Crown className="w-4 h-4 text-[#B06D35]" />
                <span>RELIC INVENTORY</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#E7E0D2] tracking-wider uppercase">
                CURSED OBJECTS & ARTIFACTS
              </h2>
            </div>
            <p className="text-xs text-[#918B86] max-w-md font-mono mt-2 sm:mt-0">
              Ancient artifacts from the abyss. Each grants permanent passive buffs and alters empire resonance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CURSED_RELICS.map((relic) => {
              const isSelected = activeRelic.id === relic.id;
              return (
                <div
                  key={relic.id}
                  onClick={() => {
                    soundEngine.playSecret();
                    setActiveRelic(relic);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`p-3 rounded bg-[#151313] border text-center cursor-pointer transition duration-200 ${
                    isSelected
                      ? 'border-[#B06D35] shadow-[0_0_20px_rgba(176,109,53,0.5)] bg-[#1C161E]'
                      : 'border-[#7A0C16]/30 hover:border-[#7A0C16]'
                  }`}
                >
                  <div className="h-14 flex items-center justify-center mb-2">
                    {getRelicIcon(relic.iconName)}
                  </div>
                  <h4 className="font-heading font-bold text-[10px] sm:text-xs text-[#E7E0D2] uppercase truncate mb-1">
                    {relic.name}
                  </h4>
                  <p className="text-[9px] font-mono text-[#918B86] truncate">
                    {relic.category}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Relic Details Pill */}
          <div className="mt-6 p-4 rounded bg-[#151313]/90 border border-[#7A0C16]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#0A0909] border border-[#B06D35]">
                {getRelicIcon(activeRelic.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#E7E0D2] tracking-wider uppercase">
                    {activeRelic.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#B06D35]">[{activeRelic.powerTier}]</span>
                </div>
                <p className="text-xs text-[#918B86]">
                  {activeRelic.description} — <span className="text-[#B31324] font-semibold">{activeRelic.effect}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNav('lair')}
              className="px-4 py-2 rounded bg-[#0A0909] border border-[#B06D35]/50 hover:border-[#B06D35] text-xs font-heading text-[#E7E0D2] tracking-widest uppercase transition shrink-0"
            >
              INSPECT IN LAIR
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. AUDIO SYSTEM DEMO & SOUND ENGINE TESTER                   */}
      {/* ============================================================ */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="charcoal-panel rounded p-8 hud-corner-crimson">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-heading tracking-[0.25em] text-[#B31324] uppercase mb-1">
                <Volume2 className="w-4 h-4 text-[#B31324]" />
                <span>PROCEDURAL SYNTHESIZER</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-heading font-extrabold text-[#E7E0D2] tracking-wider uppercase">
                AUDIO SYSTEM & BUTTON SOUNDS
              </h3>
              <p className="text-xs text-[#918B86] mt-1 font-mono">
                Pure Web Audio API synthesizer for retro-gothic sounds. Zero audio files to download.
              </p>
            </div>

            <button
              onClick={() => {
                soundEngine.toggleDrone(true);
                soundEngine.playHeartbeat();
              }}
              className="gothic-btn-outline px-4 py-2.5 rounded text-xs flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-[#B31324]" />
              <span>TEST AMBIENT PULSE</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'NORMAL CLICK', action: () => soundEngine.playNormalClick() },
              { name: 'HOVER SOUND', action: () => soundEngine.playHover() },
              { name: 'ENTER / CONFIRM', action: () => soundEngine.playEnterConfirm() },
              { name: 'MISSION START', action: () => soundEngine.playMissionStart() },
              { name: 'MISSION COMPLETE', action: () => soundEngine.playMissionComplete() },
              { name: 'ERROR BUZZ', action: () => soundEngine.playError() },
              { name: 'LOCKED GATE', action: () => soundEngine.playLocked() },
              { name: 'SECRET VAULT', action: () => soundEngine.playSecret() },
              { name: 'VOID PORTAL', action: () => soundEngine.playPortal() },
              { name: 'SYSTEM RESET', action: () => soundEngine.playReset() },
            ].map((snd, idx) => (
              <button
                key={idx}
                onClick={snd.action}
                onMouseEnter={() => soundEngine.playHover()}
                className="p-3 rounded bg-[#0A0909] border border-[#7A0C16]/40 hover:border-[#B31324] hover:bg-[#151313] text-left transition group active:scale-95"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-[#918B86]">0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B31324] opacity-40 group-hover:opacity-100" />
                </div>
                <p className="font-heading text-xs font-bold text-[#E7E0D2] tracking-wider uppercase group-hover:text-[#B31324] transition-colors">
                  {snd.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FINAL VISION FOOTER SECTION (MATCHING DESIGN BOARD)       */}
      {/* ============================================================ */}
      <section className="py-24 text-center relative border-t border-[#7A0C16]/30 bg-[#050505]">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-[#0A0909] border border-[#B31324] shadow-[0_0_30px_rgba(179,19,36,0.6)]">
              <LordEvilSigil size={64} color="#B31324" className="animate-pulse-slow" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-6xl font-horror tracking-widest text-[#B31324] text-glow-crimson mb-4">
            LORD EVIL
          </h2>

          <p className="text-base sm:text-xl font-heading text-[#E7E0D2] tracking-widest uppercase mb-2">
            YOU DON'T JUST VISIT A WEBSITE.
          </p>
          <p className="text-base sm:text-xl font-heading font-bold text-[#B06D35] tracking-widest uppercase mb-8">
            YOU ENTER A WORLD.
          </p>

          <button
            onClick={() => handleNav('missions')}
            onMouseEnter={() => soundEngine.playHover()}
            className="gothic-btn px-10 py-4 text-sm font-bold tracking-widest cursor-pointer shadow-[0_0_35px_rgba(179,19,36,0.7)]"
          >
            ENTER THE DARKNESS
          </button>
        </div>
      </section>
    </div>
  );
};
