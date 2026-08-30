import React from 'react';
import { MarketStatus, IndexTicker } from '../types';
import {
  LayoutDashboard,
  Layers,
  Sliders,
  Briefcase,
  BookOpen,
  PieChart,
  ShieldCheck,
  Search,
  MonitorPlay
} from 'lucide-react';
import { CommandPaletteModal } from './CommandPaletteModal';
import { PresentationModeOverlay } from './PresentationModeOverlay';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  marketStatus: MarketStatus | null;
  indexTicker: IndexTicker | null;
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  marketStatus,
  indexTicker,
  children,
}) => {
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = React.useState(false);

  const navItems = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'strategies', label: 'Strategies', icon: Layers },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'trades', label: 'Trade Journal', icon: BookOpen },
    { id: 'backtest', label: 'Backtest Lab', icon: Sliders },
    { id: 'market', label: 'Market', icon: PieChart },
  ];

  const statusCode = marketStatus?.status_code || 'CLOSED';
  const isLive = statusCode === 'LIVE';
  const isDelayed = statusCode === 'DELAYED';

  const statusLabel = isLive
    ? 'MARKET: LIVE'
    : isDelayed
    ? 'MARKET: DELAYED'
    : `MARKET: CLOSED — LAST CLOSE`;

  const dotClass = isLive
    ? 'bg-[#00C896] animate-pulse'
    : isDelayed
    ? 'bg-[#F0B44D]'
    : 'bg-[#5F6B79]';

  return (
    <div className="min-h-screen bg-[#080B10] text-[#E8EDF3] flex flex-col font-sans selection:bg-[#00C896]/20 selection:text-[#00C896]">
      {/* PERSISTENT TOP NAVIGATION SHELL */}
      <header className="bg-[#0D121A] border-b border-[#1F2937] sticky top-0 z-50 shadow-md">
        {/* ROW 1: COMPACT MARKET & AUM HEADER STRIP */}
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between border-b border-[#1A222D] text-xs font-sans">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00C896] shadow-sm" />
              <span className="text-[#E8EDF3] font-extrabold tracking-wider text-sm font-sans">INDIA HEDGE FUND LAB</span>
              <span className="bg-[#0B1017] border border-[#1F2937] text-[#8994A3] px-2 py-0.5 rounded text-[10px] hidden sm:inline font-mono">
                NSE QUANT v2.5
              </span>
            </div>

            {/* Centralized Dynamic NIFTY 50 & SENSEX Market Stream */}
            {indexTicker && (
              <div className="flex items-center gap-4 border-l border-[#1F2937] pl-4">
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-[#8994A3] font-semibold">NIFTY 50:</span>
                  <span className="font-mono-num text-[#E8EDF3] font-bold">{indexTicker.price.toLocaleString('en-IN')}</span>
                  <span className={`font-mono-num font-semibold ${indexTicker.change >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'}`}>
                    {indexTicker.change >= 0 ? '+' : ''}{indexTicker.change_pct.toFixed(2)}%
                  </span>
                </div>
                {indexTicker.sensex && (
                  <div className="hidden lg:flex items-center gap-1.5 border-l border-[#1F2937] pl-4 font-sans">
                    <span className="text-[#8994A3] font-semibold">SENSEX:</span>
                    <span className="font-mono-num text-[#E8EDF3] font-bold">{indexTicker.sensex.price.toLocaleString('en-IN')}</span>
                    <span className={`font-mono-num font-semibold ${indexTicker.sensex.change >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'}`}>
                      {indexTicker.sensex.change >= 0 ? '+' : ''}{indexTicker.sensex.change_pct.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Time-Aware Market Status & Total Fund AUM Badge */}
          <div className="flex items-center gap-4 mt-1 sm:mt-0 font-sans">
            <div className="flex items-center gap-2" title={marketStatus?.description}>
              <span className={`w-2 h-2 rounded-full ${dotClass}`} />
              <span className="text-[#8994A3] font-bold text-xs">{statusLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#111823] hover:bg-[#151D28] border border-[#27303B] rounded text-xs font-mono text-[#8994A3] hover:text-[#00C896] transition-colors"
                title="Open Command Palette (Cmd + K or /)"
              >
                <Search className="w-3.5 h-3.5 text-[#00C896]" />
                <span className="hidden sm:inline font-bold">Search (Cmd+K)</span>
              </button>

              <button
                onClick={() => setIsPresentationOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#00C896]/10 hover:bg-[#00C896]/20 border border-[#00C896]/30 rounded text-xs font-mono font-bold text-[#00C896] transition-colors"
                title="Toggle Senior Executive Board Presentation Mode (P)"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Presentation Mode</span>
              </button>

              <div className="bg-[#111823] border border-[#27303B] px-3 py-1 rounded text-[#00C896] font-bold hidden lg:block text-xs font-sans">
                TOTAL AUM: <strong className="font-mono-num text-[#00C896]">₹1,00,000 Cr</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: HORIZONTAL NAVIGATION TAB BAR */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <nav className="flex items-center space-x-1 py-1 text-xs font-sans">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'strategies' && ['aqr', 'all-weather', 'activist', 'compare'].includes(activeTab));

              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <span className="text-[#1F2937] px-1 select-none">|</span>}
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-semibold tracking-wide whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'nav-item-active'
                        : 'text-[#8994A3] hover:bg-[#151D28] hover:text-[#E8EDF3]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00C896]' : 'text-[#5F6B79]'}`} />
                    <span>{item.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN PAGE CONTENT — NORMAL VERTICAL SCROLL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-y-auto">
        {children}
      </main>

      {/* TERMINAL FOOTER */}
      <footer className="border-t border-[#1F2937] bg-[#0D121A] py-3 text-center text-xs text-[#5F6B79] font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[#00C896] font-bold">INDIA HEDGE FUND LAB</span> © 2026 — Total Fund AUM: <strong className="text-[#E8EDF3] font-mono-num">₹1,00,000 Cr</strong>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#5F6B79]">
            <span>Dynamic NIFTY 50 & SENSEX Stream Active</span>
          </div>
        </div>
      </footer>

      {/* MODALS & OVERLAYS */}
      <CommandPaletteModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        setActiveTab={setActiveTab}
      />

      <PresentationModeOverlay
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
};
