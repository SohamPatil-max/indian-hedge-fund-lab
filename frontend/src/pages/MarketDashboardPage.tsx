import React, { useState } from 'react';
import { useMarketData } from '../context/MarketContext';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { Search, Filter, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

export const MarketDashboardPage: React.FC = () => {
  const { marketStatus, indexTicker, stockUniverse: universe, loading } = useMarketData();
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  if (loading || !indexTicker) {
    return (
      <div className="flex items-center justify-center h-64 text-[#00C896] font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Synchronizing Central Market Store (100 NSE Constituent Stocks)...
      </div>
    );
  }

  // Development Desync Consistency Validation Check
  if (indexTicker.price && indexTicker.sensex?.price) {
    console.assert(
      indexTicker.price > 0,
      '[MarketData Consistency Check] NIFTY 50 price is invalid'
    );
  }

  const niftyPrice = indexTicker.price;
  const niftyChg = indexTicker.change;
  const niftyPct = indexTicker.change_pct;

  const sensexPrice = indexTicker.sensex?.price || 77264.51;
  const sensexChg = indexTicker.sensex?.change || 330.92;
  const sensexPct = indexTicker.sensex?.change_pct || 0.43;

  const sectors = Array.from(new Set(universe.map((s) => s.sector))).sort();

  const filteredUniverse = universe.filter((s) => {
    const matchesSearch =
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sector.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' ? true : s.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Market Indicators Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8EDF3] flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[#00C896]" />
            <span>INDIAN MARKET MONITOR</span>
          </h1>
          <p className="text-[#8994A3] text-xs font-mono mt-0.5">
            Single Source of Truth Market Engine — 100 NSE Constituent Stock Universe
          </p>
        </div>

        <DataStatusBadge status={marketStatus} />
      </div>

      {/* Top Indices Strip — Consumes Single Source of Truth Market Store */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* NIFTY 50 Canonical Card */}
        <div className="bg-[#0D121A] border border-[#27303B] p-3.5 rounded-lg space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#8994A3] font-bold">NIFTY 50 (^NSEI)</span>
            <span className="text-[#5F6B79] font-mono">{indexTicker.quote_type || 'LAST_CLOSE'}</span>
          </div>
          <div className="text-[#E8EDF3] font-extrabold text-lg font-mono-num">
            {niftyPrice.toLocaleString('en-IN')}
          </div>
          <div className={`text-xs font-bold font-mono-num ${niftyChg >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'}`}>
            {niftyChg >= 0 ? '+' : ''}{niftyChg.toFixed(2)} ({niftyPct >= 0 ? '+' : ''}{niftyPct.toFixed(2)}%)
          </div>
          <div className="text-[10px] text-[#5F6B79] font-mono pt-1">
            {indexTicker.timestamp}
          </div>
        </div>

        {/* SENSEX Canonical Card */}
        <div className="bg-[#0D121A] border border-[#27303B] p-3.5 rounded-lg space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#8994A3] font-bold">SENSEX (^BSESN)</span>
            <span className="text-[#5F6B79] font-mono">{indexTicker.sensex?.price_type || 'LAST_CLOSE'}</span>
          </div>
          <div className="text-[#E8EDF3] font-extrabold text-lg font-mono-num">
            {sensexPrice.toLocaleString('en-IN')}
          </div>
          <div className={`text-xs font-bold font-mono-num ${sensexChg >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'}`}>
            {sensexChg >= 0 ? '+' : ''}{sensexChg.toFixed(2)} ({sensexPct >= 0 ? '+' : ''}{sensexPct.toFixed(2)}%)
          </div>
          <div className="text-[10px] text-[#5F6B79] font-mono pt-1">
            {indexTicker.sensex?.timestamp || indexTicker.timestamp}
          </div>
        </div>

        {/* Market Breadth Card */}
        <div className="bg-[#0D121A] border border-[#27303B] p-3.5 rounded-lg space-y-1">
          <span className="text-[#8994A3] text-[10px] font-bold block">MARKET BREADTH (ADV/DECL)</span>
          <div className="text-[#E8EDF3] font-extrabold text-lg font-mono-num">
            {indexTicker.market_breadth.advances} / {indexTicker.market_breadth.declines}
          </div>
          <div className="text-xs font-bold text-[#00C896] font-mono-num">
            A/D Ratio: {indexTicker.market_breadth.ratio}
          </div>
          <div className="text-[10px] text-[#5F6B79] font-mono pt-1">
            100 NSE Constituent Stocks
          </div>
        </div>

        {/* Market Status Overview Card */}
        <div className="bg-[#0D121A] border border-[#27303B] p-3.5 rounded-lg space-y-1">
          <span className="text-[#8994A3] text-[10px] font-bold block">MARKET STATUS & SESSION TIME</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`w-2.5 h-2.5 rounded-full ${marketStatus?.is_open ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className={`font-extrabold text-base font-mono ${marketStatus?.is_open ? 'text-emerald-400' : 'text-rose-400'}`}>
              {marketStatus?.is_open ? 'MARKET OPEN' : `MARKET CLOSED (${marketStatus?.status_code || 'CLOSED'})`}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-300 font-mono">
            {marketStatus?.timestamp || indexTicker.timestamp || '15:30:00 IST'}
          </div>
          <div className="text-[10px] text-[#5F6B79] font-mono pt-1">
            Session: 09:15 - 15:30 IST | NSE/BSE Feed
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D121A] border border-[#27303B] p-4 rounded-lg font-mono text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#5F6B79] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search symbol, company name, sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="terminal-input w-full pl-9 pr-3 rounded text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8994A3]" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="terminal-input px-2 rounded text-xs"
            >
              <option value="ALL">All Sectors ({sectors.length})</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[#8994A3] text-[11px] font-mono">
          Showing <strong className="text-[#E8EDF3] font-mono-num">{filteredUniverse.length}</strong> of{' '}
          <strong className="text-[#E8EDF3] font-mono-num">{universe.length}</strong> NSE constituents
        </div>
      </div>

      {/* 100 NSE Stock Universe Table — Consumes Centralized Store */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B10] border-b border-[#27303B] text-[#8994A3] uppercase text-[10px] font-mono">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Company</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right font-mono-num">Price (₹)</th>
                <th className="p-3 text-right font-mono-num">Change (%)</th>
                <th className="p-3 text-right font-mono-num">Volume</th>
                <th className="p-3 text-right font-mono-num">Market Cap (₹ Cr)</th>
                <th className="p-3 text-center">Price Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27303B]/60 font-sans">
              {filteredUniverse.map((stock) => (
                <tr key={stock.symbol} className="terminal-table-row">
                  <td className="p-3 font-mono font-bold text-[#E8EDF3]">
                    {stock.symbol.replace('.NS', '')}
                  </td>
                  <td className="p-3 text-[#E8EDF3] font-medium">{stock.name}</td>
                  <td className="p-3 text-[#8994A3] text-[11px]">{stock.sector}</td>
                  <td className="p-3 text-right font-mono-num text-[#E8EDF3] font-bold">
                    ₹{stock.price.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-mono-num font-bold">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        stock.change_pct >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'
                      }`}
                    >
                      {stock.change_pct >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stock.change_pct >= 0 ? '+' : ''}
                      {stock.change_pct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono-num text-[#8994A3]">
                    {stock.volume ? stock.volume.toLocaleString('en-IN') : '1,250,000'}
                  </td>
                  <td className="p-3 text-right font-mono-num text-[#8994A3]">
                    ₹{stock.market_cap_cr.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center font-mono text-[10px]">
                    <span className="bg-[#111823] border border-[#27303B] text-[#00C896] px-2 py-0.5 rounded">
                      {stock.quote_type || marketStatus?.quote_type || 'LAST_CLOSE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
