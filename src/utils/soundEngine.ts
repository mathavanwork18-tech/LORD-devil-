// ═══════════════════════════════════════════════════════════════════════════
// LORD EVIL — HORROR AUDIO MANAGER
// Centralized Web Audio API engine: layered ambient, button SFX,
// page-specific atmospheres, horror event sounds.
// ═══════════════════════════════════════════════════════════════════════════

import { AudioSettings } from '../types';

const STORAGE_KEY_AUDIO = 'void_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  uiVolume: 0.8,
  ambienceVolume: 0.4,
  fxVolume: 0.8,
  isMuted: false,
};

// ─── Page Atmosphere Profiles ────────────────────────────────────────────
interface HorrorProfile {
  dronePitch: number;       // Hz, base drone frequency
  droneDetune: number;      // Hz, second oscillator offset for beating
  filterCutoff: number;     // Hz, lowpass cutoff
  heartbeatSpeed: number;   // ms interval
  heartbeatVolume: number;  // 0-1 relative
  whisperDensity: number;   // 0-1, chance of whisper per cycle
  tensionLevel: number;     // 0-1, overall intensity
  chimeInterval: number;    // ms between creepy chimes
}

const PAGE_PROFILES: Record<string, HorrorProfile> = {
  home: {
    dronePitch: 43.65, droneDetune: 1.15, filterCutoff: 120,
    heartbeatSpeed: 2800, heartbeatVolume: 0.12,
    whisperDensity: 0.15, tensionLevel: 0.3, chimeInterval: 5000,
  },
  missions: {
    dronePitch: 38.89, droneDetune: 1.8, filterCutoff: 150,
    heartbeatSpeed: 2000, heartbeatVolume: 0.18,
    whisperDensity: 0.25, tensionLevel: 0.55, chimeInterval: 3500,
  },
  services: {
    dronePitch: 46.25, droneDetune: 0.9, filterCutoff: 100,
    heartbeatSpeed: 3200, heartbeatVolume: 0.08,
    whisperDensity: 0.1, tensionLevel: 0.2, chimeInterval: 6000,
  },
  lair: {
    dronePitch: 36.71, droneDetune: 2.2, filterCutoff: 90,
    heartbeatSpeed: 2400, heartbeatVolume: 0.15,
    whisperDensity: 0.35, tensionLevel: 0.5, chimeInterval: 4000,
  },
  'command-center': {
    dronePitch: 41.20, droneDetune: 1.5, filterCutoff: 160,
    heartbeatSpeed: 1800, heartbeatVolume: 0.2,
    whisperDensity: 0.2, tensionLevel: 0.65, chimeInterval: 3000,
  },
  intelligence: {
    dronePitch: 49.0, droneDetune: 0.7, filterCutoff: 80,
    heartbeatSpeed: 3600, heartbeatVolume: 0.06,
    whisperDensity: 0.4, tensionLevel: 0.35, chimeInterval: 4500,
  },
  profile: {
    dronePitch: 46.25, droneDetune: 0.5, filterCutoff: 100,
    heartbeatSpeed: 3200, heartbeatVolume: 0.06,
    whisperDensity: 0.08, tensionLevel: 0.15, chimeInterval: 7000,
  },
  default: {
    dronePitch: 43.65, droneDetune: 1.0, filterCutoff: 110,
    heartbeatSpeed: 2800, heartbeatVolume: 0.1,
    whisperDensity: 0.12, tensionLevel: 0.25, chimeInterval: 5500,
  },
};

// Sinister diminished scale for chimes
const SINISTER_NOTES = [
  349.23, 392.00, 415.30, 493.88, 523.25, 554.37, 698.46, 783.99,
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings;
  private lastHoverTime = 0;

  // ── Ambient system nodes ───────────────────────────────────────────────
  private isAmbientRunning = false;
  private ambientDroneOsc1: OscillatorNode | null = null;
  private ambientDroneOsc2: OscillatorNode | null = null;
  private ambientDroneFilter: BiquadFilterNode | null = null;
  private ambientDroneGain: GainNode | null = null;
  private ambientWindSource: AudioBufferSourceNode | null = null;
  private ambientWindGain: GainNode | null = null;
  private ambientWhisperGain: GainNode | null = null;
  private ambientWhisperSource: AudioBufferSourceNode | null = null;
  private ambientMetalOsc: OscillatorNode | null = null;
  private ambientMetalFilter: BiquadFilterNode | null = null;
  private ambientMetalGain: GainNode | null = null;

  // ── Timers ─────────────────────────────────────────────────────────────
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private chimeTimer: ReturnType<typeof setInterval> | null = null;
  private impactTimer: ReturnType<typeof setInterval> | null = null;

  // ── Current profile ────────────────────────────────────────────────────
  private currentProfile: HorrorProfile = PAGE_PROFILES.default;
  private currentPage = 'home';

  // ── Simple drone (legacy compat) ───────────────────────────────────────
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDroneRunning = false;

  // ── Authentic Scary Horror Theme Tracks ────────────────────────────────
  private scaryTrackAudio: HTMLAudioElement | null = null;
  private currentScaryTrackId: 'track1' | 'track2' | 'procedural' = 'track1';
  private isScaryMusicActive = false;

  public static readonly SCARY_TRACKS = [
    {
      id: 'track1' as const,
      name: 'Little Girl With Dark Hair',
      artist: 'Gregoire Lourme (Cinematic Horror Vol. 9)',
      mood: 'Gothic Haunting / Ghostly Dread',
      url: '/assets/horror/audio/scary_horror_theme_1.mp3',
    },
    {
      id: 'track2' as const,
      name: 'Slasher Kills',
      artist: 'Gregoire Lourme (Cinematic Horror Vol. 9)',
      mood: 'Relentless Terror / Slasher Suspense',
      url: '/assets/horror/audio/scary_horror_theme_2.mp3',
    },
    {
      id: 'procedural' as const,
      name: 'Abyssal Void Engine',
      artist: 'Lord Evil Procedural Audio Synthesizer',
      mood: 'Deep Sub-Bass & Sinister Whispers',
      url: '',
    },
  ];

  constructor() {
    this.settings = this.loadSettings();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ═════════════════════════════════════════════════════════════════════════

  private loadSettings(): AudioSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIO);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return { ...DEFAULT_SETTINGS };
  }

  public saveSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY_AUDIO, JSON.stringify(this.settings));
    } catch { /* ignore */ }
    // Live-update ambient volume
    this.updateAmbientVolumes();
    this.updateScaryTrackVolume();
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // ── Scary Theme Song Playback Controls ─────────────────────────────────
  public getScaryTrackId(): 'track1' | 'track2' | 'procedural' {
    return this.currentScaryTrackId;
  }

  public isScaryTrackPlaying(): boolean {
    return this.isScaryMusicActive;
  }

  public playScaryTrack(trackId: 'track1' | 'track2' | 'procedural') {
    this.currentScaryTrackId = trackId;
    this.isScaryMusicActive = true;

    if (trackId === 'procedural') {
      if (this.scaryTrackAudio) {
        this.scaryTrackAudio.pause();
      }
      this.startAmbient();
      return;
    }

    // Stop procedural ambient so authentic horror music track shines
    this.stopAmbient();

    const trackObj = SoundEngine.SCARY_TRACKS.find(t => t.id === trackId);
    if (!trackObj || !trackObj.url) return;

    if (!this.scaryTrackAudio && typeof window !== 'undefined') {
      this.scaryTrackAudio = new Audio();
      this.scaryTrackAudio.loop = true;
    }

    if (this.scaryTrackAudio) {
      if (!this.scaryTrackAudio.src.endsWith(trackObj.url)) {
        this.scaryTrackAudio.src = trackObj.url;
      }
      this.updateScaryTrackVolume();
      this.scaryTrackAudio.play().catch(() => {});
    }
  }

  public stopScaryTrack() {
    this.isScaryMusicActive = false;
    if (this.scaryTrackAudio) {
      this.scaryTrackAudio.pause();
    }
    this.stopAmbient();
  }

  public toggleScaryThemeMusic(enable?: boolean): boolean {
    const next = enable !== undefined ? enable : !this.isScaryMusicActive;
    if (next) {
      this.playScaryTrack(this.currentScaryTrackId);
    } else {
      this.stopScaryTrack();
    }
    return this.isScaryMusicActive;
  }

  public nextScaryTrack(): 'track1' | 'track2' | 'procedural' {
    const ids: Array<'track1' | 'track2' | 'procedural'> = ['track1', 'track2', 'procedural'];
    const curIdx = ids.indexOf(this.currentScaryTrackId);
    const nextIdx = (curIdx + 1) % ids.length;
    const nextTrack = ids[nextIdx];
    this.playScaryTrack(nextTrack);
    return nextTrack;
  }

  private updateScaryTrackVolume() {
    if (!this.scaryTrackAudio) return;
    if (this.settings.isMuted) {
      this.scaryTrackAudio.volume = 0;
    } else {
      const vol = this.getEffectiveVolume('ambience');
      this.scaryTrackAudio.volume = Math.min(1, Math.max(0, vol * 0.9));
    }
  }

  private getEffectiveVolume(category: 'ui' | 'fx' | 'ambience'): number {
    if (this.settings.isMuted) return 0;
    const catVol =
      category === 'ui' ? this.settings.uiVolume
        : category === 'fx' ? this.settings.fxVolume
          : this.settings.ambienceVolume;
    return this.settings.masterVolume * catVol;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // AUDIO CONTEXT
  // ═════════════════════════════════════════════════════════════════════════

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Create a noise buffer for wind/whisper effects
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }
    return buffer;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // UI SOUNDS — dark, horror-themed button interactions
  // ═════════════════════════════════════════════════════════════════════════

  /** Subtle metallic whisper on hover */
  public playHover() {
    const now = Date.now();
    if (now - this.lastHoverTime < 60) return;
    this.lastHoverTime = now;

    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1600, t + 0.015);

    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 8;

    gain.gain.setValueAtTime(vol * 0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }

  /** Short dark click — metallic */
  public playClick() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.045);

    gain.gain.setValueAtTime(vol * 0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.055);
  }

  /** Alias for playClick */
  public playNormalClick() { this.playClick(); }
  public playButtonSound() { this.playClick(); }

  /** Rising confirmation — dark ascending minor chord */
  public playEnterConfirm() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    // Dark minor ascending: A3, C4, Eb4, A4
    [220, 261.63, 311.13, 440].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = t + idx * 0.045;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.97, start + 0.3);

      gain.gain.setValueAtTime(vol * 0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.38);
    });
  }

  /** Deep bass impact — for important actions */
  public playImpactSound() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;

    // Sub bass drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, t);
    sub.frequency.exponentialRampToValueAtTime(25, t + 0.3);
    subGain.gain.setValueAtTime(vol * 0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(t);
    sub.stop(t + 0.38);

    // Distortion crunch layer
    const crunch = ctx.createOscillator();
    const crunchGain = ctx.createGain();
    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = (Math.PI + 100 * x) / (Math.PI + 100 * Math.abs(x));
    }
    distortion.curve = curve;
    crunch.type = 'sawtooth';
    crunch.frequency.setValueAtTime(65, t);
    crunchGain.gain.setValueAtTime(vol * 0.08, t);
    crunchGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    crunch.connect(distortion);
    distortion.connect(crunchGain);
    crunchGain.connect(ctx.destination);
    crunch.start(t);
    crunch.stop(t + 0.25);
  }

  /** Whisper burst — band-pass noise */
  public playWhisperSound() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const buffer = this.createNoiseBuffer(0.5);
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 3;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.06, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);
    source.stop(t + 0.45);
  }

  /** Warning pulse — dual detuned sawtooths */
  public playWarningSound() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, t);
    osc2.frequency.setValueAtTime(138.5, t); // dissonant

    gain.gain.setValueAtTime(vol * 0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.38);
    osc2.stop(t + 0.38);
  }

  /** Portal activation — sawtooth through bandpass sweep */
  public playPortalSound() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.6);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.linearRampToValueAtTime(1200, t + 0.6);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(vol * 0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);
  }

  /** Jump scare impact — stacked noise + sub hit + dissonant chord */
  public playJumpScare() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;

    // 1. Massive sub hit
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(100, t);
    sub.frequency.exponentialRampToValueAtTime(20, t + 0.5);
    subGain.gain.setValueAtTime(vol * 0.55, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(t);
    sub.stop(t + 0.55);

    // 2. Noise burst
    const buffer = this.createNoiseBuffer(0.3);
    if (buffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 2000;
      noiseGain.gain.setValueAtTime(vol * 0.15, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.25);
    }

    // 3. Dissonant tritone stab
    [220, 311.13].forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol * 0.2, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  /**
   * THE GREAT JUMPSCARE — Demonic Reaper roar, subterranean sub-bass shockwave,
   * screeching cluster dissonance, swept noise tearing, and panic heartbeat surge.
   */
  public playReaperJumpscareRoar() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;

    // Duck any playing ambient audio immediately for maximum contrast
    this.duckAmbient(4500);

    // ── 1. Subterranean sub-bass detonation (140Hz -> 18Hz) with waveshaper saturation
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    const subDist = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = (Math.PI + 35 * x) / (Math.PI + 35 * Math.abs(x));
    }
    subDist.curve = curve;
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(140, t);
    sub.frequency.exponentialRampToValueAtTime(18, t + 0.9);
    subGain.gain.setValueAtTime(vol * 0.75, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    sub.connect(subDist);
    subDist.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(t);
    sub.stop(t + 1.25);

    // ── 2. Screaming Demonic Cluster / Banshee Shriek
    const screamFreqs = [311.13, 466.16, 622.25, 880.0, 1244.5];
    screamFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const oscFilter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq * 1.8, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.8);

      oscFilter.type = 'bandpass';
      oscFilter.frequency.setValueAtTime(freq * 1.5, t);
      oscFilter.frequency.exponentialRampToValueAtTime(300, t + 0.8);
      oscFilter.Q.value = 6;

      oscGain.gain.setValueAtTime(vol * 0.28, t);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(oscFilter);
      oscFilter.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.9);
    });

    // ── 3. High-velocity White Noise Tearing Roar
    const roarBuffer = this.createNoiseBuffer(1.0);
    if (roarBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = roarBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3500, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(450, t + 0.7);
      noiseFilter.Q.value = 3;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.35, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.8);
    }

    // ── 4. Rapid Panic Heartbeat Surge (elevated 160 BPM pulse)
    const beatTimes = [0.55, 0.9, 1.25, 1.6, 2.0];
    beatTimes.forEach((delay, beatIdx) => {
      const beatT = t + delay;
      [0, 0.12].forEach((subOffset, pairIdx) => {
        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        const s = beatT + subOffset;
        hOsc.type = 'sine';
        hOsc.frequency.setValueAtTime(pairIdx === 0 ? 68 : 52, s);
        hOsc.frequency.exponentialRampToValueAtTime(26, s + 0.12);

        const beatVol = vol * (0.45 - beatIdx * 0.06);
        hGain.gain.setValueAtTime(0.0001, s);
        hGain.gain.linearRampToValueAtTime(Math.max(0.01, beatVol), s + 0.02);
        hGain.gain.exponentialRampToValueAtTime(0.0001, s + 0.14);

        hOsc.connect(hGain);
        hGain.connect(ctx.destination);
        hOsc.start(s);
        hOsc.stop(s + 0.16);
      });
    });
  }

  /** Mission complete — deep cinematic impact + mysterious resonance */
  public playMissionComplete() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;

    // Sub drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, t);
    sub.frequency.exponentialRampToValueAtTime(35, t + 0.8);
    subGain.gain.setValueAtTime(vol * 0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(t);
    sub.stop(t + 0.9);

    // Ethereal chime sweep (minor)
    [440, 523.25, 622.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const s = t + 0.2 + i * 0.1;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, s);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, s + 0.5);
      gain.gain.setValueAtTime(vol * 0.15, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.65);
    });
  }

  /** Reverse dark whoosh — for back/close actions */
  public playBackSound() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + 0.2);

    gain.gain.setValueAtTime(vol * 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  /** Cinematic transition whoosh */
  public playTransition() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, t + 0.35);

    gain.gain.setValueAtTime(vol * 0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.38);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // LEGACY COMPAT — existing calls from GameContext, Navbar, etc.
  // ═════════════════════════════════════════════════════════════════════════

  public playHoverSound() { this.playHover(); }

  public playAccessGranted() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    // Dark minor arpeggio: Am shape
    [220, 261.63, 329.63, 440].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const s = t + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, s);
      gain.gain.setValueAtTime(vol * 0.18, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.28);
    });
  }

  public playAccessDenied() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, t);
    osc2.frequency.setValueAtTime(138.5, t);
    gain.gain.setValueAtTime(vol * 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.38);
    osc2.stop(t + 0.38);
  }

  public playScan() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.25);
    gain.gain.setValueAtTime(vol * 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  public playCountdownTick(isFinal = false) {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isFinal ? 'square' : 'triangle';
    const freq = isFinal ? 880 : 440;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, t + 0.08);
    gain.gain.setValueAtTime(vol * (isFinal ? 0.3 : 0.15), t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playHeartbeat() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    [0, 0.14].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const s = t + delay;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, s);
      osc.frequency.exponentialRampToValueAtTime(40, s + 0.1);
      gain.gain.setValueAtTime(vol * 0.35, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.15);
    });
  }

  public playReward() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    // Dark triumphant: minor key ascending
    [261.63, 311.13, 392.0, 523.25, 622.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const s = t + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, s);
      gain.gain.setValueAtTime(vol * 0.13, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.33);
    });
  }

  public playTerminalChirp() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
    gain.gain.setValueAtTime(vol * 0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.025);
  }

  public playMissionStart() { this.playPortalSound(); }
  public playError() { this.playAccessDenied(); }
  public playPortal() { this.playPortalSound(); }
  public playWhoosh() { this.playTransition(); }
  public playReset() { this.playBackSound(); }

  public playLocked() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, t);
    gain.gain.setValueAtTime(vol * 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playSecret() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;
    [659.25, 783.99, 932.33, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const s = t + idx * 0.06;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, s);
      gain.gain.setValueAtTime(vol * 0.12, s);
      gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(s);
      osc.stop(s + 0.44);
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // LAYERED AMBIENT SYSTEM — The core horror atmosphere
  // ═════════════════════════════════════════════════════════════════════════

  public isHorrorMusicActive(): boolean {
    return this.isAmbientRunning;
  }

  public toggleHorrorMusic(enable?: boolean): boolean {
    const nextState = enable !== undefined ? enable : !this.isAmbientRunning;
    if (nextState) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.isAmbientRunning;
  }

  public setPageAtmosphere(page: string) {
    this.currentPage = page;
    this.currentProfile = PAGE_PROFILES[page] || PAGE_PROFILES.default;

    if (!this.isAmbientRunning || !this.ctx) return;
    const t = this.ctx.currentTime;

    // Crossfade drone to new profile
    if (this.ambientDroneOsc1) {
      this.ambientDroneOsc1.frequency.setTargetAtTime(this.currentProfile.dronePitch, t, 2);
    }
    if (this.ambientDroneOsc2) {
      this.ambientDroneOsc2.frequency.setTargetAtTime(
        this.currentProfile.dronePitch + this.currentProfile.droneDetune, t, 2
      );
    }
    if (this.ambientDroneFilter) {
      this.ambientDroneFilter.frequency.setTargetAtTime(this.currentProfile.filterCutoff, t, 1.5);
    }

    // Update heartbeat speed
    this.restartHeartbeat();
    this.restartChimes();
  }

  private startAmbient() {
    const ctx = this.initContext();
    if (!ctx || this.isAmbientRunning) return;
    this.isAmbientRunning = true;

    const vol = this.getEffectiveVolume('ambience');
    const p = this.currentProfile;
    const t = ctx.currentTime;

    // ── 1. Deep drone (dual detuned oscillators → lowpass) ──────────
    this.ambientDroneOsc1 = ctx.createOscillator();
    this.ambientDroneOsc2 = ctx.createOscillator();
    this.ambientDroneFilter = ctx.createBiquadFilter();
    this.ambientDroneGain = ctx.createGain();

    this.ambientDroneOsc1.type = 'sawtooth';
    this.ambientDroneOsc1.frequency.setValueAtTime(p.dronePitch, t);
    this.ambientDroneOsc2.type = 'sine';
    this.ambientDroneOsc2.frequency.setValueAtTime(p.dronePitch + p.droneDetune, t);

    this.ambientDroneFilter.type = 'lowpass';
    this.ambientDroneFilter.frequency.setValueAtTime(p.filterCutoff, t);
    this.ambientDroneFilter.Q.value = 3;

    this.ambientDroneGain.gain.setValueAtTime(0.0001, t);
    this.ambientDroneGain.gain.linearRampToValueAtTime(
      Math.max(0.02, vol * 0.12 * p.tensionLevel), t + 3
    );

    this.ambientDroneOsc1.connect(this.ambientDroneFilter);
    this.ambientDroneOsc2.connect(this.ambientDroneFilter);
    this.ambientDroneFilter.connect(this.ambientDroneGain);
    this.ambientDroneGain.connect(ctx.destination);
    this.ambientDroneOsc1.start(t);
    this.ambientDroneOsc2.start(t);

    // ── 2. Distant wind (filtered noise) ────────────────────────────
    const windBuffer = this.createNoiseBuffer(30);
    if (windBuffer) {
      this.ambientWindSource = ctx.createBufferSource();
      this.ambientWindSource.buffer = windBuffer;
      this.ambientWindSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(200, t);
      windFilter.Q.value = 0.7;

      this.ambientWindGain = ctx.createGain();
      this.ambientWindGain.gain.setValueAtTime(0.0001, t);
      this.ambientWindGain.gain.linearRampToValueAtTime(vol * 0.06, t + 4);

      this.ambientWindSource.connect(windFilter);
      windFilter.connect(this.ambientWindGain);
      this.ambientWindGain.connect(ctx.destination);
      this.ambientWindSource.start(t);
    }

    // ── 3. Whisper texture (high-Q bandpass noise, very quiet) ───────
    const whisperBuffer = this.createNoiseBuffer(20);
    if (whisperBuffer) {
      this.ambientWhisperSource = ctx.createBufferSource();
      this.ambientWhisperSource.buffer = whisperBuffer;
      this.ambientWhisperSource.loop = true;

      const whisperFilter = ctx.createBiquadFilter();
      whisperFilter.type = 'bandpass';
      whisperFilter.frequency.value = 3000;
      whisperFilter.Q.value = 12;

      this.ambientWhisperGain = ctx.createGain();
      this.ambientWhisperGain.gain.setValueAtTime(0.0001, t);
      this.ambientWhisperGain.gain.linearRampToValueAtTime(
        vol * 0.02 * p.whisperDensity, t + 5
      );

      this.ambientWhisperSource.connect(whisperFilter);
      whisperFilter.connect(this.ambientWhisperGain);
      this.ambientWhisperGain.connect(ctx.destination);
      this.ambientWhisperSource.start(t);
    }

    // ── 4. Slow metallic resonance ──────────────────────────────────
    this.ambientMetalOsc = ctx.createOscillator();
    this.ambientMetalFilter = ctx.createBiquadFilter();
    this.ambientMetalGain = ctx.createGain();

    this.ambientMetalOsc.type = 'square';
    this.ambientMetalOsc.frequency.setValueAtTime(220, t);

    this.ambientMetalFilter.type = 'bandpass';
    this.ambientMetalFilter.frequency.setValueAtTime(1800, t);
    this.ambientMetalFilter.Q.value = 20;

    this.ambientMetalGain.gain.setValueAtTime(0.0001, t);
    this.ambientMetalGain.gain.linearRampToValueAtTime(vol * 0.008, t + 6);

    this.ambientMetalOsc.connect(this.ambientMetalFilter);
    this.ambientMetalFilter.connect(this.ambientMetalGain);
    this.ambientMetalGain.connect(ctx.destination);
    this.ambientMetalOsc.start(t);

    // ── 5. Scheduled timers ─────────────────────────────────────────
    this.restartHeartbeat();
    this.restartChimes();
    this.startRandomImpacts();
  }

  private stopAmbient() {
    const ctx = this.ctx;
    if (!ctx) {
      this.isAmbientRunning = false;
      return;
    }

    const t = ctx.currentTime;

    // Fade out all ambient nodes
    const fadeOut = (gain: GainNode | null) => {
      if (gain) gain.gain.setTargetAtTime(0.0001, t, 0.8);
    };

    fadeOut(this.ambientDroneGain);
    fadeOut(this.ambientWindGain);
    fadeOut(this.ambientWhisperGain);
    fadeOut(this.ambientMetalGain);

    // Stop oscillators/sources after fade
    setTimeout(() => {
      const stop = (node: OscillatorNode | AudioBufferSourceNode | null) => {
        try { node?.stop(); node?.disconnect(); } catch { /* ignore */ }
      };
      stop(this.ambientDroneOsc1);
      stop(this.ambientDroneOsc2);
      stop(this.ambientWindSource);
      stop(this.ambientWhisperSource);
      stop(this.ambientMetalOsc);

      this.ambientDroneOsc1 = null;
      this.ambientDroneOsc2 = null;
      this.ambientDroneFilter = null;
      this.ambientDroneGain = null;
      this.ambientWindSource = null;
      this.ambientWindGain = null;
      this.ambientWhisperSource = null;
      this.ambientWhisperGain = null;
      this.ambientMetalOsc = null;
      this.ambientMetalFilter = null;
      this.ambientMetalGain = null;
    }, 1000);

    // Clear timers
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
    if (this.chimeTimer) { clearInterval(this.chimeTimer); this.chimeTimer = null; }
    if (this.impactTimer) { clearInterval(this.impactTimer); this.impactTimer = null; }

    this.isAmbientRunning = false;
  }

  private updateAmbientVolumes() {
    if (!this.isAmbientRunning || !this.ctx) return;
    const vol = this.getEffectiveVolume('ambience');
    const p = this.currentProfile;
    const t = this.ctx.currentTime;

    if (this.ambientDroneGain) {
      this.ambientDroneGain.gain.setTargetAtTime(
        Math.max(0.001, vol * 0.12 * p.tensionLevel), t, 0.3
      );
    }
    if (this.ambientWindGain) {
      this.ambientWindGain.gain.setTargetAtTime(vol * 0.06, t, 0.3);
    }
    if (this.ambientWhisperGain) {
      this.ambientWhisperGain.gain.setTargetAtTime(vol * 0.02 * p.whisperDensity, t, 0.3);
    }
    if (this.ambientMetalGain) {
      this.ambientMetalGain.gain.setTargetAtTime(vol * 0.008, t, 0.3);
    }
  }

  private restartHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (!this.isAmbientRunning) return;

    const playBeat = () => {
      if (!this.isAmbientRunning || !this.ctx) return;
      const vol = this.getEffectiveVolume('ambience');
      if (vol <= 0) return;
      const t = this.ctx.currentTime;
      const p = this.currentProfile;

      [0, 0.18].forEach((offset, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const s = t + offset;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(idx === 0 ? 52 : 44, s);
        osc.frequency.exponentialRampToValueAtTime(28, s + 0.15);
        gain.gain.setValueAtTime(0.0001, s);
        gain.gain.linearRampToValueAtTime(vol * p.heartbeatVolume, s + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(s);
        osc.stop(s + 0.2);
      });
    };

    playBeat();
    this.heartbeatTimer = setInterval(playBeat, this.currentProfile.heartbeatSpeed);
  }

  private restartChimes() {
    if (this.chimeTimer) clearInterval(this.chimeTimer);
    if (!this.isAmbientRunning) return;

    const playChime = () => {
      if (!this.isAmbientRunning || !this.ctx) return;
      const vol = this.getEffectiveVolume('ambience');
      if (vol <= 0) return;
      const t = this.ctx.currentTime;

      const pickCount = Math.random() > 0.5 ? 2 : 3;
      for (let i = 0; i < pickCount; i++) {
        const note = SINISTER_NOTES[Math.floor(Math.random() * SINISTER_NOTES.length)];
        const delay = i * (0.3 + Math.random() * 0.25);
        const s = t + delay;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const bq = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, s);
        osc.frequency.exponentialRampToValueAtTime(note * 0.985, s + 1.8);

        bq.type = 'bandpass';
        bq.frequency.setValueAtTime(note, s);
        bq.Q.value = 5;

        gain.gain.setValueAtTime(0.0001, s);
        gain.gain.linearRampToValueAtTime(vol * 0.04, s + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, s + 2.0);

        osc.connect(bq);
        bq.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(s);
        osc.stop(s + 2.1);
      }
    };

    this.chimeTimer = setInterval(playChime, this.currentProfile.chimeInterval);
  }

  private startRandomImpacts() {
    if (this.impactTimer) clearInterval(this.impactTimer);
    if (!this.isAmbientRunning) return;

    this.impactTimer = setInterval(() => {
      if (!this.isAmbientRunning || !this.ctx) return;
      if (Math.random() > 0.3) return; // ~30% chance each tick
      const vol = this.getEffectiveVolume('ambience');
      if (vol <= 0) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40 + Math.random() * 30, t);
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.4);
      gain.gain.setValueAtTime(vol * 0.08 * this.currentProfile.tensionLevel, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
    }, 8000);
  }

  /** Temporarily silence ambient for jump-scare buildup */
  public duckAmbient(durationMs: number) {
    if (!this.isAmbientRunning || !this.ctx) return;
    const t = this.ctx.currentTime;

    // Duck all ambient to near-zero
    const duckGain = (g: GainNode | null) => {
      if (!g || !this.ctx) return;
      const current = g.gain.value;
      g.gain.setTargetAtTime(0.001, t, 0.15);
      // Restore after duration
      setTimeout(() => {
        if (this.ctx && g) {
          g.gain.setTargetAtTime(current, this.ctx.currentTime, 0.8);
        }
      }, durationMs);
    };

    duckGain(this.ambientDroneGain);
    duckGain(this.ambientWindGain);
    duckGain(this.ambientWhisperGain);
    duckGain(this.ambientMetalGain);

    // Also duck the authentic horror track if playing
    if (this.scaryTrackAudio && !this.scaryTrackAudio.paused) {
      const origVol = this.scaryTrackAudio.volume;
      this.scaryTrackAudio.volume = 0.03;
      setTimeout(() => {
        if (this.scaryTrackAudio) {
          this.scaryTrackAudio.volume = origVol;
        }
      }, durationMs);
    }
  }

  // ── Simple drone (legacy compat) ───────────────────────────────────────
  public toggleDrone(enable: boolean) {
    const ctx = this.initContext();
    if (!ctx) return;

    if (!enable) {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5);
        setTimeout(() => {
          try { this.droneOsc?.stop(); this.droneOsc?.disconnect(); this.droneGain?.disconnect(); } catch { /* ignore */ }
          this.droneOsc = null;
          this.droneGain = null;
          this.isDroneRunning = false;
        }, 600);
      }
      return;
    }

    if (this.isDroneRunning) return;
    const vol = this.getEffectiveVolume('ambience');
    if (vol <= 0) return;

    this.droneOsc = ctx.createOscillator();
    this.droneGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    this.droneOsc.type = 'sawtooth';
    this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    this.droneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(vol * 0.08, ctx.currentTime + 2);
    this.droneOsc.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(ctx.destination);
    this.droneOsc.start();
    this.isDroneRunning = true;
  }

  /** Glitch static noise burst — for visual glitch events */
  public playGlitchStatic() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;

    const buffer = this.createNoiseBuffer(0.15);
    if (!buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);
    source.stop(t + 0.15);
  }

  /** Distant echo rumble — for shadow events */
  public playDistantRumble() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(35, t);
    filter.type = 'lowpass';
    filter.frequency.value = 80;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol * 0.1, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.6);
  }
}

export const soundEngine = new SoundEngine();
