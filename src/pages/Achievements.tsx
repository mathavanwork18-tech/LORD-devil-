import React from 'react';
import { Award, Lock, CheckCircle2, Skull, Coins, Bot, Terminal, Crown, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Achievements: React.FC = () => {
  const { achievements } = useGame();

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-void-muted'}`;
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Skull':
        return <Skull className={className} />;
      case 'Coins':
        return <Coins className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Volume2':
        return <Volume2 className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span>IMPERIAL TROPHY ROOM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          VOID <span className="text-void-purple text-glow-purple">ACHIEVEMENTS</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Unlock badges through local mastery: surviving cursed missions, executing hacker terminal overrides, and expanding minion forces.
        </p>

        <div className="mt-4 text-xs font-mono text-void-200">
          UNLOCKED: <span className="text-yellow-400 font-bold">{unlockedCount} / {achievements.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = Boolean(ach.unlockedAt);

          return (
            <div
              key={ach.id}
              className={`void-card rounded-2xl p-6 flex flex-col justify-between transition ${
                isUnlocked
                  ? 'border-yellow-500/40 bg-void-900/90 glow-border'
                  : 'opacity-60 border-void-purple/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-yellow-400/10 border-yellow-400/40'
                        : 'bg-void-950 border-void-purple/20'
                    }`}
                  >
                    {getIcon(ach.icon, isUnlocked)}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                      <CheckCircle2 className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-void-muted bg-void-950 px-2 py-0.5 rounded border border-void-purple/15">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold font-mono text-white mb-2 uppercase">
                  {ach.title}
                </h3>
                <p className="text-xs text-void-muted font-mono leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-void-purple/10 text-[10px] font-mono text-void-muted">
                {isUnlocked ? `UNLOCKED AT ${ach.unlockedAt}` : 'CONDITIONS NOT MET'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
