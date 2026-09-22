import React from 'react';
import { Skull, Compass, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  const timelineEvents = [
    {
      year: '2018',
      title: 'THE EXPULSION FROM ACADEMIA',
      desc: 'Dr. Archibald Void is stripped of tenure at Cambridge after demonstrating that the laws of thermodynamics can be bent using focused psychic frustration.',
    },
    {
      year: '2021',
      title: 'DISCOVERY OF THE SUB-STRATA',
      desc: 'Excavation beneath Mount Erebus reveals the first natural rift into the Void dimension. Dark matter synthesis begins.',
    },
    {
      year: '2023',
      title: 'FORMATION OF THE COUNCIL',
      desc: 'Lady Eclipse and Baron Malice align their operations, forming the triumvirate of Dr. Void: The Evil Empire.',
    },
    {
      year: '2025',
      title: 'OPERATION BLOOD MOON',
      desc: 'Orbital satellite array synchronizes with subterranean amplifiers. The death token economy is launched across all clandestine networks.',
    },
    {
      year: '2026',
      title: 'ERA OF RECRUITMENT',
      desc: 'The Identity Gate opens to operatives worldwide. The world isn’t going to dominate itself.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ORIGINS & MANIFESTO</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          THE STORY OF <span className="text-void-purple text-glow-purple">DR. VOID</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          "Mediocrity is the only true crime of the mortal species. We exist to provide theatrical excellence in world subjugation."
        </p>
      </div>

      {/* Origin Story Block */}
      <div className="void-panel rounded-2xl p-6 sm:p-8 border-void-purple/40 mb-12 relative hud-corner-tl space-y-4 text-xs sm:text-sm font-mono text-void-200 leading-relaxed">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
          I. THE GENESIS OF SHADOW
        </h3>
        <p>
          Before he was Dr. Void, Archibald was simply the most dangerous intellect of his century. Where other physicists spent careers seeking grant money for standard-model particle physics, Void looked past the cosmic veil into the dark plasma that binds the multiverse together.
        </p>
        <p>
          Realizing that mortal society was choked in bureaucratic stagnation, he established the Empire with a single foundational tenet: Total authoritarian efficiency delivered with impeccable theatrical flair.
        </p>
      </div>

      {/* Interactive Timeline */}
      <div className="mb-12">
        <h3 className="text-sm font-bold font-mono tracking-widest text-white uppercase mb-8 flex items-center gap-2">
          <Clock className="w-4 h-4 text-void-crimson" />
          <span>IMPERIAL CHRONOLOGY (2018 — 2026)</span>
        </h3>

        <div className="relative border-l-2 border-void-purple/30 ml-4 pl-6 space-y-8">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-void-950 border-2 border-void-purple group-hover:border-void-crimson group-hover:scale-125 transition" />

              <span className="text-xs font-bold font-mono text-void-crimson uppercase tracking-wider">
                {evt.year}
              </span>
              <h4 className="text-base font-bold font-mono text-white mt-0.5 mb-1 group-hover:text-void-purple transition">
                {evt.title}
              </h4>
              <p className="text-xs font-mono text-void-muted leading-relaxed">
                {evt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
