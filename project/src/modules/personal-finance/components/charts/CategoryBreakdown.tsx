import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  data: { [category: string]: number };
  currency: string;
}

// Define a color palette for different categories
const CATEGORY_COLORS = {
  Housing: '#FF6B6B',
  Transportation: '#4ECDC4',
  Food: '#45B7D1',
  Utilities: '#96CEB4',
  Healthcare: '#FFEEAD',
  Insurance: '#D4A5A5',
  Entertainment: '#9B59B6',
  Shopping: '#3498DB',
  Education: '#E67E22',
  'Debt Payments': '#E74C3C',
  Other: '#95A5A6',
  // Income categories
  Salary: '#2ECC71',
  Freelance: '#27AE60',
  Investments: '#F1C40F',
  'Rental Income': '#D35400',
  Business: '#16A085',
  Dividends: '#2980B9',
  Interest: '#8E44AD',
  Royalties: '#2C3E50',
  Commission: '#F39C12',
  Bonus: '#C0392B'
};

// Fallback colors for any categories not in the predefined list
const FALLBACK_COLORS = [
  '#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6', '#F1C40F',
  '#E67E22', '#E74C3C', '#34495E', '#16A085', '#27AE60',
  '#2980B9', '#8E44AD', '#F39C12', '#D35400', '#C0392B'
];

export function CategoryBreakdown({ data, currency }: Props) {
  const chartData = Object.entries(data)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 
             FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)]
    }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(1)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}