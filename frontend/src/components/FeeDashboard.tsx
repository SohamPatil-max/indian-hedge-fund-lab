import React from 'react';
import { FeeBreakdown } from '../types';
import { DollarSign, ShieldAlert, Award, TrendingUp, Info } from 'lucide-react';

interface Props {
  totalAumCr?: number;
  fees?: FeeBreakdown;
  grossReturnPct?: number;
  netReturnPct?: number;
  isNetView: boolean;
  setIsNetView: (val: boolean) => void;
}

export const FeeDashboard: React.FC<Props> = ({
  totalAumCr = 100000.0,
  fees,
  grossReturnPct = 30.25,
  netReturnPct = 25.12,
  isNetView,
  setIsNetView,
}) => {
  // Current AUM dynamically determined from backend fees payload or totalAumCr prop
  const currentAumCr = (fees as any)?.current_aum_cr || totalAumCr;
  
  const defaultFees: FeeBreakdown = {
    management_fee_pct: 2.0,
    performance_fee_pct: 20.0,
    annual_mgmt_fee_est: (currentAumCr * 0.02) * 10000000.0,
    monthly_mgmt_fee_est: (currentAumCr * 0.02 / 12.0) * 10000000.0,
    cumulative_mgmt_fees_inr: (currentAumCr * 0.02 * 2.5) * 10000000.0,
    cumulative_perf_fees_inr: (currentAumCr * (Math.max(0, netReturnPct) / 100.0) * 0.20) * 10000000.0,
    total_fees_paid_inr: (currentAumCr * (0.02 * 2.5 + (Math.max(0, netReturnPct) / 100.0) * 0.20)) * 10000000.0,
    high_water_mark_inr: (currentAumCr * (1.0 + Math.max(0, netReturnPct) / 100.0)) * 10000000.0,
  };

  const feeData = fees || defaultFees;

  // Management Fee = 2% per annum x ACTUAL CURRENT AUM
  const annualMgmtInr = feeData.annual_mgmt_fee_est || (currentAumCr * 0.02 * 10000000.0);
  const monthlyMgmtInr = feeData.monthly_mgmt_fee_est || (annualMgmtInr / 12.0);

  const annualMgmtCr = annualMgmtInr / 10000000.0;
  const monthlyMgmtCr = monthlyMgmtInr / 10000000.0;

  const cumMgmtCr = feeData.cumulative_mgmt_fees_inr / 10000000.0;
  const cumPerfCr = feeData.cumulative_perf_fees_inr / 10000000.0;
  const totalFeesCr = feeData.total_fees_paid_inr / 10000000.0;
  const hwmCr = feeData.high_water_mark_inr / 10000000.0;
  const isHwmBreached = cumPerfCr > 0;

  return (
    <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5 text-[#E8EDF3] font-mono text-xs shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#111823] border border-[#27303B] rounded">
            <DollarSign className="w-4 h-4 text-[#00C896]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#E8EDF3] tracking-wide flex items-center gap-2">
              <span>HEDGE FUND FEE STRUCTURE — 2/20 MODEL</span>
              <span className="bg-[#111823] border border-[#27303B] text-[#00C896] text-[10px] px-2 py-0.5 rounded font-bold font-mono-num">
                CURRENT AUM: ₹{currentAumCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
              </span>
            </h3>
            <p className="text-[11px] text-[#8994A3] font-sans">
              2.0% Annual Management Fee on Actual Current AUM (Deducted Monthly) + 20.0% Performance Fee on Net Profits (HWM Enforced)
            </p>
          </div>
        </div>

        {/* View Toggle: Gross vs Net Investor Performance */}
        <div className="flex items-center bg-[#080B10] border border-[#27303B] rounded p-0.5 font-mono text-xs">
          <button
            onClick={() => setIsNetView(false)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              !isNetView ? 'bg-[#007A5E] text-white font-bold' : 'text-[#8994A3] hover:text-[#E8EDF3]'
            }`}
          >
            GROSS PORTFOLIO
          </button>
          <button
            onClick={() => setIsNetView(true)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
              isNetView ? 'bg-[#151D28] border border-[#364150] text-[#00C896] font-bold' : 'text-[#8994A3] hover:text-[#E8EDF3]'
            }`}
          >
            NET INVESTOR (AFTER 2/20)
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Management Fee Card */}
        <div className="bg-[#080B10] p-4 rounded-lg border border-[#27303B]">
          <span className="text-[#8994A3] text-[10px] block font-semibold uppercase tracking-wider">MANAGEMENT FEE (2% P.A. ON CURRENT AUM)</span>
          <div className="text-[#E8EDF3] font-bold text-lg font-mono-num mt-1">
            ₹{monthlyMgmtCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr <span className="text-xs text-[#5F6B79] font-normal">/ mo</span>
          </div>
          <span className="text-[11px] text-[#5F6B79] block mt-1 font-mono-num">
            Annualized: ₹{annualMgmtCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
          </span>
        </div>

        {/* Performance Fee Card */}
        <div className="bg-[#080B10] p-4 rounded-lg border border-[#27303B]">
          <span className="text-[#8994A3] text-[10px] block font-semibold uppercase tracking-wider">PERFORMANCE FEE (20% PROFIT)</span>
          <div className="text-[#00C896] font-bold text-lg font-mono-num mt-1">
            20.0% <span className="text-xs text-[#8994A3] font-normal">above HWM</span>
          </div>
          <span className="text-[11px] text-[#5F6B79] block mt-1 font-mono-num">
            Cum Perf Fees: ₹{cumPerfCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
          </span>
        </div>

        {/* High-Water Mark Card */}
        <div className="bg-[#080B10] p-4 rounded-lg border border-[#27303B]">
          <span className="text-[#8994A3] text-[10px] block font-semibold uppercase tracking-wider">HIGH-WATER MARK (HWM)</span>
          <div className="text-[#D9A441] font-bold text-lg font-mono-num mt-1">
            ₹{hwmCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
          </div>
          <span className="text-[11px] text-[#5F6B79] block mt-1">
            {isHwmBreached ? 'HWM Breached — Fee Eligible' : 'Below Peak — 0 Fee Charged'}
          </span>
        </div>

        {/* Cumulative Total Fees Paid */}
        <div className="bg-[#080B10] p-4 rounded-lg border border-[#27303B]">
          <span className="text-[#8994A3] text-[10px] block font-semibold uppercase tracking-wider">TOTAL FEES CHARGED</span>
          <div className="text-[#FF5C6C] font-bold text-lg font-mono-num mt-1">
            ₹{totalFeesCr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
          </div>
          <span className="text-[11px] text-[#5F6B79] block mt-1 font-mono-num">
            Impact: {(grossReturnPct - netReturnPct).toFixed(2)}% Return Difference
          </span>
        </div>
      </div>
    </div>
  );
};
