import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, ArrowUpRight, ArrowDownLeft, Shield, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const TokenHistoryDrawer: React.FC = () => {
  const {
    tokens,
    rank,
    rankProgress,
    transactions,
    isHistoryDrawerOpen,
    setHistoryDrawerOpen,
  } = useGame();

  if (!isHistoryDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop click */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => {
            soundEngine.playClick();
            setHistoryDrawerOpen(false);
          }}
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-md h-full bg-void-950/95 border-l border-void-purple/30 p-6 flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-void-purple/20">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <h2 className="font-mono text-sm sm:text-base font-bold tracking-widest text-white uppercase">
                DEATH TOKEN TREASURY
              </h2>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                setHistoryDrawerOpen(false);
              }}
              className="p-1 rounded-lg text-void-muted hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Overview Card */}
          <div className="my-6 p-5 rounded-xl bg-gradient-to-br from-void-900 to-void-850 border border-void-purple/40 text-center glow-border relative overflow-hidden">
            <div className="text-[11px] font-mono tracking-widest uppercase text-void-muted mb-1">
              CURRENT TREASURY BALANCE
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white text-glow-purple tracking-wider flex items-center justify-center gap-2">
              <Coins className="w-7 h-7 text-yellow-400" />
              <span>{tokens.toLocaleString()}</span>
            </div>
            <p className="text-[10px] font-mono text-void-200 mt-1 uppercase">
              FICTIONAL IN-GAME ASSETS ONLY
            </p>

            {/* Rank Ladder indicator */}
            <div className="mt-4 pt-3 border-t border-void-purple/20 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-void-crimson">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-bold">{rank}</span>
              </div>
              <span className="text-void-muted">{rankProgress}% to Next Rank</span>
            </div>
            <div className="w-full h-1.5 bg-void-700 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-void-purple to-void-crimson rounded-full"
                style={{ width: `${rankProgress}%` }}
              />
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <div className="text-xs font-mono text-void-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-void-purple" />
              <span>Imperial Transaction Audit Log</span>
            </div>

            {transactions.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-void-muted">
                NO TRANSACTIONS RECORDED YET.
              </div>
            ) : (
              transactions.map((tx) => {
                const isPositive = tx.type === 'reward' || tx.type === 'grant';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-void-900/70 border border-void-purple/15 flex items-center justify-between text-xs font-mono hover:border-void-purple/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          isPositive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-void-crimson/20 text-void-crimson'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-semibold truncate max-w-[190px]">
                          {tx.source}
                        </div>
                        <div className="text-[10px] text-void-muted">{tx.timestamp}</div>
                      </div>
                    </div>

                    <div
                      className={`font-bold tracking-wider ${
                        isPositive ? 'text-green-400' : 'text-void-crimson'
                      }`}
                    >
                      {isPositive ? `+${tx.amount}` : `-${tx.amount}`}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-void-purple/20 text-center">
            <p className="text-[10px] font-mono text-void-muted">
              DEATH TOKENS HAVE ZERO REAL MONETARY VALUE.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
