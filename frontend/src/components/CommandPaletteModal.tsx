import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Briefcase, BookOpen, ShieldCheck, Sliders, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useBacktest } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onSelectStock?: (symbol: string) => void;
}

export const CommandPaletteModal: React.FC<Props> = ({ isOpen, onClose, setActiveTab, onSelectStock }) => {
  const { activeBacktest } = useBacktest();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === '/' && !isOpen && (document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positions = activeBacktest?.positions || [];

  const matchedNav = [
    { id: 'command', label: 'Command Center (Home)', category: 'Navigation', icon: LayoutDashboard },
    { id: 'strategies', label: 'Strategy Library & Research', category: 'Navigation', icon: Layers },
    { id: 'aqr', label: '⚡ AQR Momentum Strategy', category: 'Strategies', icon: Layers },
    { id: 'all-weather', label: '🛡️ Bridgewater All Weather', category: 'Strategies', icon: Layers },
    { id: 'activist', label: '🟢 Elliott Activist Strategy', category: 'Strategies', icon: Layers },
    { id: 'portfolio', label: 'Portfolio Monitoring Terminal', category: 'Navigation', icon: Briefcase },
    { id: 'trades', label: 'Trade Journal & Blotter', category: 'Navigation', icon: BookOpen },
    { id: 'backtest', label: 'Backtest Lab & Parameters', category: 'Navigation', icon: Sliders },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  const matchedStocks = positions
    .filter((p: any) => p.symbol.toLowerCase().includes(query.toLowerCase()) || p.company_name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-[#0D121A] border border-[#27303B] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#27303B] bg-[#080B10]">
          <Search className="w-5 h-5 text-[#00C896] mr-3" />
          <input
            type="text"
            placeholder="Search pages, stocks (e.g. DIXON, RELIANCE), or strategies... (Press Esc to exit)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#E8EDF3] text-sm focus:outline-none placeholder-[#5F6B79] font-mono"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-[#5F6B79] hover:text-[#E8EDF3] rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {/* Navigation Items */}
          {matchedNav.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5F6B79]">Terminal Navigation</div>
              {matchedNav.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-[#E8EDF3] hover:bg-[#151D28] hover:text-[#00C896] transition-colors group font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#8994A3] group-hover:text-[#00C896]" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00C896]" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Matched Stocks */}
          {matchedStocks.length > 0 && (
            <div className="mt-2 border-t border-[#1F2937] pt-2">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5F6B79]">Portfolio Stocks</div>
              {matchedStocks.map((s: any) => (
                <button
                  key={s.symbol}
                  onClick={() => {
                    setActiveTab('aqr');
                    if (onSelectStock) onSelectStock(s.symbol);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-[#E8EDF3] hover:bg-[#151D28] hover:text-[#00C896] transition-colors group font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[#00C896] font-mono">{s.symbol}</span>
                    <span className="text-[#8994A3] text-[11px] truncate max-w-xs">{s.company_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#E8EDF3]">₹{s.price}</span>
                    <span className="text-[10px] text-[#5F6B79] font-mono">Weight: {s.weight_pct}%</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {matchedNav.length === 0 && matchedStocks.length === 0 && (
            <div className="p-8 text-center text-xs text-[#5F6B79] font-mono">
              No matching pages or stocks found for "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#080B10] border-t border-[#27303B] flex items-center justify-between text-[11px] text-[#5F6B79] font-mono">
          <span>Shortcuts: <kbd className="bg-[#151D28] px-1.5 py-0.5 rounded text-[#E8EDF3]">Cmd + K</kbd> or <kbd className="bg-[#151D28] px-1.5 py-0.5 rounded text-[#E8EDF3]">/</kbd></span>
          <span>Press <kbd className="bg-[#151D28] px-1.5 py-0.5 rounded text-[#E8EDF3]">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
