import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { Budget } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';
import { convertAmount } from '../../../utils/currencyConverter';

const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Shopping',
  'Education',
  'Debt Payments',
  'Other'
];

function BudgetPlanner() {
  const { state, dispatch } = useTransactions();
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [customCategory, setCustomCategory] = useState('');
  const [inputCurrency, setInputCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const globalCurrency = localStorage.getItem('currency') || 'USD';
  
  const budgetProgress = state.budgets
    .filter(budget => budget.period === period)
    .map(budget => {
      const spent = state.transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        progress: (spent / budget.amount) * 100
      };
    });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      dispatch({ type: 'DELETE_BUDGET', payload: id });
    }
  };

  const getCategory = (categoryId: string) => {
    return categoryId;
  };

  const getBudgetStatus = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'good';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as string;
    const amount = Number(formData.get('amount'));
    const budgetPeriod = formData.get('period') as 'monthly' | 'yearly';
    
    let finalAmount = amount;
    if (inputCurrency !== globalCurrency) {
      try {
        finalAmount = await convertAmount(amount, inputCurrency, globalCurrency);
      } catch (error) {
        console.error('Error converting amount:', error);
      }
    }

    const finalCategory = category === 'Other' ? customCategory : category;

    if (editingBudget) {
      dispatch({
        type: 'UPDATE_BUDGET',
        payload: {
          ...editingBudget,
          category: finalCategory,
          amount: finalAmount,
          period: budgetPeriod
        }
      });
    } else {
      dispatch({
        type: 'ADD_BUDGET',
        payload: {
          category: finalCategory,
          amount: finalAmount,
          period: budgetPeriod,
          spent: 0
        }
      });
    }

    setIsModalOpen(false);
    setEditingBudget(null);
    setCustomCategory('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'monthly'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === 'yearly'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            Yearly
          </button>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Budget
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetProgress.map((budget) => {
          const status = getBudgetStatus(budget.spent, budget.amount);
          
          return (
            <div
              key={budget.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getCategory(budget.category)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {period.charAt(0).toUpperCase() + period.slice(1)} Budget
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBudget(budget);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(budget.spent, globalCurrency)} / {formatCurrency(budget.amount, globalCurrency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        status === 'danger'
                          ? 'bg-red-600'
                          : status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(budget.progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining: </span>
                    <span className={`font-medium ${
                      budget.remaining >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(budget.remaining, globalCurrency)}
                    </span>
                  </div>
                  {status === 'danger' && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Over Budget</span>
                    </div>
                  )}
                  {status === 'warning' && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Near Limit</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {budgetProgress.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Budgets Set
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start by adding a budget for your expense categories
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingBudget(null);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingBudget ? 'Edit Budget' : 'Add Budget'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editingBudget?.category || ''}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {DEFAULT_EXPENSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {customCategory === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Custom Category
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="input-field"
                    placeholder="Enter custom category"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Amount
                </label>
                <div className="flex gap-2">
                  <select
                    value={inputCurrency}
                    onChange={(e) => setInputCurrency(e.target.value)}
                    className="input-field w-24"
                  >
                    {AVAILABLE_CURRENCIES.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingBudget?.amount || ''}
                    className="input-field flex-1"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {inputCurrency !== globalCurrency && (
                  <p className="text-sm text-gray-500 mt-1">
                    Will be converted to {globalCurrency} on save
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Period
                </label>
                <select
                  name="period"
                  defaultValue={editingBudget?.period || period}
                  className="input-field"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn-primary">
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetPlanner;