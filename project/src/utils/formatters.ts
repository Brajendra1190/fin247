export const CURRENCY_FORMATS: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  JPY: { symbol: '¥', locale: 'ja-JP' },
  CNY: { symbol: '¥', locale: 'zh-CN' },
  INR: { symbol: '₹', locale: 'en-IN' },
};

export const AVAILABLE_CURRENCIES = Object.keys(CURRENCY_FORMATS);

export const formatNumber = (num: number, currency: string = 'USD'): string => {
  if (typeof num !== 'number') return '0.00';
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.USD;
  
  try {
    return new Intl.NumberFormat(format.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toFixed(2);
  }
};

export const formatCurrency = (num: number, currency: string = 'USD'): string => {
  if (typeof num !== 'number') return '$0.00';
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.USD;
  
  try {
    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${format.symbol}${num.toFixed(2)}`;
  }
};

export const getCurrencySymbol = (currency: string = 'USD'): string => {
  return CURRENCY_FORMATS[currency]?.symbol || '$';
};