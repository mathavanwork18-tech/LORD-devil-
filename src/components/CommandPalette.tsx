import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Compass,
  Skull,
  Crosshair,
  Volume2,
  VolumeX,
  Terminal,
  Shield,
  Bot,
  Radio,
  X,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

interface CommandPaletteProps {
  onRouteChange: (route: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onRouteChange }) => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    missions,
    services,
    soundSettings,
    toggleMute,
    setSecretTerminalOpen,
    setHistoryDrawerOpen,
  } = useGame();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      category: string;
      icon: React.ComponentType<{ className?: string }>;
      action: () => void;
    }> = [
      {
        id: 'nav-home',
        title: 'Navigate to Home Command',
        category: 'Navigation',
        icon: Compass,
        action: () => onRouteChange('home'),
      },
      {
        id: 'nav-missions',
        title: 'View Cursed Missions Roster',
        category: 'Navigation',
        icon: Crosshair,
        action: () => onRouteChange('missions'),
      },
      {
        id: 'nav-services',
        title: 'Browse Evil Services & Blueprints',
        category: 'Navigation',
        icon: Skull,
        action: () => onRouteChange('services'),
      },
      {
        id: 'nav-cmd',
        title: 'Open Command Center & Tactical Map',
        category: 'Navigation',
        icon: Radio,
        action: () => onRouteChange('command-center'),
      },
      {
        id: 'nav-minions',
        title: 'Manage Minion Legions',
        category: 'Navigation',
        icon: Bot,
        action: () => onRouteChange('minions'),
      },
      {
        id: 'nav-lair',
        title: 'Enter Dr. Void’s Secret Lair',
        category: 'Navigation',
        icon: Shield,
        action: () => onRouteChange('lair'),
      },
      {
        id: 'nav-profile',
        title: 'Inspect Operative Profile & Rank',
        category: 'Navigation',
        icon: Shield,
        action: () => onRouteChange('profile'),
      },
      {
        id: 'act-wallet',
        title: 'Open Death Token Treasury History',
        category: 'Economy',
        icon: Skull,
        action: () => setHistoryDrawerOpen(true),
      },
      {
        id: 'act-terminal',
        title: 'Open Secret Access Terminal',
        category: 'Tools',
        icon: Terminal,
        action: () => setSecretTerminalOpen(true),
      },
      {
        id: 'act-mute',
        title: soundSettings.isMuted ? 'Unmute Audio Subsystem' : 'Mute Audio Subsystem',
        category: 'Audio',
        icon: soundSettings.isMuted ? Volume2 : VolumeX,
        action: () => toggleMute(),
      },
    ];

    // Add missions
    missions.forEach((m) => {
      list.push({
        id: `mission-${m.id}`,
        title: `Mission: ${m.title} [${m.difficulty}]`,
        category: 'Missions',
        icon: Crosshair,
        action: () => onRouteChange('missions'),
      });
    });

    // Add services
    services.forEach((s) => {
      list.push({
        id: `service-${s.id}`,
        title: `Service: ${s.title} (${s.priceTokens} Tokens)`,
        category: 'Services',
        icon: Skull,
        action: () => onRouteChange('services'),
      });
    });

    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [missions, services, soundSettings.isMuted, query, onRouteChange, setHistoryDrawerOpen, setSecretTerminalOpen, toggleMute]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, commands.length));
        soundEngine.playHover();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % Math.max(1, commands.length));
        soundEngine.playHover();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (commands[selectedIndex]) {
          soundEngine.playClick();
          commands[selectedIndex].action();
          setCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [isCommandPaletteOpen, commands, selectedIndex, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl void-panel rounded-2xl shadow-2xl border-void-purple/40 overflow-hidden hud-corner-tl"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-void-purple/20 bg-void-900/90">
            <Search className="w-5 h-5 text-void-purple mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, missions, services, tools..."
              autoFocus
              className="w-full bg-transparent text-white font-mono text-sm placeholder:text-void-muted focus:outline-none"
            />
            <button
              onClick={() => setCommandPaletteOpen(false)}
              className="p-1 rounded text-void-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-void-purple/10">
            {commands.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-void-muted">
                NO IMPERIAL PROTOCOLS MATCHING "{query.toUpperCase()}"
              </div>
            ) : (
              commands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                const IconComponent = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      soundEngine.playClick();
                      cmd.action();
                      setCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-xs font-mono transition ${
                      isSelected
                        ? 'bg-void-purple/25 border border-void-purple/40 text-white'
                        : 'text-void-200 hover:bg-void-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-void-purple' : 'text-void-muted'}`} />
                      <span className={isSelected ? 'text-glow-purple font-semibold' : ''}>
                        {cmd.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-void-muted uppercase tracking-wider bg-void-900/80 px-2 py-0.5 rounded border border-void-purple/20">
                      {cmd.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Hints */}
          <div className="px-4 py-2 border-t border-void-purple/20 bg-void-950 text-[10px] font-mono text-void-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>↑↓ Navigate</span>
              <span>•</span>
              <span>↵ Select</span>
              <span>•</span>
              <span>ESC Close</span>
            </div>
            <span className="text-void-crimson">DR. VOID KINETIC HUD</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
