export interface ProcessedCashFlow {
  amount: number;
  isInvestment: boolean;
}

export interface PaybackResult {
  paybackPeriod: number | null;
  cumulativeCashFlows: {
    year: number;
    amount: number;
    cumulative: number;
    isInvestment: boolean;
  }[];
}