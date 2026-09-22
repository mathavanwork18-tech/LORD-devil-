import React from 'react';
import { Radio, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import { LordEvilLogo, LordEvilSigil } from './LordEvilLogo';

interface FooterProps {
  onRouteChange: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  const { resetDemo } = useGame();

  const handleNav = (route: string) => {
    soundEngine.playNormalClick();
    onRouteChange(route);
  };

  const handleReset = () => {
    if (window.confirm('PURGE COVENANT DATA: Are you sure you wish to reset all local codename, token, and mission records?')) {
      resetDemo();
    }
  };

  return (
    <footer className="border-t border-[#7A0C16]/30 bg-[#0A0909] text-[#918B86] py-14 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Lore */}
          <div className="md:col-span-2 space-y-4">
            <LordEvilLogo size="md" variant="dark" />
            <p className="text-xs text-[#918B86] max-w-md leading-relaxed font-sans">
              "THE WORLD ISN'T GOING TO DOMINATE ITSELF." You have been chosen. This is not a game. This is a covenant. Explore the dark. Complete the missions. Build your empire.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#B31324] bg-[#151313] px-3 py-1.5 rounded border border-[#7A0C16]/50 w-fit">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#B31324]" />
              <span>COVENANT FREQUENCY LOCKED // ALL DOMAINS MONITORED</span>
            </div>
          </div>

          {/* Col 2: Tactical Navigation */}
          <div>
            <h4 className="text-xs font-heading font-bold tracking-widest uppercase text-[#E7E0D2] mb-3">
              Imperial Sectors
            </h4>
            <ul className="space-y-2 text-xs font-heading text-[#918B86]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#B31324] transition">
                  HOME COMMAND
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('missions')} className="hover:text-[#B31324] transition">
                  MISSIONS
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} className="hover:text-[#B31324] transition">
                  SERVICES
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('command-center')} className="hover:text-[#B31324] transition">
                  COMMAND CENTER
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('lair')} className="hover:text-[#B31324] transition">
                  THE LAIR
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Archives & Dossiers */}
          <div>
            <h4 className="text-xs font-heading font-bold tracking-widest uppercase text-[#E7E0D2] mb-3">
              Archives & Comms
            </h4>
            <ul className="space-y-2 text-xs font-heading text-[#918B86]">
              <li>
                <button onClick={() => handleNav('minions')} className="hover:text-[#B31324] transition">
                  ENTITY ROSTER
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('intelligence')} className="hover:text-[#B31324] transition">
                  CLASSIFIED INTEL
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('team')} className="hover:text-[#B31324] transition">
                  HIGH COUNCIL
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('profile')} className="hover:text-[#B31324] transition">
                  OPERATIVE DOSSIER
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#B31324] transition">
                  DARK DISPATCH
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#7A0C16]/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#918B86]">
          <div className="flex items-center gap-2">
            <LordEvilSigil size={18} color="#B31324" />
            <span>© 2026 LORD EVIL — ALL REALMS SUBJUGATED. FICTIONAL COVENANT EXPERIENCE.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[11px] text-[#B31324] hover:text-red-300 transition"
              title="Reset Local Covenant Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET COVENANT</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
