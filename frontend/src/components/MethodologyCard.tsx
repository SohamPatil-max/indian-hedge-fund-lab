import React from 'react';
import { BookOpen, Info, ShieldAlert } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  disclaimer?: string;
  formula?: string;
  rules: string[];
}

export const MethodologyCard: React.FC<Props> = ({
  title,
  subtitle,
  disclaimer,
  formula,
  rules,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 mb-6 text-gray-200 shadow-md">
      <div className="flex items-start justify-between border-b border-gray-800 pb-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>{title}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 px-2.5 py-1 rounded">
          TRANSPARENT QUANT METHODOLOGY
        </span>
      </div>

      {disclaimer && (
        <div className="bg-amber-950/50 border border-amber-800/60 rounded p-3 mb-4 text-xs text-amber-300 flex items-start gap-2 font-mono">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{disclaimer}</span>
        </div>
      )}

      {formula && (
        <div className="bg-gray-950 border border-gray-800 rounded p-3 mb-4 font-mono text-xs">
          <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1">
            Mathematical Signal Definition
          </span>
          <div className="text-emerald-400 font-bold text-sm tracking-wide">{formula}</div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Rules & Flow</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-gray-950/60 border border-gray-800/80 rounded p-2.5 text-gray-300 flex items-start gap-2"
            >
              <span className="bg-gray-800 text-gray-400 text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="leading-snug">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
