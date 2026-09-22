import React from 'react';
import { Shield, Sparkles, Award, Skull, Radio } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/mockData';
import { soundEngine } from '../utils/soundEngine';

export const Team: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-crimson/15 border border-void-crimson/30 text-xs font-mono text-void-crimson mb-3 uppercase tracking-widest">
          <Skull className="w-3.5 h-3.5" />
          <span>IMPERIAL EXECUTIVE HIERARCHY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          COUNCIL OF <span className="text-void-crimson text-glow-crimson">DOOM</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          The chief architects behind the Void. Fictional visionary villains commanding quantum cybernetics, psionic espionage, and occult bio-warfare.
        </p>
      </div>

      {/* Leadership Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="void-card rounded-2xl p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-void-crimson/15 text-void-crimson border border-void-crimson/30">
                  {member.clearance}
                </span>
                <span className="text-[10px] font-mono text-void-muted uppercase">
                  {member.department}
                </span>
              </div>

              <h3 className="text-xl font-bold font-mono text-white group-hover:text-void-purple transition mb-1">
                {member.name}
              </h3>
              <div className="text-xs font-mono text-void-purple mb-4 font-semibold">
                {member.title}
              </div>

              <p className="text-xs text-void-muted font-mono leading-relaxed mb-6">
                {member.bio}
              </p>

              {/* Abilities */}
              <div className="mb-6 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-void-muted tracking-wider mb-1">
                  TACTICAL MASTERIES
                </div>
                {member.abilities.map((ab, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono text-void-200"
                  >
                    <span className="w-1.5 h-1.5 bg-void-crimson rounded-full" />
                    <span>{ab}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="pt-4 border-t border-void-purple/15">
              <blockquote className="text-xs font-mono italic text-void-muted border-l-2 border-void-purple pl-3">
                {member.quote}
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
