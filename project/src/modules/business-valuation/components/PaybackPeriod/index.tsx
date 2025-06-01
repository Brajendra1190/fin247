import React, { useState } from 'react';
import { Calculator, ArrowRight, PlusCircle, MinusCircle } from 'lucide-react';
import { AVAILABLE_CURRENCIES } from '../../../../utils/formatters';
import { calculatePaybackPeriod, calculateDiscountedPaybackPeriod } from '../../utils/paybackCalculations';

interface CashFlow {
  year: number;
  amount: string;
  isInvestment: boolean;
}

function PaybackPeriod() {
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('10');
  const [currency, setCurrency] = useState<string>('USD');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { year: 1, amount: '', isInvestment: false }
  ]);
  const [useDiscounted, setUseDiscounted] = useState<boolean>(false);

  const [results, setResults] = useState<{
    paybackPeriod: number | null;
    cumulativeCashFlows: { year: number; amount: number; cumulative: number; isInvestment: boolean }[];
  }>({ paybackPeriod: null, cumulativeCashFlows: [] });

  const addCashFlow = () => {
    setCashFlows([
      ...cashFlows,
      { year: cashFlows.length + 1, amount: '', isInvestment: false }
    ]);
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 1) {
      const newFlows = cashFlows.filter((_, i) => i !== index);
      setCashFlows(newFlows.map((flow, i) => ({ ...flow, year: i + 1 })));
    }
  };

  const updateCashFlow = (index: number, updates: Partial<CashFlow>) => {
    const newFlows = [...cashFlows];
    newFlows[index] = { ...newFlows[index], ...updates };
    setCashFlows(newFlows);
  };

  const calculateResults = () => {
    const processedCashFlows = cashFlows.map(cf => ({
      amount: Number(cf.amount) || 0,
      isInvestment: cf.isInvestment
    }));
    const numericInitialInvestment = Number(initialInvestment) || 0;
    const numericDiscountRate = Number(discountRate) || 0;

    if (useDiscounted) {
      const result = calculateDiscountedPaybackPeriod(
        numericInitialInvestment,
        processedCashFlows,
        numericDiscountRate
      );
      setResults(result);
    } else {
      const result = calculatePaybackPeriod(
        numericInitialInvestment,
        processedCashFlows
      );
      setResults(result);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Payback Period Calculator
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency:
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-field w-auto"
            >
              {AVAILABLE_CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currency}
                </span>
                <input
                  type="text"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  className="input-field pl-16"
                  placeholder="Enter initial investment"
                />
              </div>
            </div>

            <div className="flex items-start pt-7">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useDiscounted}
                  onChange={(e) => setUseDiscounted(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Calculate Discounted Payback Period
                </span>
              </label>
            </div>
          </div>

          {useDiscounted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Rate (%)
              </label>
              <input
                type="text"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="input-field"
                placeholder="Enter discount rate"
                step="0.1"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cash Flows</h3>
              <button
                onClick={addCashFlow}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Year
              </button>
            </div>

            <div className="space-y-3">
              {cashFlows.map((cf, index) => (
                <div key={cf.year} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                    Year {cf.year}
                  </span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currency}
                    </span>
                    <input
                      type="text"
                      value={cf.amount}
                      onChange={(e) => updateCashFlow(index, { amount: e.target.value })}
                      className="input-field pl-16"
                      placeholder={`Cash flow for year ${cf.year}`}
                    />
                  </div>
                  <label className="flex items-center gap-2 min-w-[140px]">
                    <input
                      type="checkbox"
                      checked={cf.isInvestment}
                      onChange={(e) => updateCashFlow(index, { isInvestment: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Is Investment
                    </span>
                  </label>
                  {cashFlows.length > 1 && (
                    <button
                      onClick={() => removeCashFlow(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={calculateResults} className="btn-primary">
            Calculate Payback Period
          </button>
        </div>
      </div>

      {results.paybackPeriod !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {useDiscounted ? 'Discounted Payback Period' : 'Payback Period'}
          </h3>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Payback Period
              </span>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {results.paybackPeriod.toFixed(2)} years
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cumulative
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.cumulativeCashFlows.map((flow) => (
                  <tr key={flow.year}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {flow.year}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flow.isInvestment
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {flow.isInvestment ? 'Investment' : 'Cash Flow'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {currency} {Math.abs(flow.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${
                      flow.cumulative >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {currency} {flow.cumulative.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaybackPeriod;