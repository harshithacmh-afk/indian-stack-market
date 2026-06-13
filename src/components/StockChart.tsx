import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { HistoricalData } from '../types';

interface StockChartProps {
  data: HistoricalData[];
  symbol: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
        No chart data available
      </div>
    );
  }

  const isPositive = data[data.length - 1].close >= data[0].close;
  const color = isPositive ? '#22C55E' : '#F43F5E';

  return (
    <div className="h-48 w-full -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0B1426',
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.6)',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#94A3B8' }}
            itemStyle={{ color: '#F8FAFC' }}
            formatter={(value) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Close']}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorClose)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
