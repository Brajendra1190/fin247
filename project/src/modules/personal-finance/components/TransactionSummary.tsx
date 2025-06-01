import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface Props {
  transactions: Transaction[];
  currency: string;
}

const COLORS = [
  '#2563EB', '#7C3AED', '#EC4899', '#F59E0B', '#10B981',
  '#6366F1', '#8B5CF6', '#F472B6', '#FBBF24', '#34D399'
];

function TransactionSummary({ transactions, currency }: Props) {
  // Calculate monthly totals
  const monthlyData = transactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += transaction.amount;
    }
    
    return acc;
  }, {});

  const monthlyTotals = Object.entries(monthlyData)
    .map(([month, data]: [string, any]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Calculate category breakdown
  const categoryData = transactions.reduce((acc: any, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[transaction.category].income += transaction.amount;
    } else {
      acc[transaction.category].expenses += transaction.amount;
    }
    
    return acc;
  }, {});

  const categoryTotals = Object.entries(categoryData)
    .map(([category, data]: [string, any]) => ({
      category,
      income: data.income,
      expenses: data.expenses
    }))
    .sort((a, b) => (b.income + b.expenses) - (a.income + a.expenses));

  // Calculate overall totals
  const totalIncome = transactions.reduce((sum, t) => 
    t.type === 'income' ? sum + t.amount : sum, 0
  );
  const totalExpenses = transactions.reduce((sum, t) => 
    t.type === 'expense' ? sum + t.amount : sum, 0
  );
  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Amount</h3>
          <p className={`mt-2 text-3xl font-bold ${
            netAmount >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(netAmount, currency)}
          </p>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTotals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value, currency)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Income by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals.filter(c => c.income > 0)}
                  dataKey="income"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${formatCurrency(value, currency)}`}
                >
                  {categoryTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals.filter(c => c.expenses > 0)}
                  dataKey="expenses"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${formatCurrency(value, currency)}`}
                >
                  {categoryTotals.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionSummary;