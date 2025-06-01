import { useState } from 'react';
import { Calculator, PlusCircle, MinusCircle, ArrowRight } from 'lucide-react';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';

interface CashFlow {
  year: number;
  amount: string;
  type: 'inflow' | 'outflow';
  description: string;
}

function NPVCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('10');
  const [currency, setCurrency] = useState<string>('USD');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { year: 1, amount: '', type: 'inflow', description: '' }
  ]);

  const [results, setResults] = useState<{
    npv: number | null;
    irr: number | null;
    detailedFlows: { year: number; amount: number; presentValue: number; cumulative: number; type: 'inflow' | 'outflow' }[];
  }>({ npv: null, irr: null, detailedFlows: [] });

  const addCashFlow = () => {
    setCashFlows([
      ...cashFlows,
      { year: cashFlows.length + 1, amount: '', type: 'inflow', description: '' }
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
    const numericInitialInvestment = Number(initialInvestment) || 0;
    const numericDiscountRate = Number(discountRate) || 0;
    const rate = numericDiscountRate / 100;

    // Process all cash flows including initial investment
    const detailedFlows = [
      {
        year: 0,
        amount: -numericInitialInvestment,
        presentValue: -numericInitialInvestment,
        cumulative: -numericInitialInvestment,
        type: 'outflow' as const
      }
    ];

    let npv = -numericInitialInvestment;
    const rawCashFlows = [-numericInitialInvestment];

    cashFlows.forEach((cf) => {
      const amount = Number(cf.amount) || 0;
      const effectiveAmount = cf.type === 'inflow' ? amount : -amount;
      const presentValue = effectiveAmount / Math.pow(1 + rate, cf.year);
      npv += presentValue;

      detailedFlows.push({
        year: cf.year,
        amount: effectiveAmount,
        presentValue,
        cumulative: detailedFlows[detailedFlows.length - 1].cumulative + presentValue,
        type: 'outflow' as const // Always use 'outflow' as required by the type
      });

      rawCashFlows.push(effectiveAmount);
    });

    // Calculate IRR
    let irr: number | null = null;
    const MAX_ITERATIONS = 1000;
    const PRECISION = 0.00001;
    
    let low = -0.99;
    let high = 9999;
    
    // Check if IRR exists
    let allNegative = true;
    let allPositive = true;
    rawCashFlows.forEach(cf => {
      if (cf > 0) allNegative = false;
      if (cf < 0) allPositive = false;
    });
    
    if (!allNegative && !allPositive) {
      for (let i = 0; i < MAX_ITERATIONS; i++) {
        const mid = (low + high) / 2;
        let npvAtRate = 0;
        
        rawCashFlows.forEach((cf, index) => {
          npvAtRate += cf / Math.pow(1 + mid, index);
        });

        if (Math.abs(npvAtRate) < PRECISION) {
          irr = Number((mid * 100).toFixed(2));
          break;
        }

        if (npvAtRate > 0) {
          low = mid;
        } else {
          high = mid;
        }
      }
    }

    setResults({ 
      npv, 
      irr,
      detailedFlows
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            NPV & IRR Calculator
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
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cash Flows</h3>
              <button
                onClick={addCashFlow}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Cash Flow
              </button>
            </div>

            <div className="space-y-3">
              {cashFlows.map((cf, index) => (
                <div key={cf.year} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Year {cf.year}
                    </span>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {currency}
                      </span>
                      <input
                        type="text"
                        value={cf.amount}
                        onChange={(e) => updateCashFlow(index, { amount: e.target.value })}
                        className="input-field pl-16"
                        placeholder="Amount"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <select
                      value={cf.type}
                      onChange={(e) => updateCashFlow(index, { 
                        type: e.target.value as 'inflow' | 'outflow' 
                      })}
                      className="input-field"
                    >
                      <option value="inflow">Inflow</option>
                      <option value="outflow">Outflow</option>
                    </select>
                  </div>

                  <div className="col-span-5">
                    <input
                      type="text"
                      value={cf.description}
                      onChange={(e) => updateCashFlow(index, { description: e.target.value })}
                      className="input-field"
                      placeholder="Description (optional)"
                    />
                  </div>

                  <div className="col-span-1 flex justify-end">
                    {cashFlows.length > 1 && (
                      <button
                        onClick={() => removeCashFlow(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={calculateResults} className="btn-primary">
            Calculate NPV & IRR
          </button>
        </div>
      </div>

      {results.npv !== null && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Net Present Value</h3>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <span className={`text-2xl font-bold ${
                  results.npv >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {currency} {results.npv.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {results.npv >= 0 
                  ? 'The project adds value to the company'
                  : 'The project destroys value'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Internal Rate of Return</h3>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-gray-500" />
                <span className={`text-2xl font-bold ${
                  (results.irr || 0) >= Number(discountRate)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {results.irr !== null 
                    ? `${results.irr.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {results.irr !== null
                  ? results.irr >= Number(discountRate)
                    ? 'The project exceeds the required return rate'
                    : 'The project falls below the required return rate'
                  : 'IRR could not be calculated'}
              </p>
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
                    Present Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cumulative NPV
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.detailedFlows.map((flow) => (
                  <tr key={flow.year}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {flow.year}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        flow.type === 'inflow'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      }`}>
                        {flow.type === 'inflow' ? 'Inflow' : 'Outflow'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {currency} {Math.abs(flow.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {currency} {flow.presentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${
                      flow.cumulative >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {currency} {flow.cumulative.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

export default NPVCalculator;