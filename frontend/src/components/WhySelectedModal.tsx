import React from 'react';
import { AQRStockItem } from '../types';
import { X, CheckCircle, AlertTriangle, ArrowUpRight, Award, BarChart } from 'lucide-react';

interface Props {
  stock: AQRStockItem | null;
  onClose: () => void;
}

export const WhySelectedModal: React.FC<Props> = ({ stock, onClose }) => {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-xl w-full p-6 text-gray-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-950/80 border border-emerald-700 p-2.5 rounded-lg text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{stock.symbol}</span>
              <span className="text-xs bg-gray-800 text-gray-400 font-mono px-2 py-0.5 rounded">
                {stock.sector}
              </span>
            </h3>
            <p className="text-xs text-gray-400">{stock.name}</p>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`p-3 rounded-md mb-4 border flex items-center justify-between font-mono text-xs ${
            stock.selected
              ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
              : 'bg-gray-800/60 border-gray-700 text-gray-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {stock.selected ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span className="font-bold">STATUS: {stock.status}</span>
          </div>
          {stock.selected && (
            <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-bold">
              Portfolio Weight: {stock.portfolio_weight}%
            </span>
          )}
        </div>

        {/* Quantitative Metrics Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 font-mono text-xs">
          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <div className="text-gray-500 mb-1">Momentum Rank</div>
            <div className="text-base font-bold text-white font-mono-num">
              #{stock.rank} <span className="text-gray-500 text-xs">/ 100</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Prev: #{stock.previous_rank}</div>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <div className="text-gray-500 mb-1">12-1M Return Score</div>
            <div className="text-base font-bold text-emerald-400 font-mono-num">
              +{stock.momentum_score}%
            </div>
            <div className="text-[10px] text-gray-400 mt-1">12M Excl Last Month</div>
          </div>

          <div className="bg-gray-950 p-3 rounded border border-gray-800">
            <div className="text-gray-500 mb-1">12M Total Return</div>
            <div className="text-base font-bold text-blue-400 font-mono-num">
              +{stock.return_12m}%
            </div>
            <div className="text-[10px] text-gray-400 mt-1">1M: {stock.return_1m}%</div>
          </div>
        </div>

        {/* Why Selected Detailed Narrative */}
        <div className="bg-gray-950 border border-gray-800 rounded p-4 text-xs space-y-2">
          <h4 className="font-semibold text-gray-300 flex items-center gap-1.5 border-b border-gray-800 pb-2">
            <BarChart className="w-4 h-4 text-emerald-400" />
            <span>Methodology Selection Rationale</span>
          </h4>
          <p className="text-gray-300 leading-relaxed font-mono">{stock.explanation}</p>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
