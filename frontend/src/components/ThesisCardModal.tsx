import React from 'react';
import { ThesisCardData } from '../types';
import { X, Target, AlertTriangle, ShieldCheck, Flame, ChevronRight } from 'lucide-react';

interface Props {
  thesis: ThesisCardData | null;
  onClose: () => void;
}

export const ThesisCardModal: React.FC<Props> = ({ thesis, onClose }) => {
  if (!thesis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full p-6 text-gray-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-950/80 border border-indigo-700 p-2.5 rounded-lg text-indigo-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white font-mono">{thesis.symbol}</h3>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                {thesis.sector}
              </span>
            </div>
            <p className="text-xs text-gray-400">{thesis.name}</p>
          </div>
        </div>

        {/* Score & Status Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4 font-mono text-xs">
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800 text-center">
            <div className="text-gray-500 text-[10px]">Overall Score</div>
            <div className="text-lg font-bold text-emerald-400 font-mono-num">{thesis.overall_score} / 100</div>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800 text-center">
            <div className="text-gray-500 text-[10px]">Valuation Score</div>
            <div className="text-base font-bold text-indigo-400 font-mono-num">{thesis.scores.valuation}</div>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800 text-center">
            <div className="text-gray-500 text-[10px]">Quality Score</div>
            <div className="text-base font-bold text-cyan-400 font-mono-num">{thesis.scores.quality}</div>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800 text-center">
            <div className="text-gray-500 text-[10px]">Catalyst Score</div>
            <div className="text-base font-bold text-amber-400 font-mono-num">{thesis.scores.catalyst}</div>
          </div>
        </div>

        {/* Investment Thesis Narrative */}
        <div className="bg-indigo-950/40 border border-indigo-800/60 rounded p-4 mb-4 text-xs">
          <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Core Investment Thesis</span>
          </div>
          <p className="text-gray-300 leading-relaxed font-mono">{thesis.investment_thesis}</p>
        </div>

        {/* Fundamental Metrics Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 font-mono text-xs">
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800">
            <span className="text-gray-500 block">P/E Ratio</span>
            <span className="text-white font-bold font-mono-num">{thesis.metrics.pe_ratio}x</span>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800">
            <span className="text-gray-500 block">EV / EBITDA</span>
            <span className="text-white font-bold font-mono-num">{thesis.metrics.ev_ebitda}x</span>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800">
            <span className="text-gray-500 block">ROE %</span>
            <span className="text-emerald-400 font-bold font-mono-num">{thesis.metrics.roe_pct}%</span>
          </div>
          <div className="bg-gray-950 p-2.5 rounded border border-gray-800">
            <span className="text-gray-500 block">Debt / Equity</span>
            <span className="text-gray-300 font-bold font-mono-num">{thesis.metrics.debt_equity}x</span>
          </div>
        </div>

        {/* Asymmetric Risk / Reward Profile */}
        <div className="bg-gray-950 border border-gray-800 rounded p-4 mb-4 font-mono text-xs">
          <h4 className="font-semibold text-gray-300 border-b border-gray-800 pb-2 mb-3 flex items-center justify-between">
            <span>Risk / Reward Profile</span>
            <span className="text-emerald-400 font-bold">Ratio: {thesis.risk_reward_ratio}x</span>
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-900 p-2 rounded">
              <span className="text-gray-500 text-[10px]">Current Price</span>
              <div className="text-white font-bold font-mono-num">₹{thesis.price}</div>
            </div>
            <div className="bg-emerald-950/60 border border-emerald-800/60 p-2 rounded">
              <span className="text-emerald-400 text-[10px]">Fair Value Target</span>
              <div className="text-emerald-300 font-bold font-mono-num">
                ₹{thesis.target_price} (+{thesis.expected_upside_pct}%)
              </div>
            </div>
            <div className="bg-rose-950/60 border border-rose-800/60 p-2 rounded">
              <span className="text-rose-400 text-[10px]">Stop / Invalidation</span>
              <div className="text-rose-300 font-bold font-mono-num">
                ₹{thesis.stop_loss_price} (-{thesis.downside_risk_pct}%)
              </div>
            </div>
          </div>
        </div>

        {/* Catalyst Details & Exit Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-mono text-xs">
          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Catalyst Breakdown</span>
            </div>
            <div className="text-white font-bold mb-1">{thesis.catalyst_details.type}</div>
            <div className="text-gray-400 text-[11px]">
              Expected Timeline: ~{thesis.catalyst_details.timeline_months} months
            </div>
            <div className="text-gray-400 text-[11px]">
              Conviction Level: <span className="text-emerald-400 font-bold">{thesis.catalyst_details.conviction}</span>
            </div>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <div className="font-semibold text-rose-400 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Exit Framework Triggers</span>
            </div>
            <ul className="space-y-1 text-gray-400 text-[11px]">
              {thesis.exit_triggers.map((trigger, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <ChevronRight className="w-3 h-3 text-gray-600 mt-0.5 shrink-0" />
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-semibold"
          >
            Close Thesis Card
          </button>
        </div>
      </div>
    </div>
  );
};
