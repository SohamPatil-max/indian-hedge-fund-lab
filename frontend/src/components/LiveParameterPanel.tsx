import React from 'react';
import { Sliders, RefreshCw, Layers, ShieldAlert, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export interface BacktestParams {
  strategy_key: string;
  total_aum_cr: float;
  aqr_alloc_pct: float;
  all_weather_alloc_pct: float;
  activist_alloc_pct: float;
  start_date: string;
  end_date: string;
  rebalance_freq: string;
  transaction_cost_pct: float;
  slippage_pct: float;
  mgmt_fee_pct: float;
  perf_fee_pct: float;
  max_position_size_pct: float;
  momentum_lookback_months: int;
  exclusion_months: int;
  top_percentile: float;
  growth_lookback_months: int;
  inflation_lookback_months: int;
  target_risk_pct: float;
  min_val_score: float;
  min_qual_score: float;
  min_upside_pct: float;
  enable_3tier_stop_loss?: boolean;
}

type float = number;
type int = number;

export const DEFAULT_PARAMS: BacktestParams = {
  strategy_key: 'AQR_MOMENTUM',
  total_aum_cr: 100000.0,      // Default ₹1,00,000 Cr Total AUM
  aqr_alloc_pct: 40.0,         // 40% Allocation
  all_weather_alloc_pct: 35.0, // 35% Allocation
  activist_alloc_pct: 20.0,    // 20% Allocation
  start_date: '2021-01-01',
  end_date: '2026-08-01',
  rebalance_freq: 'Quarterly',
  transaction_cost_pct: 0.10,
  slippage_pct: 0.05,
  mgmt_fee_pct: 2.0,
  perf_fee_pct: 20.0,
  max_position_size_pct: 8.0,
  momentum_lookback_months: 12,
  exclusion_months: 1,
  top_percentile: 33.0,
  growth_lookback_months: 6,
  inflation_lookback_months: 6,
  target_risk_pct: 7.5,
  min_val_score: 55.0,
  min_qual_score: 55.0,
  min_upside_pct: 15.0,
  enable_3tier_stop_loss: true,
};

interface Props {
  params: BacktestParams;
  onChangeParams: (newParams: BacktestParams) => void;
  onRunBacktest: () => void;
  running: boolean;
  runId?: string;
  lastCalculated?: string;
}

export const LiveParameterPanel: React.FC<Props> = ({
  params,
  onChangeParams,
  onRunBacktest,
  running,
  runId,
  lastCalculated,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const totalAllocPct = Number((params.aqr_alloc_pct + params.all_weather_alloc_pct + params.activist_alloc_pct).toFixed(2));
  const unallocatedCashPct = Number((100.0 - totalAllocPct).toFixed(2));
  const isAllocationExceeded = totalAllocPct > 100.0;

  const updateParam = (key: keyof BacktestParams, val: any) => {
    onChangeParams({
      ...params,
      [key]: val,
    });
  };

  const handleResetDefaults = () => {
    onChangeParams(DEFAULT_PARAMS);
  };

  return (
    <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5 font-sans shadow-md space-y-5 text-xs text-[#E8EDF3]">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1F2937] pb-3">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-[#00C896]" />
          <div>
            <h2 className="text-sm font-bold text-[#E8EDF3] tracking-tight font-sans">
              Hedge Fund Research Workstation
            </h2>
            <p className="text-[11px] text-[#8994A3]">
              Single source of truth parameter engine — live re-simulation on parameter updates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {runId && (
            <div className="text-[11px] text-[#8994A3] font-mono hidden md:block">
              RUN: <strong className="text-[#E8EDF3] font-mono-num">{runId}</strong>
            </div>
          )}

          <button
            onClick={handleResetDefaults}
            className="btn-secondary px-2.5 py-1 rounded text-xs flex items-center gap-1.5 text-[#8994A3] hover:text-[#E8EDF3]"
            title="Reset parameters to ₹1,00,000 Cr defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-secondary px-2.5 py-1 rounded text-xs flex items-center gap-1 text-[#8994A3] hover:text-[#E8EDF3]"
          >
            <span>{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* PRIMARY ACTION BUTTON */}
          <button
            onClick={onRunBacktest}
            disabled={running || isAllocationExceeded}
            className={`flex items-center gap-2 px-4 py-1.5 rounded font-semibold transition-all shadow-sm ${
              isAllocationExceeded
                ? 'bg-[#151D28] text-[#5F6B79] border border-[#27303B] cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'RECALCULATING...' : 'RUN BACKTEST'}</span>
          </button>
        </div>
      </div>

      {/* 1. TOTAL FUND AUM & STRATEGY ALLOCATION (PROMINENT TOP SECTION) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8994A3]">TOTAL FUND AUM</span>
            <div className="text-xl font-extrabold text-[#E8EDF3] font-mono-num mt-0.5 flex items-center gap-2">
              <span>₹{params.total_aum_cr.toLocaleString('en-IN')} Cr</span>
              <span className="text-xs text-[#8994A3] font-sans font-normal">(Total Hedge Fund Capital)</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[#8994A3]">Deployed: </span>
              <strong className={isAllocationExceeded ? 'text-[#FF5C6C] font-mono-num' : 'text-[#00C896] font-mono-num'}>
                {totalAllocPct}%
              </strong>
            </div>
            <div>
              <span className="text-[#8994A3]">Cash: </span>
              <strong className="text-[#D9A441] font-mono-num">
                {unallocatedCashPct >= 0 ? unallocatedCashPct : 0}%
              </strong>
            </div>
          </div>
        </div>

        {/* Thin, Elegant Allocation Progress Bar */}
        <div className="h-2 w-full bg-[#080B10] rounded-full overflow-hidden flex border border-[#1F2937]">
          <div style={{ width: `${Math.min(params.aqr_alloc_pct, 100)}%` }} className="bg-[#00C896]" title={`AQR Momentum: ${params.aqr_alloc_pct}%`} />
          <div style={{ width: `${Math.min(params.all_weather_alloc_pct, 100)}%` }} className="bg-[#D9A441]" title={`All Weather: ${params.all_weather_alloc_pct}%`} />
          <div style={{ width: `${Math.min(params.activist_alloc_pct, 100)}%` }} className="bg-[#7185FF]" title={`Elliott Activist: ${params.activist_alloc_pct}%`} />
          {unallocatedCashPct > 0 && (
            <div style={{ width: `${unallocatedCashPct}%` }} className="bg-[#475569]" title={`Cash: ${unallocatedCashPct}%`} />
          )}
        </div>

        {/* Allocation Breach Error Banner */}
        {isAllocationExceeded && (
          <div className="error-banner p-3 rounded text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF5C6C] shrink-0" />
            <div>
              <strong className="font-bold block font-sans">Hard Allocation Limit Breached ({totalAllocPct}%)</strong>
              <span className="text-xs text-[#8994A3] font-sans">
                Sum of strategy allocations must not exceed 100%. Adjust strategy sliders below to resume backtesting.
              </span>
            </div>
          </div>
        )}

        {/* Strategy Allocation Breakdown Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          {/* Total AUM Input */}
          <div className="bg-[#080B10] p-2.5 rounded border border-[#1F2937]">
            <label className="text-[#8994A3] text-[10px] block font-semibold uppercase mb-1">Total AUM (₹ Cr)</label>
            <input
              type="number"
              value={params.total_aum_cr}
              onChange={(e) => updateParam('total_aum_cr', parseFloat(e.target.value) || 0)}
              className="terminal-input w-full px-2 rounded font-bold font-mono-num text-xs text-[#00C896]"
            />
          </div>

          {/* AQR Slider */}
          <div className="bg-[#080B10] p-2.5 rounded border border-[#1F2937]">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#00C896] font-semibold">AQR MOMENTUM</span>
              <span className="text-[#E8EDF3] font-mono-num font-bold">{params.aqr_alloc_pct}% <span className="text-[#5F6B79] font-normal">(₹{(params.total_aum_cr * params.aqr_alloc_pct / 100).toLocaleString('en-IN')} Cr)</span></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={params.aqr_alloc_pct}
              onChange={(e) => updateParam('aqr_alloc_pct', parseFloat(e.target.value))}
              className="w-full accent-[#00C896] cursor-pointer h-1.5"
            />
          </div>

          {/* All Weather Slider */}
          <div className="bg-[#080B10] p-2.5 rounded border border-[#1F2937]">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#D9A441] font-semibold">ALL WEATHER</span>
              <span className="text-[#E8EDF3] font-mono-num font-bold">{params.all_weather_alloc_pct}% <span className="text-[#5F6B79] font-normal">(₹{(params.total_aum_cr * params.all_weather_alloc_pct / 100).toLocaleString('en-IN')} Cr)</span></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={params.all_weather_alloc_pct}
              onChange={(e) => updateParam('all_weather_alloc_pct', parseFloat(e.target.value))}
              className="w-full accent-[#D9A441] cursor-pointer h-1.5"
            />
          </div>

          {/* Elliott Activist Slider */}
          <div className="bg-[#080B10] p-2.5 rounded border border-[#1F2937]">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#7185FF] font-semibold">ACTIVIST</span>
              <span className="text-[#E8EDF3] font-mono-num font-bold">{params.activist_alloc_pct}% <span className="text-[#5F6B79] font-normal">(₹{(params.total_aum_cr * params.activist_alloc_pct / 100).toLocaleString('en-IN')} Cr)</span></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={params.activist_alloc_pct}
              onChange={(e) => updateParam('activist_alloc_pct', parseFloat(e.target.value))}
              className="w-full accent-[#7185FF] cursor-pointer h-1.5"
            />
          </div>
        </div>
      </div>

      {/* 2. RESEARCH PANEL WITH SUBTLE SECTION DIVIDERS */}
      {isOpen && (
        <div className="border-t border-[#1F2937] pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Section 1: Target Strategy & Portfolio Rules */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider font-sans">
                Target Strategy & Rules
              </h3>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">ACTIVE STRATEGY</label>
                <select
                  value={params.strategy_key}
                  onChange={(e) => updateParam('strategy_key', e.target.value)}
                  className="terminal-input w-full px-2 rounded text-xs"
                >
                  <option value="AQR_MOMENTUM">AQR Momentum — India</option>
                  <option value="ALL_WEATHER">Bridgewater All Weather</option>
                  <option value="ACTIVIST_EVENT">Elliott Activist / Event-Driven</option>
                </select>
              </div>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">REBALANCE FREQUENCY</label>
                <select
                  value={params.rebalance_freq}
                  onChange={(e) => updateParam('rebalance_freq', e.target.value)}
                  className="terminal-input w-full px-2 rounded text-xs"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly (Recommended)</option>
                  <option value="Semi-Annually">Semi-Annually</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">MAX POSITION LIMIT (% AUM)</label>
                <input
                  type="number"
                  step="0.5"
                  value={params.max_position_size_pct}
                  onChange={(e) => updateParam('max_position_size_pct', parseFloat(e.target.value))}
                  className="terminal-input w-full px-2 rounded text-xs font-mono-num font-bold text-[#E8EDF3]"
                />
              </div>
            </div>

            {/* Section 2: Backtest Horizon & Frictions */}
            <div className="space-y-2.5 md:border-l md:border-[#1F2937] md:pl-5">
              <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider font-sans">
                Horizon & Frictions
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8994A3] text-[10px] block mb-1">START DATE</label>
                  <input
                    type="date"
                    value={params.start_date}
                    onChange={(e) => updateParam('start_date', e.target.value)}
                    className="terminal-input w-full px-2 rounded text-xs font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-[#8994A3] text-[10px] block mb-1">END DATE</label>
                  <input
                    type="date"
                    value={params.end_date}
                    onChange={(e) => updateParam('end_date', e.target.value)}
                    className="terminal-input w-full px-2 rounded text-xs font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">STT / BROKERAGE (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.transaction_cost_pct}
                  onChange={(e) => updateParam('transaction_cost_pct', parseFloat(e.target.value))}
                  className="terminal-input w-full px-2 rounded text-xs font-mono-num"
                />
              </div>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">SLIPPAGE COST (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.slippage_pct}
                  onChange={(e) => updateParam('slippage_pct', parseFloat(e.target.value))}
                  className="terminal-input w-full px-2 rounded text-xs font-mono-num"
                />
              </div>
            </div>

            {/* Section 3: Hedge Fund 2/20 Fee Model */}
            <div className="space-y-2.5 md:border-l md:border-[#1F2937] md:pl-5">
              <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider font-sans">
                2/20 Fee Model
              </h3>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">MANAGEMENT FEE (% ANNUAL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.mgmt_fee_pct}
                  onChange={(e) => updateParam('mgmt_fee_pct', parseFloat(e.target.value))}
                  className="terminal-input w-full px-2 rounded text-xs font-mono-num text-[#00C896] font-bold"
                />
              </div>

              <div>
                <label className="text-[#8994A3] text-[10px] block mb-1">PERFORMANCE FEE (% PROFIT)</label>
                <input
                  type="number"
                  step="1.0"
                  value={params.perf_fee_pct}
                  onChange={(e) => updateParam('perf_fee_pct', parseFloat(e.target.value))}
                  className="terminal-input w-full px-2 rounded text-xs font-mono-num text-[#00C896] font-bold"
                />
              </div>

              <p className="text-[10px] text-[#5F6B79]">
                High-Water Mark (HWM) protection enforced above peak NAV.
              </p>
            </div>

            {/* Section 4: Strategy Tuning Sliders */}
            <div className="space-y-2.5 md:border-l md:border-[#1F2937] md:pl-5">
              <h3 className="text-xs font-bold text-[#8994A3] uppercase tracking-wider font-sans">
                Strategy Tuning
              </h3>

              {params.strategy_key === 'AQR_MOMENTUM' && (
                <>
                  <div className="bg-[#0E1522] border border-emerald-800/60 p-2.5 rounded-lg mb-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`w-4 h-4 ${params.enable_3tier_stop_loss ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">3-TIER HF STOP LOSS</span>
                          <span className="text-[9px] text-emerald-400/90 block">2.5x ATR + 45d Time + -8% Circuit Breaker</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={params.enable_3tier_stop_loss || false}
                        onChange={(e) => updateParam('enable_3tier_stop_loss', e.target.checked)}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#8994A3] mb-1">
                      <span>MOMENTUM LOOKBACK</span>
                      <span className="text-[#E8EDF3] font-mono-num font-bold">{params.momentum_lookback_months} Months</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="24"
                      value={params.momentum_lookback_months}
                      onChange={(e) => updateParam('momentum_lookback_months', parseInt(e.target.value))}
                      className="w-full accent-[#00C896] h-1.5"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#8994A3] mb-1">
                      <span>EXCLUSION PERIOD</span>
                      <span className="text-[#E8EDF3] font-mono-num font-bold">{params.exclusion_months} Month</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={params.exclusion_months}
                      onChange={(e) => updateParam('exclusion_months', parseInt(e.target.value))}
                      className="w-full accent-[#00C896] h-1.5"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-[#8994A3] mb-1">
                      <span>TOP UNIVERSE CUTOFF</span>
                      <span className="text-[#00C896] font-mono-num font-bold">{params.top_percentile}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={params.top_percentile}
                      onChange={(e) => updateParam('top_percentile', parseFloat(e.target.value))}
                      className="w-full accent-[#00C896] h-1.5"
                    />
                  </div>
                </>
              )}

              {params.strategy_key === 'ALL_WEATHER' && (
                <>
                  <div>
                    <div className="flex justify-between text-[10px] text-[#8994A3] mb-1">
                      <span>TARGET VOLATILITY</span>
                      <span className="text-[#D9A441] font-mono-num font-bold">{params.target_risk_pct}%</span>
                    </div>
                    <input
                      type="range"
                      min="4.0"
                      max="15.0"
                      step="0.5"
                      value={params.target_risk_pct}
                      onChange={(e) => updateParam('target_risk_pct', parseFloat(e.target.value))}
                      className="w-full accent-[#D9A441] h-1.5"
                    />
                  </div>
                </>
              )}

              {params.strategy_key === 'ACTIVIST_EVENT' && (
                <>
                  <div>
                    <div className="flex justify-between text-[10px] text-[#8994A3] mb-1">
                      <span>MIN VALUATION SCORE</span>
                      <span className="text-[#7185FF] font-mono-num font-bold">{params.min_val_score}</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="80"
                      value={params.min_val_score}
                      onChange={(e) => updateParam('min_val_score', parseFloat(e.target.value))}
                      className="w-full accent-[#7185FF] h-1.5"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
