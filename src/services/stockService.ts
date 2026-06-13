import { StockQuote, HistoricalData } from '../types';

export const stockService = {
  async getQuote(symbol: string): Promise<StockQuote> {
    const response = await fetch(`/api/stock/${symbol}`);
    if (!response.ok) throw new Error('Failed to fetch quote');
    return response.json();
  },

  async getHistory(symbol: string, period1?: string, period2?: string): Promise<HistoricalData[]> {
    const params = new URLSearchParams();
    if (period1) params.append('period1', period1);
    if (period2) params.append('period2', period2);
    
    const response = await fetch(`/api/stock/${symbol}/history?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      date: new Date(item.date).toISOString().split('T')[0]
    }));
  },

  async search(query: string): Promise<any[]> {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search');
    return response.json();
  }
};
