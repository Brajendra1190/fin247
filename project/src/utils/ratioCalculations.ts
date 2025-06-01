import { FinancialStatement, FinancialRatios } from '../types/financial';

interface RatioDetail {
  formula: string;
  description: string;
}

const ratioDetails: Record<string, RatioDetail> = {
  'Current Ratio': {
    formula: 'Current Assets ÷ Current Liabilities',
    description: 'Measures a company\'s ability to pay short-term obligations within one year. A ratio above 2 is typically considered good.'
  },
  'Quick Ratio': {
    formula: '(Current Assets - Inventory) ÷ Current Liabilities',
    description: 'A more stringent measure of liquidity that excludes inventory. A ratio of 1 or higher indicates strong short-term liquidity.'
  },
  'Cash Ratio': {
    formula: 'Cash ÷ Current Liabilities',
    description: 'The most conservative liquidity ratio, showing how well a company can pay off its current liabilities with just cash and cash equivalents.'
  },
  'Gross Profit Margin': {
    formula: '(Gross Profit ÷ Revenue) × 100',
    description: 'Shows the percentage of revenue that exceeds the cost of goods sold. Higher margins indicate better efficiency in core operations.'
  },
  'Operating Margin': {
    formula: '(Operating Income ÷ Revenue) × 100',
    description: 'Indicates how much profit a company makes after paying variable costs but before paying interest or taxes.'
  },
  'Net Profit Margin': {
    formula: '(Net Income ÷ Revenue) × 100',
    description: 'Shows how much net income is generated as a percentage of revenue. Higher margins indicate better overall profitability.'
  },
  'Return on Assets': {
    formula: '(Net Income ÷ Total Assets) × 100',
    description: 'Measures how efficiently a company uses its assets to generate earnings. Higher ROA indicates better asset utilization.'
  },
  'Return on Equity': {
    formula: '(Net Income ÷ Total Equity) × 100',
    description: 'Shows how much profit a company generates with the money shareholders have invested.'
  },
  'Debt to Equity': {
    formula: 'Total Liabilities ÷ Total Equity',
    description: 'Indicates the proportion of equity and debt the company uses to finance its assets. Lower ratios indicate lower financial risk.'
  },
  'Interest Coverage': {
    formula: 'EBIT ÷ Interest Expense',
    description: 'Shows how easily a company can pay interest on its outstanding debt. Higher ratios indicate better debt servicing capability.'
  },
  'Debt to Assets': {
    formula: 'Total Liabilities ÷ Total Assets',
    description: 'Measures the percentage of assets that are financed with debt. Lower ratios indicate lower financial leverage.'
  }
};

export const calculateRatios = (data: FinancialStatement): FinancialRatios => {
  return {
    currentRatio: data.currentAssets / data.currentLiabilities,
    quickRatio: (data.currentAssets - data.inventory) / data.currentLiabilities,
    cashRatio: data.cash / data.currentLiabilities,
    grossProfitMargin: (data.grossProfit / data.revenue) * 100,
    operatingMargin: (data.operatingIncome / data.revenue) * 100,
    netProfitMargin: (data.netIncome / data.revenue) * 100,
    returnOnAssets: (data.netIncome / data.totalAssets) * 100,
    returnOnEquity: (data.netIncome / data.equity) * 100,
    debtToEquity: data.totalLiabilities / data.equity,
    interestCoverage: data.ebit / data.interestExpense,
    debtToAssets: data.totalLiabilities / data.totalAssets
  };
};

export const getRatioAnalysis = (value: number, ratioName: string): string => {
  switch (ratioName) {
    case 'Current Ratio':
      return value >= 2 ? 'Healthy liquidity position' : 'Potential liquidity concerns';
    case 'Quick Ratio':
      return value >= 1 ? 'Strong acid-test ratio' : 'May struggle with immediate obligations';
    case 'Cash Ratio':
      return value >= 0.2 ? 'Good cash position' : 'Limited immediate cash availability';
    case 'Gross Profit Margin':
      return value >= 30 ? 'Strong operational efficiency' : 'Room for operational improvement';
    case 'Operating Margin':
      return value >= 15 ? 'Efficient operations' : 'Operating efficiency could be improved';
    case 'Net Profit Margin':
      return value >= 10 ? 'Good profitability' : 'Profitability needs attention';
    case 'Return on Assets':
      return value >= 5 ? 'Good asset utilization' : 'Asset efficiency could be improved';
    case 'Return on Equity':
      return value >= 15 ? 'Strong shareholder returns' : 'Limited shareholder value generation';
    case 'Debt to Equity':
      return value <= 2 ? 'Sustainable debt levels' : 'High leverage - potential risk';
    case 'Interest Coverage':
      return value >= 3 ? 'Strong debt service capability' : 'Debt service pressure';
    case 'Debt to Assets':
      return value <= 0.5 ? 'Conservative financing' : 'High financial leverage';
    default:
      return 'Analysis not available';
  }
};

export const getRatioDetails = (ratioName: string): RatioDetail => {
  return ratioDetails[ratioName] || { formula: 'Not available', description: 'Description not available' };
};