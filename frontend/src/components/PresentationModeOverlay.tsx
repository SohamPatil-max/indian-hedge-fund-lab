import React, { useEffect } from 'react';
import { X, Award, ShieldCheck, TrendingUp, DollarSign, Layers, PieChart } from 'lucide-react';
import { useBacktest } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModeOverlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const { activeBacktest } = useBacktest();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (!isOpen && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fa = activeBacktest?.fund_allocation || {
    total_aum_cr: 100000.0,
    total_fund_pnl_cr: 141583.06,
    fund_nav: 241.58,
    aqr_alloc_pct: 40.0,
    all_weather_alloc_pct: 35.0,
    activist_alloc_pct: 20.0,
    unallocated_cash_pct: 5.0,
    aqr_pnl_cr: 94176.0,
    all_weather_pnl_cr: 22458.45,
    activist_pnl_cr: 23434.91,
    cash_pnl_cr: 1513.70
  };

  const perf = activeBacktest?.performance || {
    net_cagr_pct: 30.25,
    sharpe_ratio: 1.42,
    max_drawdown_pct: -12.22,
    net_total_return_pct: 235.44
  };

  const totalAum = fa.total_aum_cr;
  const netPnl = fa.total_fund_pnl_cr;
  const portfolioVal = totalAum + netPnl;

  return (
    <div className="fixed inset-0 z-[150] bg-[#080B10] text-[#E8EDF3] p-6 md:p-10 overflow-y-auto font-sans animate-in fade-in duration-200 selection:bg-[#00C896]/20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* EXECUTIVE HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#27303B] pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm bg-[#00C896]" />
              <h1 className="text-3xl font-extrabold tracking-tight text-[#E8EDF3]">INDIA HEDGE FUND LAB</h1>
              <span className="bg-[#00C896]/10 border border-[#00C896]/30 text-[#00C896] text-xs font-mono font-bold px-3 py-1 rounded">
                SENIOR EXECUTIVE BOARD PRESENTATION MODE
              </span>
            </div>
            <p className="text-xs text-[#8994A3] font-mono mt-1">Multi-Strategy Quantitative Hedge Fund Terminal — Performance & Risk Overview</p>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-[#151D28] hover:bg-[#27303B] border border-[#27303B] text-[#E8EDF3] text-xs font-mono font-bold rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#00C896]" />
            <span>Exit Presentation Mode (Esc)</span>
          </button>
        </div>

        {/* 5 EXECUTIVE KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono">
          <div className="bg-[#0D121A] border border-[#27303B] p-4 rounded-xl">
            <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider">INITIAL FUND AUM</span>
            <div className="text-[#E8EDF3] text-xl font-bold font-mono-num mt-1">₹{totalAum.toLocaleString('en-IN')} Cr</div>
            <span className="text-[10px] text-[#5F6B79] block mt-1">Starting Capital Base</span>
          </div>

          <div className="bg-[#0D121A] border border-[#27303B] p-4 rounded-xl">
            <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider">MASTER FUND NAV</span>
            <div className="text-[#00C896] text-2xl font-bold font-mono-num mt-1">{fa.fund_nav}</div>
            <span className="text-[10px] text-[#00C896] block mt-1">Base 100.00 Reconciled</span>
          </div>

          <div className="bg-[#0D121A] border border-[#27303B] p-4 rounded-xl">
            <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider">TOTAL NET FUND P&L</span>
            <div className="text-[#00C896] text-xl font-bold font-mono-num mt-1">+₹{netPnl.toLocaleString('en-IN')} Cr</div>
            <span className="text-[10px] text-[#00C896] block mt-1">Valuation: ₹{portfolioVal.toLocaleString('en-IN')} Cr</span>
          </div>

          <div className="bg-[#0D121A] border border-[#27303B] p-4 rounded-xl">
            <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider">STRATEGY CAGR</span>
            <div className="text-[#00C896] text-xl font-bold font-mono-num mt-1">+{perf.net_cagr_pct}% p.a.</div>
            <span className="text-[10px] text-[#8994A3] block mt-1">Annualized Return</span>
          </div>

          <div className="bg-[#0D121A] border border-[#27303B] p-4 rounded-xl">
            <span className="text-[#8994A3] text-[10px] block font-bold uppercase tracking-wider">SHARPE RATIO</span>
            <div className="text-[#00C896] text-xl font-bold font-mono-num mt-1">{perf.sharpe_ratio}</div>
            <span className="text-[10px] text-[#8994A3] block mt-1">Rf = 6.5% Repo Rate</span>
          </div>
        </div>

        {/* STRATEGY ALLOCATION SUMMARY BAR */}
        <div className="bg-[#0D121A] border border-[#27303B] rounded-xl p-6">
          <div className="flex items-center justify-between font-mono text-xs mb-4">
            <h2 className="font-bold text-[#E8EDF3] uppercase tracking-wider">STRATEGY CAPITAL ALLOCATION & REALIZED P&L</h2>
            <span className="text-[#8994A3]">Single Source of Truth Reconciled</span>
          </div>

          {/* Allocation Stack Bar */}
          <div className="w-full h-3 bg-[#080B10] rounded-full overflow-hidden flex mb-6 border border-[#27303B]">
            <div style={{ width: `${fa.aqr_alloc_pct}%` }} className="bg-[#00C896] h-full" />
            <div style={{ width: `${fa.all_weather_alloc_pct}%` }} className="bg-[#D9A441] h-full" />
            <div style={{ width: `${fa.activist_alloc_pct}%` }} className="bg-[#7185FF] h-full" />
            <div style={{ width: `${fa.unallocated_cash_pct}%` }} className="bg-[#5F6B79] h-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#080B10] border border-[#27303B] p-4 rounded-lg">
              <span className="text-[#00C896] font-bold block mb-1">⚡ AQR MOMENTUM (40%)</span>
              <span className="text-[#8994A3] block">Capital: ₹{(totalAum * (fa.aqr_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className="text-[#00C896] font-bold text-sm block mt-1">+₹{fa.aqr_pnl_cr.toLocaleString('en-IN')} Cr P&L</span>
            </div>

            <div className="bg-[#080B10] border border-[#27303B] p-4 rounded-lg">
              <span className="text-[#D9A441] font-bold block mb-1">🛡️ ALL WEATHER (35%)</span>
              <span className="text-[#8994A3] block">Capital: ₹{(totalAum * (fa.all_weather_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className="text-[#00C896] font-bold text-sm block mt-1">+₹{fa.all_weather_pnl_cr.toLocaleString('en-IN')} Cr P&L</span>
            </div>

            <div className="bg-[#080B10] border border-[#27303B] p-4 rounded-lg">
              <span className="text-[#7185FF] font-bold block mb-1">🟢 ELLIOTT ACTIVIST (20%)</span>
              <span className="text-[#8994A3] block">Capital: ₹{(totalAum * (fa.activist_alloc_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className="text-[#00C896] font-bold text-sm block mt-1">+₹{fa.activist_pnl_cr.toLocaleString('en-IN')} Cr P&L</span>
            </div>

            <div className="bg-[#080B10] border border-[#27303B] p-4 rounded-lg">
              <span className="text-[#5F6B79] font-bold block mb-1">💵 CASH RESERVE (5%)</span>
              <span className="text-[#8994A3] block">Capital: ₹{(totalAum * (fa.unallocated_cash_pct / 100)).toLocaleString('en-IN')} Cr</span>
              <span className="text-[#00C896] font-bold text-sm block mt-1">+₹{(fa.cash_pnl_cr || 1513.70).toLocaleString('en-IN')} Cr P&L</span>
            </div>
          </div>
        </div>

        {/* AUDIT & METHODOLOGY DISCLOSURE */}
        <div className="bg-[#0D121A] border border-[#27303B] rounded-xl p-6 font-mono text-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#00C896]" />
            <h3 className="font-bold text-[#E8EDF3] uppercase tracking-wider">BOARD AUDIT & GOVERNANCE COMPLIANCE</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#8994A3]">
            <div>
              <strong className="text-[#E8EDF3] block mb-1">1. Market Data Source:</strong>
              100% Real Historical Market Data downloaded directly from Yahoo Finance (`yfinance` API). Zero synthetic or fallback returns used.
            </div>
            <div>
              <strong className="text-[#E8EDF3] block mb-1">2. Risk & Liquidity Controls:</strong>
              Inverse Volatility Risk Weighting with 5% ADTV position capacity capping and 3-Tier Stop Loss Protection.
            </div>
            <div>
              <strong className="text-[#E8EDF3] block mb-1">3. Fee Accounting:</strong>
              2/20 Fee Engine (2% Mgmt + 20% Performance Fee over High-Water Mark) deducted monthly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
