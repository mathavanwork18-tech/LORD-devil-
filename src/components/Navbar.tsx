import React, { useState } from 'react';
import {
  Skull,
  Volume2,
  VolumeX,
  Search,
  Terminal,
  Menu,
  X,
  SlidersHorizontal,
  User,
  Music,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';
import { LordEvilLogo, LordEvilSigil } from './LordEvilLogo';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange }) => {
  const {
    codename,
    tokens,
    soundSettings,
    toggleMute,
    setCommandPaletteOpen,
    setSecretTerminalOpen,
    setSoundSettingsOpen,
    setHistoryDrawerOpen,
  } = useGame();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(() => soundEngine.isScaryTrackPlaying());

  // Exact navigation items from design board
  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'missions', label: 'MISSIONS' },
    { id: 'services', label: 'SERVICES' },
    { id: 'lair', label: 'LAIR' },
    { id: 'command-center', label: 'COMMAND CENTER' },
    { id: 'intelligence', label: 'INTELLIGENCE' },
    { id: 'profile', label: 'PROFILE' },
  ];

  const handleNavClick = (routeId: string) => {
    soundEngine.playNormalClick();
    onRouteChange(routeId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#7A0C16]/30 bg-[#0A0909]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with 8-pointed sigil */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('home')}
              onMouseEnter={() => soundEngine.playHover()}
              className="flex items-center gap-2 group/lordlogo focus:outline-none"
              aria-label="Lord Evil Home"
            >
              <LordEvilLogo size="sm" variant="dark" />
            </button>
          </div>

          {/* Desktop Nav Items in Cinzel Gothic font */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`relative px-3.5 py-2 text-xs font-heading tracking-[0.18em] uppercase transition duration-200 ${
                    isActive
                      ? 'text-[#FFFFFF] text-glow-crimson font-bold border-b-2 border-[#B31324] bg-[#7A0C16]/15'
                      : 'text-[#918B86] hover:text-[#E7E0D2] hover:bg-[#151313]/60'
                  }`}
                >
                  {item.label}
                  {item.id === 'missions' && (
                    <span className="absolute top-1.5 right-1 w-1.5 h-1.5 bg-[#B31324] rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & Tokens matching design board */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1,250 DEATH TOKENS Badge */}
            <button
              onClick={() => {
                soundEngine.playNormalClick();
                setHistoryDrawerOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              title="Covenant Treasury — Click to inspect"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#151313] border border-[#7A0C16] hover:border-[#B31324] shadow-[0_0_15px_rgba(179,19,36,0.25)] hover:shadow-[0_0_20px_rgba(179,19,36,0.5)] transition group active:scale-95"
            >
              <Skull className="w-4 h-4 text-[#B31324] group-hover:scale-110 transition-transform" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-xs sm:text-sm font-bold text-[#E7E0D2] tracking-wider">
                  {tokens.toLocaleString()}
                </span>
                <span className="hidden sm:inline-block text-[9px] font-heading font-semibold text-[#B31324] tracking-widest uppercase">
                  DEATH TOKENS
                </span>
              </div>
            </button>

            {/* Ctrl+K Search / Command Palette */}
            <button
              onClick={() => {
                soundEngine.playNormalClick();
                setCommandPaletteOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              title="Command Palette (Ctrl+K)"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#151313]/80 border border-[#7A0C16]/40 text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition text-xs font-mono"
            >
              <Search className="w-3.5 h-3.5 text-[#B31324]" />
              <span className="text-[10px]">⌘K</span>
            </button>

            {/* Secret Terminal Launch Button */}
            <button
              onClick={() => {
                soundEngine.playTerminalChirp();
                setSecretTerminalOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              title="Forbidden Vault Terminal"
              className="p-2 rounded bg-[#151313]/80 border border-[#7A0C16]/40 text-[#918B86] hover:text-red-400 hover:border-[#B31324] transition"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Quick Scary Horror Theme Music Button */}
            <button
              onClick={() => {
                soundEngine.playNormalClick();
                const nextState = soundEngine.toggleScaryThemeMusic();
                setIsMusicActive(nextState);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                soundEngine.nextScaryTrack();
                setIsMusicActive(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              title={`Scary Horror Theme Music (${soundEngine.getScaryTrackId().toUpperCase()}) - Click to toggle, Right-click to switch track`}
              className={`p-2 rounded border transition flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
                isMusicActive
                  ? 'bg-[#220408] border-[#ff001e] text-[#ff001e] shadow-[0_0_15px_rgba(255,0,30,0.5)]'
                  : 'bg-[#151313]/80 border-[#7A0C16]/40 text-[#918B86] hover:text-[#ff4d61] hover:border-[#ff001e]'
              }`}
            >
              <Music className={`w-4 h-4 ${isMusicActive ? 'animate-pulse text-[#ff001e]' : ''}`} />
              <span className="hidden xl:inline text-[10px] tracking-wider uppercase font-bold">
                {isMusicActive ? 'HORROR OST' : 'OST'}
              </span>
            </button>

            {/* Sound Mute / Controls */}
            <button
              onClick={toggleMute}
              onMouseEnter={() => soundEngine.playHover()}
              title={soundSettings.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded bg-[#151313]/80 border border-[#7A0C16]/40 text-[#918B86] hover:text-[#E7E0D2] hover:border-[#B31324] transition"
            >
              {soundSettings.isMuted ? (
                <VolumeX className="w-4 h-4 text-[#B31324]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#E7E0D2]" />
              )}
            </button>

            {/* Sound Mixer / Settings Modal */}
            <button
              onClick={() => {
                soundEngine.playNormalClick();
                setSoundSettingsOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              title="Atmospheric Sound Settings"
              className="hidden sm:block p-2 rounded bg-[#151313]/80 border border-[#7A0C16]/40 text-[#918B86] hover:text-[#E7E0D2] transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Profile Avatar with Crimson Ring */}
            <button
              onClick={() => handleNavClick('profile')}
              onMouseEnter={() => soundEngine.playHover()}
              title={codename ? `Operative ${codename}` : 'Profile Dossier'}
              className="relative p-1.5 rounded-full bg-[#151313] border border-[#B31324] hover:shadow-[0_0_15px_rgba(179,19,36,0.6)] transition"
            >
              <User className="w-4 h-4 text-[#E7E0D2]" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B31324]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded bg-[#151313] border border-[#7A0C16]/60 text-[#E7E0D2] hover:border-[#B31324] transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#7A0C16]/40 bg-[#0A0909]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 text-left text-xs font-heading tracking-widest rounded border transition ${
                    isActive
                      ? 'bg-[#7A0C16]/30 border-[#B31324] text-white font-bold'
                      : 'bg-[#151313]/80 border-[#7A0C16]/30 text-[#918B86] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#7A0C16]/30 flex items-center justify-between">
            <button
              onClick={() => {
                soundEngine.playNormalClick();
                setSoundSettingsOpen(true);
              }}
              className="text-xs font-heading tracking-wider text-[#918B86] hover:text-white flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B31324]" />
              <span>Audio Controls</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playNormalClick();
                setCommandPaletteOpen(true);
              }}
              className="text-xs font-heading tracking-wider text-[#918B86] hover:text-white flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#B31324]" />
              <span>Command Palette</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
