import React, { useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { parseCSVFinancials } from '../utils/csvParser';
import { FinancialStatement } from '../types/financial';

interface FileUploadProps {
  onDataExtracted: (data: FinancialStatement) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataExtracted }) => {
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      try {
        const data = await parseCSVFinancials(file);
        onDataExtracted(data);
      } catch (error) {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV file. Please check the format and try again.');
      }
    } else {
      alert('Please upload a CSV file');
    }
  }, [onDataExtracted]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      try {
        const data = await parseCSVFinancials(file);
        onDataExtracted(data);
      } catch (error) {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV file. Please check the format and try again.');
      }
    }
  }, [onDataExtracted]);

  const downloadTemplate = () => {
    const template = `EQUITY AND LIABILITIES
Share Capital,0
Reserves and Surplus,0
Total Equity,0

Non-Current Liabilities
Long-term Borrowings,0
Other Long-term Liabilities,0
Total Non-Current Liabilities,0

Current Liabilities
Short-term Borrowings,0
Trade Payables,0
Other Current Liabilities,0
Total Current Liabilities,0

Total Liabilities,0

ASSETS
Non-Current Assets
Fixed Assets,0
Long-term Investments,0
Total Non-Current Assets,0

Current Assets
Inventory,0
Trade Receivables,0
Cash and Cash Equivalents,0
Other Current Assets,0
Total Current Assets,0

Total Assets,0

INCOME STATEMENT
Revenue from Operations,0
Other Income,0
Total Revenue,0

Expenses
Cost of Materials Consumed,0
Employee Benefits Expense,0
Finance Costs,0
Other Expenses,0
Total Expenses,0

Profit Before Tax,0
Tax Expense,0
Net Profit,0

Currency,USD`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule_III_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card dark:bg-gray-800 dark:border-gray-700">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Upload Schedule III Format CSV
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drop your CSV file here or click to browse
          </p>
        </label>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Download className="h-4 w-4" />
          Download Schedule III Template
        </button>
      </div>
    </div>
  );
};

export default FileUpload;