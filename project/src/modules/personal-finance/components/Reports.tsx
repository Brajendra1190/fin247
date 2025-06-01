import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Download } from 'lucide-react';
import { useTransactionSummary } from '../context/TransactionContext';
import { DateRange } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { IncomeExpenseChart } from './charts/IncomeExpenseChart';
import { CategoryDistributionChart } from './charts/CategoryDistributionChart';
import { TrendAnalysisChart } from './charts/TrendAnalysisChart';
import { CashFlowChart } from './charts/CashFlowChart';

function Reports() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [globalCurrency, setGlobalCurrency] = useState(localStorage.getItem('currency') || 'USD');

  // Function to get default date range based on timeframe
  const getDefaultDateRange = (selectedTimeframe: typeof timeframe): DateRange => {
    const today = new Date();
    let startDate: Date;
    const endDate = today;

    switch (selectedTimeframe) {
      case 'day':
        // Start from beginning of current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      
      case 'week':
        // Start from 6 months ago
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 6);
        startDate.setDate(1); // Start from beginning of that month
        break;
      
      case 'month':
        // Start from beginning of current year
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      
      case 'year':
        // Start from 5 years ago (including current year)
        startDate = new Date(today.getFullYear() - 4, 0, 1);
        break;
      
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange('month'));
  const summary = useTransactionSummary(new Date(dateRange.startDate), new Date(dateRange.endDate));

  // Update date range when timeframe changes
  useEffect(() => {
    setDateRange(getDefaultDateRange(timeframe));
  }, [timeframe]);

  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setGlobalCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, []);

  const aggregateData = () => {
    const data = [...summary.dailyTotals].filter(item => {
      const date = new Date(item.date);
      return !isNaN(date.getTime()); // Filter out invalid dates
    });

    if (timeframe === 'day') return data;

    const aggregated = new Map();
    
    data.forEach(item => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return; // Skip invalid dates
      
      let key: string;

      switch (timeframe) {
        case 'week': {
          // Get ISO week number
          const startDate = new Date(date.getFullYear(), 0, 1);
          const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
          const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
          
          // Format as "Week X, YYYY"
          key = `Week ${weekNumber}, ${date.getFullYear()}`;
          break;
        }
        case 'month': {
          // Format as "Month YYYY"
          key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          break;
        }
        case 'year': {
          key = date.getFullYear().toString();
          break;
        }
        default:
          key = item.date;
      }

      if (!aggregated.has(key)) {
        aggregated.set(key, {
          date: key,
          income: 0,
          expenses: 0,
          timestamp: date.getTime() // Store timestamp for sorting
        });
      }

      const current = aggregated.get(key);
      aggregated.set(key, {
        ...current,
        income: (current.income || 0) + (item.income || 0),
        expenses: (current.expenses || 0) + (item.expenses || 0)
      });
    });

    // Convert to array and sort by timestamp
    return Array.from(aggregated.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, income, expenses }) => ({
        date,
        income: Number(income.toFixed(2)) || 0,
        expenses: Number(expenses.toFixed(2)) || 0
      }));
  };

  const chartData = aggregateData();

  const exportReport = () => {
    const reportData = {
      dateRange,
      summary,
      timeframe,
      chartData,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${dateRange.startDate}-to-${dateRange.endDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 self-end mb-3" />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="input-field"
                min={dateRange.startDate}
              />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Analysis Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
                className="input-field"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <button
              onClick={exportReport}
              className="btn-primary flex items-center gap-2 h-[42px]"
            >
              <Download className="h-5 w-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.totalIncome || 0, globalCurrency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.totalExpenses || 0, globalCurrency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Net Balance
          </h3>
          <p className={`text-2xl font-bold ${
            (summary.netAmount || 0) >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(summary.netAmount || 0, globalCurrency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Savings Rate
          </h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {summary.totalIncome > 0
              ? `${((summary.netAmount / summary.totalIncome) * 100).toFixed(1)}%`
              : '0%'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Income vs Expenses ({timeframe === 'day' ? 'Daily' : 
                              timeframe === 'week' ? 'Weekly' : 
                              timeframe === 'month' ? 'Monthly' : 'Yearly'})
          </h3>
          <IncomeExpenseChart data={chartData} timeframe={timeframe} currency={globalCurrency} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Expense Distribution by Category
          </h3>
          <CategoryDistributionChart data={summary.categoryBreakdown} currency={globalCurrency} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Spending Trends
          </h3>
          <TrendAnalysisChart data={chartData} timeframe={timeframe} currency={globalCurrency} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Cash Flow Analysis
          </h3>
          <CashFlowChart data={chartData} timeframe={timeframe} currency={globalCurrency} />
        </div>
      </div>
    </div>
  );
}

export default Reports;