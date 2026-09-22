import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Coins,
  Award,
  Edit2,
  Check,
  RotateCcw,
  Bot,
  Crosshair,
  TrendingUp,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const Profile: React.FC = () => {
  const {
    codename,
    updateCodename,
    tokens,
    rank,
    rankProgress,
    completedMissions,
    minions,
    achievements,
    resetDemo,
  } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(codename || '');

  const handleSaveCodename = () => {
    if (!editVal.trim()) return;
    updateCodename(editVal);
    setIsEditing(false);
    soundEngine.playAccessGranted();
  };

  const unlockedAchievementsCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/30 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>PERSONNEL CLEARANCE DOSSIER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          OPERATIVE <span className="text-void-purple text-glow-purple">PROFILE</span>
        </h1>
        <p className="text-xs font-mono text-void-muted">
          Your personal standing, imperial credentials, and operational milestones within the Void.
        </p>
      </div>

      {/* Main Dossier Card */}
      <div className="void-panel rounded-2xl p-6 sm:p-8 border-void-purple/40 mb-8 relative hud-corner-tl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-void-purple/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-void-900 border border-void-purple flex items-center justify-center glow-border">
              <Shield className="w-8 h-8 text-void-purple" />
            </div>

            <div>
              <div className="text-[10px] font-mono text-void-muted uppercase">CODENAME</div>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    maxLength={20}
                    className="px-3 py-1 bg-void-900 border border-void-purple rounded text-sm font-mono text-white focus:outline-none"
                  />
                  <button
                    onClick={handleSaveCodename}
                    className="p-1.5 rounded bg-void-purple text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold font-mono text-white tracking-widest">
                    {codename || 'OPERATIVE'}
                  </h2>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsEditing(true);
                    }}
                    className="p-1 text-void-muted hover:text-white"
                    title="Edit Codename"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="text-xs font-mono text-void-crimson uppercase mt-0.5">
                CLEARANCE RANK: {rank}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right bg-void-900/60 p-4 rounded-xl border border-void-purple/20">
            <div className="text-[10px] font-mono text-void-muted uppercase">WALLET BALANCE</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-yellow-400 mt-1 flex items-center sm:justify-end gap-1.5">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span>{tokens.toLocaleString()}</span>
            </div>
            <div className="text-[10px] font-mono text-void-muted mt-0.5">DEATH TOKENS</div>
          </div>
        </div>

        {/* Rank Progression Ladder */}
        <div className="py-6 border-b border-void-purple/20">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-void-muted uppercase">RANK PROGRESSION TO EMPEROR</span>
            <span className="text-void-purple font-bold">{rankProgress}% COMPLETE</span>
          </div>
          <div className="w-full h-2.5 bg-void-900 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-void-purple via-void-crimson to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${rankProgress}%` }}
            />
          </div>

          {/* Ranks list */}
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono">
            {['INITIATE', 'OPERATIVE', 'COMMANDER', 'VOID ARCHITECT', 'EMPEROR'].map((r) => {
              const isCurrent = rank === r;
              return (
                <div
                  key={r}
                  className={`p-2 rounded border truncate ${
                    isCurrent
                      ? 'bg-void-purple/25 border-void-purple text-white font-bold'
                      : 'bg-void-900/40 border-void-purple/10 text-void-muted'
                  }`}
                >
                  {r}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cumulative Operational Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="bg-void-900/70 p-4 rounded-xl border border-void-purple/15 text-center">
            <Crosshair className="w-5 h-5 text-void-purple mx-auto mb-1" />
            <div className="text-2xl font-bold font-mono text-white">
              {completedMissions.length}
            </div>
            <div className="text-[10px] font-mono text-void-muted uppercase">
              CURSED MISSIONS COMPLETED
            </div>
          </div>

          <div className="bg-void-900/70 p-4 rounded-xl border border-void-purple/15 text-center">
            <Bot className="w-5 h-5 text-void-crimson mx-auto mb-1" />
            <div className="text-2xl font-bold font-mono text-white">
              {minions.reduce((acc, m) => acc + m.level, 0)}
            </div>
            <div className="text-[10px] font-mono text-void-muted uppercase">
              CUMULATIVE MINION POWER TIER
            </div>
          </div>

          <div className="bg-void-900/70 p-4 rounded-xl border border-void-purple/15 text-center">
            <Award className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold font-mono text-white">
              {unlockedAchievementsCount} / {achievements.length}
            </div>
            <div className="text-[10px] font-mono text-void-muted uppercase">
              IMPERIAL ACHIEVEMENTS CLAIMED
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Demo */}
      <div className="void-card rounded-2xl p-6 border-void-crimson/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold font-mono text-white">PURGE LOCAL MATRIX STATE</h4>
          <p className="text-xs font-mono text-void-muted">
            Permanently clear all local progress, token grants, and mission completions.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('RESET VOID DATA: Are you sure?')) {
              resetDemo();
            }
          }}
          className="px-4 py-2 rounded-lg bg-void-crimson/20 hover:bg-void-crimson/40 border border-void-crimson/50 text-void-crimson hover:text-white text-xs font-mono flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET LOCAL DATA</span>
        </button>
      </div>
    </div>
  );
};
