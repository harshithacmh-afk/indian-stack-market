import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockQuote } from '../types';
import { formatNumberCompact, formatPrice } from '../lib/format';

interface StockCardProps {
  quote: StockQuote;
  onClick?: () => void;
  isActive?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({ quote, onClick, isActive }) => {
  const isPositive = (quote.regularMarketChange || 0) >= 0;
  const changeColor = isPositive ? 'text-emerald-400' : 'text-rose-400';
  const accentBg = isPositive ? 'bg-emerald-400/10' : 'bg-rose-400/10';

  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-40 text-left rounded-2xl border p-4 transition-all snap-start ${
        isActive
          ? 'border-amber-400/60 bg-[#16213D] shadow-[0_0_0_1px_rgba(245,191,68,0.15)]'
          : 'border-white/5 bg-[#141F38] hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <h3 className="font-semibold text-sm text-white tracking-tight">
          {quote.symbol.replace('.NS', '')}
        </h3>
      </div>

      <p className="text-[11px] text-slate-400 truncate mb-3 leading-tight">
        {quote.longName || quote.shortName}
      </p>

      <div className="text-lg font-bold text-white tabular-nums mb-1.5">
        {formatPrice(quote.regularMarketPrice, quote.currency)}
      </div>

      <div className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${accentBg} ${changeColor}`}>
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(quote.regularMarketChangePercent || 0).toFixed(2)}%
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wider">
        <span>Vol {formatNumberCompact(quote.regularMarketVolume)}</span>
      </div>
    </button>
  );
};
