import { AVAILABLE_CURRENCIES } from './formatters';

export interface ExchangeRates {
  [key: string]: number;
}

const API_KEY = '06c535aef1ed32e3d18e6ef2';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

let cachedRates: { [key: string]: ExchangeRates } = {};
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function verifyApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/USD`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result === 'success';
  } catch (error) {
    console.error('API Connection Error:', error);
    return false;
  }
}

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedRates[baseCurrency] && (now - lastFetchTime < CACHE_DURATION)) {
      return cachedRates[baseCurrency];
    }

    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result === 'error') {
      throw new Error(data['error-type']);
    }

    // Store rates in cache
    cachedRates[baseCurrency] = data.conversion_rates;
    lastFetchTime = now;
    
    return data.conversion_rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Fallback to default rates if API fails
    return getFallbackRates(baseCurrency);
  }
}

function getFallbackRates(baseCurrency: string): ExchangeRates {
  // Default exchange rates as fallback
  const defaultRates: ExchangeRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CNY: 6.45,
    INR: 74.5,
  };

  if (baseCurrency === 'USD') {
    return defaultRates;
  }

  // Convert rates to requested base currency
  const baseRate = defaultRates[baseCurrency] || 1;
  const convertedRates: ExchangeRates = {};

  Object.entries(defaultRates).forEach(([currency, rate]) => {
    convertedRates[currency] = rate / baseRate;
  });

  return convertedRates;
}

export async function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  try {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Get exchange rates for the source currency
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates[toCurrency]) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    // Convert the amount using the exchange rate
    const convertedAmount = amount * rates[toCurrency];
    return Number(convertedAmount.toFixed(2));
  } catch (error) {
    console.error('Error converting amount:', error);
    return amount; // Return original amount if conversion fails
  }
}

export async function convertAllAmounts(
  amounts: { [key: string]: number },
  fromCurrency: string,
  toCurrency: string
): Promise<{ [key: string]: number }> {
  try {
    if (fromCurrency === toCurrency) {
      return amounts;
    }

    // Get exchange rates for the source currency
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates[toCurrency]) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }

    // Convert all amounts using the exchange rate
    const convertedAmounts: { [key: string]: number } = {};
    for (const [key, value] of Object.entries(amounts)) {
      convertedAmounts[key] = Number((value * rates[toCurrency]).toFixed(2));
    }

    return convertedAmounts;
  } catch (error) {
    console.error('Error converting amounts:', error);
    return amounts; // Return original amounts if conversion fails
  }
}