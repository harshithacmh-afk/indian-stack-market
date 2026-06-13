// Indian numbering system helpers: Thousand, Lakh (10^5), Crore (10^7)

export function formatINRCompact(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '--';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1e7) {
    return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  }
  if (abs >= 1e5) {
    return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  }
  if (abs >= 1e3) {
    return `${sign}₹${(abs / 1e3).toFixed(2)} K`;
  }
  return `${sign}₹${abs.toFixed(2)}`;
}

export function formatNumberCompact(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '--';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1e7) {
    return `${sign}${(abs / 1e7).toFixed(2)} Cr`;
  }
  if (abs >= 1e5) {
    return `${sign}${(abs / 1e5).toFixed(2)} L`;
  }
  if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(2)} K`;
  }
  return abs.toString();
}

// Standard Indian comma grouping, e.g. 1234567 -> 12,34,567
export function formatIndianGrouping(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '--';
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatPrice(value?: number, currency?: string): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '--';
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '';
  return `${symbol}${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}
