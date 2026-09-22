import React from 'react';
import { Skull, AlertOctagon, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NotFoundProps {
  onReturn: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onReturn }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 select-none">
      <div className="max-w-md void-panel rounded-3xl p-8 sm:p-10 border-void-crimson/40 text-center relative hud-corner-tl glow-border-crimson">
        <div className="w-20 h-20 rounded-2xl bg-void-crimson/15 border border-void-crimson/50 flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10 text-void-crimson animate-pulse" />
        </div>

        <div className="text-xs font-mono text-void-crimson tracking-widest uppercase mb-1">
          ANOMALY DETECTED // SECTOR UNCHARTED
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white mb-3">
          DIMENSION <span className="text-void-crimson text-glow-crimson">404</span>
        </h1>
        <p className="text-xs sm:text-sm font-mono text-void-muted leading-relaxed mb-8">
          You have slipped beyond the containment boundaries of Dr. Void’s empire into an unstable quantum vacuum. Reality does not exist at these coordinates.
        </p>

        <button
          onClick={() => {
            soundEngine.playAccessGranted();
            onReturn();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-bold font-mono tracking-widest text-white text-xs flex items-center justify-center gap-2 shadow-glow-purple transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO THE EMPIRE</span>
        </button>
      </div>
    </div>
  );
};
