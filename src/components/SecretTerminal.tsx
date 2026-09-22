import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const SecretTerminal: React.FC = () => {
  const {
    codename,
    tokens,
    rank,
    addTokens,
    unlockAchievement,
    isSecretTerminalOpen,
    setSecretTerminalOpen,
  } = useGame();

  const [inputVal, setInputVal] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { id: '1', type: 'output', text: '==================================================' },
    { id: '2', type: 'output', text: '   DR. VOID CLASSIFIED MAINFRAME — SUBSYSTEM 99  ' },
    { id: '3', type: 'output', text: '==================================================' },
    { id: '4', type: 'output', text: 'Type "help" for a list of active imperial commands.' },
    { id: '5', type: 'output', text: 'Notice: Unauthorized access will be fed to the Archon.' },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSecretTerminalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSecretTerminalOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isSecretTerminalOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    soundEngine.playTerminalChirp();
    const newLogs: LogLine[] = [
      ...logs,
      { id: 'log-' + Date.now(), type: 'input', text: `> ${rawCmd}` },
    ];

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
      case 'help':
        newLogs.push(
          { id: 'h1', type: 'output', text: 'AVAILABLE COMMANDS:' },
          { id: 'h2', type: 'output', text: '  status           - Display operative and system telemetry' },
          { id: 'h3', type: 'output', text: '  void-2077        - [CLASSIFIED] Execute Master Override Protocol' },
          { id: 'h4', type: 'output', text: '  grant <amount>   - Deposit test Death Tokens into local treasury' },
          { id: 'h5', type: 'output', text: '  lore             - Declassify Dr. Void origin records' },
          { id: 'h6', type: 'output', text: '  minions          - Query minion readiness report' },
          { id: 'h7', type: 'output', text: '  matrix           - Trigger visual phosphor stream' },
          { id: 'h8', type: 'output', text: '  clear            - Wipe local console memory' },
          { id: 'h9', type: 'output', text: '  exit             - Close terminal session' }
        );
        break;

      case 'status':
        newLogs.push(
          { id: 's1', type: 'output', text: `OPERATIVE: ${codename || 'ANONYMOUS_INTRUDER'}` },
          { id: 's2', type: 'output', text: `SECURITY RANK: ${rank}` },
          { id: 's3', type: 'output', text: `TREASURY BALANCE: ${tokens.toLocaleString()} DEATH TOKENS` },
          { id: 's4', type: 'success', text: 'CORE RIFT TEMPERATURE: 1.4 MK (STABLE)' },
          { id: 's5', type: 'success', text: 'DEFENSE GRID: 100% OPERATIONAL' }
        );
        break;

      case 'void-2077':
        soundEngine.playAccessGranted();
        unlockAchievement('ach-05');
        addTokens(500, 'TERMINAL OVERRIDE VOID-2077');
        newLogs.push(
          { id: 'v1', type: 'success', text: '##################################################' },
          { id: 'v2', type: 'success', text: '  [ACCESS GRANTED] MASTER OVERRIDE VOID-2077 ACTIVATED' },
          { id: 'v3', type: 'success', text: '##################################################' },
          { id: 'v4', type: 'output', text: 'Achievement Unlocked: TERMINAL INFILTRATOR' },
          { id: 'v5', type: 'output', text: '+500 DEATH TOKENS WIRED TO YOUR SECURE DOSSIER.' },
          { id: 'v6', type: 'output', text: 'DR. VOID SAYS: "Curiosity is the true hallmark of villainy."' }
        );
        break;

      case 'grant':
        const amt = parseInt(arg, 10);
        if (isNaN(amt) || amt <= 0) {
          newLogs.push({ id: 'err', type: 'error', text: 'Usage: grant <positive_number>' });
        } else if (amt > 100000) {
          newLogs.push({ id: 'err', type: 'error', text: 'Error: Cannot exceed 100,000 in a single quantum transfer.' });
        } else {
          addTokens(amt, 'TERMINAL GRANT COMMAND');
          newLogs.push({ id: 'g1', type: 'success', text: `SUCCESS: Deposited ${amt} Death Tokens.` });
        }
        break;

      case 'lore':
        newLogs.push(
          { id: 'l1', type: 'output', text: 'RECORD DECLASSIFIED: DR. ARCHIBALD VOID' },
          { id: 'l2', type: 'output', text: 'Born in 1984 under the shadow of a blood moon. At age 26, proved that gravity' },
          { id: 'l3', type: 'output', text: 'can be inverted through psychic resonance. Founded the Evil Empire to deliver' },
          { id: 'l4', type: 'output', text: 'humanity from mundane mediocrity through theatrical cosmic terror.' }
        );
        break;

      case 'minions':
        newLogs.push(
          { id: 'm1', type: 'output', text: 'MINION DEPLOYMENT STATUS:' },
          { id: 'm2', type: 'output', text: '  - SHADOW DRONES: 12,400 Units Active (Patrolling Sector 4)' },
          { id: 'm3', type: 'output', text: '  - VOID CULTISTS: 4,200 Chanting in Subterranean Crypt' },
          { id: 'm4', type: 'output', text: '  - CYBER SPECTERS: Infiltrating 31 Global Fiber Hubs' }
        );
        break;

      case 'matrix':
        newLogs.push(
          { id: 'mx1', type: 'success', text: '01010110 01001111 01001001 01000100' },
          { id: 'mx2', type: 'success', text: 'THE MATRIX BELONGS TO THE EMPEROR' },
          { id: 'mx3', type: 'success', text: '11001010 10101110 00101010 11110000' }
        );
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
        setSecretTerminalOpen(false);
        return;

      default:
        soundEngine.playAccessDenied();
        newLogs.push({
          id: 'err-' + Date.now(),
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for syntax.`,
        });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full ${
          isMaximized ? 'h-full max-w-none' : 'max-w-3xl h-[540px]'
        } bg-[#050B07] border-2 border-green-500/50 rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono text-green-400`}
        style={{
          textShadow: '0 0 5px rgba(34, 197, 94, 0.6)',
          boxShadow: '0 0 35px rgba(34, 197, 94, 0.15)',
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-green-950/40 border-b border-green-500/30 select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold tracking-widest uppercase">
              TERMINAL // VOID-OS KERNEL v4.9.12
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:text-white transition"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setSecretTerminalOpen(false)}
              className="p-1 hover:text-red-400 transition"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scanlines Effect */}
        <div className="relative flex-1 p-4 overflow-y-auto scanlines text-xs sm:text-sm leading-relaxed space-y-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`${
                log.type === 'input'
                  ? 'text-white font-bold'
                  : log.type === 'error'
                  ? 'text-red-400'
                  : log.type === 'success'
                  ? 'text-green-300 font-bold'
                  : 'text-green-400/90'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleCommand} className="p-3 bg-black/70 border-t border-green-500/30 flex items-center gap-2">
          <span className="text-green-400 font-bold text-sm select-none">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' or secret code..."
            className="flex-1 bg-transparent text-green-300 font-mono text-xs sm:text-sm focus:outline-none placeholder:text-green-800"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-300 text-xs rounded border border-green-500/40 transition"
          >
            EXEC
          </button>
        </form>
      </motion.div>
    </div>
  );
};
