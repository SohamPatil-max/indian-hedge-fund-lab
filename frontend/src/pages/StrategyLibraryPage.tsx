import React, { useState, useEffect } from 'react';
import { AQRMomentumPage } from './AQRMomentumPage';
import { AllWeatherPage } from './AllWeatherPage';
import { ActivistPage } from './ActivistPage';
import { ComparePage } from './ComparePage';

import { TrendingUp, Shield, Activity, BarChart3, Layers, ArrowRight } from 'lucide-react';

interface Props {
  setActiveTab?: (tab: string) => void;
  initialSubTab?: 'overview' | 'aqr' | 'all-weather' | 'activist' | 'compare';
}

export const StrategyLibraryPage: React.FC<Props> = ({ setActiveTab, initialSubTab = 'overview' }) => {
  const [subTab, setSubTab] = useState<'overview' | 'aqr' | 'all-weather' | 'activist' | 'compare'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="space-y-6 font-sans">
      {/* Strategy Hub Workstation Sub-Navigation Bar */}
      <div className="bg-[#0D111A] border border-[#1E293B] rounded-lg p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setSubTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              subTab === 'overview'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-[#131929]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Research Library</span>
          </button>

          <button
            onClick={() => setSubTab('aqr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              subTab === 'aqr'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-[#131929]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>AQR Momentum</span>
          </button>

          <button
            onClick={() => setSubTab('all-weather')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              subTab === 'all-weather'
                ? 'bg-amber-950 border border-amber-700 text-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-[#131929]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>All Weather</span>
          </button>

          <button
            onClick={() => setSubTab('activist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              subTab === 'activist'
                ? 'bg-indigo-950 border border-indigo-700 text-indigo-300'
                : 'text-slate-400 hover:text-white hover:bg-[#131929]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Elliott Activist</span>
          </button>

          <button
            onClick={() => setSubTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              subTab === 'compare'
                ? 'bg-cyan-950 border border-cyan-700 text-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-[#131929]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare Strategies</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="border-b border-[#1E293B] pb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>Quantitative Research Library</span>
            </h1>
            <p className="text-slate-400 text-sm font-mono mt-1">
              Explore systematic quantitative momentum, macro risk-parity allocation, and fundamental event-driven strategies tailored for Indian stock markets.
            </p>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {/* Strategy 1: AQR Momentum */}
            <div className="bg-[#0D111A] border border-[#1E293B] rounded-lg p-6 hover:border-emerald-700/50 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      QUANTITATIVE STRATEGY
                    </span>
                    <h2 className="text-xl font-bold text-white">AQR Momentum — India</h2>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Publicly documented 12-1M momentum formula. Ranks 100 Indian equities, selects top 33%, market-cap weighted.
                  </p>
                </div>
                <button
                  onClick={() => setSubTab('aqr')}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded transition-all"
                >
                  <span>Open AQR Research Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Signal Formula</span>
                  <span className="text-emerald-400 font-bold">12-1M Momentum Return</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Universe Cutoff</span>
                  <span className="text-white font-bold">Top 33% (Rank #1-#33)</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Rebalance Cycle</span>
                  <span className="text-white font-bold">Quarterly Market-Cap Weight</span>
                </div>
              </div>

              <div className="bg-[#070A10] p-3 rounded border border-[#1E293B] text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-slate-400 font-mono block mb-1">Core Strategy Philosophy:</strong>
                Momentum investing relies on the empirical persistence of past 12-month return winners continuing to outperform. As per AQR's research, excluding the most recent month (1M) is critical to eliminate short-term market microstructure noise and mean-reversion pullbacks.
              </div>
            </div>

            {/* Strategy 2: Bridgewater All Weather */}
            <div className="bg-[#0D111A] border border-[#1E293B] rounded-lg p-6 hover:border-amber-700/50 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-950 border border-amber-800 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      MACRO / RISK BALANCED
                    </span>
                    <h2 className="text-xl font-bold text-white">Bridgewater-Inspired All Weather — India</h2>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Indian-market implementation inspired by the publicly described All Weather philosophy. NOT Bridgewater's proprietary system.
                  </p>
                </div>
                <button
                  onClick={() => setSubTab('all-weather')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded transition-all"
                >
                  <span>Open All Weather Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Macro Regimes</span>
                  <span className="text-amber-400 font-bold">4 Quadrants (Growth x Inflation)</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Asset Proxies</span>
                  <span className="text-white font-bold">NIFTY 50, G-Secs, Gold, Cash</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Risk Goal</span>
                  <span className="text-white font-bold">Balanced Volatility Contribution</span>
                </div>
              </div>

              <div className="bg-[#070A10] p-3 rounded border border-[#1E293B] text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-slate-400 font-mono block mb-1">Core Strategy Philosophy:</strong>
                Traditional 60/40 portfolios are dominated by equity risk. Risk parity balances risk contributions across growth and inflation environments so the portfolio prospers regardless of macro surprises.
              </div>
            </div>

            {/* Strategy 3: Elliott Activist */}
            <div className="bg-[#0D111A] border border-[#1E293B] rounded-lg p-6 hover:border-indigo-700/50 transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1E293B] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      FUNDAMENTAL / EVENT DRIVEN
                    </span>
                    <h2 className="text-xl font-bold text-white">Elliott-Inspired Activist / Event-Driven — India</h2>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Inspired by Elliott Investment Management's approach. Focuses on individual Indian companies with clear value catalysts.
                  </p>
                </div>
                <button
                  onClick={() => setSubTab('activist')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded transition-all"
                >
                  <span>Open Activist Workstation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Screening Pillars</span>
                  <span className="text-indigo-400 font-bold">Valuation + Quality + Catalyst</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Catalyst Events</span>
                  <span className="text-white font-bold">Demergers, Buybacks, Restructuring</span>
                </div>
                <div className="bg-[#070A10] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-500 block">Target Risk/Reward</span>
                  <span className="text-white font-bold">&gt; 2.0x Upside / Downside Ratio</span>
                </div>
              </div>

              <div className="bg-[#070A10] p-3 rounded border border-[#1E293B] text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-slate-400 font-mono block mb-1">Core Strategy Philosophy:</strong>
                Undervalued stocks need explicit corporate catalysts (such as demergers or asset sales) to unlock value; otherwise, they remain value traps.
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'aqr' && <AQRMomentumPage />}
      {subTab === 'all-weather' && <AllWeatherPage />}
      {subTab === 'activist' && <ActivistPage />}
      {subTab === 'compare' && <ComparePage />}
    </div>
  );
};
