import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  Shield,
  Coins,
  ArrowUp,
  Sparkles,
  CheckCircle2,
  Award,
  Skull,
  Flame,
  Swords,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const Minions: React.FC = () => {
  const { minions, tokens, upgradeMinion } = useGame();

  const handleUpgrade = (id: string) => {
    upgradeMinion(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0C16]/30 border border-[#ff001e]/40 text-xs font-heading text-[#ff4d61] mb-3 uppercase tracking-widest">
          <Skull className="w-3.5 h-3.5 text-[#ff001e] animate-pulse" />
          <span>LEGION SUBJUGATION BARRACKS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-wider text-white uppercase mb-2">
          MINION <span className="text-[#ff001e] text-glow-crimson">ARMY</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#918B86] font-mono leading-relaxed">
          Upgrade and deploy synthetic shadows, cultist zealots, and cybernetic siege titans. Invest Death Tokens to raise their lethality.
        </p>
      </div>

      {/* ── CINEMATIC MINION ARMY HORDE SHOWCASE ── */}
      <div className="relative rounded-2xl overflow-hidden mb-12 border border-[#7A0C16]/70 shadow-[0_0_50px_rgba(179,19,36,0.35)] group bg-[#080204]">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src="/assets/horror/entities/minion_army_horde.jpg"
            alt="Lord Evil Minion Army Horde"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 filter contrast-125 brightness-95"
          />
          {/* Crimson gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/85 via-transparent to-[#050505]/85" />

          {/* Floating tactical lore and stats */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A0C16]/70 border border-[#ff001e]/60 text-[11px] font-heading tracking-widest text-[#ff4d61] mb-2 uppercase shadow-[0_0_15px_rgba(255,0,30,0.4)]">
                <Flame className="w-3.5 h-3.5 text-[#ff001e] animate-pulse" />
                <span>ACTIVE HORDE DEPLOYMENT // 666,000 DEMONIC UNITS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-horror tracking-wider text-[#ff001e] text-glow-crimson mb-1 uppercase">
                THE CRIMSON SUBJUGATION LEGION
              </h2>
              <p className="text-xs sm:text-sm text-[#d4ccc5] font-sans leading-relaxed">
                Bound by dark covenant under the Blood Eclipse. Winged gargoyles, shadowed wraiths, and biomechanical siege fiends march upon the mortal plane at Lord Evil's command.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-lg bg-[#070306]/90 border border-[#7A0C16] text-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="text-[10px] font-mono text-[#918B86] uppercase tracking-wider">TOTAL ACTIVE POWER</div>
                <div className="text-xl font-heading font-extrabold text-[#ff001e]">
                  {minions.reduce((acc, m) => acc + m.power, 0).toLocaleString()}
                </div>
              </div>
              <div className="px-4 py-2.5 rounded-lg bg-[#070306]/90 border border-[#7A0C16] text-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                <div className="text-[10px] font-mono text-[#918B86] uppercase tracking-wider">COMMANDER STATUS</div>
                <div className="text-xl font-heading font-extrabold text-[#B06D35]">SUPREME</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {minions.map((minion) => {
          const canAfford = tokens >= minion.costToUpgrade;

          return (
            <div
              key={minion.id}
              className="void-card rounded-2xl p-6 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-void-purple/15 text-void-purple border border-void-purple/30">
                    {minion.tier} TIER
                  </span>
                  <span className="text-xs font-mono text-yellow-400 font-bold">
                    LEVEL {minion.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-mono text-white group-hover:text-void-purple transition mb-1">
                  {minion.name}
                </h3>
                <div className="text-xs font-mono text-void-crimson uppercase mb-3">
                  ROLE: {minion.role}
                </div>

                <p className="text-xs text-void-muted leading-relaxed mb-6">
                  {minion.description}
                </p>

                {/* Stats Bars */}
                <div className="space-y-3 mb-6 bg-void-900/60 p-3.5 rounded-xl border border-void-purple/15 text-xs font-mono">
                  {/* Power */}
                  <div>
                    <div className="flex justify-between text-void-200 mb-1">
                      <span>COMBAT POWER</span>
                      <span className="font-bold text-white">{minion.power}</span>
                    </div>
                    <div className="w-full h-1.5 bg-void-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-void-purple rounded-full"
                        style={{ width: `${Math.min(100, (minion.power / 300) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Loyalty */}
                  <div>
                    <div className="flex justify-between text-void-200 mb-1">
                      <span>LOYALTY INDEX</span>
                      <span className="font-bold text-green-400">{minion.loyalty}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-void-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${minion.loyalty}%` }}
                      />
                    </div>
                  </div>

                  {/* Efficiency */}
                  <div>
                    <div className="flex justify-between text-void-200 mb-1">
                      <span>OPERATIONAL EFFICIENCY</span>
                      <span className="font-bold text-void-crimson">{minion.efficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-void-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-void-crimson rounded-full"
                        style={{ width: `${minion.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Ability */}
                <div className="p-3 bg-void-900/80 rounded-lg border border-void-purple/20 text-xs font-mono mb-6">
                  <div className="text-[10px] font-bold text-void-purple uppercase mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>TACTICAL PASSIVE</span>
                  </div>
                  <p className="text-[11px] text-void-muted leading-relaxed">
                    {minion.specialAbility}
                  </p>
                </div>
              </div>

              {/* Upgrade Button */}
              <div className="pt-4 border-t border-void-purple/15">
                <button
                  onClick={() => handleUpgrade(minion.id)}
                  disabled={!canAfford}
                  className={`w-full py-3 rounded-xl font-bold font-mono tracking-wider text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                    canAfford
                      ? 'bg-gradient-to-r from-void-purple to-void-crimson text-white shadow-glow-purple hover:brightness-110'
                      : 'bg-void-900 text-void-muted border border-void-purple/20 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>
                    UPGRADE UNIT ({minion.costToUpgrade} TOKENS)
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
