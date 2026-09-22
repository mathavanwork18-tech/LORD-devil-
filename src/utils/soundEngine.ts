import { AudioSettings } from '../types';

const STORAGE_KEY_AUDIO = 'void_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  uiVolume: 0.8,
  ambienceVolume: 0.4,
  fxVolume: 0.8,
  isMuted: false,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings;
  private lastHoverTime = 0;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDroneRunning = false;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): AudioSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIO);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY_AUDIO, JSON.stringify(this.settings));
    } catch {
      // ignore
    }
    if (this.droneGain && this.ctx) {
      const vol = this.getEffectiveVolume('ambience');
      this.droneGain.gain.setTargetAtTime(vol * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getEffectiveVolume(category: 'ui' | 'fx' | 'ambience'): number {
    if (this.settings.isMuted) return 0;
    const catVol =
      category === 'ui'
        ? this.settings.uiVolume
        : category === 'fx'
        ? this.settings.fxVolume
        : this.settings.ambienceVolume;
    return this.settings.masterVolume * catVol;
  }

  // --- SOUND EFFECTS ---

  public playHover() {
    const now = Date.now();
    if (now - this.lastHoverTime < 60) return; // rate limit
    this.lastHoverTime = now;

    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(vol * 0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }

  public playClick() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(vol * 0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  }

  public playAccessGranted() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(vol * 0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  public playAccessDenied() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, ctx.currentTime);
    osc2.frequency.setValueAtTime(138.5, ctx.currentTime); // dissonant minor 2nd

    gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.36);
    osc2.stop(ctx.currentTime + 0.36);
  }

  public playScan() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  public playCountdownTick(isFinal = false) {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isFinal ? 'square' : 'triangle';
    const freq = isFinal ? 880 : 440;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(vol * (isFinal ? 0.3 : 0.15), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playHeartbeat() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    // Double beat
    [0, 0.14].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + delay;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, startTime);
      osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);

      gain.gain.setValueAtTime(vol * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.13);
    });
  }

  public playReward() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(vol * 0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  public playMissionComplete() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    // Deep sub drop + ethereal chime
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.8);

    subGain.gain.setValueAtTime(vol * 0.4, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.85);

    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start();
    sub.stop(ctx.currentTime + 0.86);

    // Chime sweep
    [440, 554.37, 659.25, 830.61].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + 0.2 + i * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(vol * 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.62);
    });
  }

  public playTerminalChirp() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    const randFreq = 800 + Math.random() * 400;
    osc.frequency.setValueAtTime(randFreq, ctx.currentTime);

    gain.gain.setValueAtTime(vol * 0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }

  // --- LORD EVIL DEDICATED SOUND SYSTEM ---

  public playNormalClick() {
    this.playClick();
  }

  public playEnterConfirm() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    [220, 277.18, 329.63, 440].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(vol * 0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  public playMissionStart() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.52);
  }

  public playError() {
    this.playAccessDenied();
  }

  public playLocked() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, ctx.currentTime);

    gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playSecret() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(vol * 0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  public playPortal() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.6);
    filter.Q.value = 4;

    gain.gain.setValueAtTime(vol * 0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.75);
  }

  public playReset() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('ui');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  public playWhoosh() {
    const ctx = this.initContext();
    if (!ctx) return;
    const vol = this.getEffectiveVolume('fx');
    if (vol <= 0) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  }

  public toggleDrone(enable: boolean) {
    const ctx = this.initContext();
    if (!ctx) return;

    if (!enable) {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5);
        setTimeout(() => {
          try {
            this.droneOsc?.stop();
            this.droneOsc?.disconnect();
            this.droneGain?.disconnect();
          } catch {
            // ignore
          }
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
    this.droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1

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

  // --- HORROR AMBIENT MUSIC ENGINE ---
  private isHorrorMusicRunning = false;
  private horrorMusicTimer: any = null;
  private horrorHeartbeatTimer: any = null;
  private horrorDroneOsc1: OscillatorNode | null = null;
  private horrorDroneOsc2: OscillatorNode | null = null;
  private horrorDroneFilter: BiquadFilterNode | null = null;
  private horrorDroneGain: GainNode | null = null;

  public isHorrorMusicActive(): boolean {
    return this.isHorrorMusicRunning;
  }

  public toggleHorrorMusic(enable?: boolean): boolean {
    const nextState = enable !== undefined ? enable : !this.isHorrorMusicRunning;
    const ctx = this.initContext();
    if (!ctx) return false;

    if (!nextState) {
      // Fade out
      if (this.horrorDroneGain) {
        this.horrorDroneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.8);
        setTimeout(() => {
          try {
            this.horrorDroneOsc1?.stop();
            this.horrorDroneOsc2?.stop();
            this.horrorDroneOsc1?.disconnect();
            this.horrorDroneOsc2?.disconnect();
            this.horrorDroneFilter?.disconnect();
            this.horrorDroneGain?.disconnect();
          } catch {
            // ignore
          }
          this.horrorDroneOsc1 = null;
          this.horrorDroneOsc2 = null;
          this.horrorDroneFilter = null;
          this.horrorDroneGain = null;
        }, 900);
      }
      if (this.horrorMusicTimer) {
        clearInterval(this.horrorMusicTimer);
        this.horrorMusicTimer = null;
      }
      if (this.horrorHeartbeatTimer) {
        clearInterval(this.horrorHeartbeatTimer);
        this.horrorHeartbeatTimer = null;
      }
      this.isHorrorMusicRunning = false;
      return false;
    }

    if (this.isHorrorMusicRunning) return true;

    const vol = this.getEffectiveVolume('ambience');
    this.isHorrorMusicRunning = true;

    // 1. Dual detuned dark sub-bass drone
    this.horrorDroneOsc1 = ctx.createOscillator();
    this.horrorDroneOsc2 = ctx.createOscillator();
    this.horrorDroneFilter = ctx.createBiquadFilter();
    this.horrorDroneGain = ctx.createGain();

    this.horrorDroneOsc1.type = 'sawtooth';
    this.horrorDroneOsc1.frequency.setValueAtTime(43.65, ctx.currentTime); // F1
    this.horrorDroneOsc2.type = 'sine';
    this.horrorDroneOsc2.frequency.setValueAtTime(44.8, ctx.currentTime); // slight beat frequency

    this.horrorDroneFilter.type = 'lowpass';
    this.horrorDroneFilter.frequency.setValueAtTime(120, ctx.currentTime);
    this.horrorDroneFilter.Q.value = 3;

    this.horrorDroneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.horrorDroneGain.gain.linearRampToValueAtTime(Math.max(0.02, vol * 0.12), ctx.currentTime + 2.5);

    this.horrorDroneOsc1.connect(this.horrorDroneFilter);
    this.horrorDroneOsc2.connect(this.horrorDroneFilter);
    this.horrorDroneFilter.connect(this.horrorDroneGain);
    this.horrorDroneGain.connect(ctx.destination);

    this.horrorDroneOsc1.start();
    this.horrorDroneOsc2.start();

    // 2. Sinister diminished melody bell sequence
    const notes = [
      349.23, // F4
      392.00, // G4
      415.30, // Ab4
      493.88, // B4
      523.25, // C5
      554.37, // C#5
      698.46, // F5
      783.99, // G5
    ];

    const playCreepyChime = () => {
      if (!this.isHorrorMusicRunning || !this.ctx) return;
      const cVol = this.getEffectiveVolume('ambience');
      if (cVol <= 0) return;

      const pickCount = Math.random() > 0.5 ? 2 : 3;
      for (let i = 0; i < pickCount; i++) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        const delay = i * (0.35 + Math.random() * 0.25);

        const osc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const bq = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime + delay);
        // Slight micro-pitch drop for unsettling dissonance
        osc.frequency.exponentialRampToValueAtTime(note * 0.985, this.ctx.currentTime + delay + 1.8);

        bq.type = 'bandpass';
        bq.frequency.setValueAtTime(note, this.ctx.currentTime + delay);
        bq.Q.value = 5;

        chimeGain.gain.setValueAtTime(0.0001, this.ctx.currentTime + delay);
        chimeGain.gain.linearRampToValueAtTime(cVol * 0.05, this.ctx.currentTime + delay + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 2.2);

        osc.connect(bq);
        bq.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + 2.3);
      }
    };

    // 3. Subterranean Heartbeat pulse (Thump-thump)
    const playHeartbeat = () => {
      if (!this.isHorrorMusicRunning || !this.ctx) return;
      const hVol = this.getEffectiveVolume('ambience');
      if (hVol <= 0) return;

      [0, 0.22].forEach((offset, idx) => {
        const hOsc = this.ctx!.createOscillator();
        const hGain = this.ctx!.createGain();
        const t = this.ctx!.currentTime + offset;

        hOsc.type = 'sine';
        hOsc.frequency.setValueAtTime(idx === 0 ? 52 : 44, t);
        hOsc.frequency.exponentialRampToValueAtTime(28, t + 0.18);

        hGain.gain.setValueAtTime(0.0001, t);
        hGain.gain.linearRampToValueAtTime(hVol * (idx === 0 ? 0.16 : 0.11), t + 0.03);
        hGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

        hOsc.connect(hGain);
        hGain.connect(this.ctx!.destination);

        hOsc.start(t);
        hOsc.stop(t + 0.22);
      });
    };

    playCreepyChime();
    playHeartbeat();

    this.horrorMusicTimer = setInterval(playCreepyChime, 3800);
    this.horrorHeartbeatTimer = setInterval(playHeartbeat, 2200);

    return true;
  }
}

export const soundEngine = new SoundEngine();

