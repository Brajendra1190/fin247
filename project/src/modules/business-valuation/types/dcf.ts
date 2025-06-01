export interface CashFlowItem {
  id: string;
  name: string;
  type: 'income' | 'expense';
  amount: string;
  useGrowth: boolean;
  growthRates: string[];
  manualProjections: string[];
  useManualProjections: boolean;
}

export interface DCFInputs {
  wacc: string;
  perpetualGrowthRate: string;
  projectionYears: number;
  cashFlowItems: CashFlowItem[];
  currency: string;
}

export interface ProjectedCashFlow {
  year: number;
  items: {
    id: string;
    name: string;
    type: 'income' | 'expense';
    amount: number;
    growthRate: number;
  }[];
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
}