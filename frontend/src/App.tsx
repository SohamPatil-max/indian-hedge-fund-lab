import React, { useEffect, useState, createContext, useContext } from 'react';
import { AppShell } from './components/AppShell';
import { LiveParameterPanel, DEFAULT_PARAMS, BacktestParams } from './components/LiveParameterPanel';
import { BacktestResult } from './types';
import { MarketProvider, useMarketData } from './context/MarketContext';

import { CommandCenter } from './pages/CommandCenter';
import { StrategyLibraryPage } from './pages/StrategyLibraryPage';
import { BacktestLabPage } from './pages/BacktestLabPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TradeJournalPage } from './pages/TradeJournalPage';
import { MarketDashboardPage } from './pages/MarketDashboardPage';

interface BacktestContextType {
  activeBacktest: BacktestResult | null;
  params: BacktestParams;
  setParams: (p: BacktestParams) => void;
  runBacktest: (overrideParams?: BacktestParams) => Promise<void>;
  running: boolean;
}

export const BacktestContext = createContext<BacktestContextType | null>(null);

export const useBacktest = () => {
  const ctx = useContext(BacktestContext);
  if (!ctx) throw new Error('useBacktest must be used within BacktestProvider');
  return ctx;
};

function MainApp() {
  const [activeTab, setActiveTab] = useState('command');
  const { marketStatus, indexTicker } = useMarketData();

  const [params, setParams] = useState<BacktestParams>(DEFAULT_PARAMS);
  const [activeBacktest, setActiveBacktest] = useState<BacktestResult | null>(null);
  const [running, setRunning] = useState(false);

  const runBacktest = async (overrideParams?: BacktestParams) => {
    setRunning(true);
    const payload = overrideParams || params;
    try {
      const res = await fetch('/api/backtest/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setActiveBacktest(data);
    } catch (err) {
      console.error('Error running backtest:', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // Initial instant load from pre-warmed backend state (5ms response)
    fetch('/api/backtest/active_state')
      .then(res => res.json())
      .then(data => setActiveBacktest(data))
      .catch(err => runBacktest());
  }, []);

  return (
    <BacktestContext.Provider
      value={{
        activeBacktest,
        params,
        setParams,
        runBacktest,
        running,
      }}
    >
      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        marketStatus={marketStatus}
        indexTicker={indexTicker}
      >
        {/* Global Parameter Control Panel */}
        <div className="mb-6">
          <LiveParameterPanel
            params={params}
            onChangeParams={setParams}
            onRunBacktest={runBacktest}
            running={running}
            runId={activeBacktest?.run_id}
            lastCalculated={activeBacktest?.last_calculated}
          />
        </div>

        {/* View Router */}
        {activeTab === 'command' && (
          <CommandCenter
            setActiveTab={setActiveTab}
            marketStatus={marketStatus}
            indexTicker={indexTicker}
          />
        )}
        {(activeTab === 'strategies' || activeTab === 'aqr' || activeTab === 'all-weather' || activeTab === 'activist' || activeTab === 'compare') && (
          <StrategyLibraryPage setActiveTab={setActiveTab} initialSubTab={activeTab === 'strategies' ? 'overview' : (activeTab as any)} />
        )}
        {activeTab === 'backtest' && <BacktestLabPage />}
        {activeTab === 'portfolio' && <PortfolioPage />}
        {activeTab === 'trades' && <TradeJournalPage />}
        {activeTab === 'market' && <MarketDashboardPage />}
      </AppShell>
    </BacktestContext.Provider>
  );
}

export function App() {
  return (
    <MarketProvider>
      <MainApp />
    </MarketProvider>
  );
}

export default App;
