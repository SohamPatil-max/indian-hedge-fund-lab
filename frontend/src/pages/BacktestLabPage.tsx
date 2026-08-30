import React, { useState } from 'react';
import { useBacktest } from '../App';
import { FeeDashboard } from '../components/FeeDashboard';
import { ExportDataControl } from '../components/ExportDataControl';
import { Sliders, Play, TrendingUp, ShieldAlert, DollarSign, Activity, FileSpreadsheet, BarChart, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';

export const BacktestLabPage: React.FC = () => {
  const { activeBacktest: result, running } = useBacktest();
  const [isNetView, setIsNetView] = useState(true);

  if (running && !result) {
    return (
      <div className="flex items-center justify-center h-64 text-[#00C896] font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Running Historical Backtest & Single Source of Truth Pipeline...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8EDF3] flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#00C896]" />
            <span>Quantitative Backtest Workstation</span>
          </h1>
          <p className="text-[#8994A3] text-sm mt-0.5 font-mono">
            Event-driven historical backtesting workstation powered by the single source of truth engine
          </p>
        </div>
        {result && (
          <div className="font-mono text-xs text-[#8994A3] bg-[#0D121A] border border-[#27303B] px-3 py-1.5 rounded">
            Run ID: <strong className="text-[#E8EDF3]">{result.run_id}</strong> | Calculated: {result.last_calculated}
          </div>
        )}
      </div>

      {result && (
        <>
          {/* Dedicated 2/20 Fee Dashboard */}
          <FeeDashboard
            fees={result.fee_breakdown}
            grossReturnPct={result.performance.gross_total_return_pct}
            netReturnPct={result.performance.net_total_return_pct}
            isNetView={isNetView}
            setIsNetView={setIsNetView}
          />

          {/* TWO COLUMN QUANT RESEARCH WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-mono text-xs">
            {/* LEFT COLUMN — RESULTS SUMMARY & METRICS */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold text-[#00C896] uppercase tracking-wider border-b border-[#27303B] pb-2">
                  QUANT METRIC RESULTS
                </h3>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">NET CAGR</span>
                  <span className="text-[#00C896] font-bold text-lg font-mono-num">
                    {result.performance.net_cagr_pct}%
                  </span>
                </div>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">SHARPE RATIO</span>
                  <span className="text-[#7185FF] font-bold text-lg font-mono-num">
                    {result.risk.sharpe_ratio}
                  </span>
                </div>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">NET TOTAL RETURN</span>
                  <span className="text-[#00C896] font-bold text-lg font-mono-num">
                    +{result.performance.net_total_return_pct}%
                  </span>
                </div>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">MAX DRAWDOWN</span>
                  <span className="text-[#FF5C6C] font-bold text-lg font-mono-num">
                    {result.risk.max_drawdown_pct}%
                  </span>
                </div>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">SORTINO RATIO</span>
                  <span className="text-[#00C896] font-bold text-base font-mono-num">
                    {result.risk.sortino_ratio}
                  </span>
                </div>

                <div className="bg-[#080B10] p-3 rounded border border-[#27303B]">
                  <span className="text-[#8994A3] text-[10px] block">TOTAL FEES PAID</span>
                  <span className="text-[#FF5C6C] font-bold text-base font-mono-num">
                    ₹{(result.fee_breakdown.total_fees_paid_inr / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN COLUMN — CHARTS & STATS */}
            <div className="lg:col-span-3 space-y-6">
              {/* Equity Curve Chart */}
              <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#E8EDF3] uppercase tracking-wider">
                      Equity Curve — Gross vs Net Investor vs High-Water Mark
                    </h3>
                    <p className="text-[11px] text-[#8994A3]">Strategy: {result.strategy_name}</p>
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.equity_curve}>
                      <XAxis dataKey="date" stroke="#687483" fontSize={11} />
                      <YAxis stroke="#687483" fontSize={11} orientation="right" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D121A', borderColor: '#27303B', fontSize: '12px', color: '#E8EDF3' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                      <Line
                        type="monotone"
                        dataKey="gross_portfolio_value"
                        name="Gross Portfolio Value (₹)"
                        stroke="#00C896"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="net_investor_value"
                        name="Net Investor Value (₹)"
                        stroke="#7185FF"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="high_water_mark"
                        name="High-Water Mark (₹)"
                        stroke="#D9A441"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark_nifty"
                        name="NIFTY 50 Benchmark (₹)"
                        stroke="#5F6B79"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Drawdown Chart */}
              <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5">
                <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider mb-3">
                  Historical Drawdown Profile (%)
                </h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.equity_curve}>
                      <XAxis dataKey="date" stroke="#687483" fontSize={10} />
                      <YAxis stroke="#687483" fontSize={10} orientation="right" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D121A', borderColor: '#27303B', fontSize: '12px', color: '#E8EDF3' }}
                      />
                      <Area type="monotone" dataKey="drawdown_pct" stroke="#FF5C6C" fill="#FF5C6C" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trade Statistics Summary */}
              <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-4">
                <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider mb-3">
                  Trade Statistics & Execution Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#080B10] p-2.5 rounded border border-[#27303B]">
                    <span className="text-[#8994A3] text-[10px] block">TOTAL TRADES</span>
                    <span className="text-[#E8EDF3] font-bold">{result.trading.total_trades}</span>
                  </div>
                  <div className="bg-[#080B10] p-2.5 rounded border border-[#27303B]">
                    <span className="text-[#8994A3] text-[10px] block">WIN RATE</span>
                    <span className="text-[#00C896] font-bold">{result.trading.win_rate_pct}%</span>
                  </div>
                  <div className="bg-[#080B10] p-2.5 rounded border border-[#27303B]">
                    <span className="text-[#8994A3] text-[10px] block">PROFIT FACTOR</span>
                    <span className="text-[#7185FF] font-bold">{result.trading.profit_factor}</span>
                  </div>
                  <div className="bg-[#080B10] p-2.5 rounded border border-[#27303B]">
                    <span className="text-[#8994A3] text-[10px] block">TURNOVER RATE</span>
                    <span className="text-[#D9A441] font-bold">{result.trading.turnover_pct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Trades Controls */}
          <ExportDataControl
            strategyLabel={result.strategy_name.replace(/\s+/g, '_')}
            backtestData={result}
            trades={result.all_trades}
          />
        </>
      )}
    </div>
  );
};
