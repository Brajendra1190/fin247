import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { calculateWACC, calculateCostOfEquity } from '../utils/costOfCapitalCalculations';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';

function CostOfCapital() {
  const [inputs, setInputs] = useState({
    // Cost of Equity Inputs
    riskFreeRate: '',
    marketReturn: '',
    beta: '',
    
    // Cost of Debt Inputs
    debtRate: '',
    taxRate: '',
    
    // Capital Structure
    equityValue: '',
    debtValue: '',
    
    // Currency
    currency: 'USD'
  });

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const costOfEquity = calculateCostOfEquity(
    Number(inputs.riskFreeRate) || 0,
    Number(inputs.marketReturn) || 0,
    Number(inputs.beta) || 0
  );

  const costOfDebt = (Number(inputs.debtRate) || 0) * (1 - (Number(inputs.taxRate) || 0) / 100);

  const wacc = calculateWACC(
    costOfEquity,
    costOfDebt,
    Number(inputs.equityValue) || 0,
    Number(inputs.debtValue) || 0
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Cost of Equity (CAPM)
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency:
              </label>
              <select
                value={inputs.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="input-field w-auto"
              >
                {AVAILABLE_CURRENCIES.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk-free Rate (%)
              </label>
              <input
                type="text"
                value={inputs.riskFreeRate}
                onChange={(e) => handleInputChange('riskFreeRate', e.target.value)}
                className="input-field"
                placeholder="Enter risk-free rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Market Return (%)
              </label>
              <input
                type="text"
                value={inputs.marketReturn}
                onChange={(e) => handleInputChange('marketReturn', e.target.value)}
                className="input-field"
                placeholder="Enter market return"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Beta
              </label>
              <input
                type="text"
                value={inputs.beta}
                onChange={(e) => handleInputChange('beta', e.target.value)}
                className="input-field"
                placeholder="Enter beta value"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Cost of Equity
                </span>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {costOfEquity.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Cost of Debt
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pre-tax Cost of Debt (%)
              </label>
              <input
                type="text"
                value={inputs.debtRate}
                onChange={(e) => handleInputChange('debtRate', e.target.value)}
                className="input-field"
                placeholder="Enter pre-tax cost of debt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="text"
                value={inputs.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                className="input-field"
                placeholder="Enter tax rate"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  After-tax Cost of Debt
                </span>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {costOfDebt.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Capital Structure</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Market Value of Equity
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {inputs.currency}
              </span>
              <input
                type="text"
                value={inputs.equityValue}
                onChange={(e) => handleInputChange('equityValue', e.target.value)}
                className="input-field pl-16"
                placeholder="Enter equity value"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Market Value of Debt
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {inputs.currency}
              </span>
              <input
                type="text"
                value={inputs.debtValue}
                onChange={(e) => handleInputChange('debtValue', e.target.value)}
                className="input-field pl-16"
                placeholder="Enter debt value"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Weighted Average Cost of Capital (WACC)
            </span>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {wacc.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostOfCapital;