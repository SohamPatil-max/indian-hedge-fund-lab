import React, { useEffect, useState } from 'react';
import { BarChart3, Play, TrendingUp, Shield, Activity, Award } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ComparePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compare/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initial_capital: 10000000,
        start_date: '2021-01-01',
        end_date: '2026-08-01',
        rebalance_freq: 'Quarterly',
      }),
    })
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
      <div className="flex items-center justify-center h-64 text-indigo-400 font-mono text-sm">
        <span className="animate-spin mr-2">⚙</span> Running Multi-Strategy Comparison Engine vs NIFTY 50...
      </div>
    );
  }

  const { strategies, equity_curve_overlay } = data;
  const aqr = strategies.AQR_MOMENTUM;
  const aw = strategies.ALL_WEATHER;
  const act = strategies.ACTIVIST_EVENT;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Multi-Strategy Performance Comparison</span>
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Side-by-side risk and return matrix comparing all 3 Indian hedge fund strategy modules vs NIFTY 50 benchmark
        </p>
      </div>

      {/* Side-by-Side Comparison Metric Matrix Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-gray-950 border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Performance Metric</th>
              <th className="p-3 text-right font-bold text-emerald-400">AQR Momentum</th>
              <th className="p-3 text-right font-bold text-amber-400">All Weather</th>
              <th className="p-3 text-right font-bold text-indigo-400">Elliott Activist</th>
              <th className="p-3 text-right text-gray-400">NIFTY 50 Benchmark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Total Return (%)</td>
              <td className="p-3 text-right font-mono-num font-bold text-emerald-400">
                +{aqr.performance.total_return_pct}%
              </td>
              <td className="p-3 text-right font-mono-num font-bold text-amber-400">
                +{aw.performance.total_return_pct}%
              </td>
              <td className="p-3 text-right font-mono-num font-bold text-indigo-400">
                +{act.performance.total_return_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-gray-300">
                +{aqr.performance.benchmark_total_return_pct}%
              </td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">CAGR (%)</td>
              <td className="p-3 text-right font-mono-num font-bold text-emerald-400">
                {aqr.performance.cagr_pct}%
              </td>
              <td className="p-3 text-right font-mono-num font-bold text-amber-400">
                {aw.performance.cagr_pct}%
              </td>
              <td className="p-3 text-right font-mono-num font-bold text-indigo-400">
                {act.performance.cagr_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-gray-300">
                {aqr.performance.benchmark_cagr_pct}%
              </td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Annualized Volatility (%)</td>
              <td className="p-3 text-right font-mono-num text-emerald-400">
                {aqr.performance.annualized_volatility_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-amber-400 font-bold">
                {aw.performance.annualized_volatility_pct}% (Lowest)
              </td>
              <td className="p-3 text-right font-mono-num text-indigo-400">
                {act.performance.annualized_volatility_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-gray-300">14.5%</td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Sharpe Ratio</td>
              <td className="p-3 text-right font-mono-num text-emerald-400">
                {aqr.risk.sharpe_ratio}
              </td>
              <td className="p-3 text-right font-mono-num text-amber-400">
                {aw.risk.sharpe_ratio}
              </td>
              <td className="p-3 text-right font-mono-num font-bold text-indigo-400">
                {act.risk.sharpe_ratio} (Highest)
              </td>
              <td className="p-3 text-right font-mono-num text-gray-300">0.51</td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Sortino Ratio</td>
              <td className="p-3 text-right font-mono-num text-emerald-400">{aqr.risk.sortino_ratio}</td>
              <td className="p-3 text-right font-mono-num text-amber-400">{aw.risk.sortino_ratio}</td>
              <td className="p-3 text-right font-mono-num text-indigo-400">{act.risk.sortino_ratio}</td>
              <td className="p-3 text-right font-mono-num text-gray-300">0.72</td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Maximum Drawdown (%)</td>
              <td className="p-3 text-right font-mono-num text-rose-400">
                {aqr.risk.max_drawdown_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-amber-400 font-bold">
                {aw.risk.max_drawdown_pct}% (Safest)
              </td>
              <td className="p-3 text-right font-mono-num text-rose-400">
                {act.risk.max_drawdown_pct}%
              </td>
              <td className="p-3 text-right font-mono-num text-gray-300">-18.4%</td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Beta vs NIFTY 50</td>
              <td className="p-3 text-right font-mono-num text-emerald-400">{aqr.risk.beta_vs_nifty}</td>
              <td className="p-3 text-right font-mono-num text-amber-400">{aw.risk.beta_vs_nifty}</td>
              <td className="p-3 text-right font-mono-num text-indigo-400">{act.risk.beta_vs_nifty}</td>
              <td className="p-3 text-right font-mono-num text-gray-300">1.00</td>
            </tr>

            <tr className="hover:bg-gray-800/40">
              <td className="p-3 font-semibold text-gray-300">Win Rate (%)</td>
              <td className="p-3 text-right font-mono-num text-emerald-400">{aqr.trading.win_rate_pct}%</td>
              <td className="p-3 text-right font-mono-num text-amber-400">{aw.trading.win_rate_pct}%</td>
              <td className="p-3 text-right font-mono-num text-indigo-400">{act.trading.win_rate_pct}%</td>
              <td className="p-3 text-right font-mono-num text-gray-300">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Multi-Strategy Equity Curve Overlay Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-base font-bold text-white mb-4">Overlaid Strategy Equity Curves</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equity_curve_overlay}>
              <XAxis dataKey="date" stroke="#4B5563" fontSize={11} />
              <YAxis stroke="#4B5563" fontSize={11} orientation="right" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line
                type="monotone"
                dataKey="AQR_Momentum"
                name="AQR Momentum (₹)"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="All_Weather"
                name="Bridgewater All Weather (₹)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Activist_Event"
                name="Elliott Activist (₹)"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="NIFTY_50"
                name="NIFTY 50 Benchmark (₹)"
                stroke="#6B7280"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
