import React, { useRef, useEffect, useState, useCallback } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
  type: 'dust' | 'ash' | 'ember' | 'crimson';
}

interface FogLayer {
  x: number; y: number; vx: number; vy: number;
  radius: number; opacity: number; maxOpacity: number;
  color: string; phase: number;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const INTRO_DURATION = 30000; // 30 seconds
const PHASE_TIMES = {
  BLACKNESS: [0, 3000],
  FOG_APPEAR: [3000, 7000],
  SYMBOL_REVEAL: [7000, 11000],
  LOGO_REVEAL: [11000, 16000],
  WORLD_REVEAL: [16000, 21000],
  SYSTEM_ACTIVATION: [21000, 26000],
  FINAL_TITLE: [26000, 29000],
  TRANSITION: [29000, 30000],
} as const;

const COLORS = {
  voidBlack: '#050505',
  deepBlack: '#0A0909',
  bloodRed: '#7A0C16',
  darkCrimson: '#B31324',
  oldGold: '#B06D35',
  boneWhite: '#E7E0D2',
  shadowPurple: '#24182E',
};

// ─── AUDIO ENGINE ────────────────────────────────────────────────────────────
class IntroAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private isMuted = false;

  init() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);
    } catch { /* Audio not supported */ }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.35;
    }
  }

  // Phase 0-3s: Very low atmospheric rumble
  playAtmosphericRumble() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sub-bass rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 30;
    filter.type = 'lowpass';
    filter.frequency.value = 80;
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 2);
    gain.gain.linearRampToValueAtTime(0.25, now + 7);
    gain.gain.linearRampToValueAtTime(0.3, now + 15);
    gain.gain.linearRampToValueAtTime(0.1, now + 28);
    gain.gain.linearRampToValueAtTime(0, now + 30);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 31);
    this.oscillators.push(osc);
    this.nodes.push(gain, filter);
  }

  // Phase 3-7s: Distant wind
  playDistantWind() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Noise-based wind via oscillators
    const bufferSize = this.ctx.sampleRate * 30;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 200;
    filter.Q.value = 0.7;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0, now + 2.5);
    gain.gain.linearRampToValueAtTime(0.12, now + 5);
    gain.gain.linearRampToValueAtTime(0.18, now + 10);
    gain.gain.linearRampToValueAtTime(0.08, now + 25);
    gain.gain.linearRampToValueAtTime(0, now + 30);

    // Modulate filter frequency for wind effect
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.linearRampToValueAtTime(350, now + 8);
    filter.frequency.linearRampToValueAtTime(180, now + 16);
    filter.frequency.linearRampToValueAtTime(280, now + 24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 31);
    this.nodes.push(gain, filter);
  }

  // Phase 7-11s: Three subtle dark pulses
  playSymbolPulses() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const pulseStart = 7;

    [0, 1.2, 2.4].forEach((delay) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = 55;

      const t = now + pulseStart + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 1);
      this.oscillators.push(osc);
      this.nodes.push(gain);
    });
  }

  // Phase 11-16s: Deep impact + metallic resonance
  playDeepImpact() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const impactTime = now + 11;

    // Sub-bass impact
    const impactOsc = this.ctx.createOscillator();
    const impactGain = this.ctx.createGain();
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(80, impactTime);
    impactOsc.frequency.exponentialRampToValueAtTime(25, impactTime + 2);
    impactGain.gain.setValueAtTime(0.5, impactTime);
    impactGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 3);
    impactOsc.connect(impactGain);
    impactGain.connect(this.masterGain);
    impactOsc.start(impactTime);
    impactOsc.stop(impactTime + 3.5);
    this.oscillators.push(impactOsc);
    this.nodes.push(impactGain);

    // Metallic resonance
    const metalOsc = this.ctx.createOscillator();
    const metalGain = this.ctx.createGain();
    const metalFilter = this.ctx.createBiquadFilter();
    metalOsc.type = 'square';
    metalOsc.frequency.value = 220;
    metalFilter.type = 'bandpass';
    metalFilter.frequency.value = 1800;
    metalFilter.Q.value = 15;
    metalGain.gain.setValueAtTime(0.08, impactTime);
    metalGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 4);
    metalOsc.connect(metalFilter);
    metalFilter.connect(metalGain);
    metalGain.connect(this.masterGain);
    metalOsc.start(impactTime);
    metalOsc.stop(impactTime + 4.5);
    this.oscillators.push(metalOsc);
    this.nodes.push(metalGain, metalFilter);
  }

  // Phase 16-21s: Low choir-like atmospheric texture
  playDarkChoir() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const choirStart = now + 16;

    // Layered detuned oscillators for choir effect
    [130.81, 164.81, 196.00, 261.63].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;
      // Slight detune for chorus
      osc.detune.value = (i % 2 === 0 ? 1 : -1) * (5 + i * 3);

      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1;

      gain.gain.setValueAtTime(0, choirStart);
      gain.gain.linearRampToValueAtTime(0.06, choirStart + 2);
      gain.gain.linearRampToValueAtTime(0.08, choirStart + 3);
      gain.gain.linearRampToValueAtTime(0.02, choirStart + 4.5);
      gain.gain.linearRampToValueAtTime(0, choirStart + 5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(choirStart);
      osc.stop(choirStart + 5.5);
      this.oscillators.push(osc);
      this.nodes.push(gain, filter);
    });
  }

  // Phase 21-26s: Digital distortion + heartbeat
  playSystemActivation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const sysStart = now + 21;

    // Heartbeat pulse
    for (let beat = 0; beat < 6; beat++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 45;

      const beatTime = sysStart + beat * 0.85;
      gain.gain.setValueAtTime(0, beatTime);
      gain.gain.linearRampToValueAtTime(0.3, beatTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(beatTime);
      osc.stop(beatTime + 0.6);
      this.oscillators.push(osc);
      this.nodes.push(gain);
    }

    // Digital distortion texture
    const distOsc = this.ctx.createOscillator();
    const distGain = this.ctx.createGain();
    const distortion = this.ctx.createWaveShaper();

    distOsc.type = 'sawtooth';
    distOsc.frequency.value = 100;
    distOsc.frequency.linearRampToValueAtTime(300, sysStart + 4);

    // Create distortion curve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = (Math.PI + 200 * x) / (Math.PI + 200 * Math.abs(x));
    }
    distortion.curve = curve;

    distGain.gain.setValueAtTime(0, sysStart);
    distGain.gain.linearRampToValueAtTime(0.04, sysStart + 1);
    distGain.gain.linearRampToValueAtTime(0.06, sysStart + 3);
    distGain.gain.linearRampToValueAtTime(0, sysStart + 5);

    distOsc.connect(distortion);
    distortion.connect(distGain);
    distGain.connect(this.masterGain);
    distOsc.start(sysStart);
    distOsc.stop(sysStart + 5.5);
    this.oscillators.push(distOsc);
    this.nodes.push(distGain);
  }

  // Phase 26-29s: Rising bass
  playRisingBass() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const riseStart = now + 26;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(30, riseStart);
    osc.frequency.exponentialRampToValueAtTime(120, riseStart + 3);

    gain.gain.setValueAtTime(0, riseStart);
    gain.gain.linearRampToValueAtTime(0.35, riseStart + 2.5);
    gain.gain.linearRampToValueAtTime(0, riseStart + 3);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, riseStart);
    filter.frequency.linearRampToValueAtTime(600, riseStart + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(riseStart);
    osc.stop(riseStart + 3.5);
    this.oscillators.push(osc);
    this.nodes.push(gain, filter);
  }

  // Phase 29-30s: Final deep hit
  playFinalHit() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const hitTime = now + 29;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, hitTime);
    osc.frequency.exponentialRampToValueAtTime(20, hitTime + 1);

    gain.gain.setValueAtTime(0.6, hitTime);
    gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(hitTime);
    osc.stop(hitTime + 1.2);
    this.oscillators.push(osc);
    this.nodes.push(gain);
  }

  startFullSequence() {
    this.init();
    if (!this.ctx) return;
    this.playAtmosphericRumble();
    this.playDistantWind();
    this.playSymbolPulses();
    this.playDeepImpact();
    this.playDarkChoir();
    this.playSystemActivation();
    this.playRisingBass();
    this.playFinalHit();
  }

  destroy() {
    this.oscillators.forEach(o => { try { o.stop(); } catch {} });
    this.oscillators = [];
    this.nodes = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

// ─── SIGIL SVG COMPONENT ────────────────────────────────────────────────────
const CrownEyeEmblem: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = Math.min(1, progress * 1.5);
  const scale = 0.6 + progress * 0.4;
  const glowIntensity = Math.sin(progress * Math.PI * 4) * 0.3 + 0.7;

  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 ${20 * glowIntensity}px rgba(179,19,36,0.8)) drop-shadow(0 0 ${40 * glowIntensity}px rgba(122,12,22,0.5))`,
        transition: 'none',
      }}
    >
      {/* Outer ritual circle */}
      <circle cx="100" cy="100" r="90" stroke={COLORS.darkCrimson} strokeWidth="1.5"
        strokeDasharray={`${565 * progress} ${565 * (1 - progress)}`} opacity={0.7} />
      <circle cx="100" cy="100" r="82" stroke={COLORS.bloodRed} strokeWidth="1"
        strokeDasharray="4 3" opacity={progress * 0.5} />

      {/* Crown silhouette */}
      <path
        d={`M60,105 L70,${105 - 35 * progress} L85,${105 - 15 * progress} L100,${105 - 45 * progress} L115,${105 - 15 * progress} L130,${105 - 35 * progress} L140,105 Z`}
        stroke={COLORS.oldGold}
        strokeWidth="2"
        fill="none"
        opacity={progress}
        style={{ filter: `drop-shadow(0 0 8px rgba(176,109,53,0.6))` }}
      />

      {/* Inner all-seeing eye */}
      <ellipse
        cx="100" cy="115"
        rx={22 * progress} ry={12 * progress}
        stroke={COLORS.darkCrimson} strokeWidth="2"
        fill="none" opacity={progress}
      />
      <circle
        cx="100" cy="115"
        r={5 * progress}
        fill={COLORS.darkCrimson}
        opacity={progress}
      />

      {/* 8 directional rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="100" y1="100"
          x2={100 + Math.cos(angle * Math.PI / 180) * 70 * progress}
          y2={100 + Math.sin(angle * Math.PI / 180) * 70 * progress}
          stroke={COLORS.bloodRed}
          strokeWidth={angle % 90 === 0 ? '2' : '1'}
          opacity={progress * 0.4}
        />
      ))}

      {/* Rune marks at cardinal points */}
      {[0, 90, 180, 270].map((angle) => {
        const rx = 100 + Math.cos(angle * Math.PI / 180) * 75;
        const ry = 100 + Math.sin(angle * Math.PI / 180) * 75;
        return (
          <circle key={`rune-${angle}`} cx={rx} cy={ry} r={3 * progress}
            fill={COLORS.oldGold} opacity={progress * 0.8} />
        );
      })}
    </svg>
  );
};

// ─── SYSTEM UI ELEMENTS ─────────────────────────────────────────────────────
const SystemSymbols: React.FC<{ progress: number }> = ({ progress }) => {
  const symbols = ['⊕', '⌬', '◈', '⊗', '⌖', '◎', '⊙', '⟐', '⊛', '⬡'];
  const positions = [
    { top: '15%', left: '8%' }, { top: '25%', right: '12%' },
    { top: '40%', left: '5%' }, { top: '55%', right: '7%' },
    { top: '70%', left: '10%' }, { top: '80%', right: '15%' },
    { top: '20%', left: '25%' }, { top: '65%', right: '25%' },
    { top: '35%', left: '15%' }, { top: '50%', right: '18%' },
  ];

  return (
    <>
      {symbols.map((sym, i) => {
        const delay = i * 0.08;
        const symProgress = Math.max(0, Math.min(1, (progress - delay) * 3));
        const floatY = Math.sin((progress * 8 + i) * 0.5) * 5;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...positions[i],
              opacity: symProgress * 0.6,
              transform: `translateY(${floatY}px) scale(${0.8 + symProgress * 0.2})`,
              color: i % 3 === 0 ? COLORS.darkCrimson : i % 3 === 1 ? COLORS.oldGold : COLORS.boneWhite,
              fontSize: `${14 + (i % 3) * 4}px`,
              fontFamily: 'monospace',
              textShadow: `0 0 10px currentColor`,
              transition: 'none',
              pointerEvents: 'none' as const,
            }}
          >
            {sym}
          </div>
        );
      })}
    </>
  );
};

// Horizontal scan lines that activate
const ScanLines: React.FC<{ progress: number }> = ({ progress }) => {
  const lines = Array.from({ length: 8 }, (_, i) => i);

  return (
    <>
      {lines.map(i => {
        const delay = i * 0.1;
        const lineProgress = Math.max(0, Math.min(1, (progress - delay) * 4));
        const yPos = 10 + (i * 10);

        return (
          <div key={i} style={{
            position: 'absolute',
            top: `${yPos}%`,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.darkCrimson} ${lineProgress * 50}%, transparent ${lineProgress * 100}%)`,
            opacity: lineProgress * 0.3,
            pointerEvents: 'none' as const,
          }} />
        );
      })}
    </>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<IntroAudioEngine | null>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const fogLayersRef = useRef<FogLayer[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const completedRef = useRef(false);

  // Determine current phase
  const getPhase = useCallback((t: number) => {
    if (t < 3000) return 'BLACKNESS';
    if (t < 7000) return 'FOG_APPEAR';
    if (t < 11000) return 'SYMBOL_REVEAL';
    if (t < 16000) return 'LOGO_REVEAL';
    if (t < 21000) return 'WORLD_REVEAL';
    if (t < 26000) return 'SYSTEM_ACTIVATION';
    if (t < 29000) return 'FINAL_TITLE';
    return 'TRANSITION';
  }, []);

  // Phase progress (0-1) within a phase
  const getPhaseProgress = useCallback((t: number, phase: keyof typeof PHASE_TIMES) => {
    const [start, end] = PHASE_TIMES[phase];
    return Math.max(0, Math.min(1, (t - start) / (end - start)));
  }, []);

  // Initialize fog layers
  const initFogLayers = useCallback((width: number, height: number) => {
    const layers: FogLayer[] = [];
    for (let i = 0; i < 12; i++) {
      layers.push({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.2 + Math.random() * 0.4),
        radius: 80 + Math.random() * 200,
        opacity: 0,
        maxOpacity: 0.06 + Math.random() * 0.12,
        color: i % 3 === 0 ? 'rgba(122,12,22,' : i % 3 === 1 ? 'rgba(36,24,46,' : 'rgba(10,9,9,',
        phase: Math.random() * Math.PI * 2,
      });
    }
    fogLayersRef.current = layers;
  }, []);

  // Spawn a particle
  const spawnParticle = useCallback((width: number, height: number, type: Particle['type'] = 'dust') => {
    const p: Particle = {
      x: Math.random() * width,
      y: type === 'ember' || type === 'ash' ? height + 10 : Math.random() * height,
      vx: (Math.random() - 0.5) * (type === 'ember' ? 1.5 : 0.3),
      vy: type === 'ember' ? -(1 + Math.random() * 2) : type === 'ash' ? -(0.3 + Math.random() * 0.6) : (Math.random() - 0.5) * 0.15,
      size: type === 'ember' ? 1 + Math.random() * 2 : type === 'crimson' ? 2 + Math.random() * 3 : 0.5 + Math.random() * 1.5,
      opacity: 0,
      life: 0,
      maxLife: type === 'ember' ? 120 + Math.random() * 180 : 200 + Math.random() * 300,
      type,
    };
    particlesRef.current.push(p);
  }, []);

  // Canvas render loop
  const renderCanvas = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
    ctx.clearRect(0, 0, width, height);

    // Draw fog layers
    const fogProgress = getPhaseProgress(t, 'FOG_APPEAR');
    if (t >= 3000) {
      fogLayersRef.current.forEach(layer => {
        layer.x += layer.vx;
        layer.y += layer.vy;
        layer.phase += 0.01;

        // Target opacity based on timeline
        let targetOpacity = layer.maxOpacity * fogProgress;
        if (t > 16000) {
          targetOpacity *= 1.3; // More fog during world reveal
        }
        if (t > 26000) {
          targetOpacity *= Math.max(0, 1 - getPhaseProgress(t, 'FINAL_TITLE'));
        }

        layer.opacity += (targetOpacity - layer.opacity) * 0.02;

        // Breathing effect
        const breathe = Math.sin(layer.phase) * 0.02;
        const currentRadius = layer.radius * (1 + breathe);

        const gradient = ctx.createRadialGradient(
          layer.x, layer.y, 0,
          layer.x, layer.y, currentRadius
        );
        gradient.addColorStop(0, layer.color + layer.opacity + ')');
        gradient.addColorStop(0.6, layer.color + (layer.opacity * 0.5) + ')');
        gradient.addColorStop(1, layer.color + '0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(layer.x - currentRadius, layer.y - currentRadius, currentRadius * 2, currentRadius * 2);

        // Wrap around
        if (layer.y < -layer.radius) {
          layer.y = height + layer.radius;
          layer.x = Math.random() * width;
        }
        if (layer.x < -layer.radius) layer.x = width + layer.radius;
        if (layer.x > width + layer.radius) layer.x = -layer.radius;
      });
    }

    // Spawn particles based on phase
    const spawnRate = t < 3000 ? 0.02 : t < 7000 ? 0.08 : t < 16000 ? 0.15 : t < 26000 ? 0.25 : 0.1;

    if (Math.random() < spawnRate) {
      spawnParticle(width, height, 'dust');
    }
    if (t > 7000 && Math.random() < 0.06) {
      spawnParticle(width, height, 'ash');
    }
    if (t > 11000 && Math.random() < 0.04) {
      spawnParticle(width, height, 'ember');
    }
    if (t > 16000 && Math.random() < 0.03) {
      spawnParticle(width, height, 'crimson');
    }

    // Update & draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      // Opacity: fade in, hold, fade out
      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio < 0.15) {
        p.opacity = (lifeRatio / 0.15) * 0.6;
      } else if (lifeRatio > 0.75) {
        p.opacity = ((1 - lifeRatio) / 0.25) * 0.6;
      }

      // Draw
      ctx.beginPath();
      if (p.type === 'ember') {
        ctx.fillStyle = `rgba(179,19,36,${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(179,19,36,0.8)';
      } else if (p.type === 'crimson') {
        ctx.fillStyle = `rgba(122,12,22,${p.opacity * 0.7})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(122,12,22,0.6)';
      } else if (p.type === 'ash') {
        ctx.fillStyle = `rgba(145,139,134,${p.opacity * 0.4})`;
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = `rgba(231,224,210,${p.opacity * 0.25})`;
        ctx.shadowBlur = 0;
      }

      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      return p.life < p.maxLife && p.x > -50 && p.x < width + 50 && p.y > -50 && p.y < height + 50;
    });

    // Film grain overlay
    const grainOpacity = t < 3000 ? 0.03 : t < 11000 ? 0.05 : 0.04;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 16) { // Every 4th pixel for performance
      const noise = (Math.random() - 0.5) * 255 * grainOpacity;
      pixels[i] = Math.max(0, Math.min(255, pixels[i] + noise));
      pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + noise));
      pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // Vignette
    const vignetteGradient = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.25,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    vignetteGradient.addColorStop(0, 'rgba(5,5,5,0)');
    vignetteGradient.addColorStop(0.7, 'rgba(5,5,5,0.3)');
    vignetteGradient.addColorStop(1, 'rgba(5,5,5,0.85)');
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, width, height);

  }, [getPhaseProgress, spawnParticle]);

  // Complete the intro
  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsTransitioning(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.destroy();
      }
      cancelAnimationFrame(animFrameRef.current);
      onComplete();
    }, 1000);
  }, [onComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    completeIntro();
  }, [completeIntro]);

  // Start the intro
  const handleStart = useCallback(() => {
    setHasStarted(true);

    // Start audio
    audioRef.current = new IntroAudioEngine();
    audioRef.current.startFullSequence();
    audioRef.current.setMuted(isMuted);

    startTimeRef.current = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    initFogLayers(window.innerWidth, window.innerHeight);

    // Main animation loop
    const animate = () => {
      const now = performance.now();
      const t = now - startTimeRef.current;
      setElapsed(t);

      renderCanvas(ctx, window.innerWidth, window.innerHeight, t);

      if (t >= INTRO_DURATION) {
        completeIntro();
        return;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Failsafe: always transition after 32 seconds
    setTimeout(() => {
      if (!completedRef.current) {
        completeIntro();
      }
    }, 32000);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isMuted, initFogLayers, renderCanvas, completeIntro]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.destroy();
      }
    };
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newVal = !prev;
      if (audioRef.current) {
        audioRef.current.setMuted(newVal);
      }
      return newVal;
    });
  }, []);

  // Check for prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Skip the intro entirely for reduced motion
    useEffect(() => { onComplete(); }, [onComplete]);
    return null;
  }

  // Current phase data
  const phase = getPhase(elapsed);
  const symbolProgress = getPhaseProgress(elapsed, 'SYMBOL_REVEAL');
  const logoProgress = getPhaseProgress(elapsed, 'LOGO_REVEAL');
  const worldProgress = getPhaseProgress(elapsed, 'WORLD_REVEAL');
  const systemProgress = getPhaseProgress(elapsed, 'SYSTEM_ACTIVATION');
  const finalProgress = getPhaseProgress(elapsed, 'FINAL_TITLE');
  const transitionProgress = getPhaseProgress(elapsed, 'TRANSITION');

  // ─── PRE-START SCREEN (Click to Begin) ──────────────────────────────────
  if (!hasStarted) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer"
        style={{ background: COLORS.voidBlack }}
        onClick={handleStart}
      >
        {/* Subtle ambient dust */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'rgba(231,224,210,0.15)',
                animation: `float ${4 + Math.random() * 6}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Pulsing emblem */}
        <div className="mb-8 animate-pulse" style={{ animationDuration: '3s' }}>
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="35" stroke={COLORS.darkCrimson} strokeWidth="1.5"
              strokeDasharray="6 4" opacity="0.6" />
            <circle cx="50" cy="50" r="12" stroke={COLORS.bloodRed} strokeWidth="1.5" opacity="0.8" />
            <circle cx="50" cy="50" r="3" fill={COLORS.darkCrimson} />
          </svg>
        </div>

        <p
          className="text-sm tracking-[0.4em] uppercase mb-4"
          style={{ color: COLORS.boneWhite, fontFamily: 'Cinzel, serif', opacity: 0.7 }}
        >
          Click to Enter
        </p>
        <p
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{ color: COLORS.oldGold, fontFamily: 'Inter, sans-serif', opacity: 0.4 }}
        >
          Best experienced with sound
        </p>

        {/* Pre-mute toggle */}
        <button
          className="absolute bottom-8 right-8 p-3 rounded-full border transition-all duration-300"
          style={{
            borderColor: isMuted ? 'rgba(179,19,36,0.3)' : 'rgba(176,109,53,0.4)',
            color: isMuted ? COLORS.darkCrimson : COLORS.oldGold,
            background: 'rgba(21,19,19,0.5)',
          }}
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  // ─── MAIN INTRO RENDER ────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        background: COLORS.voidBlack,
        opacity: isTransitioning ? 0 : 1,
        transition: isTransitioning ? 'opacity 1s ease-out' : 'none',
      }}
    >
      {/* Background canvas (particles, fog, grain, vignette) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ─── PHASE: SYMBOL REVEAL (7-11s) ──────────────────────────────── */}
      {elapsed >= 6500 && elapsed < 16000 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: elapsed < 11000 ? symbolProgress : Math.max(0, 1 - (logoProgress * 1.5)),
          }}
        >
          <CrownEyeEmblem progress={symbolProgress} />
        </div>
      )}

      {/* ─── PHASE: LOGO REVEAL (11-16s) ───────────────────────────────── */}
      {elapsed >= 10500 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: elapsed < 16000
              ? Math.min(1, logoProgress * 2)
              : elapsed < 26000
                ? 1
                : Math.max(0, 1 - (finalProgress > 0.5 ? 0 : finalProgress * 2)),
          }}
        >
          {/* LORD EVIL text formation */}
          <div className="relative">
            {/* Background glow pulse */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(179,19,36,${0.15 * logoProgress}) 0%, transparent 70%)`,
                transform: `scale(${2 + Math.sin(elapsed / 500) * 0.2})`,
                filter: 'blur(40px)',
              }}
            />

            {/* Main LORD EVIL text */}
            <h1
              style={{
                fontFamily: 'Creepster, cursive',
                fontSize: 'clamp(3rem, 10vw, 7rem)',
                color: COLORS.darkCrimson,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textShadow: `
                  0 0 ${15 + Math.sin(elapsed / 300) * 8}px rgba(179,19,36,0.9),
                  0 0 ${35 + Math.sin(elapsed / 400) * 15}px rgba(179,19,36,0.5),
                  0 0 ${60 + Math.sin(elapsed / 500) * 20}px rgba(122,12,22,0.4),
                  0 4px 20px rgba(0,0,0,0.8)
                `,
                opacity: Math.min(1, logoProgress * 2.5),
                transform: `scale(${0.85 + logoProgress * 0.15}) translateY(${(1 - logoProgress) * 20}px)`,
                transition: 'none',
                WebkitTextStroke: '0.5px rgba(122,12,22,0.3)',
                position: 'relative',
              }}
            >
              LORD EVIL
            </h1>

            {/* Subtitle */}
            <p
              className="text-center mt-2"
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: COLORS.oldGold,
                opacity: Math.max(0, logoProgress * 2 - 1),
                textShadow: '0 0 10px rgba(176,109,53,0.5)',
              }}
            >
              THE EMPIRE
            </p>
          </div>
        </div>
      )}

      {/* ─── PHASE: WORLD REVEAL (16-21s) ──────────────────────────────── */}
      {elapsed >= 15500 && elapsed < 26000 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark throne architecture: towering columns */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${worldProgress * 45}%`,
              background: `linear-gradient(to top, rgba(10,9,9,0.95) 0%, rgba(21,19,19,0.6) 40%, transparent 100%)`,
              opacity: worldProgress,
            }}
          />

          {/* Left column silhouette */}
          <div
            className="absolute bottom-0 left-[8%]"
            style={{
              width: '3%',
              height: `${worldProgress * 55}%`,
              background: `linear-gradient(to top, rgba(36,24,46,0.8) 0%, rgba(122,12,22,0.2) 80%, transparent 100%)`,
              opacity: worldProgress,
              boxShadow: `inset 0 0 15px rgba(179,19,36,0.15)`,
            }}
          />

          {/* Right column silhouette */}
          <div
            className="absolute bottom-0 right-[8%]"
            style={{
              width: '3%',
              height: `${worldProgress * 55}%`,
              background: `linear-gradient(to top, rgba(36,24,46,0.8) 0%, rgba(122,12,22,0.2) 80%, transparent 100%)`,
              opacity: worldProgress,
              boxShadow: `inset 0 0 15px rgba(179,19,36,0.15)`,
            }}
          />

          {/* Central arch */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: '60%',
              height: `${worldProgress * 35}%`,
              borderTop: `2px solid rgba(179,19,36,${worldProgress * 0.25})`,
              borderRadius: '50% 50% 0 0',
              background: `radial-gradient(ellipse at 50% 100%, rgba(122,12,22,0.1) 0%, transparent 70%)`,
              opacity: worldProgress * 0.8,
            }}
          />

          {/* Crimson light shafts */}
          {[20, 40, 60, 80].map((pos, i) => (
            <div
              key={`shaft-${i}`}
              className="absolute top-0"
              style={{
                left: `${pos}%`,
                width: '1px',
                height: `${worldProgress * 100}%`,
                background: `linear-gradient(to bottom, rgba(179,19,36,${worldProgress * 0.08}) 0%, transparent 100%)`,
                opacity: 0.3 + Math.sin((elapsed / 1000 + i) * 0.5) * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* ─── PHASE: SYSTEM ACTIVATION (21-26s) ────────────────────────── */}
      {elapsed >= 20500 && elapsed < 26500 && (
        <div className="absolute inset-0 pointer-events-none">
          <SystemSymbols progress={systemProgress} />
          <ScanLines progress={systemProgress} />

          {/* HUD corner brackets */}
          <div
            className="absolute top-[5%] left-[5%]"
            style={{
              width: 40, height: 40,
              borderTop: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              borderLeft: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              opacity: systemProgress,
            }}
          />
          <div
            className="absolute top-[5%] right-[5%]"
            style={{
              width: 40, height: 40,
              borderTop: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              borderRight: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              opacity: systemProgress,
            }}
          />
          <div
            className="absolute bottom-[5%] left-[5%]"
            style={{
              width: 40, height: 40,
              borderBottom: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              borderLeft: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              opacity: systemProgress,
            }}
          />
          <div
            className="absolute bottom-[5%] right-[5%]"
            style={{
              width: 40, height: 40,
              borderBottom: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              borderRight: `2px solid rgba(179,19,36,${systemProgress * 0.8})`,
              opacity: systemProgress,
            }}
          />

          {/* Status text */}
          <div
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: COLORS.darkCrimson,
              opacity: systemProgress * 0.6,
              textShadow: '0 0 8px rgba(179,19,36,0.5)',
            }}
          >
            {systemProgress < 0.3 ? 'INITIALIZING...' :
             systemProgress < 0.6 ? 'SYSTEM ONLINE' :
             'EMPIRE ACTIVATED'}
          </div>
        </div>
      )}

      {/* ─── PHASE: FINAL TITLE (26-29s) ───────────────────────────────── */}
      {elapsed >= 25500 && elapsed < 30000 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: finalProgress < 0.15 ? finalProgress / 0.15 : transitionProgress > 0 ? 1 - transitionProgress : 1,
          }}
        >
          <h1
            style={{
              fontFamily: 'Creepster, cursive',
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              color: COLORS.darkCrimson,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textShadow: `
                0 0 20px rgba(179,19,36,0.9),
                0 0 50px rgba(179,19,36,0.6),
                0 0 80px rgba(122,12,22,0.5),
                0 6px 30px rgba(0,0,0,0.9)
              `,
            }}
          >
            LORD EVIL
          </h1>
          <div
            className="mt-3 h-[1px]"
            style={{
              width: `${finalProgress * 200}px`,
              maxWidth: '80vw',
              background: `linear-gradient(90deg, transparent, ${COLORS.oldGold}, transparent)`,
              opacity: finalProgress,
            }}
          />
          <p
            className="mt-4"
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(0.55rem, 1.2vw, 0.75rem)',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: COLORS.boneWhite,
              opacity: Math.max(0, finalProgress * 2 - 0.5) * 0.7,
              textShadow: '0 0 15px rgba(231,224,210,0.3)',
            }}
          >
            WELCOME TO THE EMPIRE
          </p>
        </div>
      )}

      {/* ─── TRANSITION OVERLAY (29-30s) ───────────────────────────────── */}
      {elapsed >= 28500 && (
        <div
          className="absolute inset-0"
          style={{
            background: COLORS.voidBlack,
            opacity: transitionProgress,
          }}
        />
      )}

      {/* ─── SKIP BUTTON ──────────────────────────────────────────────── */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-sm transition-all duration-300 hover:border-opacity-80"
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: COLORS.boneWhite,
          opacity: elapsed > 2000 ? 0.4 : 0,
          background: 'rgba(5,5,5,0.5)',
          border: '1px solid rgba(179,19,36,0.3)',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '0.9';
          (e.target as HTMLButtonElement).style.borderColor = 'rgba(179,19,36,0.7)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.opacity = '0.4';
          (e.target as HTMLButtonElement).style.borderColor = 'rgba(179,19,36,0.3)';
        }}
      >
        Skip Intro
      </button>

      {/* ─── MUTE TOGGLE ──────────────────────────────────────────────── */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-50 p-2 rounded-full transition-all duration-300"
        style={{
          color: isMuted ? COLORS.darkCrimson : COLORS.oldGold,
          background: 'rgba(5,5,5,0.4)',
          border: `1px solid ${isMuted ? 'rgba(179,19,36,0.3)' : 'rgba(176,109,53,0.3)'}`,
          opacity: elapsed > 1000 ? 0.5 : 0,
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.opacity = '1'; }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.5'; }}
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* ─── PROGRESS BAR ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          width: `${(elapsed / INTRO_DURATION) * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.bloodRed}, ${COLORS.darkCrimson}, ${COLORS.oldGold})`,
          boxShadow: `0 0 10px ${COLORS.darkCrimson}`,
          opacity: elapsed > 1000 ? 0.6 : 0,
          transition: 'opacity 0.5s',
        }}
      />

      {/* Float animation for pre-start dust */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0.15; }
          50% { opacity: 0.3; }
          100% { transform: translateY(-20px) translateX(10px); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};

export default CinematicIntro;
