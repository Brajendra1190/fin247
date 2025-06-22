import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../utils/formatters';

interface Props {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
  currency: string;
}

export function SpendingTrends({ data, currency }: Props) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [showIncome, setShowIncome] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);

  const handleLegendClick = (o: any) => {
    if (o.dataKey === 'income') setShowIncome((v) => !v);
    if (o.dataKey === 'expenses') setShowExpenses((v) => !v);
  };

  const ChartComponent =
    chartType === 'bar' ? BarChart : chartType === 'area' ? AreaChart : LineChart;

  return (
    <div className="h-[340px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">Chart Type:</span>
        <button
          className={`px-2 py-1 rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('line')}
        >
          Line
        </button>
        <button
          className={`px-2 py-1 rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('bar')}
        >
          Bar
        </button>
        <button
          className={`px-2 py-1 rounded ${chartType === 'area' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setChartType('area')}
        >
          Area
        </button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <ChartComponent
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currency)}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend onClick={handleLegendClick} />
          {showIncome && chartType === 'line' && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#34D399"
              activeDot={{ r: 8 }}
              name="Income"
            />
          )}
          {showExpenses && chartType === 'line' && (
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#F87171"
              activeDot={{ r: 8 }}
              name="Expenses"
            />
          )}
          {showIncome && chartType === 'bar' && (
            <Bar dataKey="income" fill="#34D399" name="Income" />
          )}
          {showExpenses && chartType === 'bar' && (
            <Bar dataKey="expenses" fill="#F87171" name="Expenses" />
          )}
          {showIncome && chartType === 'area' && (
            <Area type="monotone" dataKey="income" stroke="#34D399" fill="#bbf7d0" name="Income" />
          )}
          {showExpenses && chartType === 'area' && (
            <Area type="monotone" dataKey="expenses" stroke="#F87171" fill="#fecaca" name="Expenses" />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

