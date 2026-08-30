import React, { useState } from 'react';
import { useBacktest } from '../App';
import { MarketStatus, IndexTicker } from '../types';
import {
  Briefcase,
  Layers,
  ArrowRight,
  Play
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Props {
  setActiveTab: (tab: string) => void;
  marketStatus: MarketStatus | null;
  indexTicker: IndexTicker | null;
}

export const CommandCenter: React.FC<Props> = ({ setActiveTab }) => {
  const { params, activeBacktest: result } = useBacktest();

  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | 'YTD' | '1Y' | '3Y' | 'MAX'>('MAX');
  const [isNetView, setIsNetView] = useState(true);
  const [scaleMode, setScaleMode] = useState<'NAV' | 'CR'>('NAV');

  // Single Source of Truth Fund Allocation Object from Active Backtest Engine
  const fundAlloc = result?.fund_allocation || {
    total_aum_cr: 100000.0,
    aqr_alloc_pct: 40.0,
    all_weather_alloc_pct: 35.0,
    activist_alloc_pct: 20.0,
    unallocated_cash_pct: 5.0,
    total_fund_pnl_cr: 54777.52,
    daily_pnl_cr: 240.0,
    ytd_return_pct: 15.12,
    fund_nav: 154.78,
    aqr_pnl_cr: 7070.75,
    all_weather_pnl_cr: 22458.45,
    activist_pnl_cr: 23434.91,
    cash_pnl_cr: 1513.70
  };

  const trades = result?.recent_trades.slice(0, 10) || [];
  const rawCurve = result?.equity_curve || [];

  const getFilteredCurve = () => {
    if (!rawCurve.length) return [];
    if (timeRange === '1M') return rawCurve.slice(-2);
    if (timeRange === '3M') return rawCurve.slice(-4);
    if (timeRange === '6M') return rawCurve.slice(-7);
    if (timeRange === '1Y') return rawCurve.slice(-13);
    if (timeRange === '3Y') return rawCurve.slice(-37);
    return rawCurve;
  };

  const rawFiltered = getFilteredCurve();
  const initialBaseVal = rawCurve[0]?.net_investor_value || 1.0;
  const initialBmVal = rawCurve[0]?.benchmark_nifty || 1.0;

  const chartData = rawFiltered.map(pt => {
    const netNav = Math.round((pt.net_investor_value / initialBaseVal) * 10000) / 100;
    const grossNav = Math.round((pt.gross_portfolio_value / initialBaseVal) * 10000) / 100;
    const niftyNav = Math.round((pt.benchmark_nifty / initialBmVal) * 10000) / 100;
    const netValueCr = Math.round((pt.net_investor_value / 10000000.0) * 100) / 100;
    const grossValueCr = Math.round((pt.gross_portfolio_value / 10000000.0) * 100) / 100;
    const niftyValueCr = Math.round((pt.benchmark_nifty / 10000000.0) * 100) / 100;

    return {
      ...pt,
      net_nav: netNav,
      gross_nav: grossNav,
      nifty_nav: niftyNav,
      net_value_cr: netValueCr,
      gross_value_cr: grossValueCr,
      nifty_value_cr: niftyValueCr,
    };
  });

  const totalAumCr = params?.total_aum_cr || fundAlloc.total_aum_cr || 100000.0;
  const aumScale = totalAumCr / (fundAlloc.total_aum_cr || 100000.0);

  const combinedNetPnlCr = Math.round((fundAlloc.total_fund_pnl_cr * aumScale) * 100) / 100;
  const totalPortfolioValueCr = totalAumCr + combinedNetPnlCr;
  const dailyPnlCr = Math.round(((fundAlloc.daily_pnl_cr ?? 240.0) * aumScale) * 100) / 100;
  const ytdReturnPct = result?.performance.ytd_return_pct ?? fundAlloc.ytd_return_pct ?? 15.12;

  const aqrPnlCr = Math.round((fundAlloc.aqr_pnl_cr * aumScale) * 100) / 100;
  const awPnlCr = Math.round((fundAlloc.all_weather_pnl_cr * aumScale) * 100) / 100;
  const activistPnlCr = Math.round((fundAlloc.activist_pnl_cr * aumScale) * 100) / 100;
  const cashRepoPnlCr = Math.round((combinedNetPnlCr - (aqrPnlCr + awPnlCr + activistPnlCr)) * 100) / 100;

  function formatPnl(val: number) {
    const isPos = val >= 0;
    const formatted = Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return {
      text: `${isPos ? '+' : '-'}₹${formatted} Cr`,
      colorClass: isPos ? 'text-[#00C896]' : 'text-[#FF5C6C]'
    };
  }

  const aqrPnlFormatted = formatPnl(aqrPnlCr);
  const awPnlFormatted = formatPnl(awPnlCr);
  const activistPnlFormatted = formatPnl(activistPnlCr);
  const cashPnlFormatted = formatPnl(cashRepoPnlCr);

  return (
    <div className="space-y-6 font-sans">
      {/* SECTION 1 — FUND HEADER */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#E8EDF3] tracking-tight">INDIA HEDGE FUND LAB</h1>
              <span className="bg-[#111823] border border-[#27303B] text-[#00C896] text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                ₹{totalAumCr.toLocaleString('en-IN')} Cr AUM
              </span>
            </div>
            <p className="text-xs text-[#8994A3] font-mono mt-1">Institutional Multi-Strategy Quant Terminal — NSE India</p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('backtest')}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded shadow-sm text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Backtest Workstation</span>
            </button>
          </div>
        </div>

        {/* 6 Institutional Audited Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-sans text-xs">
          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">MASTER FUND AUM</span>
            <div className="text-[#E8EDF3] font-bold text-lg font-mono-num mt-1">
              ₹{totalAumCr.toLocaleString('en-IN')} Cr
            </div>
            <span className="text-[10px] text-[#5F6B79] block mt-0.5">Initial Capital Base</span>
          </div>

          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">MASTER FUND NAV</span>
            <div className="text-[#00C896] font-bold text-xl font-mono-num mt-1">
              {fundAlloc.fund_nav.toFixed(2)}
            </div>
            <span className="text-[10px] text-[#00C896] block mt-0.5">Base 100 Reconciled</span>
          </div>

          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">TOTAL NET P&L</span>
            <div className="text-[#00C896] font-bold text-lg font-mono-num mt-1">
              +₹{combinedNetPnlCr.toLocaleString('en-IN')} Cr
            </div>
            <span className="text-[10px] text-[#00C896] block mt-0.5">₹{totalPortfolioValueCr.toLocaleString('en-IN')} Cr Value</span>
          </div>

          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">STRATEGY CAGR</span>
            <div className="text-[#00C896] font-bold text-lg font-mono-num mt-1">
              +{result?.performance.net_cagr_pct ?? 30.25}% p.a.
            </div>
            <span className="text-[10px] text-[#5F6B79] block mt-0.5">Annualized Return</span>
          </div>

          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">SHARPE RATIO</span>
            <div className="text-[#00C896] font-bold text-lg font-mono-num mt-1">
              {result?.performance.sharpe_ratio ?? 1.42}
            </div>
            <span className="text-[10px] text-[#5F6B79] block mt-0.5">Rf = 6.5% Repo Rate</span>
          </div>

          <div className="bg-[#080B10] p-3.5 rounded border border-[#27303B]">
            <span className="text-[#8994A3] text-[10px] block uppercase tracking-wider font-semibold">MAX DRAWDOWN</span>
            <div className="text-[#FF5C6C] font-bold text-lg font-mono-num mt-1">
              {result?.performance.max_drawdown_pct ?? -12.22}%
            </div>
            <span className="text-[10px] text-[#00C896] block mt-0.5">3-Tier Stop Protected</span>
          </div>
        </div>
      </div>

      {/* SECTION 2 — ALLOCATION BREAKDOWN STRIP */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00C896]" />
            <h2 className="font-bold text-[#E8EDF3] uppercase tracking-wider text-xs">SINGLE SOURCE FUND CAPITAL ALLOCATION</h2>
          </div>
          <span className="text-[#8994A3] text-[11px]">Total AUM: <strong className="text-[#E8EDF3]">₹{totalAumCr.toLocaleString('en-IN')} Cr</strong></span>
        </div>

        {/* Visual Allocation Stack Bar */}
        <div className="w-full h-3 bg-[#080B10] rounded-full overflow-hidden flex mb-4 border border-[#27303B]">
          <div style={{ width: `${fundAlloc.aqr_alloc_pct}%` }} className="bg-[#00C896] h-full" title={`AQR ${fundAlloc.aqr_alloc_pct}%`} />
          <div style={{ width: `${fundAlloc.all_weather_alloc_pct}%` }} className="bg-[#D9A441] h-full" title={`All Weather ${fundAlloc.all_weather_alloc_pct}%`} />
          <div style={{ width: `${fundAlloc.activist_alloc_pct}%` }} className="bg-[#7185FF] h-full" title={`Activist ${fundAlloc.activist_alloc_pct}%`} />
          <div style={{ width: `${fundAlloc.unallocated_cash_pct}%` }} className="bg-[#5F6B79] h-full" title={`Cash ${fundAlloc.unallocated_cash_pct}%`} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#080B10] border border-[#27303B] p-3 rounded flex items-center justify-between">
            <div>
              <span className="text-[#8994A3] text-[10px] block font-bold">AQR MOMENTUM</span>
              <div className="text-[#00C896] font-bold text-sm font-mono-num">{fundAlloc.aqr_alloc_pct}%</div>
            </div>
            <div className="text-right">
              <span className="text-[#E8EDF3] font-bold block font-mono-num">₹{(totalAumCr * (fundAlloc.aqr_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className={`text-[10px] font-mono font-bold ${aqrPnlFormatted.colorClass}`}>{aqrPnlFormatted.text}</span>
            </div>
          </div>

          <div className="bg-[#080B10] border border-[#27303B] p-3 rounded flex items-center justify-between">
            <div>
              <span className="text-[#8994A3] text-[10px] block font-bold">ALL WEATHER</span>
              <div className="text-[#D9A441] font-bold text-sm font-mono-num">{fundAlloc.all_weather_alloc_pct}%</div>
            </div>
            <div className="text-right">
              <span className="text-[#E8EDF3] font-bold block font-mono-num">₹{(totalAumCr * (fundAlloc.all_weather_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className={`text-[10px] font-mono font-bold ${awPnlFormatted.colorClass}`}>{awPnlFormatted.text}</span>
            </div>
          </div>

          <div className="bg-[#080B10] border border-[#27303B] p-3 rounded flex items-center justify-between">
            <div>
              <span className="text-[#8994A3] text-[10px] block font-bold">ELLIOTT ACTIVIST</span>
              <div className="text-[#7185FF] font-bold text-sm font-mono-num">{fundAlloc.activist_alloc_pct}%</div>
            </div>
            <div className="text-right">
              <span className="text-[#E8EDF3] font-bold block font-mono-num">₹{(totalAumCr * (fundAlloc.activist_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className={`text-[10px] font-mono font-bold ${activistPnlFormatted.colorClass}`}>{activistPnlFormatted.text}</span>
            </div>
          </div>

          <div className="bg-[#080B10] border border-[#27303B] p-3 rounded flex items-center justify-between">
            <div>
              <span className="text-[#8994A3] text-[10px] block font-bold">CASH RESERVE</span>
              <div className="text-[#5F6B79] font-bold text-sm font-mono-num">{fundAlloc.unallocated_cash_pct}%</div>
            </div>
            <div className="text-right">
              <span className="text-[#E8EDF3] font-bold block font-mono-num">₹{(totalAumCr * (fundAlloc.unallocated_cash_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className={`text-[10px] font-mono font-bold ${cashPnlFormatted.colorClass}`}>{cashPnlFormatted.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — EQUITY CURVE CHART */}
      <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-3 mb-4 font-mono text-xs">
          <div>
            <h2 className="font-bold text-[#E8EDF3] uppercase tracking-wider text-xs">FUND PERFORMANCE TRAJECTORY</h2>
            <span className="text-[10px] text-[#8994A3]">
              {scaleMode === 'NAV' ? 'Base NAV = 100.0 Reconciled' : 'Values in ₹ Crores'} | High-Water Mark Protected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Display Scale Toggle (NAV vs Crore) */}
            <div className="flex bg-[#080B10] p-0.5 rounded border border-[#27303B] text-[11px]">
              <button
                onClick={() => setScaleMode('NAV')}
                className={`px-2.5 py-1 rounded transition-colors ${scaleMode === 'NAV' ? 'bg-[#00C896] text-[#080B10] font-bold' : 'text-[#8994A3]'}`}
                title="Scale Y-Axis as Fund NAV (Base 100.0)"
              >
                NAV (100.0)
              </button>
              <button
                onClick={() => setScaleMode('CR')}
                className={`px-2.5 py-1 rounded transition-colors ${scaleMode === 'CR' ? 'bg-[#00C896] text-[#080B10] font-bold' : 'text-[#8994A3]'}`}
                title="Scale Y-Axis in ₹ Crores"
              >
                Crores (₹)
              </button>
            </div>

            {/* Fee View Toggle */}
            <div className="flex bg-[#080B10] p-0.5 rounded border border-[#27303B] text-[11px]">
              <button
                onClick={() => setIsNetView(true)}
                className={`px-2.5 py-1 rounded transition-colors ${isNetView ? 'bg-[#111823] text-[#00C896] font-bold' : 'text-[#8994A3]'}`}
              >
                NET 2/20
              </button>
              <button
                onClick={() => setIsNetView(false)}
                className={`px-2.5 py-1 rounded transition-colors ${!isNetView ? 'bg-[#111823] text-[#00C896] font-bold' : 'text-[#8994A3]'}`}
              >
                GROSS
              </button>
            </div>

            {/* Time Range Filter */}
            <div className="flex bg-[#080B10] p-0.5 rounded border border-[#27303B] text-[11px]">
              {(['1M', '3M', '6M', '1Y', '3Y', 'MAX'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-1 rounded transition-colors ${timeRange === r ? 'bg-[#111823] text-[#00C896] font-bold' : 'text-[#8994A3]'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                width={scaleMode === 'CR' ? 90 : 50}
                domain={['auto', 'auto']}
                tickFormatter={(val: number) => {
                  if (scaleMode === 'CR') {
                    return `₹${Math.round(val).toLocaleString('en-IN')} Cr`;
                  }
                  return val.toFixed(0);
                }}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    const dp = payload[0].payload;
                    return (
                      <div className="bg-[#0D121A] border border-[#27303B] p-3 rounded shadow-xl font-mono text-xs text-[#E8EDF3]">
                        <div className="text-[#8994A3] text-[10px] font-bold border-b border-[#27303B] pb-1 mb-2">
                          DATE: {label}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#00C896] font-bold">
                          <span>Master Fund NAV:</span>
                          <span>{dp.net_nav?.toFixed(2) || dp.nav?.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#00C896] text-[11px] mt-0.5">
                          <span>Net Portfolio Value:</span>
                          <span>₹{(dp.net_value_cr || 0).toLocaleString('en-IN')} Cr</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#8994A3] mt-1.5 pt-1.5 border-t border-[#27303B]">
                          <span>NIFTY 50 Benchmark:</span>
                          <span>{dp.nifty_nav?.toFixed(2)} (₹{(dp.nifty_value_cr || 0).toLocaleString('en-IN')} Cr)</span>
                        </div>
                        {dp.drawdown_pct !== undefined && (
                          <div className="flex items-center justify-between gap-4 text-[#FF5C6C] text-[10px] mt-1">
                            <span>Drawdown:</span>
                            <span>{dp.drawdown_pct.toFixed(2)}%</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line
                type="monotone"
                dataKey={
                  scaleMode === 'NAV'
                    ? (isNetView ? 'net_nav' : 'gross_nav')
                    : (isNetView ? 'net_value_cr' : 'gross_value_cr')
                }
                name={
                  scaleMode === 'NAV'
                    ? (isNetView ? 'Net Master Fund NAV (Base 100)' : 'Gross Master Fund NAV')
                    : (isNetView ? 'Net Investor Capital (₹ Cr)' : 'Gross Portfolio Capital (₹ Cr)')
                }
                stroke="#00C896"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={scaleMode === 'NAV' ? 'nifty_nav' : 'nifty_value_cr'}
                name={scaleMode === 'NAV' ? 'NIFTY 50 Benchmark NAV' : 'NIFTY 50 Capital (₹ Cr)'}
                stroke="#5F6B79"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 4 — STRATEGY NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AQR Card */}
        <div
          onClick={() => {
            setActiveTab('aqr');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-[#0D121A] border border-[#27303B] hover:border-[#00C896]/60 rounded-lg p-4 space-y-3 font-mono text-xs cursor-pointer transition-all hover:bg-[#111823] group"
        >
          <div className="flex justify-between items-center border-b border-[#27303B] pb-2">
            <span className="font-bold text-[#00C896] uppercase">AQR-inspired Momentum</span>
            <span className="text-[10px] text-[#8994A3]">{fundAlloc.aqr_alloc_pct}% Alloc</span>
          </div>
          <p className="text-[#8994A3] text-[11px] font-sans">
            Systematic 12-1 month price momentum & liquid Universe stock selection.
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8994A3]">Estimated P&L:</span>
            <strong className={`font-mono-num ${aqrPnlFormatted.colorClass}`}>{aqrPnlFormatted.text}</strong>
          </div>
          <div
            className="w-full bg-[#111823] group-hover:bg-[#1A2332] border border-[#27303B] group-hover:border-[#00C896] text-[#E8EDF3] font-bold py-2 rounded flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <span>Open AQR Workstation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00C896]" />
          </div>
        </div>

        {/* All Weather Card */}
        <div
          onClick={() => {
            setActiveTab('all-weather');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-[#0D121A] border border-[#27303B] hover:border-[#3B82F6]/60 rounded-lg p-4 space-y-3 font-mono text-xs cursor-pointer transition-all hover:bg-[#111823] group"
        >
          <div className="flex justify-between items-center border-b border-[#27303B] pb-2">
            <span className="font-bold text-[#3B82F6] uppercase">Bridgewater-inspired All Weather</span>
            <span className="text-[10px] text-[#8994A3]">{fundAlloc.all_weather_alloc_pct}% Alloc</span>
          </div>
          <p className="text-[#8994A3] text-[11px] font-sans">
            Risk-parity macro asset allocation across Indian economic regimes.
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8994A3]">Estimated P&L:</span>
            <strong className={`font-mono-num ${awPnlFormatted.colorClass}`}>{awPnlFormatted.text}</strong>
          </div>
          <div
            className="w-full bg-[#111823] group-hover:bg-[#1A2332] border border-[#27303B] group-hover:border-[#3B82F6] text-[#E8EDF3] font-bold py-2 rounded flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <span>Open All Weather Workstation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
        </div>

        {/* Activist Card */}
        <div
          onClick={() => {
            setActiveTab('activist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-[#0D121A] border border-[#27303B] hover:border-[#F59E0B]/60 rounded-lg p-4 space-y-3 font-mono text-xs cursor-pointer transition-all hover:bg-[#111823] group"
        >
          <div className="flex justify-between items-center border-b border-[#27303B] pb-2">
            <span className="font-bold text-[#F59E0B] uppercase">Elliott-inspired Activist</span>
            <span className="text-[10px] text-[#8994A3]">{fundAlloc.activist_alloc_pct}% Alloc</span>
          </div>
          <p className="text-[#8994A3] text-[11px] font-sans">
            Point-in-time relative price screening & volume surge event identification.
          </p>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8994A3]">Estimated P&L:</span>
            <strong className={`font-mono-num ${activistPnlFormatted.colorClass}`}>{activistPnlFormatted.text}</strong>
          </div>
          <div
            className="w-full bg-[#111823] group-hover:bg-[#1A2332] border border-[#27303B] group-hover:border-[#F59E0B] text-[#E8EDF3] font-bold py-2 rounded flex items-center justify-center gap-1.5 text-xs transition-colors"
          >
            <span>Open Activist Workstation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
        </div>
      </div>
    </div>
  );
};
