import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../types';
import { useTransactions } from '../context/TransactionContext';
import { AVAILABLE_CURRENCIES } from '../../../utils/formatters';
import { convertAmount } from '../../../utils/currencyConverter';
import { DEFAULT_INCOME_CATEGORIES, DEFAULT_EXPENSE_CATEGORIES } from '../constants/categories';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

function TransactionModal({ isOpen, onClose, transaction }: Props) {
  const { dispatch } = useTransactions();
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: 'expense',
    category: '',
    description: '',
    tags: []
  });
  const [customCategory, setCustomCategory] = useState('');
  const [inputCurrency, setInputCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [isConverting, setIsConverting] = useState(false);
  const globalCurrency = localStorage.getItem('currency') || 'USD';

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date.split('T')[0],
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        tags: transaction.tags || []
      });
      if (!DEFAULT_INCOME_CATEGORIES.includes(transaction.category as any) && 
          !DEFAULT_EXPENSE_CATEGORIES.includes(transaction.category as any)) {
        setCustomCategory(transaction.category);
      }
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        type: 'expense',
        category: '',
        description: '',
        tags: []
      });
      setCustomCategory('');
      setInputCurrency(globalCurrency);
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConverting(true);
    
    try {
      const finalCategory = formData.category === 'Other' ? customCategory : formData.category;
      let finalAmount = Number(formData.amount);

      // Convert amount if currencies are different
      if (inputCurrency !== globalCurrency) {
        const convertedAmount = await convertAmount(finalAmount, inputCurrency, globalCurrency);
        if (convertedAmount !== finalAmount) {
          finalAmount = convertedAmount;
          toast.success(`Amount converted from ${inputCurrency} to ${globalCurrency}`);
        }
      }

      if (transaction) {
        dispatch({
          type: 'UPDATE_TRANSACTION',
          payload: {
            id: transaction.id,
            category: finalCategory,
            amount: finalAmount,
            type: formData.type,
            date: formData.date,
            description: formData.description,
            tags: formData.tags,
            recurringId: formData.recurringId || undefined
          }
        });
        toast.success('Transaction updated successfully');
      } else {
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: crypto.randomUUID(),
            category: finalCategory,
            amount: finalAmount,
            type: formData.type,
            date: formData.date,
            description: formData.description,
            tags: formData.tags,
            recurringId: undefined
          }
        });
        toast.success('Transaction added successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Error processing transaction. Please try again.');
    } finally {
      setIsConverting(false);
    }
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
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>

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
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
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

          <div className="pt-4">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isConverting}
            >
              {isConverting ? 'Processing...' : (transaction ? 'Update Transaction' : 'Add Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;