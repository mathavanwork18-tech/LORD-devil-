import React, { useState } from 'react';
import { Radio, Lock, Unlock, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { INTEL_REPORTS } from '../data/mockData';
import { IntelReport } from '../types';
import { soundEngine } from '../utils/soundEngine';

export const Intelligence: React.FC = () => {
  const [reports, setReports] = useState<IntelReport[]>(INTEL_REPORTS);
  const [decryptedIds, setDecryptedIds] = useState<string[]>(['intel-01', 'intel-02']);

  const handleDecrypt = (id: string) => {
    soundEngine.playScan();
    setTimeout(() => {
      soundEngine.playAccessGranted();
      setDecryptedIds((prev) => [...prev, id]);
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>CLASSIFIED CIPHER INTERCEPTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          IMPERIAL <span className="text-void-purple text-glow-purple">INTELLIGENCE</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Decrypted wiretaps, satellite anomalies, and intercepted diplomatic communications from across the mortal realms.
        </p>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {reports.map((report) => {
          const isDecrypted = decryptedIds.includes(report.id);

          return (
            <div
              key={report.id}
              className="void-card rounded-2xl p-6 transition group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-void-crimson">
                    {report.code}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-void-crimson/15 text-void-crimson border border-void-crimson/30">
                    {report.classification}
                  </span>
                  <span className="text-[10px] font-mono text-void-muted">
                    INTERCEPTED: {report.timestamp}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-void-purple">
                  SOURCE: {report.interceptedFrom}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold font-mono text-white mb-3">
                {report.title}
              </h3>

              {isDecrypted ? (
                <p className="text-xs sm:text-sm font-mono text-void-200 leading-relaxed bg-void-900/80 p-4 rounded-xl border border-void-purple/20">
                  {report.summary}
                </p>
              ) : (
                <div className="p-4 rounded-xl bg-void-950 border border-void-purple/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="font-mono text-xs text-void-muted tracking-widest blur-[2px] select-none">
                    X992-CIPHER-OVERRIDE-A882-BLOCKED-ENCRYPTION-STREAM
                  </div>
                  <button
                    onClick={() => handleDecrypt(report.id)}
                    className="px-4 py-2 rounded-lg bg-void-purple/25 hover:bg-void-purple/40 border border-void-purple text-xs font-mono text-white flex items-center gap-2 transition shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>DECRYPT REPORT</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
