import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRank, HorrorTheme, TokenTransaction, Mission, EvilService, Minion, Achievement, AudioSettings } from '../types';
import { INITIAL_MISSIONS, INITIAL_SERVICES, INITIAL_MINIONS, INITIAL_ACHIEVEMENTS } from '../data/mockData';
import { soundEngine } from '../utils/soundEngine';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface GameContextType {
  // Theme & Atmosphere
  currentTheme: HorrorTheme;
  setTheme: (theme: HorrorTheme) => void;

  // User Profile
  codename: string | null;
  tokens: number;
  rank: UserRank;
  rankProgress: number; // 0 to 100 towards next rank
  setCodename: (name: string) => void;
  updateCodename: (name: string) => void;

  // Economy
  transactions: TokenTransaction[];
  addTokens: (amount: number, source: string) => void;
  spendTokens: (amount: number, source: string) => boolean;

  // Missions
  missions: Mission[];
  completedMissions: string[];
  activeMission: Mission | null;
  startMission: (mission: Mission) => void;
  finishActiveMission: () => void;
  cancelActiveMission: () => void;

  // Services
  services: EvilService[];
  favorites: string[];
  comparedServices: string[];
  toggleFavorite: (serviceId: string) => void;
  toggleCompare: (serviceId: string) => void;
  clearCompared: () => void;

  // Minions
  minions: Minion[];
  upgradeMinion: (minionId: string) => boolean;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Sound Settings
  soundSettings: AudioSettings;
  updateSoundSettings: (settings: Partial<AudioSettings>) => void;
  toggleMute: () => void;

  // Modals & Drawers
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isSecretTerminalOpen: boolean;
  setSecretTerminalOpen: (open: boolean) => void;
  isSoundSettingsOpen: boolean;
  setSoundSettingsOpen: (open: boolean) => void;
  isHistoryDrawerOpen: boolean;
  setHistoryDrawerOpen: (open: boolean) => void;
  isCompareDrawerOpen: boolean;
  setCompareDrawerOpen: (open: boolean) => void;

  // Feedback & Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;

  // Developer Reset
  resetDemo: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CODENAME: 'void_codename',
  TOKENS: 'void_tokens',
  COMPLETED_MISSIONS: 'void_completed_missions',
  TRANSACTIONS: 'void_transactions',
  MINIONS: 'void_minions',
  ACHIEVEMENTS: 'void_achievements',
  FAVORITES: 'void_favorites',
  THEME: 'void_active_theme',
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [currentTheme, setCurrentThemeState] = useState<HorrorTheme>(() => {
    const saved = localStorage.getItem('void_active_theme') as HorrorTheme | null;
    return saved && ['blood', 'void', 'crypt', 'noir'].includes(saved) ? saved : 'blood';
  });

  const setTheme = (theme: HorrorTheme) => {
    setCurrentThemeState(theme);
    localStorage.setItem('void_active_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    soundEngine.playNormalClick();
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Load state from localStorage
  const [codename, setCodenameState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CODENAME);
  });

  const [tokens, setTokensState] = useState<number>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return val !== null ? parseInt(val, 10) : 1250;
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_MISSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState<TokenTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'tx-init',
          type: 'grant',
          amount: 1250,
          source: 'LORD EVIL COVENANT GRANT',
          timestamp: new Date().toLocaleTimeString(),
        }
      ];
    } catch {
      return [];
    }
  });

  const [minions, setMinions] = useState<Minion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MINIONS);
      return saved ? JSON.parse(saved) : INITIAL_MINIONS;
    } catch {
      return INITIAL_MINIONS;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['srv-01'];
    } catch {
      return ['srv-01'];
    }
  });

  const [comparedServices, setComparedServices] = useState<string[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  // UI state
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isSecretTerminalOpen, setSecretTerminalOpen] = useState(false);
  const [isSoundSettingsOpen, setSoundSettingsOpen] = useState(false);
  const [isHistoryDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [isCompareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [soundSettings, setSoundSettingsState] = useState<AudioSettings>(() => soundEngine.getSettings());

  // Derive Rank
  const getRankInfo = (tokenCount: number): { rank: UserRank; progress: number } => {
    if (tokenCount < 1500) {
      return { rank: 'INITIATE', progress: Math.min(100, Math.floor((tokenCount / 1500) * 100)) };
    }
    if (tokenCount < 3000) {
      return { rank: 'OPERATIVE', progress: Math.min(100, Math.floor(((tokenCount - 1500) / 1500) * 100)) };
    }
    if (tokenCount < 5000) {
      return { rank: 'COMMANDER', progress: Math.min(100, Math.floor(((tokenCount - 3000) / 2000) * 100)) };
    }
    if (tokenCount < 8000) {
      return { rank: 'VOID ARCHITECT', progress: Math.min(100, Math.floor(((tokenCount - 5000) / 3000) * 100)) };
    }
    return { rank: 'EMPEROR', progress: 100 };
  };

  const { rank, progress: rankProgress } = getRankInfo(tokens);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // Keyboard Shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        soundEngine.playClick();
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSecretTerminalOpen(false);
        setSoundSettingsOpen(false);
        setHistoryDrawerOpen(false);
        setCompareDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state to LocalStorage
  const setCodename = (name: string) => {
    const clean = name.trim().toUpperCase();
    setCodenameState(clean);
    localStorage.setItem(STORAGE_KEYS.CODENAME, clean);
    unlockAchievement('ach-01');
    showToast(`IDENTITY VERIFIED: OPERATIVE ${clean}`, 'success');
  };

  const updateCodename = (name: string) => {
    const clean = name.trim().toUpperCase();
    if (!clean) return;
    setCodenameState(clean);
    localStorage.setItem(STORAGE_KEYS.CODENAME, clean);
    showToast(`Dossier updated: ${clean}`, 'info');
  };

  const addTokens = (amount: number, source: string) => {
    const newTotal = tokens + amount;
    setTokensState(newTotal);
    localStorage.setItem(STORAGE_KEYS.TOKENS, newTotal.toString());

    const newTx: TokenTransaction = {
      id: 'tx-' + Date.now(),
      type: 'reward',
      amount,
      source,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updatedTxs = [newTx, ...transactions].slice(0, 50);
    setTransactions(updatedTxs);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTxs));

    soundEngine.playReward();
    showToast(`+${amount} DEATH TOKENS [${source}]`, 'success');

    if (newTotal >= 2000) {
      unlockAchievement('ach-03');
    }
  };

  const spendTokens = (amount: number, source: string): boolean => {
    if (tokens < amount) {
      soundEngine.playAccessDenied();
      showToast(`INSUFFICIENT TOKENS (Need ${amount}, Have ${tokens})`, 'warning');
      return false;
    }
    const newTotal = tokens - amount;
    setTokensState(newTotal);
    localStorage.setItem(STORAGE_KEYS.TOKENS, newTotal.toString());

    const newTx: TokenTransaction = {
      id: 'tx-' + Date.now(),
      type: 'expense',
      amount,
      source,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updatedTxs = [newTx, ...transactions].slice(0, 50);
    setTransactions(updatedTxs);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTxs));

    soundEngine.playClick();
    showToast(`-${amount} DEATH TOKENS [${source}]`, 'info');
    return true;
  };

  // Missions
  const startMission = (mission: Mission) => {
    setActiveMission(mission);
    soundEngine.playScan();
    showToast(`MISSION INITIATED: ${mission.title}`, 'warning');
  };

  const cancelActiveMission = () => {
    setActiveMission(null);
    soundEngine.playClick();
    showToast('MISSION ABORTED', 'info');
  };

  const finishActiveMission = () => {
    if (!activeMission) return;
    const missionId = activeMission.id;
    const reward = activeMission.rewardTokens;

    if (!completedMissions.includes(missionId)) {
      const updated = [...completedMissions, missionId];
      setCompletedMissions(updated);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_MISSIONS, JSON.stringify(updated));
    }

    addTokens(reward, activeMission.title);
    unlockAchievement('ach-02');
    setActiveMission(null);
  };

  // Services
  const toggleFavorite = (serviceId: string) => {
    soundEngine.playClick();
    let updated: string[];
    if (favorites.includes(serviceId)) {
      updated = favorites.filter((id) => id !== serviceId);
      showToast('Removed from saved plans', 'info');
    } else {
      updated = [...favorites, serviceId];
      showToast('Saved to evil blueprints', 'success');
    }
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  };

  const toggleCompare = (serviceId: string) => {
    soundEngine.playClick();
    if (comparedServices.includes(serviceId)) {
      setComparedServices(comparedServices.filter((id) => id !== serviceId));
    } else {
      if (comparedServices.length >= 3) {
        showToast('Maximum 3 services can be compared', 'warning');
        return;
      }
      const updated = [...comparedServices, serviceId];
      setComparedServices(updated);
      setCompareDrawerOpen(true);
      if (updated.length === 3) {
        unlockAchievement('ach-07');
      }
    }
  };

  const clearCompared = () => {
    soundEngine.playClick();
    setComparedServices([]);
    setCompareDrawerOpen(false);
  };

  // Minions
  const upgradeMinion = (minionId: string): boolean => {
    const target = minions.find((m) => m.id === minionId);
    if (!target) return false;

    if (!spendTokens(target.costToUpgrade, `UPGRADE ${target.name}`)) {
      return false;
    }

    const updated = minions.map((m) => {
      if (m.id === minionId) {
        const nextLevel = m.level + 1;
        if (nextLevel >= 3) unlockAchievement('ach-04');
        return {
          ...m,
          level: nextLevel,
          power: Math.round(m.power * 1.35),
          loyalty: Math.min(100, m.loyalty + 2),
          efficiency: Math.min(100, m.efficiency + 3),
          costToUpgrade: Math.round(m.costToUpgrade * 1.6),
        };
      }
      return m;
    });

    setMinions(updated);
    localStorage.setItem(STORAGE_KEYS.MINIONS, JSON.stringify(updated));
    soundEngine.playReward();
    showToast(`${target.name} upgraded to Level ${target.level + 1}!`, 'success');
    return true;
  };

  // Achievements
  const unlockAchievement = (id: string) => {
    const target = achievements.find((a) => a.id === id);
    if (target && !target.unlockedAt) {
      const now = new Date().toLocaleTimeString();
      const updated = achievements.map((a) => (a.id === id ? { ...a, unlockedAt: now } : a));
      setAchievements(updated);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
      soundEngine.playReward();
      showToast(`ACHIEVEMENT UNLOCKED: ${target.title}`, 'success');
    }
  };

  // Audio Controls
  const updateSoundSettings = (settings: Partial<AudioSettings>) => {
    soundEngine.saveSettings(settings);
    setSoundSettingsState(soundEngine.getSettings());
  };

  const toggleMute = () => {
    const current = soundSettings.isMuted;
    updateSoundSettings({ isMuted: !current });
    if (current) {
      soundEngine.playClick();
      showToast('AUDIO SUBSYSTEM: ENGAGED', 'info');
    } else {
      showToast('AUDIO SUBSYSTEM: MUTED', 'warning');
    }
  };

  // Developer Reset
  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEYS.CODENAME);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_MISSIONS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.MINIONS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);

    setCodenameState(null);
    setTokensState(1000);
    setCompletedMissions([]);
    setTransactions([]);
    setMinions(INITIAL_MINIONS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setFavorites(['srv-01']);
    setComparedServices([]);
    setActiveMission(null);

    soundEngine.playAccessGranted();
    showToast('DEMO STATE RESET COMPLETE', 'info');
  };

  return (
    <GameContext.Provider
      value={{
        codename,
        tokens,
        rank,
        rankProgress,
        setCodename,
        updateCodename,
        transactions,
        addTokens,
        spendTokens,
        missions: INITIAL_MISSIONS,
        completedMissions,
        activeMission,
        startMission,
        finishActiveMission,
        cancelActiveMission,
        services: INITIAL_SERVICES,
        favorites,
        comparedServices,
        toggleFavorite,
        toggleCompare,
        clearCompared,
        minions,
        upgradeMinion,
        achievements,
        unlockAchievement,
        soundSettings,
        updateSoundSettings,
        toggleMute,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isSecretTerminalOpen,
        setSecretTerminalOpen,
        isSoundSettingsOpen,
        setSoundSettingsOpen,
        isHistoryDrawerOpen,
        setHistoryDrawerOpen,
        isCompareDrawerOpen,
        setCompareDrawerOpen,
        toasts,
        showToast,
        resetDemo,
        currentTheme,
        setTheme,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
