import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
  timeframe: 'day' | 'week' | 'month' | 'year';
  currency: string;
}

export function IncomeExpenseChart({ data, timeframe, currency }: Props) {
  const aggregateData = () => {
    if (timeframe === 'day') return data;

    const aggregated = new Map();
    
    data.forEach(item => {
      const date = new Date(item.date);
      let key: string;

      switch (timeframe) {
        case 'week':
          const weekNumber = Math.ceil((date.getDate() - 1 - date.getDay()) / 7);
          key = `Week ${weekNumber + 1}`;
          break;
        case 'month':
          key = date.toLocaleString('default', { month: 'short' });
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = item.date;
      }

      if (!aggregated.has(key)) {
        aggregated.set(key, { date: key, income: 0, expenses: 0 });
      }
      const current = aggregated.get(key);
      aggregated.set(key, {
        date: key,
        income: current.income + item.income,
        expenses: current.expenses + item.expenses
      });
    });

    return Array.from(aggregated.values());
  };

  const chartData = aggregateData();

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
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
          <Bar dataKey="income" name="Income" fill="#34D399" />
          <Bar dataKey="expenses" name="Expenses" fill="#F87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}