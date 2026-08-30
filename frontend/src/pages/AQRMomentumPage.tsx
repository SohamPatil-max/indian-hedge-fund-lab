import React, { useEffect, useState } from 'react';
import { useBacktest } from '../App';
import { MethodologyCard } from '../components/MethodologyCard';
import { WhySelectedModal } from '../components/WhySelectedModal';
import { StockResearchDrawer } from '../components/StockResearchDrawer';
import { AQRStockItem } from '../types';
import { TrendingUp, CheckCircle, XCircle, Search, HelpCircle, Layers, Shield, Award, Calendar, Percent, Scale } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const AQRMomentumPage: React.FC = () => {
  const { params, activeBacktest } = useBacktest();
  const [data, setData] = useState<{
    overview: any;
    selected_count: number;
    universe_count: number;
    portfolio: AQRStockItem[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeResearchTab, setActiveResearchTab] = useState<'OVERVIEW' | 'SIGNALS' | 'PORTFOLIO' | 'PERFORMANCE' | 'RULES'>('SIGNALS');
  const [search, setSearch] = useState('');
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);
  const [selectedStockForModal, setSelectedStockForModal] = useState<AQRStockItem | null>(null);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      lookback: params.momentum_lookback_months.toString(),
      exclusion: params.exclusion_months.toString(),
      percentile: params.top_percentile.toString(),
      max_pos: params.max_position_size_pct.toString(),
    });

    fetch(`/api/strategy/aqr?${query.toString()}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('AQR fetch error:', err);
        setLoading(false);
      });
  }, [params]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64 text-emerald-400 font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Recalculating AQR-Inspired Momentum Ranks (Lookback: {params.momentum_lookback_months}M, Excl: {params.exclusion_months}M, Top: {params.top_percentile}%)...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-300 font-mono text-sm space-y-4 bg-[#0D121A] border border-[#27303B] rounded-lg p-6">
        <span className="text-amber-400 font-bold text-base">⚠️ Backend Stream Connecting...</span>
        <p className="text-xs text-[#8994A3] text-center max-w-md">
          The Render backend API container is waking up. Click below to refresh the momentum data feed.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#00C896] hover:bg-[#00E6AB] text-[#080B10] font-bold rounded cursor-pointer transition-colors"
        >
          🔄 Refresh AQR Momentum Ranks
        </button>
      </div>
    );
  }

  const filteredPortfolio = data.portfolio.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterSelectedOnly ? item.selected : true;
    return matchesSearch && matchesFilter;
  });

  const [selectedDrawerStock, setSelectedDrawerStock] = useState<string | null>(null);

  return (
    <div className="space-y-6 font-sans">
      {/* Strategy Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2937] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#E8EDF3] flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#00C896]" />
              <span>AQR-INSPIRED MOMENTUM — INDIA</span>
            </h1>
            <span className="bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-xs font-mono font-bold px-2 py-0.5 rounded">
              AQR-INSPIRED FACTOR MODEL
            </span>
          </div>
          <p className="text-[#8994A3] text-xs font-mono mt-1">
            12-1 MONTH TOTAL RETURN · TOP 33% UNIVERSE · INVERSE-VOLATILITY RISK WEIGHTED · QUARTERLY REBALANCE
          </p>
        </div>

        {/* Research Workstation Navigation Tabs */}
        <div className="flex items-center bg-[#0D121A] border border-[#27303B] rounded p-1 font-mono text-xs">
          {(['OVERVIEW', 'SIGNALS', 'PORTFOLIO', 'PERFORMANCE', 'RULES'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveResearchTab(tab)}
              className={`px-3 py-1.5 rounded font-semibold transition-all ${
                activeResearchTab === tab
                  ? 'bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/30'
                  : 'text-[#8994A3] hover:text-[#E8EDF3]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* VISUAL STRATEGY PIPELINE BANNER */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-4 font-mono text-xs">
        <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider mb-2">QUANTITATIVE STRATEGY PIPELINE & EXECUTION WORKFLOW</span>
        <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[11px]">
          <div className="bg-[#080B10] border border-[#27303B] px-3 py-2 rounded text-[#00C896] font-bold flex-1 min-w-[120px]">
            12-1M Momentum
          </div>
          <span className="text-[#5F6B79]">➔</span>
          <div className="bg-[#080B10] border border-[#27303B] px-3 py-2 rounded text-[#00C896] font-bold flex-1 min-w-[120px]">
            Top 33% Percentile
          </div>
          <span className="text-[#5F6B79]">➔</span>
          <div className="bg-[#080B10] border border-[#27303B] px-3 py-2 rounded text-[#D9A441] font-bold flex-1 min-w-[120px]">
            Inverse Volatility
          </div>
          <span className="text-[#5F6B79]">➔</span>
          <div className="bg-[#080B10] border border-[#27303B] px-3 py-2 rounded text-[#7185FF] font-bold flex-1 min-w-[120px]">
            8% Position Cap
          </div>
          <span className="text-[#5F6B79]">➔</span>
          <div className="bg-[#080B10] border border-[#27303B] px-3 py-2 rounded text-[#00C896] font-bold flex-1 min-w-[120px]">
            5% ADTV Limit
          </div>
          <span className="text-[#5F6B79]">➔</span>
          <div className="bg-[#00C896]/10 border border-[#00C896]/30 px-3 py-2 rounded text-[#00C896] font-bold flex-1 min-w-[120px]">
            Portfolio Active
          </div>
        </div>
      </div>

      {/* AQR PUBLISHED METHODOLOGY PANEL */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-4 font-mono text-xs">
        <div className="flex items-center gap-2 mb-3 border-b border-[#27303B] pb-2">
          <Shield className="w-4 h-4 text-[#00C896]" />
          <h3 className="font-bold text-[#E8EDF3] uppercase tracking-wider text-xs">
            AQR METHODOLOGY CONFIGURATION
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#00C896]" /> MOMENTUM SIGNAL
            </span>
            <div className="text-[#E8EDF3] font-bold text-xs font-mono mt-1">12 Months (T-12 to T-1)</div>
          </div>

          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <XCircle className="w-3 h-3 text-[#D9A441]" /> RECENT MONTH EXCLUDED
            </span>
            <div className="text-[#00C896] font-bold text-xs font-mono mt-1">Yes (1 Month T-1)</div>
          </div>

          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <Award className="w-3 h-3 text-[#00C896]" /> SELECTION CUTOFF
            </span>
            <div className="text-[#E8EDF3] font-bold text-xs font-mono mt-1">Top 33% (One-Third)</div>
          </div>

          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <Scale className="w-3 h-3 text-[#7185FF]" /> WEIGHTING SCHEME
            </span>
            <div className="text-[#E8EDF3] font-bold text-xs font-mono mt-1">Market Capitalization</div>
          </div>

          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <Percent className="w-3 h-3 text-[#00C896]" /> REBALANCE SCHEDULE
            </span>
            <div className="text-[#E8EDF3] font-bold text-xs font-mono mt-1">Quarterly (Mar, Jun, Sep, Dec)</div>
          </div>

          <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase font-bold flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#5F6B79]" /> UNIVERSE SCOPE
            </span>
            <div className="text-[#E8EDF3] font-bold text-xs font-mono mt-1">100 NSE Constituents</div>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeResearchTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <MethodologyCard
            title="AQR-Inspired Systematic Momentum Methodology — India"
            subtitle={`Published Factor Adaptation (12-1M Total Return) for NSE Equity Universe`}
            formula={`Momentum Score = 12-Month Return (%) - 1-Month Return (%) [T-12 to T-1]`}
            rules={[
              `Calculate 12-month trailing total return for every eligible constituent in the 100 NSE stock universe.`,
              `Exclude most recent 1 month (T-1) to eliminate short-term reversal noise and market microstructure friction.`,
              "Rank all eligible stocks in descending order from highest to lowest 12-1m momentum score (Highest = Rank #1).",
              `Select top 33% (one-third) highest-ranking liquid Indian equities (~${data.selected_count} stocks).`,
              `Weight selected stocks according to market capitalization: Weight_i = Cap_i / Sum(Cap_selected).`,
              `Reconstitute and rebalance portfolio quarterly (March, June, September, December).`
            ]}
          />
        </div>
      )}

      {/* SIGNALS TAB — High-Density Quant Ranking Table */}
      {activeResearchTab === 'SIGNALS' && (
        <div className="space-y-4 font-mono text-xs">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D111A] border border-[#1E293B] p-3 rounded">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search symbol, company, sector..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#182232] border border-[#27303B] text-slate-200 text-xs rounded pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs select-none">
                <input
                  type="checkbox"
                  checked={filterSelectedOnly}
                  onChange={(e) => setFilterSelectedOnly(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
                <span>Selected Portfolio Stocks Only</span>
              </label>
            </div>

            <div className="text-slate-400 text-xs">
              Showing <strong className="text-white">{filteredPortfolio.length}</strong> of <strong className="text-white">{data.universe_count}</strong> NSE stocks
            </div>
          </div>

          {/* Quant Signals Table */}
          <div className="bg-[#0D111A] border border-[#1E293B] rounded overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#182232] border-b border-[#27303B] text-slate-400 text-[11px]">
                  <th className="p-3">RANK</th>
                  <th className="p-3">SYMBOL & COMPANY</th>
                  <th className="p-3">SECTOR</th>
                  <th className="p-3 text-right">12M RET (%)</th>
                  <th className="p-3 text-right">1M RET (%)</th>
                  <th className="p-3 text-right">12-1M SCORE</th>
                  <th className="p-3 text-right">WEIGHT</th>
                  <th className="p-3 text-center">STATUS</th>
                  <th className="p-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredPortfolio.map((item) => (
                  <tr
                    key={item.symbol}
                    onClick={() => setSelectedDrawerStock(item.symbol)}
                    className={`hover:bg-[#182232]/80 cursor-pointer transition-colors ${
                      item.selected ? 'bg-[#00C896]/5' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-slate-300">#{item.rank}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{item.symbol.replace('.NS', '')}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{item.name}</div>
                    </td>
                    <td className="p-3 text-slate-300 text-[11px]">{item.sector}</td>
                    <td className="p-3 text-right text-slate-200">{item.return_12m.toFixed(1)}%</td>
                    <td className="p-3 text-right text-slate-400">{item.return_1m.toFixed(1)}%</td>
                    <td className={`p-3 text-right font-bold ${item.momentum_score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.momentum_score >= 0 ? '+' : ''}{item.momentum_score.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-300">
                      {item.selected ? `${item.portfolio_weight}%` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      {item.selected ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>SELECTED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-900 text-slate-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded">
                          <XCircle className="w-3 h-3 text-slate-500" />
                          <span>EXCLUDED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedStockForModal(item)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center justify-center gap-1 mx-auto"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why?</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PORTFOLIO TAB */}
      {activeResearchTab === 'PORTFOLIO' && (
        <div className="bg-[#0D111A] border border-[#1E293B] rounded p-4 font-mono text-xs">
          <h3 className="font-bold text-white mb-3">CURRENT AQR MOMENTUM PORTFOLIO POSITIONS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#182232] border-b border-[#27303B] text-slate-400">
                  <th className="p-3">SYMBOL</th>
                  <th className="p-3">SECTOR</th>
                  <th className="p-3 text-right">WEIGHT</th>
                  <th className="p-3 text-right">12-1M SCORE</th>
                  <th className="p-3 text-right">PRICE (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {data.portfolio.filter((i) => i.selected).map((item) => (
                  <tr key={item.symbol} className="hover:bg-[#182232]/50">
                    <td className="p-3 font-bold text-white">{item.symbol.replace('.NS', '')}</td>
                    <td className="p-3 text-slate-300">{item.sector}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">{item.portfolio_weight}%</td>
                    <td className="p-3 text-right text-emerald-300">+{item.momentum_score.toFixed(2)}%</td>
                    <td className="p-3 text-right text-slate-200">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PERFORMANCE TAB */}
      {activeResearchTab === 'PERFORMANCE' && (
        <div className="bg-[#0D111A] border border-[#1E293B] rounded p-5 space-y-4">
          <h3 className="font-bold text-white text-sm font-mono uppercase">AQR Momentum Backtest Performance</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={(activeBacktest?.equity_curve || []).map((pt, idx, arr) => {
                  const initNet = arr[0]?.net_investor_value || 1.0;
                  const initBm = arr[0]?.benchmark_nifty || 1.0;
                  return {
                    ...pt,
                    net_nav: Math.round((pt.net_investor_value / initNet) * 10000) / 100,
                    nifty_nav: Math.round((pt.benchmark_nifty / initBm) * 10000) / 100,
                    net_cr: Math.round((pt.net_investor_value / 10000000.0) * 100) / 100,
                    nifty_cr: Math.round((pt.benchmark_nifty / 10000000.0) * 100) / 100,
                  };
                })}
              >
                <XAxis
                  dataKey="date"
                  stroke="#5F6B79"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(dateStr: string) => {
                    if (!dateStr || dateStr.length < 7) return dateStr;
                    const parts = dateStr.split('-');
                    if (parts.length < 2) return dateStr;
                    const yr = parts[0].substring(2);
                    const moIdx = parseInt(parts[1], 10) - 1;
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${months[moIdx] || parts[1]} '${yr}`;
                  }}
                />
                <YAxis
                  stroke="#5F6B79"
                  fontSize={10}
                  tickLine={false}
                  width={50}
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => v.toFixed(0)}
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      const dp = payload[0].payload;
                      return (
                        <div className="bg-[#0D121A] border border-[#27303B] p-3 rounded shadow-xl font-mono text-xs text-[#E8EDF3]">
                          <div className="text-[#8994A3] text-[10px] font-bold border-b border-[#27303B] pb-1 mb-2">DATE: {label}</div>
                          <div className="flex items-center justify-between gap-4 text-[#00C896] font-bold">
                            <span>AQR Strategy NAV:</span>
                            <span>{dp.net_nav?.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-[#00C896] text-[11px] mt-0.5">
                            <span>AQR Capital:</span>
                            <span>₹{(dp.net_cr || 0).toLocaleString('en-IN')} Cr</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-[#8994A3] mt-1 pt-1 border-t border-[#27303B]">
                            <span>NIFTY 50 Benchmark:</span>
                            <span>{dp.nifty_nav?.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="net_nav" name="AQR Momentum Net NAV (Base 100)" stroke="#00C896" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty_nav" name="NIFTY 50 Benchmark NAV" stroke="#5F6B79" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RULES TAB */}
      {activeResearchTab === 'RULES' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-[#0D111A] border border-[#1E293B] rounded p-4 space-y-3 text-slate-300">
            <h3 className="font-bold text-white text-sm uppercase">Formal Strategy Execution Rules</h3>
            <p>1. Universe: 100 constituent NSE liquid stock universe updated from central market data store.</p>
            <p>2. Signal: 12-month trailing total return excluding the most recent 1 month (T-1) to avoid short-term reversal noise.</p>
            <p>3. Ranking: Descending rank by 12-1m momentum score (Highest = Rank #1).</p>
            <p>4. Selection: Top 33% (one-third) of eligible universe.</p>
            <p>5. Weighting: Market-cap weighted: Weight_i = Cap_i / Sum(Cap_selected).</p>
            <p>6. Rebalancing: Quarterly schedule (March, June, September, December).</p>
          </div>
        </div>
      )}

      {/* Modal Drawer */}
      {selectedStockForModal && (
        <WhySelectedModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
        />
      )}

      {/* Stock Research Drawer */}
      {selectedDrawerStock && (
        <StockResearchDrawer
          stockSymbol={selectedDrawerStock}
          onClose={() => setSelectedDrawerStock(null)}
        />
      )}
    </div>
  );
};
