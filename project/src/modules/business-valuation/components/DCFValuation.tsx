import React, { useState } from 'react';
import { Calculator, ArrowRight, PlusCircle, MinusCircle, Settings } from 'lucide-react';
import { CashFlowItem, DCFInputs, ProjectedCashFlow } from '../types/dcf';
import { nanoid } from 'nanoid';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';

function DCFValuation() {
  const [inputs, setInputs] = useState<DCFInputs>({
    wacc: '',
    perpetualGrowthRate: '',
    projectionYears: 5,
    cashFlowItems: [],
    currency: 'USD'
  });

  const [projectedCashFlows, setProjectedCashFlows] = useState<ProjectedCashFlow[]>([]);
  const [enterpriseValue, setEnterpriseValue] = useState<number | null>(null);

  const addCashFlowItem = (type: 'income' | 'expense') => {
    const newItem: CashFlowItem = {
      id: nanoid(),
      name: '',
      type,
      amount: '',
      useGrowth: true,
      growthRates: Array(inputs.projectionYears).fill(''),
      manualProjections: Array(inputs.projectionYears).fill(''),
      useManualProjections: false
    };

    setInputs(prev => ({
      ...prev,
      cashFlowItems: [...prev.cashFlowItems, newItem]
    }));
  };

  const removeCashFlowItem = (id: string) => {
    setInputs(prev => ({
      ...prev,
      cashFlowItems: prev.cashFlowItems.filter(item => item.id !== id)
    }));
  };

  const updateCashFlowItem = (id: string, updates: Partial<CashFlowItem>) => {
    setInputs(prev => ({
      ...prev,
      cashFlowItems: prev.cashFlowItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const calculateDCF = () => {
    const numericWACC = Number(inputs.wacc) || 0;
    const numericPerpetualGrowth = Number(inputs.perpetualGrowthRate) || 0;

    let projectedFlows: ProjectedCashFlow[] = [];

    for (let year = 1; year <= inputs.projectionYears; year++) {
      const yearlyItems = inputs.cashFlowItems.map(item => {
        let amount = Number(item.amount) || 0;
        
        if (item.useManualProjections) {
          amount = Number(item.manualProjections[year - 1]) || 0;
        } else if (item.useGrowth) {
          for (let i = 0; i < year; i++) {
            const growthRate = Number(item.growthRates[i]) || 0;
            amount *= (1 + growthRate / 100);
          }
        }

        return {
          id: item.id,
          name: item.name,
          type: item.type,
          amount,
          growthRate: item.useGrowth ? Number(item.growthRates[year - 1]) || 0 : 0
        };
      });

      const totalIncome = yearlyItems
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

      const totalExpenses = yearlyItems
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

      projectedFlows.push({
        year,
        items: yearlyItems,
        totalIncome,
        totalExpenses,
        netCashFlow: totalIncome - totalExpenses
      });
    }

    const lastFlow = projectedFlows[projectedFlows.length - 1];
    const terminalValue = lastFlow.netCashFlow * (1 + numericPerpetualGrowth / 100) / 
                         (numericWACC / 100 - numericPerpetualGrowth / 100);

    let presentValue = 0;
    projectedFlows.forEach((flow, index) => {
      presentValue += flow.netCashFlow / Math.pow(1 + numericWACC / 100, index + 1);
    });

    presentValue += terminalValue / Math.pow(1 + numericWACC / 100, inputs.projectionYears);

    setProjectedCashFlows(projectedFlows);
    setEnterpriseValue(presentValue);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            DCF Valuation Model
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Currency:
            </label>
            <select
              value={inputs.currency}
              onChange={(e) => setInputs(prev => ({ ...prev, currency: e.target.value }))}
              className="input-field w-auto"
            >
              {AVAILABLE_CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              WACC (%)
            </label>
            <input
              type="text"
              value={inputs.wacc}
              onChange={(e) => setInputs(prev => ({ ...prev, wacc: e.target.value }))}
              className="input-field"
              placeholder="Enter WACC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Perpetual Growth Rate (%)
            </label>
            <input
              type="text"
              value={inputs.perpetualGrowthRate}
              onChange={(e) => setInputs(prev => ({ ...prev, perpetualGrowthRate: e.target.value }))}
              className="input-field"
              placeholder="Enter perpetual growth rate"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Income Items</h3>
              <button
                onClick={() => addCashFlowItem('income')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Income
              </button>
            </div>
            
            {inputs.cashFlowItems
              .filter(item => item.type === 'income')
              .map(item => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Income Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateCashFlowItem(item.id, { name: e.target.value })}
                        className="input-field"
                        placeholder="Enter income name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Base Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {inputs.currency}
                        </span>
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) => updateCashFlowItem(item.id, { amount: e.target.value })}
                          className="input-field pl-16"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.useGrowth}
                        onChange={(e) => updateCashFlowItem(item.id, { 
                          useGrowth: e.target.checked,
                          useManualProjections: false 
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Apply growth rates</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.useManualProjections}
                        onChange={(e) => updateCashFlowItem(item.id, { 
                          useManualProjections: e.target.checked,
                          useGrowth: false 
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Manual projections</span>
                    </label>
                    <button
                      onClick={() => removeCashFlowItem(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-auto"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>

                  {item.useGrowth && (
                    <div className="grid grid-cols-5 gap-2">
                      {item.growthRates.map((rate, index) => (
                        <div key={index}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Year {index + 1} Growth
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={rate}
                              onChange={(e) => {
                                const newRates = [...item.growthRates];
                                newRates[index] = e.target.value;
                                updateCashFlowItem(item.id, { growthRates: newRates });
                              }}
                              className="input-field text-sm"
                              placeholder="Growth %"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.useManualProjections && (
                    <div className="grid grid-cols-5 gap-2">
                      {item.manualProjections.map((projection, index) => (
                        <div key={index}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Year {index + 1} Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                              {inputs.currency}
                            </span>
                            <input
                              type="text"
                              value={projection}
                              onChange={(e) => {
                                const newProjections = [...item.manualProjections];
                                newProjections[index] = e.target.value;
                                updateCashFlowItem(item.id, { manualProjections: newProjections });
                              }}
                              className="input-field text-sm pl-12"
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Items</h3>
              <button
                onClick={() => addCashFlowItem('expense')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Expense
              </button>
            </div>
            
            {inputs.cashFlowItems
              .filter(item => item.type === 'expense')
              .map(item => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expense Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateCashFlowItem(item.id, { name: e.target.value })}
                        className="input-field"
                        placeholder="Enter expense name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Base Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {inputs.currency}
                        </span>
                        <input
                          type="text"
                          value={item.amount}
                          onChange={(e) => updateCashFlowItem(item.id, { amount: e.target.value })}
                          className="input-field pl-16"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.useGrowth}
                        onChange={(e) => updateCashFlowItem(item.id, { 
                          useGrowth: e.target.checked,
                          useManualProjections: false 
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Apply growth rates</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.useManualProjections}
                        onChange={(e) => updateCashFlowItem(item.id, { 
                          useManualProjections: e.target.checked,
                          useGrowth: false 
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Manual projections</span>
                    </label>
                    <button
                      onClick={() => removeCashFlowItem(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-auto"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>

                  {item.useGrowth && (
                    <div className="grid grid-cols-5 gap-2">
                      {item.growthRates.map((rate, index) => (
                        <div key={index}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Year {index + 1} Growth
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={rate}
                              onChange={(e) => {
                                const newRates = [...item.growthRates];
                                newRates[index] = e.target.value;
                                updateCashFlowItem(item.id, { growthRates: newRates });
                              }}
                              className="input-field text-sm"
                              placeholder="Growth %"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.useManualProjections && (
                    <div className="grid grid-cols-5 gap-2">
                      {item.manualProjections.map((projection, index) => (
                        <div key={index}>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Year {index + 1} Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                              {inputs.currency}
                            </span>
                            <input
                              type="text"
                              value={projection}
                              onChange={(e) => {
                                const newProjections = [...item.manualProjections];
                                newProjections[index] = e.target.value;
                                updateCashFlowItem(item.id, { manualProjections: newProjections });
                              }}
                              className="input-field text-sm pl-12"
                              placeholder="Amount"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <button onClick={calculateDCF} className="btn-primary mt-6">
          Calculate Enterprise Value
        </button>
      </div>

      {enterpriseValue !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Projected Cash Flows</h3>
          
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Income</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Expenses</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Cash Flow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projectedCashFlows.map((flow) => (
                    <tr key={flow.year}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{flow.year}</td>
                      <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                        {inputs.currency} {flow.totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                        {inputs.currency} {flow.totalExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {inputs.currency} {flow.netCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enterprise Value
                </span>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-gray-500" />
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {inputs.currency} {enterpriseValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DCFValuation;