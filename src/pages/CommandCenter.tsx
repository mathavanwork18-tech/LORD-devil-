import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  RefreshCw,
  Shield,
  Activity,
  AlertTriangle,
  Globe,
  Bot,
  Zap,
  CheckCircle2,
  Crosshair,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { TACTICAL_NODES } from '../data/mockData';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const CommandCenter: React.FC = () => {
  const { tokens } = useGame();
  const [selectedNode, setSelectedNode] = useState(TACTICAL_NODES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleScan = () => {
    setIsScanning(true);
    soundEngine.playScan();
    setTimeout(() => {
      setIsScanning(false);
      soundEngine.playAccessGranted();
    }, 1800);
  };

  const filteredNodes = filterStatus === 'ALL'
    ? TACTICAL_NODES
    : TACTICAL_NODES.filter((n) => n.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-void-purple/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-2 uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GLOBAL DOMINANCE REALM TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white uppercase">
            EVIL COMMAND <span className="text-void-purple text-glow-purple">CENTER</span>
          </h1>
          <p className="text-xs font-mono text-void-muted mt-1">
            Real-time planetary surveillance grid, active field nodes, and dark matter reactors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-lg bg-void-purple/20 hover:bg-void-purple/30 border border-void-purple text-xs font-mono text-white flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'RUNNING FREQUENCY SWEEP...' : 'DIAGNOSTIC SCAN'}</span>
          </button>
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Vector SVG World Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="void-panel rounded-2xl p-6 border-void-purple/40 relative overflow-hidden hud-corner-tl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-void-purple" />
                <h3 className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
                  PLANETARY TACTICAL SECTOR MAP
                </h3>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {['ALL', 'OCCUPIED', 'CONTESTED', 'SUBJUGATED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      soundEngine.playClick();
                      setFilterStatus(st);
                    }}
                    className={`px-2 py-0.5 rounded border transition ${
                      filterStatus === st
                        ? 'bg-void-purple text-white border-void-purple'
                        : 'bg-void-900 text-void-muted border-void-purple/10'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Tactical Map Canvas */}
            <div className="relative w-full aspect-[16/9] bg-void-950 rounded-xl border border-void-purple/20 overflow-hidden flex items-center justify-center scanlines">
              {/* Radar circular rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-48 h-48 rounded-full border border-void-purple" />
                <div className="w-96 h-96 rounded-full border border-void-purple" />
                <div className="w-[500px] h-[500px] rounded-full border border-void-purple" />
              </div>

              {/* Radar rotating sweep arm */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full bg-gradient-to-tr from-void-purple/10 to-transparent rounded-full animate-radar origin-center pointer-events-none opacity-40" />
              </div>

              {/* Vector Abstract World Continents */}
              <svg
                viewBox="0 0 1000 550"
                className="w-full h-full text-void-850 fill-current opacity-75 select-none"
              >
                {/* North America */}
                <path d="M120,80 Q220,60 300,100 Q320,180 260,250 Q180,280 140,220 Z" />
                {/* South America */}
                <path d="M240,280 Q320,300 300,420 Q250,500 220,440 Z" />
                {/* Eurasia */}
                <path d="M450,70 Q750,50 850,140 Q800,260 620,240 Q540,160 450,120 Z" />
                {/* Africa */}
                <path d="M460,220 Q560,200 580,340 Q520,450 460,380 Z" />
                {/* Australia */}
                <path d="M780,340 Q880,330 870,440 Q790,450 760,390 Z" />

                {/* Animated Connection Lines Between Active Nodes */}
                <line x1="320" y1="190" x2="580" y2="165" stroke="#B000FF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                <line x1="580" y1="165" x2="820" y2="300" stroke="#FF1744" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                <line x1="490" y1="264" x2="320" y2="190" stroke="#B000FF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
              </svg>

              {/* Interactive Tactical Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedNode(node);
                    }}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
                  >
                    {/* Pulsing ring */}
                    <span
                      className={`absolute -inset-2 rounded-full opacity-60 animate-ping ${
                        node.status === 'CONTESTED'
                          ? 'bg-void-crimson'
                          : node.status === 'SUBJUGATED'
                          ? 'bg-green-400'
                          : 'bg-void-purple'
                      }`}
                    />
                    {/* Node Core */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition transform group-hover:scale-125 ${
                        isSelected
                          ? 'bg-white border-void-purple ring-4 ring-void-purple/40 scale-125'
                          : node.status === 'CONTESTED'
                          ? 'bg-void-crimson border-white'
                          : node.status === 'SUBJUGATED'
                          ? 'bg-green-500 border-white'
                          : 'bg-void-purple border-white'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-void-purple/15 text-[11px] font-mono text-void-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-void-purple" /> OCCUPIED
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-void-crimson" /> CONTESTED
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" /> SUBJUGATED
                </span>
              </div>
              <span>COORDINATE GRID: WGS-84 QUANTUM ALIGNED</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="void-card rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono text-void-muted uppercase">ACTIVE FLEETS</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">48 BATTALIONS</div>
            </div>
            <div className="void-card rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono text-void-muted uppercase">SURVEILLANCE SATS</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-void-purple mt-1">12 ONLINE</div>
            </div>
            <div className="void-card rounded-xl p-4 text-center">
              <div className="text-[10px] font-mono text-void-muted uppercase">CONTAINMENT LEVEL</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-green-400 mt-1">99.8%</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Node Dossier & Telemetry */}
        <div className="space-y-6">
          {/* Node Detail Panel */}
          <div className="void-panel rounded-2xl p-6 border-void-purple/40 relative hud-corner-tl">
            <div className="text-[10px] font-mono text-void-crimson uppercase tracking-widest mb-1">
              SELECTED SECTOR TELEMETRY
            </div>
            <h3 className="text-xl font-bold font-mono text-white mb-4">
              {selectedNode.name}
            </h3>

            <div className="space-y-3.5 text-xs font-mono text-void-200 mb-6">
              <div className="flex justify-between py-1 border-b border-void-purple/10">
                <span className="text-void-muted">CONTROL STATUS:</span>
                <span className={`font-bold ${
                  selectedNode.status === 'CONTESTED' ? 'text-void-crimson' : 'text-green-400'
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-void-purple/10">
                <span className="text-void-muted">LOCAL THREAT INDEX:</span>
                <span className="font-bold text-void-purple">{selectedNode.threat}</span>
              </div>

              <div>
                <div className="flex justify-between text-void-muted mb-1">
                  <span>SUBJUGATION PROGRESS</span>
                  <span className="text-white font-bold">{selectedNode.progress}%</span>
                </div>
                <div className="w-full h-2 bg-void-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-void-purple to-void-crimson rounded-full"
                    style={{ width: `${selectedNode.progress}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-void-900 rounded-lg border border-void-purple/20 text-[11px] leading-relaxed text-void-muted">
                DEPLOYED AGENTS: 400 Shadow Drones, 2 Cyber Specters. Automated jammer disrupting local emergency radio bands.
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playScan();
              }}
              className="w-full py-3 rounded-lg bg-void-purple/20 hover:bg-void-purple/40 border border-void-purple text-xs font-mono tracking-wider text-white flex items-center justify-center gap-2 transition"
            >
              <Crosshair className="w-4 h-4" />
              <span>REINFORCE WITH MINIONS</span>
            </button>
          </div>

          {/* System Health Monitor */}
          <div className="void-card rounded-2xl p-6">
            <h4 className="text-xs font-mono tracking-widest uppercase text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span>CORE ENERGY REACTORS</span>
            </h4>

            <div className="space-y-3 text-xs font-mono text-void-200">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>DIMENSIONAL RIFT CONDENSER</span>
                  <span className="text-green-400">94%</span>
                </div>
                <div className="w-full h-1.5 bg-void-900 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-green-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>DARK MATTER COOLING GRIDS</span>
                  <span className="text-void-purple">88%</span>
                </div>
                <div className="w-full h-1.5 bg-void-900 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-void-purple rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>ORBITAL LASER COHERENCE</span>
                  <span className="text-void-crimson">99%</span>
                </div>
                <div className="w-full h-1.5 bg-void-900 rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-void-crimson rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
