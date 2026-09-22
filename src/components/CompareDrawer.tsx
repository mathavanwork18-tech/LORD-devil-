import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Coins, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const CompareDrawer: React.FC<{ onSelectService?: (id: string) => void }> = ({ onSelectService }) => {
  const {
    services,
    comparedServices,
    toggleCompare,
    clearCompared,
    isCompareDrawerOpen,
    setCompareDrawerOpen,
  } = useGame();

  if (!isCompareDrawerOpen || comparedServices.length === 0) return null;

  const comparedList = services.filter((s) => comparedServices.includes(s.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 z-40 bg-void-950/95 border-t border-void-purple/40 shadow-2xl backdrop-blur-2xl p-4 sm:p-6 transition-all">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-void-purple/20">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-void-purple" />
              <h3 className="font-mono text-sm sm:text-base font-bold tracking-widest text-white uppercase">
                EVIL SERVICES COMPARISON MATRIX ({comparedList.length}/3)
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearCompared}
                className="text-xs font-mono text-void-muted hover:text-void-crimson transition"
              >
                CLEAR ALL
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCompareDrawerOpen(false);
                }}
                className="p-1 rounded text-void-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {comparedList.map((srv) => (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="void-card rounded-xl p-4 relative flex flex-col justify-between"
              >
                <button
                  onClick={() => toggleCompare(srv.id)}
                  className="absolute top-3 right-3 p-1 text-void-muted hover:text-void-crimson"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-[10px] font-mono text-void-crimson uppercase tracking-wider mb-1">
                    {srv.category} CLASS
                  </div>
                  <h4 className="text-base font-bold text-white font-mono mb-2">{srv.title}</h4>
                  <p className="text-xs text-void-muted mb-4 line-clamp-2">{srv.description}</p>

                  <div className="space-y-2 mb-4 text-xs font-mono">
                    <div className="flex justify-between items-center py-1 border-b border-void-purple/10">
                      <span className="text-void-muted flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-400" /> PRICE
                      </span>
                      <span className="font-bold text-white">{srv.priceTokens} TOKENS</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-void-purple/10">
                      <span className="text-void-muted flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-void-crimson" /> THREAT LEVEL
                      </span>
                      <span className="font-bold text-void-crimson">{srv.threatLevel}%</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-void-purple/10">
                      <span className="text-void-muted flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" /> SUCCESS RATE
                      </span>
                      <span className="font-bold text-green-400">{srv.successRate}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectService?.(srv.id);
                  }}
                  className="w-full py-2 rounded bg-void-purple/20 hover:bg-void-purple/40 border border-void-purple/40 text-xs font-mono tracking-wider text-white flex items-center justify-center gap-1 transition"
                >
                  <span>INSPECT BLUEPRINT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
