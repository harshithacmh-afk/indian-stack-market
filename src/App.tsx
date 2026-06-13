import React, { useState, useEffect } from 'react';
import { LayoutGrid, MessageCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { StockQuote, HistoricalData } from './types';
import { stockService } from './services/stockService';
import { StockCard } from './components/StockCard';
import { StockChart } from './components/StockChart';
import { ChatInterface } from './components/ChatInterface';
import { formatPrice, formatNumberCompact } from './lib/format';

const DEFAULT_STOCKS = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS'];

export default function App() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE.NS');
  const [history, setHistory] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async (refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);

    try {
      const stockQuotes = await Promise.all(
        DEFAULT_STOCKS.map((s) => stockService.getQuote(s))
      );
      setQuotes(stockQuotes.filter(Boolean));
      setError(null);
    } catch (err) {
      console.error('Quote Error:', err);
      setError('Failed to load stock quotes');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchHistory = async (symbol: string) => {
    try {
      const historyData = await stockService.getHistory(symbol);
      setHistory(historyData || []);
    } catch (err) {
      console.error('History Error:', err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    fetchHistory(selectedSymbol);
  }, [selectedSymbol]);

  const selectedQuote = quotes.find((q) => q.symbol === selectedSymbol);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1426] text-center px-6">
        <p className="text-rose-400 font-semibold mb-2">Something went wrong</p>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchQuotes()}
          className="bg-amber-400 text-[#0B1426] font-semibold text-sm px-4 py-2 rounded-xl"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1426]">
        <RefreshCw className="animate-spin text-amber-400" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1426] text-slate-100 font-sans flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0B1426]/90 backdrop-blur-md border-b border-white/5 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 tracking-wide uppercase">Markets</p>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              FinTrack
            </h1>
          </div>
          <button
            onClick={() => fetchQuotes(true)}
            className="p-2.5 rounded-xl bg-[#141F38] border border-white/5 text-slate-300 active:scale-95 transition-transform"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Watchlist */}
              <div className="pt-4 pb-1">
                <h2 className="px-5 text-sm font-semibold text-slate-300 mb-3">Watchlist</h2>
                <div className="flex gap-3 px-5 overflow-x-auto snap-x pb-2 scrollbar-hide">
                  {quotes.map((q) => (
                    <StockCard
                      key={q.symbol}
                      quote={q}
                      isActive={q.symbol === selectedSymbol}
                      onClick={() => setSelectedSymbol(q.symbol)}
                    />
                  ))}
                </div>
              </div>

              {/* Detail */}
              {selectedQuote && (
                <div className="px-5 mt-4">
                  <div className="bg-[#141F38] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-bold text-lg tracking-tight">
                          {selectedQuote.symbol.replace('.NS', '')}
                        </h3>
                        <p className="text-xs text-slate-400 truncate max-w-[220px]">
                          {selectedQuote.longName}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                          (selectedQuote.regularMarketChange || 0) >= 0
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : 'bg-rose-400/10 text-rose-400'
                        }`}
                      >
                        {(selectedQuote.regularMarketChange || 0) >= 0 ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {Math.abs(selectedQuote.regularMarketChangePercent || 0).toFixed(2)}%
                      </div>
                    </div>

                    <div className="text-3xl font-bold tabular-nums mt-3 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {formatPrice(selectedQuote.regularMarketPrice, selectedQuote.currency)}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {(selectedQuote.regularMarketChange || 0) >= 0 ? '+' : ''}
                      {selectedQuote.regularMarketChange?.toFixed(2)} today
                    </p>

                    <StockChart data={history} symbol={selectedSymbol} />

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Day High</p>
                        <p className="text-sm font-semibold tabular-nums">
                          {formatPrice(selectedQuote.regularMarketDayHigh, selectedQuote.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Day Low</p>
                        <p className="text-sm font-semibold tabular-nums">
                          {formatPrice(selectedQuote.regularMarketDayLow, selectedQuote.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Mkt Cap</p>
                        <p className="text-sm font-semibold tabular-nums">
                          ₹{formatNumberCompact(selectedQuote.marketCap)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-[calc(100vh-88px)]"
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0B1426]/95 backdrop-blur-md border-t border-white/5 px-6 py-3 flex justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-colors ${
            activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-500'
          }`}
        >
          <LayoutGrid size={20} />
          <span className="text-[11px] font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-colors ${
            activeTab === 'chat' ? 'text-amber-400' : 'text-slate-500'
          }`}
        >
          <MessageCircle size={20} />
          <span className="text-[11px] font-medium">Chat</span>
        </button>
      </nav>
    </div>
  );
}
