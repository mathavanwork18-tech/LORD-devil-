export type UserRank = 'INITIATE' | 'OPERATIVE' | 'COMMANDER' | 'VOID ARCHITECT' | 'EMPEROR';

export interface TokenTransaction {
  id: string;
  type: 'reward' | 'expense' | 'grant';
  amount: number;
  source: string;
  timestamp: string;
}

export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  entityName: string;
  category: 'MYSTERY' | 'SURVIVAL' | 'SUPERNATURAL' | 'CLASSIFIED';
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' | 'LETHAL';
  durationSec: number;
  rewardTokens: number;
  description: string;
  objective: string;
  completionMessage: string;
  iconName: string;
  threatColor: string;
  image?: string;
}

export interface EvilService {
  id: string;
  title: string;
  category: 'GLOBAL' | 'TECH' | 'SPACE' | 'MYSTERY' | 'CUSTOM';
  priceTokens: number;
  threatLevel: number; // 1-100
  successRate: number; // percentage e.g. 99.4
  description: string;
  features: string[];
  tags: string[];
  quote: string;
  image?: string;
}

export interface Minion {
  id: string;
  name: string;
  role: string;
  tier: 'BASIC' | 'ELITE' | 'CHAMPION' | 'COLOSSAL';
  level: number;
  power: number;
  loyalty: number;
  efficiency: number;
  costToUpgrade: number;
  description: string;
  specialAbility: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  clearance: string;
  department: string;
  bio: string;
  abilities: string[];
  quote: string;
}

export interface IntelReport {
  id: string;
  code: string;
  title: string;
  classification: 'CONFIDENTIAL' | 'SECRET' | 'TOP SECRET' | 'RESTRICTED';
  timestamp: string;
  summary: string;
  interceptedFrom: string;
  status: 'INTERCEPTED' | 'DECRYPTED' | 'ANALYZED';
}

export interface LairRoom {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  securityLevel: string;
  image?: string;
  artifacts: {
    name: string;
    description: string;
    status: 'ACTIVE' | 'CONTAINED' | 'STANDBY';
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface AudioSettings {
  masterVolume: number;
  uiVolume: number;
  ambienceVolume: number;
  fxVolume: number;
  isMuted: boolean;
}

export interface LordEntity {
  id: string;
  fileNumber: string;
  name: string;
  title: string;
  status: 'ACTIVE' | 'CONTAINED' | 'SUMMONED' | 'DORMANT';
  auraColor: string;
  glowClass: string;
  description: string;
  power: number;
  realm: string;
}

export interface CursedRelic {
  id: string;
  name: string;
  category: string;
  powerTier: string;
  description: string;
  effect: string;
  iconName: string;
}
