import { FinancialStatement } from '../types/financial';

export const parseCSVFinancials = async (file: File): Promise<FinancialStatement> => {
  try {
    const text = await file.text();
    const rows = text.split('\n').map(row => {
      const [key, value] = row.split(',').map(item => item?.trim());
      return { key, value };
    });

    const getValue = (key: string): number => {
      const row = rows.find(r => r.key === key);
      return row ? parseFloat(row.value.replace(/[^0-9.-]/g, '')) || 0 : 0;
    };

    const statement: FinancialStatement = {
      currentAssets: getValue('Total Current Assets'),
      totalAssets: getValue('Total Assets'),
      currentLiabilities: getValue('Total Current Liabilities'),
      totalLiabilities: getValue('Total Liabilities'),
      inventory: getValue('Inventory'),
      accountsReceivable: getValue('Trade Receivables'),
      cash: getValue('Cash and Cash Equivalents'),
      equity: getValue('Total Equity'),
      revenue: getValue('Total Revenue'),
      grossProfit: getValue('Total Revenue') - getValue('Cost of Materials Consumed'),
      operatingIncome: getValue('Total Revenue') - getValue('Total Expenses'),
      netIncome: getValue('Net Profit'),
      ebit: getValue('Profit Before Tax') + getValue('Finance Costs'),
      interestExpense: getValue('Finance Costs'),
      currency: rows.find(r => r.key === 'Currency')?.value || 'USD'
    };

    return statement;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file. Please ensure the file follows the correct format.');
  }
};