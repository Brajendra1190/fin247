import React, { useState } from 'react';
import { Wallet, Calendar, PieChart, TrendingUp, Receipt, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionManager from './components/TransactionManager';
import RecurringTransactions from './components/RecurringTransactions';
import BudgetPlanner from './components/BudgetPlanner';
import Reports from './components/Reports';
import { TransactionProvider } from './context/TransactionContext';

function PersonalFinance() {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'transactions' | 'recurring' | 'budget' | 'reports'>('dashboard');

  const modules = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: PieChart,
      description: 'Overview of your financial health'
    },
    { 
      id: 'transactions', 
      name: 'Transactions', 
      icon: Receipt,
      description: 'Manage your income and expenses'
    },
    { 
      id: 'recurring', 
      name: 'Recurring', 
      icon: Clock,
      description: 'Manage recurring transactions'
    },
    { 
      id: 'budget', 
      name: 'Budget', 
      icon: Wallet,
      description: 'Plan and track your budget'
    },
    { 
      id: 'reports', 
      name: 'Reports', 
      icon: TrendingUp,
      description: 'Detailed financial reports'
    }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionManager />;
      case 'recurring':
        return <RecurringTransactions />;
      case 'budget':
        return <BudgetPlanner />;
      case 'reports':
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <TransactionProvider>
      <div className="max-w-7xl mx-auto space-y-8 p-4">
        <div className="flex items-center gap-3 mb-8">
          <Wallet className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Finance</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as typeof activeModule)}
                className={`p-4 rounded-lg transition-all ${
                  activeModule === module.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 border-2 border-indigo-500 dark:border-indigo-400'
                    : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon className={`h-6 w-6 ${
                    activeModule === module.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <h3 className={`text-sm font-semibold ${
                    activeModule === module.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {module.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {module.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {renderModule()}
      </div>
    </TransactionProvider>
  );
}

export default PersonalFinance;