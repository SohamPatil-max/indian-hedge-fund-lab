import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { TradeRecord } from '../types';

interface Props {
  strategyLabel?: string;
  backtestData?: any;
  trades?: TradeRecord[];
}

export const ExportDataControl: React.FC<Props> = ({
  strategyLabel = 'hedge_fund',
  backtestData,
  trades,
}) => {
  const [strategyFilter, setStrategyFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [winLossFilter, setWinLossFilter] = useState('ALL');
  const [symbolFilter, setSymbolFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [exporting, setExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportCSV = async (downloadAll = false) => {
    setExporting(true);
    setStatusMessage("Preparing export...");
    setIsError(false);

    try {
      const payload = {
        strategy_label: strategyLabel,
        trades: trades || [],
        strategy_filter: downloadAll ? 'ALL' : strategyFilter,
        action_filter: downloadAll ? 'ALL' : actionFilter,
        win_loss_filter: downloadAll ? 'ALL' : winLossFilter,
        symbol_filter: downloadAll ? '' : symbolFilter,
        start_date: downloadAll ? '' : startDate,
        end_date: downloadAll ? '' : endDate,
      };

      const res = await fetch('/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Export validation failed — data mismatch detected.");
      }

      const blob = await res.blob();
      const todayStr = new Date().toISOString().split('T')[0];
      const filename = downloadAll
        ? `hedge_fund_trade_journal_${todayStr}.csv`
        : `hedge_fund_${strategyFilter !== 'ALL' ? strategyFilter : 'filtered'}_trades_${todayStr}.csv`;

      triggerDownload(blob, filename);
      setStatusMessage("Export complete");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Export CSV error:', err);
      setIsError(true);
      setStatusMessage(err.message || "Export failed — please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async (downloadAll = false) => {
    setExporting(true);
    setStatusMessage("Preparing export...");
    setIsError(false);

    try {
      const payload = {
        strategy_label: strategyLabel,
        backtest_data: backtestData,
        trades: trades || [],
        strategy_filter: downloadAll ? 'ALL' : strategyFilter,
        action_filter: downloadAll ? 'ALL' : actionFilter,
        win_loss_filter: downloadAll ? 'ALL' : winLossFilter,
        symbol_filter: downloadAll ? '' : symbolFilter,
        start_date: downloadAll ? '' : startDate,
        end_date: downloadAll ? '' : endDate,
      };

      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || "Export validation failed — data mismatch detected.");
      }

      const blob = await res.blob();
      const todayStr = new Date().toISOString().split('T')[0];
      const filename = downloadAll
        ? `hedge_fund_trade_journal_${todayStr}.xlsx`
        : `hedge_fund_${strategyFilter !== 'ALL' ? strategyFilter : 'filtered'}_trades_${todayStr}.xlsx`;

      triggerDownload(blob, filename);
      setStatusMessage("Export complete");
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error('Export Excel error:', err);
      setIsError(true);
      setStatusMessage(err.message || "Export failed — please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-[#0D121A] border border-[#27303B] rounded-lg p-5 text-[#E8EDF3] font-sans">
      {/* Disclaimer Banner */}
      <div className="flex items-center justify-between gap-2 bg-[#080B10] border border-[#27303B] px-3 py-1.5 rounded mb-4 text-[11px] font-mono text-[#8994A3]">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#F0B44D] shrink-0" />
          <span>Historical simulation — past performance does not guarantee future results.</span>
        </div>
        <span className="text-[10px] text-[#5F6B79] font-mono hidden sm:inline">SINGLE SOURCE TRADE LEDGER</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27303B] pb-3 mb-4 font-mono">
        <div>
          <h3 className="text-base font-bold text-[#E8EDF3] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#00C896]" />
            <span>EXPORT TRADE JOURNAL WORKBOOKS</span>
          </h3>
          <p className="text-xs text-[#8994A3]">
            Export exact trade records and multi-sheet financial workbooks (.csv / .xlsx)
          </p>
        </div>

        {/* Action Download Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleExportCSV(false)}
            disabled={exporting}
            className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold font-mono"
          >
            {exporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 text-[#00C896]" />}
            <span>Download CSV</span>
          </button>

          <button
            onClick={() => handleExportExcel(false)}
            disabled={exporting}
            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold font-mono shadow-sm"
          >
            {exporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            <span>Download Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => handleExportExcel(true)}
            disabled={exporting}
            className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All Trades</span>
          </button>
        </div>
      </div>

      {/* Status Toast Banner */}
      {statusMessage && (
        <div className={`p-3 rounded mb-4 text-xs font-mono flex items-center gap-2 animate-fade-in border ${
          isError
            ? 'bg-[#1A0D12] border-[#FF5C6C]/40 text-[#FF5C6C]'
            : 'bg-[#111823] border-[#00C896]/40 text-[#00C896]'
        }`}>
          {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Filter Drawer before Exporting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
        <div>
          <label className="text-[#8994A3] block text-[10px] uppercase mb-1">Strategy</label>
          <select
            value={strategyFilter}
            onChange={(e) => setStrategyFilter(e.target.value)}
            className="terminal-input rounded p-1.5 w-full focus:outline-none"
          >
            <option value="ALL">All Strategies</option>
            <option value="AQR">AQR Momentum</option>
            <option value="Weather">All Weather</option>
            <option value="Activist">Elliott Activist</option>
          </select>
        </div>

        <div>
          <label className="text-[#8994A3] block text-[10px] uppercase mb-1">Action</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="terminal-input rounded p-1.5 w-full focus:outline-none"
          >
            <option value="ALL">All Orders (BUY & SELL)</option>
            <option value="BUY">BUY Orders</option>
            <option value="SELL">SELL Orders</option>
          </select>
        </div>

        <div>
          <label className="text-[#8994A3] block text-[10px] uppercase mb-1">Profitability</label>
          <select
            value={winLossFilter}
            onChange={(e) => setWinLossFilter(e.target.value)}
            className="terminal-input rounded p-1.5 w-full focus:outline-none"
          >
            <option value="ALL">All Trades</option>
            <option value="PROFITABLE">Profitable Trades Only</option>
            <option value="LOSING">Losing Trades Only</option>
          </select>
        </div>

        <div>
          <label className="text-[#8994A3] block text-[10px] uppercase mb-1">Symbol Search</label>
          <input
            type="text"
            placeholder="e.g. RELIANCE, TCS..."
            value={symbolFilter}
            onChange={(e) => setSymbolFilter(e.target.value)}
            className="terminal-input rounded p-1.5 w-full focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[#8994A3] block text-[10px] uppercase mb-1">Date Range</label>
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="terminal-input rounded p-1.5 w-full focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
