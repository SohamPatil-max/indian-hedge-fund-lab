import React from 'react';
import { DataStatusBadge } from './DataStatusBadge';
import { MarketStatus, IndexTicker } from '../types';
import {
  Cpu,
  Layers,
  Sliders,
  Briefcase,
  BookOpen,
  PieChart
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  marketStatus: MarketStatus | null;
  indexTicker: IndexTicker | null;
}

export const HeaderNavbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  marketStatus,
  indexTicker,
}) => {
  const navItems = [
    { id: 'command', label: 'COMMAND CENTER', icon: Cpu },
    { id: 'strategies', label: 'STRATEGIES', icon: Layers },
    { id: 'backtest', label: 'BACKTEST LAB', icon: Sliders },
    { id: 'portfolio', label: 'PORTFOLIO', icon: Briefcase },
    { id: 'trades', label: 'TRADE JOURNAL', icon: BookOpen },
    { id: 'market', label: 'MARKET', icon: PieChart },
  ];

  return (
    <header className="bg-[#0A0E17] border-b border-[#1E293B] text-slate-200 sticky top-0 z-50 shadow-md">
      {/* Top Institutional Financial Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between border-b border-[#161E2E] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-emerald-400">
            <span className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
              NSE QUANT
            </span>
            <span className="text-white tracking-widest text-sm">INDIA HEDGE FUND LAB</span>
          </div>

          {/* Real Historical Data Source Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/80 px-2.5 py-1 rounded text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HISTORICAL DATA: <strong>REAL</strong> | SOURCE: Yahoo Finance (yfinance)</span>
          </div>

          {/* 1. NIFTY 50 Box */}
          {indexTicker && (
            <div className="flex items-center gap-2 bg-[#0E131F] border border-[#1E293B] px-3 py-1 rounded shadow-sm">
              <span className="text-slate-400 font-semibold">NIFTY 50:</span>
              <span className="font-mono-num text-white font-bold">{indexTicker.price.toLocaleString('en-IN')}</span>
              <span
                className={`font-mono-num font-semibold ${
                  indexTicker.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {indexTicker.change >= 0 ? '+' : ''}
                {indexTicker.change.toFixed(2)} ({indexTicker.change_pct >= 0 ? '+' : ''}
                {indexTicker.change_pct.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* 2. SENSEX Box */}
          {indexTicker?.sensex && (
            <div className="flex items-center gap-2 bg-[#0E131F] border border-[#1E293B] px-3 py-1 rounded shadow-sm">
              <span className="text-slate-400 font-semibold">SENSEX:</span>
              <span className="font-mono-num text-white font-bold">{indexTicker.sensex.price.toLocaleString('en-IN')}</span>
              <span
                className={`font-mono-num font-semibold ${
                  indexTicker.sensex.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {indexTicker.sensex.change >= 0 ? '+' : ''}
                {indexTicker.sensex.change.toFixed(2)} ({indexTicker.sensex.change_pct >= 0 ? '+' : ''}
                {indexTicker.sensex.change_pct.toFixed(2)}%)
              </span>
            </div>
          )}

          {/* 3. Market Open / Close & Session Time Status Box */}
          {marketStatus && (
            <div className={`flex items-center gap-2 border px-3 py-1 rounded shadow-sm ${
              marketStatus.is_open 
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
            }`}>
              <div className="relative flex h-2 w-2">
                {marketStatus.is_open && <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400 animate-ping" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${marketStatus.is_open ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
              <span className="font-bold tracking-wider text-[11px]">
                {marketStatus.is_open ? 'MARKET OPEN' : `MARKET CLOSED (${marketStatus.status_code})`}
              </span>
              <span className="text-slate-400 text-[10px] hidden md:inline">
                | {marketStatus.timestamp}
              </span>
            </div>
          )}
        </div>

        {/* Live Data Status Indicator */}
        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <DataStatusBadge status={marketStatus} />
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <nav className="flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider rounded-md whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-950/70 border border-emerald-600/80 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:bg-[#0E131F] hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
