// ═══════════════════════════════════════════════════════════════════════════
// LORD EVIL — HORROR EVENT MANAGER
// Background system that randomly triggers atmospheric visual/audio events.
// ═══════════════════════════════════════════════════════════════════════════

import { soundEngine } from './soundEngine';

// ─── Event Types ─────────────────────────────────────────────────────────
export type HorrorEventType =
  | 'fogSurge'
  | 'shadowPass'
  | 'redFlicker'
  | 'distantWhisper'
  | 'screenGlitch'
  | 'mysteriousSymbol'
  | 'eyeAppearance'
  | 'shadowFigure'
  | 'portalPulse'
  | 'suddenSilence'
  | 'ancientText'
  | 'jumpScare';

export interface HorrorEvent {
  type: HorrorEventType;
  startTime: number;
  duration: number;  // ms
}

// ─── Event Config ────────────────────────────────────────────────────────
interface EventConfig {
  probability: number;  // 0-1, chance per tick
  cooldown: number;     // ms, minimum time between same event type
  duration: [number, number]; // [min, max] ms
}

const EVENT_CONFIGS: Record<HorrorEventType, EventConfig> = {
  fogSurge:        { probability: 0.08, cooldown: 15000, duration: [2000, 3000] },
  shadowPass:      { probability: 0.05, cooldown: 20000, duration: [1000, 2000] },
  redFlicker:      { probability: 0.06, cooldown: 12000, duration: [300, 500] },
  distantWhisper:  { probability: 0.07, cooldown: 10000, duration: [500, 500] },
  screenGlitch:    { probability: 0.04, cooldown: 18000, duration: [300, 800] },
  mysteriousSymbol: { probability: 0.03, cooldown: 25000, duration: [1000, 1000] },
  eyeAppearance:   { probability: 0.02, cooldown: 30000, duration: [1500, 1500] },
  shadowFigure:    { probability: 0.015, cooldown: 45000, duration: [3000, 5000] },
  portalPulse:     { probability: 0.05, cooldown: 15000, duration: [800, 800] },
  suddenSilence:   { probability: 0.02, cooldown: 30000, duration: [2000, 2000] },
  ancientText:     { probability: 0.03, cooldown: 20000, duration: [1200, 1200] },
  jumpScare:       { probability: 0.008, cooldown: 30000, duration: [1500, 1500] },
};

// ─── Subscriber callback type ────────────────────────────────────────────
type EventCallback = (event: HorrorEvent | null) => void;

// ═══════════════════════════════════════════════════════════════════════════
// MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class HorrorEventManagerClass {
  private isRunning = false;
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private cooldowns = new Map<HorrorEventType, number>(); // type → last fired timestamp
  private activeEvent: HorrorEvent | null = null;
  private subscribers: Set<EventCallback> = new Set();
  private enabled = true;
  private jumpScareEnabled = true;
  private isBlocked = false; // true when modals/forms are open
  private prefersReducedMotion = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  // ── Subscription ───────────────────────────────────────────────────────
  public subscribe(callback: EventCallback): () => void {
    this.subscribers.add(callback);
    return () => { this.subscribers.delete(callback); };
  }

  private notifySubscribers(event: HorrorEvent | null) {
    this.subscribers.forEach(cb => cb(event));
  }

  // ── Control ────────────────────────────────────────────────────────────
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Tick every 8 seconds to check for random events
    this.tickTimer = setInterval(() => this.tick(), 8000);
  }

  public stop() {
    this.isRunning = false;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    this.activeEvent = null;
    this.notifySubscribers(null);
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.activeEvent = null;
      this.notifySubscribers(null);
    }
  }

  public setJumpScareEnabled(enabled: boolean) {
    this.jumpScareEnabled = enabled;
  }

  /** Call when modals/forms are open to block events */
  public setBlocked(blocked: boolean) {
    this.isBlocked = blocked;
  }

  public getActiveEvent(): HorrorEvent | null {
    return this.activeEvent;
  }

  // ── Force trigger (for testing) ────────────────────────────────────────
  public forceEvent(type: HorrorEventType) {
    this.triggerEvent(type);
  }

  // ── Main tick ──────────────────────────────────────────────────────────
  private tick() {
    if (!this.enabled || !this.isRunning || this.isBlocked) return;
    if (this.activeEvent) return; // don't overlap events

    const now = Date.now();
    const eventTypes = Object.keys(EVENT_CONFIGS) as HorrorEventType[];

    // Shuffle for variety
    const shuffled = eventTypes.sort(() => Math.random() - 0.5);

    for (const type of shuffled) {
      if (type === 'jumpScare' && !this.jumpScareEnabled) continue;

      const config = EVENT_CONFIGS[type];
      const lastFired = this.cooldowns.get(type) || 0;

      // Check cooldown
      if (now - lastFired < config.cooldown) continue;

      // Probability check
      if (Math.random() > config.probability) continue;

      // Skip visual-heavy events for reduced motion
      if (this.prefersReducedMotion) {
        const visualHeavy: HorrorEventType[] = ['screenGlitch', 'jumpScare', 'redFlicker', 'shadowPass'];
        if (visualHeavy.includes(type)) continue;
      }

      this.triggerEvent(type);
      return; // Only one event per tick
    }
  }

  private triggerEvent(type: HorrorEventType) {
    const config = EVENT_CONFIGS[type];
    const duration = config.duration[0] + Math.random() * (config.duration[1] - config.duration[0]);

    this.cooldowns.set(type, Date.now());

    const event: HorrorEvent = {
      type,
      startTime: Date.now(),
      duration,
    };

    this.activeEvent = event;
    this.notifySubscribers(event);

    // Play associated audio
    this.playEventAudio(type);

    // Auto-clear after duration
    setTimeout(() => {
      if (this.activeEvent === event) {
        this.activeEvent = null;
        this.notifySubscribers(null);
      }
    }, duration);
  }

  private playEventAudio(type: HorrorEventType) {
    switch (type) {
      case 'distantWhisper':
        soundEngine.playWhisperSound();
        break;
      case 'screenGlitch':
      case 'redFlicker':
        soundEngine.playGlitchStatic();
        break;
      case 'shadowPass':
      case 'shadowFigure':
        soundEngine.playDistantRumble();
        break;
      case 'portalPulse':
        soundEngine.playPortalSound();
        break;
      case 'jumpScare':
        // Duck ambient first, then hit
        soundEngine.duckAmbient(3500);
        setTimeout(() => soundEngine.playReaperJumpscareRoar(), 200);
        break;
      case 'suddenSilence':
        soundEngine.duckAmbient(2000);
        break;
      case 'fogSurge':
      case 'mysteriousSymbol':
      case 'eyeAppearance':
      case 'ancientText':
        // These are visual-only or very subtle audio
        break;
    }
  }
}

export const horrorEventManager = new HorrorEventManagerClass();
