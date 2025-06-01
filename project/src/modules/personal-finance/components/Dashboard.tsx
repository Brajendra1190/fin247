import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Calendar } from 'lucide-react';
import { useTransactions, useTransactionSummary, useBudgetProgress } from '../context/TransactionContext';
import { CategoryBreakdown } from './charts/CategoryBreakdown';
import { SpendingTrends } from './charts/SpendingTrends';
import { BudgetOverview } from './charts/BudgetOverview';
import DataManagement from './DataManagement';
import { formatCurrency } from '../../../utils/formatters';

function Dashboard() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  
  const today = new Date();
  let startDate: Date;
  
  switch (timeframe) {
    case 'week':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
  }

  const summary = useTransactionSummary(startDate, today);
  const budgetProgress = useBudgetProgress('monthly');

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    
    // Also listen for localStorage changes
    const handleStorageChange = () => {
      const newCurrency = localStorage.getItem('currency') || 'USD';
      setCurrency(newCurrency);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        {(['week', 'month', 'year'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeframe(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === range
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Income</h3>
            <ArrowUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.totalIncome, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expenses</h3>
            <ArrowDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.totalExpenses, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Net Balance</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className={`mt-2 text-2xl font-bold ${
            summary.netAmount >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(summary.netAmount, currency)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <CategoryBreakdown data={summary.categoryBreakdown} currency={currency} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Income vs Expenses
          </h3>
          <SpendingTrends data={summary.dailyTotals} currency={currency} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Budget Overview
        </h3>
        <BudgetOverview budgets={budgetProgress} currency={currency} />
      </div>

      <DataManagement />
    </div>
  );
}

export default Dashboard;