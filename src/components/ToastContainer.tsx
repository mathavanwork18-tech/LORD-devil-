import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useGame();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl font-mono text-xs ${
              t.type === 'success'
                ? 'bg-void-950/95 border-void-purple/50 text-white shadow-void-purple/20'
                : t.type === 'warning'
                ? 'bg-void-950/95 border-yellow-500/50 text-yellow-300 shadow-yellow-500/10'
                : t.type === 'error'
                ? 'bg-void-950/95 border-void-crimson/50 text-void-crimson shadow-void-crimson/20'
                : 'bg-void-950/95 border-void-purple/30 text-void-200'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />}
            {t.type === 'error' && <AlertOctagon className="w-4 h-4 text-void-crimson shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-void-purple shrink-0" />}

            <span className="leading-snug">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
