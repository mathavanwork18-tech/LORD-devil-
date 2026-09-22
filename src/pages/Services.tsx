import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Skull,
  Search,
  Bookmark,
  Scale,
  Coins,
  ShieldAlert,
  CheckCircle,
  X,
  Share2,
  Sliders,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { EvilService } from '../types';
import { useGame } from '../context/GameContext';
import { soundEngine } from '../utils/soundEngine';

export const Services: React.FC = () => {
  const {
    services,
    favorites,
    comparedServices,
    toggleFavorite,
    toggleCompare,
    spendTokens,
    showToast,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price' | 'threat' | 'success'>('threat');
  const [activeDetailService, setActiveDetailService] = useState<EvilService | null>(null);

  const categories = ['ALL', 'GLOBAL', 'TECH', 'SPACE', 'MYSTERY', 'CUSTOM'];

  const filteredServices = useMemo(() => {
    return services
      .filter((srv) => {
        const matchCat = selectedCategory === 'ALL' || srv.category === selectedCategory;
        const matchSearch =
          srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          srv.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.priceTokens - a.priceTokens;
        if (sortBy === 'threat') return b.threatLevel - a.threatLevel;
        return b.successRate - a.successRate;
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  const handlePurchaseService = (srv: EvilService) => {
    if (spendTokens(srv.priceTokens, `PURCHASE ${srv.title}`)) {
      soundEngine.playReward();
      showToast(`PROTOCOL CONTRACT CONFIRMED: ${srv.title}`, 'success');
      setActiveDetailService(null);
    }
  };

  const handleShare = (srv: EvilService) => {
    soundEngine.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`DR. VOID EVIL BLUEPRINT: ${srv.title} — Threat Level ${srv.threatLevel}%`);
      showToast('Blueprint link copied to neural clipboard', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-void-purple/20 border border-void-purple/40 text-xs font-mono text-void-purple mb-3 uppercase tracking-widest">
          <Skull className="w-3.5 h-3.5" />
          <span>SUPERVILLAIN CORPORATE SERVICES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-wider text-white uppercase mb-2">
          CHOOSE YOUR <span className="text-void-purple text-glow-purple">CHAOS</span>
        </h1>
        <p className="text-xs sm:text-sm text-void-muted font-mono leading-relaxed">
          From planetary orbital laser sweeps to custom doomsday monologues. Guaranteed 99%+ fictional satisfaction.
        </p>
      </div>

      {/* Control Bar */}
      <div className="void-panel rounded-2xl p-4 sm:p-5 mb-8 border-void-purple/30 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-void-purple absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blueprints by name, tags, or capability..."
            className="w-full pl-10 pr-4 py-2.5 bg-void-900/90 border border-void-purple/20 rounded-xl text-xs font-mono text-white placeholder:text-void-muted focus:outline-none focus:border-void-purple"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-void-purple/15">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-void-muted text-[10px] uppercase">SECTOR:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  selectedCategory === cat
                    ? 'bg-void-purple text-white border-void-purple font-bold'
                    : 'bg-void-900 text-void-200 border-void-purple/15 hover:border-void-purple/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-void-muted text-[10px] uppercase">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                soundEngine.playClick();
                setSortBy(e.target.value as 'price' | 'threat' | 'success');
              }}
              className="bg-void-900 border border-void-purple/30 text-xs font-mono text-white px-2.5 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="threat">Threat Level (High to Low)</option>
              <option value="price">Token Price (High to Low)</option>
              <option value="success">Success Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const isFav = favorites.includes(srv.id);
          const isComp = comparedServices.includes(srv.id);

          return (
            <div
              key={srv.id}
              className="void-card rounded-2xl p-6 flex flex-col justify-between relative group"
            >
              {/* Top Meta & Bookmark */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-void-crimson uppercase tracking-widest bg-void-crimson/10 px-2 py-0.5 rounded border border-void-crimson/20">
                    {srv.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(srv.id)}
                      title={isFav ? 'Remove from Saved' : 'Save Blueprint'}
                      className={`p-1.5 rounded-lg transition ${
                        isFav
                          ? 'text-yellow-400 bg-yellow-400/15'
                          : 'text-void-muted hover:text-white bg-void-900'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => toggleCompare(srv.id)}
                      title={isComp ? 'Remove from Comparison' : 'Compare Service'}
                      className={`p-1.5 rounded-lg transition ${
                        isComp
                          ? 'text-void-purple bg-void-purple/20'
                          : 'text-void-muted hover:text-white bg-void-900'
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-mono text-white group-hover:text-void-purple transition mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-void-muted leading-relaxed mb-4 line-clamp-3">
                  {srv.description}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 mb-6 text-xs font-mono text-void-200">
                  {srv.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-void-purple rounded-full shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Specs & Action */}
              <div className="pt-4 border-t border-void-purple/15">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4 bg-void-900/60 p-2 rounded-lg border border-void-purple/10">
                  <div>
                    <div className="text-[10px] text-void-muted">PRICE</div>
                    <div className="font-bold text-yellow-400">{srv.priceTokens}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-void-muted">THREAT</div>
                    <div className="font-bold text-void-crimson">{srv.threatLevel}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-void-muted">SUCCESS</div>
                    <div className="font-bold text-green-400">{srv.successRate}%</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveDetailService(srv);
                  }}
                  className="w-full py-2.5 rounded-lg bg-void-purple/20 hover:bg-void-purple/40 border border-void-purple/40 text-xs font-mono tracking-wider text-white flex items-center justify-center gap-2 transition"
                >
                  <span>INSPECT FULL BLUEPRINT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SERVICE DETAIL MODAL (SECTION 13) */}
      <AnimatePresence>
        {activeDetailService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl void-panel rounded-2xl p-6 sm:p-8 border-void-purple/50 shadow-2xl relative my-8 hud-corner-tl"
            >
              <button
                onClick={() => setActiveDetailService(null)}
                className="absolute top-4 right-4 p-1 text-void-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono tracking-widest text-void-crimson uppercase bg-void-crimson/10 px-2.5 py-0.5 rounded border border-void-crimson/30">
                  {activeDetailService.category} SPECIFICATION
                </span>
                <span className="text-[10px] font-mono text-void-muted">
                  ID: {activeDetailService.id.toUpperCase()}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-2">
                {activeDetailService.title}
              </h2>

              <p className="text-xs sm:text-sm text-void-200 leading-relaxed font-mono mb-4">
                {activeDetailService.description}
              </p>

              {/* Quote from villain lore */}
              <blockquote className="p-3 bg-void-900 rounded-lg border-l-2 border-void-purple text-xs font-mono italic text-void-muted mb-6">
                {activeDetailService.quote}
              </blockquote>

              {/* Threat Meter Visualization */}
              <div className="mb-6 p-4 rounded-xl bg-void-900/80 border border-void-purple/20">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-void-muted flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-void-crimson" />
                    <span>THREAT LEVEL INDEX</span>
                  </span>
                  <span className="font-bold text-void-crimson">{activeDetailService.threatLevel}%</span>
                </div>
                <div className="h-2 w-full bg-void-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-void-purple to-void-crimson rounded-full"
                    style={{ width: `${activeDetailService.threatLevel}%` }}
                  />
                </div>
              </div>

              {/* All 6 Features */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-3">
                  INCLUDED SERVICE CAPABILITIES
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-void-200">
                  {activeDetailService.features.map((f, i) => (
                    <div key={i} className="p-2.5 rounded bg-void-900/50 border border-void-purple/10 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-void-purple shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-void-purple/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeDetailService)}
                    className="p-2.5 rounded-lg bg-void-900 border border-void-purple/20 text-void-200 hover:text-white transition"
                    title="Share Blueprint"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(activeDetailService.id)}
                    className="p-2.5 rounded-lg bg-void-900 border border-void-purple/20 text-void-200 hover:text-yellow-400 transition"
                    title="Toggle Favorite"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveDetailService(null)}
                    className="px-4 py-2.5 rounded-lg bg-void-900 border border-void-purple/20 text-xs font-mono text-void-muted hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handlePurchaseService(activeDetailService)}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-void-purple to-void-crimson hover:brightness-110 font-mono font-bold tracking-wider text-xs text-white shadow-glow-purple transition active:scale-95 flex items-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-yellow-300" />
                    <span>CONTRACT FOR {activeDetailService.priceTokens} TOKENS</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
