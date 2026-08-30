import React, { useState } from 'react';
import { useBacktest } from '../App';
import { ExportDataControl } from '../components/ExportDataControl';
import { TradeDetailDrawer } from '../components/TradeDetailDrawer';
import { TradeRecord } from '../types';
import { BookOpen, Search, Filter, ExternalLink } from 'lucide-react';

export const TradeJournalPage: React.FC = () => {
  const { activeBacktest, running } = useBacktest();
  const trades: TradeRecord[] = activeBacktest?.all_trades || [];

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedTrade, setSelectedTrade] = useState<TradeRecord | null>(null);

  if (running && !activeBacktest) {
    return (
      <div className="flex items-center justify-center h-64 text-[#00C896] font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Syncing Institutional Execution Blotter with Active Backtest Run...
      </div>
    );
  }

  const filteredTrades = trades.filter((t) => {
    const matchesSearch =
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.company_name.toLowerCase().includes(search.toLowerCase()) ||
      t.strategy.toLowerCase().includes(search.toLowerCase()) ||
      t.signal_reason.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'ALL' ? true : t.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-4 font-mono">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#E8EDF3] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00C896]" />
            <span>TRADE JOURNAL</span>
          </h1>
          <span className="bg-[#080B10] border border-[#27303B] text-[#8994A3] px-2.5 py-0.5 rounded text-xs font-bold">
            {trades.length} EXECUTED TRADES
          </span>
        </div>

        <div className="text-xs text-[#8994A3]">
          Click any trade row to slide out the <strong className="text-[#00C896]">Trade Detail Drawer</strong>
        </div>
      </div>

      {/* Export Data Panel with Filter Controls */}
      <ExportDataControl
        strategyLabel={activeBacktest?.strategy_name.replace(/\s+/g, '_') || 'Indian_Hedge_Fund'}
        backtestData={activeBacktest}
        trades={trades}
      />

      {/* Search & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D121A] border border-[#27303B] p-4 rounded-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#5F6B79] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search symbol, strategy, rationale..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="terminal-input rounded-md pl-9 pr-3 py-1.5 text-xs text-[#E8EDF3] placeholder-[#5F6B79] w-full font-mono focus:outline-none"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="terminal-input text-[#8994A3] text-xs rounded px-3 py-1.5 font-mono focus:outline-none"
          >
            <option value="ALL">All Actions (BUY & SELL)</option>
            <option value="BUY">BUY Orders Only</option>
            <option value="SELL">SELL Orders Only</option>
          </select>
        </div>

        <div className="font-mono text-xs text-[#8994A3]">
          Showing <span className="text-[#00C896] font-bold">{filteredTrades.length}</span> / {trades.length} Active Trades
        </div>
      </div>

      {/* Institutional Table-First Blotter */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#080B10] border-b border-[#27303B] text-[#8994A3] uppercase text-[10px] tracking-wider sticky top-0">
            <tr>
              <th className="p-3">DATE</th>
              <th className="p-3">STRATEGY</th>
              <th className="p-3">SYMBOL</th>
              <th className="p-3 text-center">SIDE</th>
              <th className="p-3 text-right">QTY</th>
              <th className="p-3 text-right">PRICE</th>
              <th className="p-3 text-right">VALUE</th>
              <th className="p-3 text-right">P&L</th>
              <th className="p-3 text-right">WEIGHT</th>
              <th className="p-3">REASON</th>
              <th className="p-3 text-center">INSPECT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27303B]/60">
            {filteredTrades.map((t) => (
              <tr
                key={t.trade_id}
                onClick={() => setSelectedTrade(t)}
                className="terminal-table-row cursor-pointer"
              >
                <td className="p-3 text-[#8994A3] whitespace-nowrap">{t.date}</td>
                <td className="p-3 text-[#00C896] font-semibold whitespace-nowrap">{t.strategy}</td>
                <td className="p-3 font-bold text-[#E8EDF3] whitespace-nowrap">{t.symbol.replace('.NS', '')}</td>
                <td className="p-3 text-center whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.action === 'BUY'
                        ? 'bg-[#111823] text-[#00C896] border border-[#00C896]/40'
                        : 'bg-[#111823] text-[#FF5C6C] border border-[#FF5C6C]/40'
                    }`}
                  >
                    {t.action}
                  </span>
                </td>
                <td className="p-3 text-right font-mono-num text-[#8994A3] font-bold whitespace-nowrap">{t.quantity}</td>
                <td className="p-3 text-right font-mono-num text-[#E8EDF3] whitespace-nowrap">₹{t.execution_price}</td>
                <td className="p-3 text-right font-mono-num text-[#E8EDF3] font-bold whitespace-nowrap">
                  ₹{t.net_trade_value.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-right font-mono-num font-bold whitespace-nowrap">
                  {t.realized_pnl > 0 ? (
                    <span className="text-[#00C896]">+₹{t.realized_pnl.toLocaleString('en-IN')}</span>
                  ) : t.realized_pnl < 0 ? (
                    <span className="text-[#FF5C6C]">-₹{Math.abs(t.realized_pnl).toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-[#5F6B79]">—</span>
                  )}
                </td>
                <td className="p-3 text-right font-mono-num text-[#00C896] font-bold whitespace-nowrap">
                  {t.portfolio_weight_pct}%
                </td>
                <td className="p-3 text-[#8994A3] text-[11px] max-w-xs truncate">{t.signal_reason}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrade(t);
                    }}
                    className="p-1 text-[#8994A3] hover:text-[#00C896] hover:bg-[#151D28] rounded transition-all"
                    title="Open Detail Drawer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-out Trade Detail Drawer */}
      <TradeDetailDrawer
        trade={selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    </div>
  );
};
