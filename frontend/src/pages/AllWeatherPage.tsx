import React, { useEffect, useState } from 'react';
import { MethodologyCard } from '../components/MethodologyCard';
import { AllWeatherResponse } from '../types';
import { Shield, PieChart, RefreshCw, AlertCircle, ArrowUp, ArrowDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const AllWeatherPage: React.FC = () => {
  const [data, setData] = useState<AllWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/strategy/all-weather')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-amber-400 font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Evaluating Indian Macro Regimes & Risk Parity Allocations...
      </div>
    );
  }

  const { macro_regime } = data;
  const macroData = macro_regime.macro_data;

  const pieChartData = data.asset_allocations.map((item) => ({
    name: item.asset,
    value: item.target_weight_pct,
    risk: item.risk_contribution_pct,
  }));

  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <span>Bridgewater-Inspired All Weather — India</span>
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Macro regime asset allocation and risk parity framework adapted for the Indian market
        </p>
      </div>

      {/* Methodology Card with Explicit Disclaimer */}
      <MethodologyCard
        title="All Weather Macro & Risk Parity Framework"
        subtitle="Balanced Risk Contribution across Indian Inflation and Economic Growth cycles"
        disclaimer={data.disclaimer}
        formula="Target Risk Contribution (i) = (Weight_i * Volatility_i) / Total_Portfolio_Risk = Constant"
        rules={[
          "Monitor Indian macro indicators: GDP Growth, CPI Inflation, RBI Repo Rate, 10Y G-Sec Yield, INR/USD, Crude Oil.",
          "Classify current economic state into 1 of 4 Macro Regimes (Growth Up/Down x Inflation Up/Down).",
          "Map asset classes to macro environment drivers (NIFTY 50 Equities, 10Y Sovereign G-Secs, Gold, Cash).",
          "Solve for inverse-volatility Risk Parity weights so each asset class contributes equal risk factor.",
          "Perform dynamic rebalancing whenever current weight drifts > 2% from target risk parity weights."
        ]}
      />

      {/* Indian Economic Inputs Dashboard */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Indian Macro Indicators Stream
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Real GDP Growth</span>
            <div className="text-emerald-400 font-bold text-base font-mono-num flex items-center gap-1">
              <span>{macroData.gdp_growth_pct}%</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] text-gray-500">Trend: Expansion</span>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">CPI Inflation</span>
            <div className="text-amber-400 font-bold text-base font-mono-num flex items-center gap-1">
              <span>{macroData.cpi_inflation_pct}%</span>
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-gray-500">Trend: Cooling</span>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">RBI Policy Rate</span>
            <div className="text-white font-bold text-base font-mono-num">{macroData.rbi_repo_rate_pct}%</div>
            <span className="text-[10px] text-gray-500">MPC Stance: Neutral</span>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">10Y G-Sec Yield</span>
            <div className="text-white font-bold text-base font-mono-num">{macroData.gsec_10y_yield_pct}%</div>
            <span className="text-[10px] text-gray-500">Sovereign Benchmark</span>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">INR / USD</span>
            <div className="text-gray-200 font-bold text-base font-mono-num">₹{macroData.inr_usd_rate}</div>
            <span className="text-[10px] text-gray-500">FX Spot Rate</span>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Brent Crude Oil</span>
            <div className="text-cyan-400 font-bold text-base font-mono-num">${macroData.brent_crude_usd}</div>
            <span className="text-[10px] text-gray-500">Commodity Benchmark</span>
          </div>
        </div>
      </div>

      {/* 4 Macro Regimes Matrix + Current Active Regime */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Four Environments Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            The Four All Weather Macro Regimes Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Growth</th>
                  <th className="p-3">Inflation</th>
                  <th className="p-3">Macro Environment</th>
                  <th className="p-3">Favored Indian Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className={macro_regime.regime_id === 'REGIME_1' ? 'bg-emerald-950/40 font-bold' : ''}>
                  <td className="p-3 text-emerald-400">↑ Expansion</td>
                  <td className="p-3 text-emerald-400">↓ Cooling</td>
                  <td className="p-3 text-white">Growth Up / Inflation Down</td>
                  <td className="p-3 text-gray-300">Indian Equities (NIFTY), Corporate Debt</td>
                </tr>
                <tr className={macro_regime.regime_id === 'REGIME_2' ? 'bg-amber-950/40 font-bold' : ''}>
                  <td className="p-3 text-emerald-400">↑ Expansion</td>
                  <td className="p-3 text-amber-400">↑ Rising</td>
                  <td className="p-3 text-white">Growth Up / Inflation Up</td>
                  <td className="p-3 text-gray-300">Gold (GOLDBEES), Commodities, Short Debt</td>
                </tr>
                <tr className={macro_regime.regime_id === 'REGIME_3' ? 'bg-indigo-950/40 font-bold' : ''}>
                  <td className="p-3 text-rose-400">↓ Slowdown</td>
                  <td className="p-3 text-emerald-400">↓ Cooling</td>
                  <td className="p-3 text-white">Growth Down / Inflation Down</td>
                  <td className="p-3 text-gray-300">10Y Sovereign G-Secs, High-Grade Bonds</td>
                </tr>
                <tr className={macro_regime.regime_id === 'REGIME_4' ? 'bg-rose-950/40 font-bold' : ''}>
                  <td className="p-3 text-rose-400">↓ Slowdown</td>
                  <td className="p-3 text-amber-400">↑ Rising</td>
                  <td className="p-3 text-white">Growth Down / Inflation Up</td>
                  <td className="p-3 text-gray-300">Gold, Cash / Liquid BEES, Oil Commodities</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Model Called Current Regime Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
                ACTIVE CLASSIFICATION
              </span>
              <span className="text-xs text-gray-400 font-mono">Volatility: {data.portfolio_volatility_pct}%</span>
            </div>

            <h3 className="text-lg font-bold text-emerald-400 mb-2">{macro_regime.regime_name}</h3>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">{macro_regime.description}</p>

            <div className="bg-gray-950 border border-gray-800 rounded p-3 text-xs font-mono space-y-2">
              <div className="text-gray-400 font-semibold flex items-center gap-1.5 border-b border-gray-800 pb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Why is the model calling this regime?</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">{macro_regime.rule_explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Parity Asset Allocation & Rebalance Required Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Allocation Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Target Risk Parity Asset Weighting
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rebalance Trades Generator Table */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Asset Allocation & Rebalancing Generator
            </h3>
            {data.rebalance_required ? (
              <span className="bg-amber-950 border border-amber-800 text-amber-400 text-xs px-2.5 py-1 rounded font-mono font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Rebalance Required</span>
              </span>
            ) : (
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs px-2.5 py-1 rounded font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Allocation Balanced</span>
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Asset Instrument</th>
                  <th className="p-3 text-right">Current %</th>
                  <th className="p-3 text-right">Target %</th>
                  <th className="p-3 text-right">Risk Contrib %</th>
                  <th className="p-3 text-center">Action</th>
                  <th className="p-3 text-right">Rebalance Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.asset_allocations.map((item) => (
                  <tr key={item.asset} className="hover:bg-gray-800/40">
                    <td className="p-3 font-bold text-white">{item.asset}</td>
                    <td className="p-3 text-right font-mono-num text-gray-300">{item.current_weight_pct}%</td>
                    <td className="p-3 text-right font-mono-num text-emerald-400 font-bold">{item.target_weight_pct}%</td>
                    <td className="p-3 text-right font-mono-num text-amber-400">{item.risk_contribution_pct}%</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.action === 'BUY'
                            ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                            : item.action === 'SELL'
                            ? 'bg-rose-950 border border-rose-700 text-rose-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono-num text-white">
                      ₹{item.trade_amount_inr.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
