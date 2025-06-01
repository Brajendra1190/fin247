import React, { useState } from 'react';
import { FinancialStatement, FinancialRatios } from '../../types/financial';
import { calculateRatios } from '../../utils/ratioCalculations';
import FinancialInput from '../../components/FinancialInput';
import RatiosDisplay from '../../components/RatiosDisplay';
import FileUpload from '../../components/FileUpload';
import ExportData from '../../components/ExportData';
import { Calculator } from 'lucide-react';

function FinancialDashboard() {
  const [ratios, setRatios] = useState<FinancialRatios | null>(null);
  const [financialData, setFinancialData] = useState<FinancialStatement | null>(null);

  const handleFinancialDataSubmit = (data: FinancialStatement) => {
    const calculatedRatios = calculateRatios(data);
    setRatios(calculatedRatios);
    setFinancialData(data);
  };

  const handleDataExtracted = (data: FinancialStatement) => {
    setFinancialData(data);
    const calculatedRatios = calculateRatios(data);
    setRatios(calculatedRatios);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      <div className="flex items-center gap-3 mb-8">
        <Calculator className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Analysis</h1>
      </div>

      <div className="space-y-8">
        <FileUpload onDataExtracted={handleDataExtracted} />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">
              OR enter data manually
            </span>
          </div>
        </div>

        <FinancialInput onSubmit={handleFinancialDataSubmit} initialData={financialData} />
        
        {ratios && financialData && (
          <>
            <RatiosDisplay ratios={ratios} />
            <ExportData financialData={financialData} ratios={ratios} />
          </>
        )}
      </div>
    </div>
  );
}

export default FinancialDashboard;