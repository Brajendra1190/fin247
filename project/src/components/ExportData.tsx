import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { FinancialStatement, FinancialRatios } from '../types/financial';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { exportToExcel } from '../utils/excelExport';

interface Props {
  financialData: FinancialStatement;
  ratios: FinancialRatios;
}

const ExportData: React.FC<Props> = ({ financialData, ratios }) => {
  const generateCSV = () => {
    const rows = [
      ['FINANCIAL ANALYSIS REPORT'],
      ['Generated on:', new Date().toLocaleDateString()],
      ['Currency:', financialData.currency],
      [''],
      ['=== BALANCE SHEET ==='],
      ['Assets', 'Amount', '% of Total Assets'],
      ['Current Assets', formatCurrency(financialData.currentAssets, financialData.currency), `${((financialData.currentAssets / financialData.totalAssets) * 100).toFixed(1)}%`],
      ['Total Assets', formatCurrency(financialData.totalAssets, financialData.currency), '100.0%'],
      [''],
      ['Liabilities & Equity', 'Amount', '% of Total'],
      ['Current Liabilities', formatCurrency(financialData.currentLiabilities, financialData.currency), `${((financialData.currentLiabilities / financialData.totalAssets) * 100).toFixed(1)}%`],
      ['Total Liabilities', formatCurrency(financialData.totalLiabilities, financialData.currency), `${((financialData.totalLiabilities / financialData.totalAssets) * 100).toFixed(1)}%`],
      ['Total Equity', formatCurrency(financialData.equity, financialData.currency), `${((financialData.equity / financialData.totalAssets) * 100).toFixed(1)}%`],
      [''],
      ['=== INCOME STATEMENT ==='],
      ['Item', 'Amount', '% of Revenue'],
      ['Revenue', formatCurrency(financialData.revenue, financialData.currency), '100.0%'],
      ['Gross Profit', formatCurrency(financialData.grossProfit, financialData.currency), `${((financialData.grossProfit / financialData.revenue) * 100).toFixed(1)}%`],
      ['Operating Income', formatCurrency(financialData.operatingIncome, financialData.currency), `${((financialData.operatingIncome / financialData.revenue) * 100).toFixed(1)}%`],
      ['Net Income', formatCurrency(financialData.netIncome, financialData.currency), `${((financialData.netIncome / financialData.revenue) * 100).toFixed(1)}%`],
      [''],
      ['=== FINANCIAL RATIOS ==='],
      [''],
      ['LIQUIDITY RATIOS', 'Value', 'Industry Benchmark'],
      ['Current Ratio', ratios.currentRatio.toFixed(2), '2.00'],
      ['Quick Ratio', ratios.quickRatio.toFixed(2), '1.00'],
      ['Cash Ratio', ratios.cashRatio.toFixed(2), '0.20'],
      [''],
      ['PROFITABILITY RATIOS', 'Value', 'Industry Benchmark'],
      ['Gross Profit Margin', `${ratios.grossProfitMargin.toFixed(2)}%`, '30.00%'],
      ['Operating Margin', `${ratios.operatingMargin.toFixed(2)}%`, '15.00%'],
      ['Net Profit Margin', `${ratios.netProfitMargin.toFixed(2)}%`, '10.00%'],
      ['Return on Assets', `${ratios.returnOnAssets.toFixed(2)}%`, '5.00%'],
      ['Return on Equity', `${ratios.returnOnEquity.toFixed(2)}%`, '15.00%'],
      [''],
      ['SOLVENCY RATIOS', 'Value', 'Industry Benchmark'],
      ['Debt to Equity', ratios.debtToEquity.toFixed(2), '2.00'],
      ['Interest Coverage', ratios.interestCoverage.toFixed(2), '3.00'],
      ['Debt to Assets', ratios.debtToAssets.toFixed(2), '0.50']
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-analysis-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-8 space-y-4">
      <button
        onClick={generateCSV}
        className="btn-primary flex items-center justify-center gap-2"
      >
        <Download className="h-5 w-5" />
        Export Analysis (CSV)
      </button>
      
      <button
        onClick={() => exportToExcel(financialData, ratios)}
        className="btn-primary flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
      >
        <FileSpreadsheet className="h-5 w-5" />
        Export to Excel
      </button>
    </div>
  );
};

export default ExportData;