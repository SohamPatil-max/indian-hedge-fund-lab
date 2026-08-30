import React, { useEffect, useState } from 'react';
import { MethodologyCard } from '../components/MethodologyCard';
import { ThesisCardModal } from '../components/ThesisCardModal';
import { ThesisCardData } from '../types';
import { Activity, Flame, ShieldAlert, Target, Award, Search, Filter, ChevronRight } from 'lucide-react';

export const ActivistPage: React.FC = () => {
  const [data, setData] = useState<{
    framework: any;
    qualified_count: number;
    candidates: ThesisCardData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterQualified, setFilterQualified] = useState(true);
  const [selectedThesisModal, setSelectedThesisModal] = useState<ThesisCardData | null>(null);

  useEffect(() => {
    fetch('/api/strategy/activist')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activist fetch error:', err);
        setLoading(false);
      });
  }, []);

  const candidateList = data?.candidates || [];
  const filteredCandidates = candidateList.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase()) ||
      (item.catalyst_details?.type || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterQualified ? item.status === 'QUALIFIED CANDIDATE' : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-400" />
          <span>Elliott-Inspired Activist / Event-Driven — India</span>
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Fundamental stock scoring combined with corporate catalyst identification for individual Indian companies
        </p>
      </div>

      {/* Methodology Card */}
      <MethodologyCard
        title="Activist & Event-Driven Investment Methodology"
        subtitle="Asymmetric Risk/Reward Stock Selection with Corporate Value Unlock Catalysts"
        disclaimer={data?.framework?.disclaimer || "Point-in-time price relative screening & real volume surge event identification."}
        formula="Candidate Qualification = Undervalued + High Business Quality + Identifiable Catalyst + Risk/Reward > 2.0x"
        rules={[
          "Screen Indian equity universe across 3 quantitative pillars: Valuation, Quality, and Catalyst Potential.",
          "Valuation Scoring: Discounted P/E, P/B, EV/EBITDA, and positive Free Cash Flow Yield.",
          "Quality Scoring: High Return on Equity (ROE > 12%), ROCE > 14%, low Debt-to-Equity (< 1.2x).",
          "Identify Corporate Catalysts: Demergers, Asset Sales, Buybacks, Debt Reduction, Restructuring.",
          "Construct Asymmetric Risk/Reward Thesis Cards requiring > 2.0x upside to downside ratio.",
          "Enforce strict thesis invalidation stop loss levels and fair value target exit triggers."
        ]}
      />

      {/* Entry vs Exit Decision Framework Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-1.5 border-b border-gray-800 pb-2">
            <Target className="w-4 h-4" />
            <span>Investment Entry Decision Framework</span>
          </h4>
          <ul className="space-y-1.5 text-gray-300 text-[11px]">
            {(data?.framework?.entry_framework || [
              "1. Screen 100 NSE Equities for Valuation Discount & Quality Support",
              "2. Detect Real Volume Surge Catalysts (>2.5x 6M Avg)",
              "3. Enforce Asymmetric Risk/Reward Ratio (>2.0x)"
            ]).map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <h4 className="text-rose-400 font-bold mb-2 flex items-center gap-1.5 border-b border-gray-800 pb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Investment Exit & Invalidation Framework</span>
          </h4>
          <ul className="space-y-1.5 text-gray-300 text-[11px]">
            {(data?.framework?.exit_framework || [
              "1. Target Price Reached (Valuation Re-rating)",
              "2. Thesis Invalidation (Catalyst Fails to Materialize)",
              "3. Quarterly Rebalance Exit"
            ]).map((step: string, idx: number) => (
              <li key={idx} className="flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 border border-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search stock symbol, name, catalyst..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-600 w-full"
            />
          </div>
          <button
            onClick={() => setFilterQualified(!filterQualified)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-all ${
              filterQualified
                ? 'bg-indigo-950 border-indigo-600 text-indigo-300'
                : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterQualified ? 'Qualified Candidates Only' : 'Show All Screened'}</span>
          </button>
        </div>

        <div className="font-mono text-xs text-gray-400">
          Qualified Candidates: <span className="text-indigo-400 font-bold">{data?.qualified_count || 0}</span> / {candidateList.length} Companies
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map((item) => (
          <div
            key={item.symbol}
            className={`bg-gray-900 border rounded-lg p-5 flex flex-col justify-between transition-all hover:border-indigo-500 ${
              item.status === 'QUALIFIED CANDIDATE'
                ? 'border-indigo-800/80 shadow-md shadow-indigo-950/30'
                : 'border-gray-800 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-mono">{item.symbol.replace('.NS', '')}</h3>
                  <span className="text-[10px] font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                    {item.sector}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    item.status === 'QUALIFIED CANDIDATE'
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : 'bg-gray-950 border-gray-800 text-gray-500'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-3">{item.name}</p>

              {/* Three Pillar Scores */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs mb-4 text-center">
                <div className="bg-gray-950 p-2 rounded border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">Valuation</span>
                  <span className="text-indigo-400 font-bold font-mono-num">{item.scores.valuation}</span>
                </div>
                <div className="bg-gray-950 p-2 rounded border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">Quality</span>
                  <span className="text-cyan-400 font-bold font-mono-num">{item.scores.quality}</span>
                </div>
                <div className="bg-gray-950 p-2 rounded border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">Catalyst</span>
                  <span className="text-amber-400 font-bold font-mono-num">{item.scores.catalyst}</span>
                </div>
              </div>

              {/* Catalyst Banner */}
              <div className="bg-gray-950 border border-gray-800 rounded p-2.5 mb-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Identified Catalyst</span>
                </div>
                <div className="text-white font-bold">{item.catalyst_details.type}</div>
              </div>
            </div>

            {/* Asymmetric Risk / Reward Footer */}
            <div className="pt-3 border-t border-gray-800 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-[10px] block">Risk / Reward</span>
                <span className="text-emerald-400 font-bold font-mono-num">{item.risk_reward_ratio}x</span>
              </div>
              <button
                onClick={() => setSelectedThesisModal(item)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all flex items-center gap-1"
              >
                <span>Inspect Thesis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Thesis Card Modal */}
      <ThesisCardModal
        thesis={selectedThesisModal}
        onClose={() => setSelectedThesisModal(null)}
      />
    </div>
  );
};
