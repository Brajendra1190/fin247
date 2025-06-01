import { useState, useEffect } from 'react';
import { Plus, Filter, Search, BarChart2, List } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import TransactionList from './TransactionList';
import TransactionModal from './TransactionModal';
import { Transaction } from '../types';
import TransactionSummary from './TransactionSummary';

const DEFAULT_INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investments', 'Rental Income', 'Business',
  'Dividends', 'Interest', 'Royalties', 'Commission', 'Bonus', 'Other'
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare',
  'Insurance', 'Entertainment', 'Shopping', 'Education', 'Debt Payments', 'Other'
];

function TransactionManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<'summary' | 'detailed'>('summary');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  
  const { state } = useTransactions();

  useEffect(() => {
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail.currency);
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, []);

  const getCategories = () => {
    const categories = new Set<string>();
    DEFAULT_INCOME_CATEGORIES.forEach(cat => categories.add(cat));
    DEFAULT_EXPENSE_CATEGORIES.forEach(cat => categories.add(cat));
    state.transactions.forEach(t => categories.add(t.category));
    return Array.from(categories).sort();
  };

  const filteredTransactions = state.transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('summary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'summary'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            Summary
          </button>
          <button
            onClick={() => setActiveView('detailed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'detailed'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <List className="h-5 w-5" />
            Detailed
          </button>
        </div>

        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All Categories</option>
            {getCategories().map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {activeView === 'summary' ? (
        <TransactionSummary 
          transactions={filteredTransactions}
          currency={currency}
        />
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
        />
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
      />
    </div>
  );
}

export default TransactionManager;