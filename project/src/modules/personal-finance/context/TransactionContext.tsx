import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Transaction, RecurringTransaction, Budget, Category } from '../types';
import { nanoid } from 'nanoid';
import { useAuth } from '../../../context/AuthContext';
import { convertAmount } from '../../../utils/currencyConverter';
import toast from 'react-hot-toast';

interface TransactionState {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  budgets: Budget[];
  categories: Category[];
  baseCurrency: string;
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_RECURRING'; payload: RecurringTransaction }
  | { type: 'UPDATE_RECURRING'; payload: RecurringTransaction }
  | { type: 'DELETE_RECURRING'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'LOAD_STATE'; payload: TransactionState }
  | { type: 'UPDATE_CURRENCY'; payload: { transactions: Transaction[]; baseCurrency: string } };

const initialCategories: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', color: '#34D399' },
  { id: 'investment', name: 'Investment', type: 'income', color: '#60A5FA' },
  { id: 'food', name: 'Food & Dining', type: 'expense', color: '#F87171' },
  { id: 'transport', name: 'Transportation', type: 'expense', color: '#FBBF24' },
  { id: 'utilities', name: 'Utilities', type: 'expense', color: '#818CF8' },
  { id: 'rent', name: 'Rent', type: 'expense', color: '#F472B6' },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#A78BFA' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense', color: '#34D399' }
];

const initialState: TransactionState = {
  transactions: [],
  recurringTransactions: [],
  budgets: [],
  categories: initialCategories,
  baseCurrency: localStorage.getItem('currency') || 'USD'
};

const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
} | undefined>(undefined);

function processRecurringTransaction(recurring: RecurringTransaction, currentDate: Date = new Date()): Transaction[] {
  const transactions: Transaction[] = [];
  const startDate = new Date(recurring.startDate);
  const endDate = recurring.endDate ? new Date(recurring.endDate) : currentDate;
  let currentProcessDate = new Date(startDate);

  while (currentProcessDate <= endDate) {
    transactions.push({
      id: nanoid(),
      date: currentProcessDate.toISOString(),
      amount: recurring.amount,
      type: recurring.type,
      category: recurring.category,
      description: `${recurring.description} (Recurring)`,
      recurringId: recurring.id
    });

    switch (recurring.frequency) {
      case 'daily':
        currentProcessDate.setDate(currentProcessDate.getDate() + 1);
        break;
      case 'weekly':
        currentProcessDate.setDate(currentProcessDate.getDate() + 7);
        break;
      case 'monthly':
        currentProcessDate.setMonth(currentProcessDate.getMonth() + 1);
        break;
      case 'yearly':
        currentProcessDate.setFullYear(currentProcessDate.getFullYear() + 1);
        break;
    }
  }

  return transactions;
}

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, { ...action.payload, id: nanoid() }]
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    case 'ADD_RECURRING':
      const newRecurring = { ...action.payload, id: nanoid() };
      const transactions = processRecurringTransaction(newRecurring);
      return {
        ...state,
        recurringTransactions: [...state.recurringTransactions, newRecurring],
        transactions: [...state.transactions, ...transactions]
      };
    case 'UPDATE_RECURRING':
      const updatedRecurring = action.payload;
      const filteredTransactions = state.transactions.filter(t => t.recurringId !== updatedRecurring.id);
      const newTransactions = processRecurringTransaction(updatedRecurring);
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.map(t =>
          t.id === updatedRecurring.id ? updatedRecurring : t
        ),
        transactions: [...filteredTransactions, ...newTransactions]
      };
    case 'DELETE_RECURRING':
      return {
        ...state,
        recurringTransactions: state.recurringTransactions.filter(t => t.id !== action.payload),
        transactions: state.transactions.filter(t => t.recurringId !== action.payload)
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, { ...action.payload, id: nanoid() }]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? action.payload : b
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { ...action.payload, id: nanoid() }]
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload)
      };
    case 'LOAD_STATE':
      return action.payload;
    case 'UPDATE_CURRENCY':
      return {
        ...state,
        transactions: action.payload.transactions,
        baseCurrency: action.payload.baseCurrency
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { currentUser } = useAuth();
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const handleCurrencyChange = async (event: CustomEvent) => {
      const newCurrency = event.detail.currency;
      const prevCurrency = event.detail.previousCurrency;
      
      if (newCurrency === state.baseCurrency || isConverting) return;

      setIsConverting(true);
      const toastId = toast.loading('Converting transactions...');
      
      try {
        // Convert all regular transactions
        const convertedTransactions = await Promise.all(
          state.transactions.map(async (transaction) => {
            if (transaction.recurringId) {
              // Skip recurring transactions as they'll be regenerated
              return transaction;
            }
            
            try {
              const convertedAmount = await convertAmount(
                transaction.amount,
                prevCurrency,
                newCurrency
              );
              
              return {
                ...transaction,
                amount: convertedAmount
              };
            } catch (error) {
              console.error(`Error converting transaction ${transaction.id}:`, error);
              return transaction;
            }
          })
        );

        // Convert recurring transactions
        const convertedRecurring = await Promise.all(
          state.recurringTransactions.map(async (recurring) => {
            try {
              const convertedAmount = await convertAmount(
                recurring.amount,
                prevCurrency,
                newCurrency
              );
              
              return {
                ...recurring,
                amount: convertedAmount
              };
            } catch (error) {
              console.error(`Error converting recurring transaction ${recurring.id}:`, error);
              return recurring;
            }
          })
        );

        // Convert budgets
        const convertedBudgets = await Promise.all(
          state.budgets.map(async (budget) => {
            try {
              const convertedAmount = await convertAmount(
                budget.amount,
                prevCurrency,
                newCurrency
              );
              
              return {
                ...budget,
                amount: convertedAmount
              };
            } catch (error) {
              console.error(`Error converting budget ${budget.id}:`, error);
              return budget;
            }
          })
        );

        // Update state with all converted values
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            ...state,
            transactions: convertedTransactions,
            recurringTransactions: convertedRecurring,
            budgets: convertedBudgets,
            baseCurrency: newCurrency
          }
        });

        toast.success('All amounts converted successfully', { id: toastId });
      } catch (error) {
        console.error('Error converting amounts:', error);
        toast.error('Failed to convert some amounts', { id: toastId });
      } finally {
        setIsConverting(false);
      }
    };

    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, [state.baseCurrency, isConverting]);

  useEffect(() => {
    const processAllRecurringTransactions = () => {
      const currentDate = new Date();
      
      state.recurringTransactions.forEach(recurring => {
        const startDate = new Date(recurring.startDate);
        const endDate = recurring.endDate ? new Date(recurring.endDate) : currentDate;
        
        if (startDate <= currentDate && (!recurring.endDate || endDate >= currentDate)) {
          const filteredTransactions = state.transactions.filter(t => t.recurringId !== recurring.id);
          const newTransactions = processRecurringTransaction(recurring, currentDate);
          
          dispatch({
            type: 'UPDATE_RECURRING',
            payload: {
              ...recurring,
              lastProcessed: currentDate.toISOString()
            }
          });

          dispatch({
            type: 'LOAD_STATE',
            payload: {
              ...state,
              transactions: [...filteredTransactions, ...newTransactions]
            }
          });
        }
      });
    };

    processAllRecurringTransactions();
    const interval = setInterval(processAllRecurringTransactions, 86400000);

    return () => clearInterval(interval);
  }, [state.recurringTransactions]);

  useEffect(() => {
    const savedState = localStorage.getItem('financeState');
    if (savedState && currentUser) {
      const parsedState = JSON.parse(savedState);
      dispatch({ 
        type: 'LOAD_STATE', 
        payload: { 
          ...parsedState,
          baseCurrency: parsedState.baseCurrency || 'USD'
        } 
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('financeState', JSON.stringify(state));
    }
  }, [state, currentUser]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}

export function useTransactionsByDate(startDate: Date, endDate: Date) {
  const { state } = useTransactions();
  
  return state.transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

export function useTransactionSummary(startDate: Date, endDate: Date) {
  const transactions = useTransactionsByDate(startDate, endDate);
  
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    categoryBreakdown: {} as { [key: string]: number },
    dailyTotals: [] as { date: string; income: number; expenses: number }[]
  };

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      summary.totalIncome += transaction.amount;
    } else {
      summary.totalExpenses += transaction.amount;
    }

    if (!summary.categoryBreakdown[transaction.category]) {
      summary.categoryBreakdown[transaction.category] = 0;
    }
    summary.categoryBreakdown[transaction.category] += transaction.amount;
  });

  summary.netAmount = summary.totalIncome - summary.totalExpenses;

  const dailyMap = new Map<string, { income: number; expenses: number }>();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { income: 0, expenses: 0 });
  }

  transactions.forEach(transaction => {
    const dateStr = transaction.date.split('T')[0];
    const daily = dailyMap.get(dateStr) || { income: 0, expenses: 0 };
    
    if (transaction.type === 'income') {
      daily.income += transaction.amount;
    } else {
      daily.expenses += transaction.amount;
    }
    
    dailyMap.set(dateStr, daily);
  });

  summary.dailyTotals = Array.from(dailyMap.entries()).map(([date, totals]) => ({
    date,
    ...totals
  }));

  return summary;
}

export function useBudgetProgress(period: 'monthly' | 'yearly' = 'monthly') {
  const { state } = useTransactions();
  const today = new Date();
  
  let startDate: Date;
  if (period === 'monthly') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else {
    startDate = new Date(today.getFullYear(), 0, 1);
  }

  const transactions = useTransactionsByDate(startDate, today);
  
  return state.budgets
    .filter(budget => budget.period === period)
    .map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        progress: (spent / budget.amount) * 100
      };
    });
}