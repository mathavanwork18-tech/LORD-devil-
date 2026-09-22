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
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Bot className="w-3.5 h-3.5" />
          <span>LEGION SUBJUGATION BARRACKS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          MINION <span className="text-void-purple text-glow-purple">ARMY</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Upgrade and deploy synthetic shadows, cultist zealots, and cybernetic siege titans. Invest Death Tokens to raise their lethality.
        </p>
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
