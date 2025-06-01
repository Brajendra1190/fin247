export interface FinancialStatement {
  // Balance Sheet
  currentAssets: number;
  totalAssets: number;
  currentLiabilities: number;
  totalLiabilities: number;
  inventory: number;
  accountsReceivable: number;
  cash: number;
  equity: number;
  
  // Income Statement
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  ebit: number;
  interestExpense: number;

  // Meta
  currency: string;
}

export interface FinancialRatios {
  // Liquidity Ratios
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;

  // Profitability Ratios
  grossProfitMargin: number;
  operatingMargin: number;
  netProfitMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;

  // Solvency Ratios
  debtToEquity: number;
  interestCoverage: number;
  debtToAssets: number;
}