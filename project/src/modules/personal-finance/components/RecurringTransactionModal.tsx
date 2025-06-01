import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RecurringTransaction } from '../types';
import { useTransactions } from '../context/TransactionContext';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';
import { convertAmount } from '../../../utils/currencyConverter';

const DEFAULT_INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Rental Income',
  'Business',
  'Dividends',
  'Interest',
  'Royalties',
  'Commission',
  'Bonus',
  'Other'
];

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: RecurringTransaction | null;
}

function RecurringTransactionModal({ isOpen, onClose, transaction }: Props) {
  const { dispatch } = useTransactions();
  const [formData, setFormData] = useState<Omit<RecurringTransaction, 'id'>>({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [customCategory, setCustomCategory] = useState('');
  const [inputCurrency, setInputCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const globalCurrency = localStorage.getItem('currency') || 'USD';

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        frequency: transaction.frequency,
        startDate: transaction.startDate.split('T')[0],
        endDate: transaction.endDate?.split('T')[0],
        lastProcessed: transaction.lastProcessed
      });
      if (!DEFAULT_INCOME_CATEGORIES.includes(transaction.category) && 
          !DEFAULT_EXPENSE_CATEGORIES.includes(transaction.category)) {
        setCustomCategory(transaction.category);
      }
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0]
      });
      setCustomCategory('');
      setInputCurrency(globalCurrency);
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
    
    // Convert amount if currencies are different
    let finalAmount = Number(formData.amount);
    if (inputCurrency !== globalCurrency) {
      try {
        finalAmount = await convertAmount(finalAmount, inputCurrency, globalCurrency);
      } catch (error) {
        console.error('Error converting amount:', error);
        // Fallback to original amount if conversion fails
      }
    }

    if (transaction) {
      dispatch({
        type: 'UPDATE_RECURRING',
        payload: { 
          ...formData, 
          id: transaction.id,
          category: finalCategory,
          amount: finalAmount
        }
      });
    } else {
      dispatch({
        type: 'ADD_RECURRING',
        payload: {
          ...formData,
          category: finalCategory,
          amount: finalAmount
        }
      });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {transaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="input-field"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {(formData.type === 'income' ? DEFAULT_INCOME_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES)
                .map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              }
            </select>
          </div>

          {formData.category === 'Other' && (
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
              Amount
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
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ 
                ...formData, 
                frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly'
              })}
              className="input-field"
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="input-field"
              min={formData.startDate}
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary">
              {transaction ? 'Update Recurring Transaction' : 'Add Recurring Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecurringTransactionModal;