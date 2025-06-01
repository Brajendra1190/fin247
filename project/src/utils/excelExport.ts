interface ExcelStyles {
  headerStyle: {
    font: { bold: boolean; color: { rgb: string } };
    fill: { fgColor: { rgb: string } };
    alignment: { horizontal: string };
  };
  subHeaderStyle: {
    font: { bold: boolean };
    fill: { fgColor: { rgb: string } };
  };
  currencyStyle: {
    numFmt: string;
  };
  percentStyle: {
    numFmt: string;
  };
}

export const exportToExcel = (financialData: any, ratios: any) => {
  // Create CSV content
  const rows = [
    ['Financial Analysis Report'],
    ['Generated on:', new Date().toLocaleDateString()],
    ['Currency:', financialData.currency],
    [''],
    ['Balance Sheet'],
    ['Item', 'Amount', '% of Total'],
    ['Current Assets', financialData.currentAssets, (financialData.currentAssets / financialData.totalAssets * 100).toFixed(2) + '%'],
    ['Total Assets', financialData.totalAssets, '100%'],
    ['Current Liabilities', financialData.currentLiabilities, (financialData.currentLiabilities / financialData.totalAssets * 100).toFixed(2) + '%'],
    ['Total Liabilities', financialData.totalLiabilities, (financialData.totalLiabilities / financialData.totalAssets * 100).toFixed(2) + '%'],
    ['Total Equity', financialData.equity, (financialData.equity / financialData.totalAssets * 100).toFixed(2) + '%'],
    [''],
    ['Financial Ratios'],
    ['Ratio', 'Value', 'Benchmark'],
    ['Current Ratio', ratios.currentRatio.toFixed(2), '2.00'],
    ['Quick Ratio', ratios.quickRatio.toFixed(2), '1.00'],
    ['Cash Ratio', ratios.cashRatio.toFixed(2), '0.20'],
    ['Gross Profit Margin', ratios.grossProfitMargin.toFixed(2) + '%', '30.00%'],
    ['Operating Margin', ratios.operatingMargin.toFixed(2) + '%', '15.00%'],
    ['Net Profit Margin', ratios.netProfitMargin.toFixed(2) + '%', '10.00%'],
    ['Return on Assets', ratios.returnOnAssets.toFixed(2) + '%', '5.00%'],
    ['Return on Equity', ratios.returnOnEquity.toFixed(2) + '%', '15.00%']
  ];

  // Convert to CSV
  const csv = rows.map(row => row.join(',')).join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `financial-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};