import React, { useState, useEffect } from 'react';
import { FinancialStatement } from '../types/financial';
import { ClipboardEdit } from 'lucide-react';
import { AVAILABLE_CURRENCIES } from '../utils/formatters';

interface Props {
  onSubmit: (data: FinancialStatement) => void;
  initialData: FinancialStatement | null;
}

const FinancialInput: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<FinancialStatement>({
    currentAssets: 0,
    totalAssets: 0,
    currentLiabilities: 0,
    totalLiabilities: 0,
    inventory: 0,
    accountsReceivable: 0,
    cash: 0,
    equity: 0,
    revenue: 0,
    grossProfit: 0,
    operatingIncome: 0,
    netIncome: 0,
    ebit: 0,
    interestExpense: 0,
    currency: 'USD'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currency' ? value : value === '' ? 0 : parseFloat(value)
    }));
  };

  const renderInput = (name: keyof FinancialStatement, label: string) => {
    if (name === 'currency') return null;
    return (
      <div key={name} className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {formData.currency}
          </span>
          <input
            type="number"
            id={name}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            className="input-field pl-12"
            placeholder="Enter amount"
            step="0.01"
          />
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-indigo-600 dark:bg-indigo-800 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardEdit className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Financial Statement Input</h2>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="currency" className="text-sm font-medium text-white">Currency:</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="input-field w-auto bg-white dark:bg-gray-700 border-none"
          >
            {AVAILABLE_CURRENCIES.map(curr => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Balance Sheet</h3>
          <div className="space-y-4">
            {renderInput('currentAssets', 'Current Assets')}
            {renderInput('totalAssets', 'Total Assets')}
            {renderInput('currentLiabilities', 'Current Liabilities')}
            {renderInput('totalLiabilities', 'Total Liabilities')}
            {renderInput('inventory', 'Inventory')}
            {renderInput('cash', 'Cash')}
            {renderInput('equity', 'Total Equity')}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Income Statement</h3>
          <div className="space-y-4">
            {renderInput('revenue', 'Revenue')}
            {renderInput('grossProfit', 'Gross Profit')}
            {renderInput('operatingIncome', 'Operating Income')}
            {renderInput('netIncome', 'Net Income')}
            {renderInput('ebit', 'EBIT')}
            {renderInput('interestExpense', 'Interest Expense')}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Calculate Ratios
      </button>
    </form>
  );
};

export default FinancialInput;