import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketStatus, IndexTicker, StockQuote } from '../types';

interface MarketContextType {
  marketStatus: MarketStatus | null;
  indexTicker: IndexTicker | null;
  stockUniverse: StockQuote[];
  loading: boolean;
  refreshMarketData: () => Promise<void>;
}

const MarketContext = createContext<MarketContextType>({
  marketStatus: null,
  indexTicker: null,
  stockUniverse: [],
  loading: true,
  refreshMarketData: async () => {},
});

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [indexTicker, setIndexTicker] = useState<IndexTicker | null>(null);
  const [stockUniverse, setStockUniverse] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllMarketData = async () => {
    try {
      const [statusRes, tickerRes, universeRes] = await Promise.all([
        fetch('/api/market/status').then((r) => r.json()),
        fetch('/api/market/ticker').then((r) => r.json()),
        fetch('/api/market/universe').then((r) => r.json()),
      ]);

      setMarketStatus(statusRes);
      setIndexTicker(tickerRes);
      setStockUniverse(universeRes);

      // Development Desync Check
      if (tickerRes?.price && statusRes?.status_code) {
        console.log(
          `[MarketContext] Single Source of Truth Active — NIFTY 50: Rs ${tickerRes.price} (${tickerRes.change_pct}%) | SENSEX: Rs ${tickerRes.sensex?.price || 'N/A'} | Status: ${statusRes.status_code}`
        );
      }
    } catch (err) {
      console.error('[MarketContext] Failed to fetch central market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMarketData();

    // Auto-refresh every 15 seconds during trading session
    const interval = setInterval(fetchAllMarketData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketContext.Provider
      value={{
        marketStatus,
        indexTicker,
        stockUniverse,
        loading,
        refreshMarketData: fetchAllMarketData,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketData = () => useContext(MarketContext);
