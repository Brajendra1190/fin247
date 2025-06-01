import React from 'react';
import { FinancialRatios } from '../types/financial';
import { TrendingUp } from 'lucide-react';
import RatioCard from './RatioCard';

interface Props {
  ratios: FinancialRatios;
}

const RatiosDisplay: React.FC<Props> = ({ ratios }) => {
  const renderRatioGroup = (title: string, ratioItems: Array<[string, number]>) => (
    <div key={title} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      <div className="space-y-3">
        {ratioItems.map(([name, value]) => (
          <RatioCard key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Analysis</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {renderRatioGroup('Liquidity Ratios', [
            ['Current Ratio', ratios.currentRatio],
            ['Quick Ratio', ratios.quickRatio],
            ['Cash Ratio', ratios.cashRatio]
          ])}
          {renderRatioGroup('Profitability Ratios', [
            ['Gross Profit Margin', ratios.grossProfitMargin],
            ['Operating Margin', ratios.operatingMargin],
            ['Net Profit Margin', ratios.netProfitMargin],
            ['Return on Assets', ratios.returnOnAssets],
            ['Return on Equity', ratios.returnOnEquity]
          ])}
          {renderRatioGroup('Solvency Ratios', [
            ['Debt to Equity', ratios.debtToEquity],
            ['Interest Coverage', ratios.interestCoverage],
            ['Debt to Assets', ratios.debtToAssets]
          ])}
        </div>
      </div>
    </div>
  );
};

export default RatiosDisplay;