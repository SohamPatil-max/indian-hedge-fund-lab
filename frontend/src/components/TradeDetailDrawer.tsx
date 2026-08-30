import React from 'react';
import { TradeRecord } from '../types';
import { X, CheckCircle, Clock, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';

interface Props {
  trade: TradeRecord | null;
  onClose: () => void;
}

export const TradeDetailDrawer: React.FC<Props> = ({ trade, onClose }) => {
  if (!trade) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end font-sans">
      <div className="w-full max-w-md bg-[#0D121A] border-l border-[#27303B] h-full shadow-2xl flex flex-col font-mono text-xs text-[#E8EDF3]">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#27303B] flex items-center justify-between bg-[#080B10]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00C896]" />
            <h3 className="text-sm font-bold text-[#E8EDF3]">TRADE EXECUTION DETAILS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#151D28] text-[#8994A3] hover:text-[#E8EDF3] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Symbol & Action Summary Card */}
          <div className="bg-[#080B10] border border-[#27303B] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#E8EDF3] font-bold text-base">{trade.symbol.replace('.NS', '')}</span>
              <span
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  trade.action === 'BUY'
                    ? 'bg-[#111823] border border-[#00C896]/40 text-[#00C896]'
                    : 'bg-[#111823] border border-[#FF5C6C]/40 text-[#FF5C6C]'
                }`}
              >
                {trade.action} ORDER
              </span>
            </div>
            <p className="text-[#8994A3] text-[11px] font-sans">{trade.company_name}</p>
            <div className="mt-3 pt-3 border-t border-[#27303B] flex justify-between text-[11px]">
              <span className="text-[#5F6B79]">Execution Date:</span>
              <span className="text-[#E8EDF3] font-bold">{trade.date}</span>
            </div>
          </div>

          {/* Trade Execution Metrics Table */}
          <div className="bg-[#080B10] border border-[#27303B] rounded-lg p-4 space-y-2.5">
            <h4 className="text-[10px] text-[#00C896] font-bold uppercase tracking-wider mb-2">Execution Metrics</h4>
            
            <div className="flex justify-between">
              <span className="text-[#8994A3]">Trade ID:</span>
              <span className="text-[#E8EDF3] font-bold">{trade.trade_id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-[#8994A3]">Execution Price:</span>
              <span className="text-[#E8EDF3] font-mono-num font-bold">₹{trade.execution_price}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Executed Quantity:</span>
              <span className="text-[#E8EDF3] font-mono-num font-bold">{trade.quantity} shares</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Gross Trade Value:</span>
              <span className="text-[#8994A3] font-mono-num">₹{trade.gross_trade_value.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">STT / Transaction Cost:</span>
              <span className="text-[#8994A3] font-mono-num">₹{trade.transaction_cost}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Slippage Cost:</span>
              <span className="text-[#8994A3] font-mono-num">₹{trade.slippage}</span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#27303B]">
              <span className="text-[#E8EDF3] font-bold">Net Trade Value:</span>
              <span className="text-[#00C896] font-mono-num font-bold">₹{trade.net_trade_value.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Portfolio & P&L Impact */}
          <div className="bg-[#080B10] border border-[#27303B] rounded-lg p-4 space-y-2.5">
            <h4 className="text-[10px] text-[#D9A441] font-bold uppercase tracking-wider mb-2">Portfolio & P&L Impact</h4>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Portfolio Weight:</span>
              <span className="text-[#00C896] font-bold">{trade.portfolio_weight_pct}%</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Realized P&L:</span>
              <span className={`font-bold font-mono-num ${trade.realized_pnl >= 0 ? 'text-[#00C896]' : 'text-[#FF5C6C]'}`}>
                {trade.realized_pnl > 0 ? '+' : ''}₹{trade.realized_pnl.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Holding Period:</span>
              <span className="text-[#E8EDF3] font-bold">{trade.holding_period_days} days</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8994A3]">Portfolio NAV:</span>
              <span className="text-[#E8EDF3] font-bold">{trade.portfolio_nav}</span>
            </div>
          </div>

          {/* Strategy & Signal Rationale Card */}
          <div className="bg-[#080B10] border border-[#27303B] rounded-lg p-4 space-y-2">
            <h4 className="text-[10px] text-[#7185FF] font-bold uppercase tracking-wider mb-1">Quantitative Signal Rationale</h4>
            <div className="text-xs text-[#8994A3] font-sans leading-relaxed">
              {trade.signal_reason}
            </div>
            <div className="pt-2 text-[10px] text-[#5F6B79]">
              Strategy: <strong className="text-[#E8EDF3]">{trade.strategy}</strong>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#27303B] bg-[#080B10]">
          <button
            onClick={onClose}
            className="btn-secondary w-full py-2 rounded font-bold transition-all text-xs"
          >
            Close Detail Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
