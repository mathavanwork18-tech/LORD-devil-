import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Shield, CheckCircle2, Lock, Radio, Key } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const Contact: React.FC = () => {
  const { codename, showToast } = useGame();
  const [senderName, setSenderName] = useState(codename || '');
  const [subject, setSubject] = useState('Request Evil Consulting');
  const [priority, setPriority] = useState('STANDARD');
  const [message, setMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [receiptCode, setReceiptCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('TRANSMISSION BUFFER CANNOT BE EMPTY', 'warning');
      soundEngine.playAccessDenied();
      return;
    }

    setIsTransmitting(true);
    soundEngine.playScan();

    setTimeout(() => {
      setIsTransmitting(false);
      const code = 'CIPHER-TX-' + Math.floor(1000 + Math.random() * 9000);
      setReceiptCode(code);
      soundEngine.playAccessGranted();
      showToast('ENCRYPTED CABLE DISPATCHED TO MT. EREBUS', 'success');
    }, 1500);
  };

  const handleReset = () => {
    setMessage('');
    setReceiptCode(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-crimson/15 border border-void-crimson/30 text-xs font-mono text-void-crimson mb-3 uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>QUANTUM UPLINK RELAY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          ENCRYPTED <span className="text-void-crimson text-glow-crimson">TRANSMISSION</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          Direct 4096-bit encrypted wire to Dr. Void’s personal console. Report superhero incursions, request planetary lasers, or submit tribute.
        </p>
      </div>

      <div className="void-panel rounded-2xl p-6 sm:p-10 border-void-purple/40 relative hud-corner-tl">
        <AnimatePresence mode="wait">
          {!receiptCode ? (
            <motion.form
              key="contact-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-xs font-mono"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-void-200 block mb-1.5 uppercase">
                    OPERATIVE CODENAME / CALLSIGN
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="ENTER CALLSIGN..."
                    required
                    className="w-full px-4 py-2.5 bg-void-900 border border-void-purple/30 rounded-lg text-white focus:outline-none focus:border-void-purple"
                  />
                </div>

                <div>
                  <label className="text-void-200 block mb-1.5 uppercase">
                    TRANSMISSION PURPOSE
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-void-900 border border-void-purple/30 rounded-lg text-white focus:outline-none focus:border-void-purple"
                  >
                    <option value="Request Evil Consulting">Request Evil Consulting</option>
                    <option value="Report Superhero Activity">Report Superhero Activity</option>
                    <option value="Contract Minion Vanguard">Contract Minion Vanguard</option>
                    <option value="Submit Tribute / Voluntary Surrender">Submit Tribute / Voluntary Surrender</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-void-200 block mb-1.5 uppercase">
                  CLASSIFICATION LEVEL
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['STANDARD', 'HIGH PRIORITY', 'APOCALYPTIC'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setPriority(lvl)}
                      className={`py-2 rounded-lg border text-center transition ${
                        priority === lvl
                          ? 'bg-void-crimson/20 border-void-crimson text-void-crimson font-bold'
                          : 'bg-void-900 border-void-purple/15 text-void-muted'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-void-200 block mb-1.5 uppercase">
                  TRANSMISSION PAYLOAD / DISPATCH
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify coordinates, hero weaknesses, or desired terms of surrender..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-void-900 border border-void-purple/30 rounded-lg text-white placeholder:text-void-muted focus:outline-none focus:border-void-purple leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-bold font-mono tracking-widest text-white text-xs flex items-center justify-center gap-2 shadow-glow-purple transition active:scale-95 disabled:opacity-50"
              >
                {isTransmitting ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>ENCRYPTING & TRANSMITTING VIA SUB-STRATA...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>BROADCAST ENCRYPTED CABLE</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="receipt"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto text-green-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold font-mono text-white tracking-wider">
                TRANSMISSION RECEIVED BY THE EMPEROR
              </h3>
              <p className="text-xs font-mono text-void-muted max-w-md mx-auto">
                Your encrypted packet has been injected into Dr. Void’s personal neural receiver. Expect automated surveillance within your sector.
              </p>

              <div className="p-4 rounded-xl bg-void-900 border border-void-purple/30 max-w-sm mx-auto font-mono">
                <div className="text-[10px] text-void-muted uppercase">CONFIRMATION TOKEN</div>
                <div className="text-lg font-bold text-void-purple mt-1 tracking-widest">
                  {receiptCode}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-void-900 hover:bg-void-850 border border-void-purple/30 text-xs font-mono text-void-200 hover:text-white transition"
              >
                DISPATCH ANOTHER CABLE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
